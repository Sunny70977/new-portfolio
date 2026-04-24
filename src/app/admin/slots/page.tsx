"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ShellLayout from "@/components/ShellLayout";
import { getAdminSlots, addSlot, deleteSlot } from "@/lib/api";
import toast from "react-hot-toast";

interface Slot {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

const TIME_PRESETS = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
];
const DURATION_OPTS = [
    { label: "30 min", end: (s: string) => addMinutes(s, 30) },
    { label: "1 hr", end: (s: string) => addMinutes(s, 60) },
    { label: "1.5 hr", end: (s: string) => addMinutes(s, 90) },
    { label: "2 hr", end: (s: string) => addMinutes(s, 120) },
];

function addMinutes(timeStr: string, mins: number): string {
    const [t, period] = timeStr.split(" ");
    let [h, m] = t.split(":").map(Number);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    const total = h * 60 + m + mins;
    const nh = Math.floor(total / 60) % 24;
    const nm = total % 60;
    const np = nh < 12 ? "AM" : "PM";
    const fh = nh % 12 === 0 ? 12 : nh % 12;
    return `${String(fh).padStart(2, "0")}:${String(nm).padStart(2, "0")} ${np}`;
}

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AdminSlotsPage() {
    const { isAdmin, loading: authLoading, user } = useAuth();
    const router = useRouter();

    // Calendar state
    const today = new Date();
    const [calYear, setCalYear] = useState(today.getFullYear());
    const [calMonth, setCalMonth] = useState(today.getMonth());
    const [selected, setSelected] = useState<string>("");   // "YYYY-MM-DD"

    // Form state
    const [startTime, setStartTime] = useState("10:00 AM");
    const [endTime, setEndTime] = useState("11:00 AM");
    const [adding, setAdding] = useState(false);

    // Slots list
    const [slots, setSlots] = useState<Slot[]>([]);
    const [fetching, setFetching] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        if (!authLoading && (!user || !isAdmin)) router.push("/admin-login");
    }, [authLoading, user, isAdmin, router]);

    const fetchSlots = useCallback(async () => {
        setFetching(true);
        try {
            const res = await getAdminSlots();
            setSlots(res.data);
        } catch {
            toast.error("Failed to fetch slots");
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => { if (isAdmin) fetchSlots(); }, [isAdmin, fetchSlots]);

    /* Build a Set of dates that already have slots (for calendar colouring) */
    const slotDates = new Set(slots.map((s) => s.date));
    const bookedDates = new Set(slots.filter((s) => s.isBooked).map((s) => s.date));

    /* Slots for the currently selected date */
    const selectedSlots = slots.filter((s) => s.date === selected);

    /* Calendar navigation */
    const prevMonth = () => {
        if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11); }
        else setCalMonth((m) => m - 1);
    };
    const nextMonth = () => {
        if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0); }
        else setCalMonth((m) => m + 1);
    };

    const handleDayClick = (day: number) => {
        const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const d = new Date(dateStr);
        const todayMidnight = new Date(); todayMidnight.setHours(0, 0, 0, 0);
        if (d < todayMidnight) return; // past date
        setSelected(dateStr);
    };

    const handleAddSlot = async () => {
        if (!selected) { toast.error("Pick a date on the calendar first"); return; }
        setAdding(true);
        try {
            await addSlot({ date: selected, startTime, endTime });
            toast.success(`✅ Slot added for ${selected}`);
            fetchSlots();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed";
            toast.error(`❌ ${msg}`);
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(`Delete slot #${id}?`)) return;
        setDeleting(id);
        try {
            await deleteSlot(id);
            toast.success("Deleted ✅");
            fetchSlots();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Delete failed";
            toast.error(`❌ ${msg}`);
        } finally {
            setDeleting(null);
        }
    };

    if (authLoading || !isAdmin) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050a05" }}>
            <span className="spinner" />
        </div>
    );

    const daysInMonth = getDaysInMonth(calYear, calMonth);
    const firstDay = getFirstDayOfMonth(calYear, calMonth);
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    return (
        <ShellLayout>
            <div className="term-window">
                <div className="term-bar">
                    <span className="term-bar-title">admin — Slot Manager · Calendar View</span>
                </div>
                <div className="term-body">
                    <div className="cmd-line">
                        <span className="prompt">admin@portfolio:~#</span>
                        <span className="cmd-text">slot-manager --calendar --add --list</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 20 }}>
                        {/* ── LEFT: Calendar ── */}
                        <div>
                            <div style={calStyles.calHeader}>
                                <button style={calStyles.navBtn} onClick={prevMonth}>‹</button>
                                <span style={calStyles.monthLabel}>{MONTHS[calMonth]} {calYear}</span>
                                <button style={calStyles.navBtn} onClick={nextMonth}>›</button>
                            </div>

                            <div style={calStyles.dayNames}>
                                {DAYS.map((d) => <span key={d} style={calStyles.dayName}>{d}</span>)}
                            </div>

                            <div style={calStyles.grid}>
                                {/* Empty cells before first day */}
                                {Array.from({ length: firstDay }).map((_, i) => (
                                    <span key={`e-${i}`} style={calStyles.emptyCell} />
                                ))}
                                {/* Day cells */}
                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                                    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                                    const isPast = dateStr < todayStr;
                                    const isToday = dateStr === todayStr;
                                    const isSel = dateStr === selected;
                                    const hasSlot = slotDates.has(dateStr);
                                    const isBooked = bookedDates.has(dateStr);

                                    let cellStyle = { ...calStyles.dayCell };
                                    if (isPast) cellStyle = { ...cellStyle, ...calStyles.pastCell };
                                    if (hasSlot) cellStyle = { ...cellStyle, ...calStyles.hasSlotCell };
                                    if (isBooked) cellStyle = { ...cellStyle, ...calStyles.bookedCell };
                                    if (isToday) cellStyle = { ...cellStyle, ...calStyles.todayCell };
                                    if (isSel) cellStyle = { ...cellStyle, ...calStyles.selectedCell };

                                    return (
                                        <button
                                            key={day}
                                            style={cellStyle}
                                            onClick={() => handleDayClick(day)}
                                            disabled={isPast}
                                            title={dateStr}
                                        >
                                            {day}
                                            {hasSlot && !isSel && (
                                                <span style={{ position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: isBooked ? "#f59e0b" : "#22c55e" }} />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
                                {[
                                    { color: "#22c55e", label: "Has free slot" },
                                    { color: "#f59e0b", label: "Has booked slot" },
                                    { color: "#2563eb", label: "Today" },
                                    { color: "#16a34a", label: "Selected" },
                                ].map((l) => (
                                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#6b8f6b" }}>
                                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: l.color, display: "inline-block" }} />
                                        {l.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── RIGHT: Add form + selected date slots ── */}
                        <div>
                            {selected ? (
                                <>
                                    <div style={{ fontSize: 13, color: "var(--green-bright)", fontWeight: 700, marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
                                        📅 {selected}
                                        {selectedSlots.length > 0 && <span style={{ marginLeft: 8, fontSize: 11, color: "var(--text-muted)" }}>({selectedSlots.length} slot{selectedSlots.length > 1 ? "s" : ""})</span>}
                                    </div>

                                    {/* Existing slots on selected date */}
                                    {selectedSlots.length > 0 && (
                                        <div style={{ marginBottom: 16 }}>
                                            {selectedSlots.map((s) => (
                                                <div key={s.id} style={slotRowStyle(s.isBooked)}>
                                                    <div>
                                                        <span style={{ color: "var(--green-bright)", fontSize: 13 }}>{s.startTime}</span>
                                                        <span style={{ color: "var(--text-dim)", fontSize: 12 }}> – {s.endTime}</span>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                        <span style={{ fontSize: 11, color: s.isBooked ? "#f59e0b" : "#22c55e" }}>
                                                            {s.isBooked ? "⬡ booked" : "● free"}
                                                        </span>
                                                        {!s.isBooked && (
                                                            <button
                                                                className="btn btn-danger btn-xs"
                                                                onClick={() => handleDelete(s.id)}
                                                                disabled={deleting === s.id}
                                                            >
                                                                {deleting === s.id ? "…" : "✕"}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add slot form */}
                                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}>➕ Add new slot on {selected}:</div>

                                    <div className="form-group">
                                        <label className="form-label">startTime</label>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                                            {TIME_PRESETS.map((t) => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    className={`btn btn-xs ${startTime === t ? "btn-primary" : "btn-outline"}`}
                                                    onClick={() => setStartTime(t)}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="input-wrap">
                                            <span className="input-prefix">$</span>
                                            <input className="term-input" value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="10:00 AM" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">duration → endTime</label>
                                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                                            {DURATION_OPTS.map((d) => {
                                                const computedEnd = d.end(startTime);
                                                return (
                                                    <button
                                                        key={d.label}
                                                        type="button"
                                                        className={`btn btn-xs ${endTime === computedEnd ? "btn-primary" : "btn-outline"}`}
                                                        onClick={() => setEndTime(computedEnd)}
                                                    >
                                                        {d.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div className="input-wrap">
                                            <span className="input-prefix">$</span>
                                            <input className="term-input" value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="11:00 AM" />
                                        </div>
                                    </div>

                                    <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleAddSlot} disabled={adding}>
                                        {adding ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Adding…</> : `+ Add Slot on ${selected}`}
                                    </button>
                                </>
                            ) : (
                                <div className="alert alert-info">
                                    👈 Click a date on the calendar to select it, then add a time slot.
                                </div>
                            )}

                            {/* Upcomng stats */}
                            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
                                <div className="stat-box"><div className="stat-num">{slots.length}</div><div className="stat-lbl">total slots</div></div>
                                <div className="stat-box"><div className="stat-num">{slots.filter(s => !s.isBooked).length}</div><div className="stat-lbl">free</div></div>
                                <div className="stat-box"><div className="stat-num">{slots.filter(s => s.isBooked).length}</div><div className="stat-lbl">booked</div></div>
                            </div>
                        </div>
                    </div>

                    {/* ── All slots table ── */}
                    <div className="cmd-line mt-24">
                        <span className="prompt">admin@portfolio:~#</span>
                        <span className="cmd-text">GET /api/admin/availability — all {slots.length} slots</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "10px 0" }}>
                        <span className="text-muted text-sm">Sorted by date ascending</span>
                        <button className="btn btn-outline btn-xs" onClick={fetchSlots} disabled={fetching}>↻ refresh</button>
                    </div>

                    {fetching ? (
                        <div style={{ display: "flex", gap: 10, padding: "12px 0" }}><span className="spinner" /><span className="text-muted">Loading…</span></div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table className="data-table">
                                <thead>
                                    <tr><th>ID</th><th>Date</th><th>Start</th><th>End</th><th>Status</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {slots.map((s) => (
                                        <tr key={s.id}>
                                            <td className="text-dim">#{s.id}</td>
                                            <td className="name">{s.date}</td>
                                            <td>{s.startTime}</td>
                                            <td>{s.endTime}</td>
                                            <td>{s.isBooked ? <span className="slot-status-booked">⬡ booked</span> : <span className="slot-status-free">● free</span>}</td>
                                            <td>
                                                {!s.isBooked && (
                                                    <button className="btn btn-danger btn-xs" onClick={() => handleDelete(s.id)} disabled={deleting === s.id}>
                                                        {deleting === s.id ? "…" : "✕ delete"}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {slots.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-dim)", padding: "20px 0" }}>No slots yet — use the calendar to add one.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </ShellLayout>
    );
}

function slotRowStyle(isBooked: boolean): React.CSSProperties {
    return {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px",
        background: "var(--bg)",
        border: `1px solid ${isBooked ? "#451a03" : "var(--border)"}`,
        borderRadius: 6,
        marginBottom: 6,
    };
}

const calStyles: Record<string, React.CSSProperties> = {
    calHeader: {
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 12,
    },
    navBtn: {
        background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--green)",
        width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 16,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-mono)",
    },
    monthLabel: { fontSize: 14, fontWeight: 700, color: "var(--green-bright)", fontFamily: "var(--font-mono)" },
    dayNames: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 },
    dayName: { textAlign: "center", fontSize: 11, color: "var(--text-dim)", padding: "4px 0", fontFamily: "var(--font-mono)" },
    grid: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 },
    emptyCell: { display: "block" },
    dayCell: {
        position: "relative", textAlign: "center", padding: "7px 2px", fontSize: 12,
        borderRadius: 6, cursor: "pointer", background: "var(--bg-card)",
        border: "1px solid var(--border)", color: "var(--text-muted)",
        fontFamily: "var(--font-mono)", transition: "all .12s",
    },
    pastCell: { opacity: 0.3, cursor: "not-allowed" },
    hasSlotCell: { borderColor: "#16a34a", color: "var(--green)" },
    bookedCell: { borderColor: "#92400e", color: "#f59e0b" },
    todayCell: { borderColor: "#2563eb", color: "#93c5fd", fontWeight: 700 },
    selectedCell: { background: "var(--green)", color: "#050a05", fontWeight: 700, boxShadow: "0 0 10px rgba(34,197,94,0.4)" },
};
