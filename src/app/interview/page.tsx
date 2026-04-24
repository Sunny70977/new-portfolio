"use client";
import { useEffect, useState } from "react";
import ShellLayout from "@/components/ShellLayout";
import { getSlots, bookInterview } from "@/lib/api";
import toast from "react-hot-toast";

interface Slot {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

interface GroupedSlots {
    [date: string]: Slot[];
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function InterviewPage() {
    const [slots, setSlots] = useState<Slot[]>([]);
    const [grouped, setGrouped] = useState<GroupedSlots>({});
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Slot | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState<{ date: string; time: string } | null>(null);
    const [form, setForm] = useState({
        recruiterName: "", recruiterEmail: "", recruiterCompany: "",
        recruiterPhone: "", message: "",
    });

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const res = await getSlots();
            const data: Slot[] = res.data;
            setSlots(data);
            // Group by date
            const g: GroupedSlots = {};
            data.forEach((s) => { (g[s.date] = g[s.date] || []).push(s); });
            setGrouped(g);
        } catch {
            toast.error("❌ Could not reach the API. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSlots(); }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected) return;
        setSubmitting(true);
        try {
            await bookInterview({ availabilityId: selected.id, ...form });
            setSuccess({ date: selected.date, time: `${selected.startTime} – ${selected.endTime}` });
            toast.success("🎉 Booked! Check your email.");
            setForm({ recruiterName: "", recruiterEmail: "", recruiterCompany: "", recruiterPhone: "", message: "" });
            setSelected(null);
            fetchSlots();
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                "Booking failed. Please try again.";
            toast.error(`❌ ${msg}`);
        } finally {
            setSubmitting(false);
        }
    };

    const dates = Object.keys(grouped).sort();

    return (
        <ShellLayout>
            <div className="term-window">
                <div className="term-bar">
                    <span className="term-bar-title">./book-interview.sh — Interview Scheduler</span>
                </div>
                <div className="term-body">

                    {/* ── Header command ── */}
                    <div className="cmd-line">
                        <span className="prompt">sunny@portfolio:~$</span>
                        <span className="cmd-text">GET /api/interviews/slots — public</span>
                    </div>

                    {/* ── Success Banner ── */}
                    {success && (
                        <div style={successBox}>
                            <div style={{ fontSize: 22, marginBottom: 8 }}>🎉</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "#22c55e", marginBottom: 4 }}>Interview Booked Successfully!</div>
                            <div style={{ fontSize: 13, color: "#6b8f6b" }}>{success.date} · {success.time} IST</div>
                            <div style={{ fontSize: 12, color: "#4a6b4a", marginTop: 6 }}>
                                ✉ Confirmation sent to your email. Sunny has been notified via email + WhatsApp.
                            </div>
                            <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }} onClick={() => setSuccess(null)}>
                                Book Another →
                            </button>
                        </div>
                    )}

                    {/* ── Slots Table (row-wise) ── */}
                    {!success && (
                        <>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "14px 0 10px" }}>
                                <span className="text-muted text-sm">
                                    {loading ? "Fetching…" : `${slots.length} slot${slots.length !== 1 ? "s" : ""} available across ${dates.length} day${dates.length !== 1 ? "s" : ""}`}
                                </span>
                                <button className="btn btn-outline btn-xs" onClick={fetchSlots} disabled={loading}>↻ refresh</button>
                            </div>

                            {loading ? (
                                <div style={{ display: "flex", gap: 10, padding: "20px 0", alignItems: "center" }}>
                                    <span className="spinner" />
                                    <span className="text-muted">Connecting to API…</span>
                                </div>
                            ) : dates.length === 0 ? (
                                <div className="alert alert-info">
                                    No available slots at the moment. Please check back later, or contact Sunny directly at{" "}
                                    <a href="mailto:sunnykumar5sept@gmail.com" style={{ color: "var(--green)" }}>sunnykumar5sept@gmail.com</a>
                                </div>
                            ) : (
                                /* ── Row-wise date groups ── */
                                <div>
                                    {dates.map((date) => (
                                        <div key={date} style={dateGroup}>
                                            {/* Date header row */}
                                            <div style={dateHeader}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <span style={{ fontSize: 16 }}>📅</span>
                                                    <div>
                                                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--green-bright)" }}>
                                                            {formatDate(date)}
                                                        </div>
                                                        <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                                                            {grouped[date].length} slot{grouped[date].length > 1 ? "s" : ""}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span style={{ fontSize: 11, color: "var(--text-dim)" }}>{date}</span>
                                            </div>

                                            {/* Time slots as row pills */}
                                            <div style={slotPillsRow}>
                                                {grouped[date].map((slot) => {
                                                    const isSel = selected?.id === slot.id;
                                                    return (
                                                        <button
                                                            key={slot.id}
                                                            onClick={() => { setSelected(slot); /* scroll to form */ }}
                                                            disabled={slot.isBooked}
                                                            style={{
                                                                ...slotPill,
                                                                ...(isSel ? slotPillSelected : {}),
                                                                ...(slot.isBooked ? slotPillBooked : {}),
                                                            }}
                                                            title={slot.isBooked ? "Already booked" : `Click to book ${slot.startTime} – ${slot.endTime}`}
                                                        >
                                                            <span style={{ fontSize: 11, marginRight: 4 }}>
                                                                {slot.isBooked ? "🔒" : isSel ? "✅" : "🕐"}
                                                            </span>
                                                            {slot.startTime} – {slot.endTime}
                                                            {slot.isBooked && <span style={{ marginLeft: 6, fontSize: 10, opacity: .7 }}>(booked)</span>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ── Booking Form ── */}
                            {selected && (
                                <div style={{ marginTop: 24 }}>
                                    <div className="cmd-line">
                                        <span className="prompt">sunny@portfolio:~$</span>
                                        <span className="cmd-text">POST /api/interviews/book — slot #{selected.id}</span>
                                    </div>

                                    <div className="alert alert-success" style={{ marginTop: 10 }}>
                                        ✅ Selected: <strong>{formatDate(selected.date)}</strong> · {selected.startTime} – {selected.endTime} IST
                                        <button className="btn btn-xs btn-outline" style={{ marginLeft: 12 }} onClick={() => setSelected(null)}>
                                            ✕ deselect
                                        </button>
                                    </div>

                                    <form onSubmit={handleBook} style={{ marginTop: 16 }}>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">recruiterName <span className="req">*</span></label>
                                                <div className="input-wrap">
                                                    <span className="input-prefix">$</span>
                                                    <input name="recruiterName" value={form.recruiterName} onChange={handleChange}
                                                        className="term-input" placeholder="Your full name" required />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">recruiterEmail <span className="req">*</span></label>
                                                <div className="input-wrap">
                                                    <span className="input-prefix">$</span>
                                                    <input name="recruiterEmail" type="email" value={form.recruiterEmail} onChange={handleChange}
                                                        className="term-input" placeholder="your@company.com" required />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">recruiterCompany <span className="req">*</span></label>
                                                <div className="input-wrap">
                                                    <span className="input-prefix">$</span>
                                                    <input name="recruiterCompany" value={form.recruiterCompany} onChange={handleChange}
                                                        className="term-input" placeholder="Company name" required />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">recruiterPhone <span className="req">*</span></label>
                                                <div className="input-wrap">
                                                    <span className="input-prefix">$</span>
                                                    <input name="recruiterPhone" type="tel" value={form.recruiterPhone} onChange={handleChange}
                                                        className="term-input" placeholder="+91XXXXXXXXXX" required />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">message <span className="opt">(optional)</span></label>
                                            <div className="input-wrap">
                                                <span className="input-prefix">$</span>
                                                <textarea name="message" value={form.message} onChange={handleChange}
                                                    className="term-input" rows={3}
                                                    placeholder="Anything you'd like Sunny to know before the interview…" />
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                                            <button type="button" className="btn btn-outline" onClick={() => setSelected(null)}>✕ cancel</button>
                                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                                {submitting
                                                    ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Booking…</>
                                                    : "▶ Confirm Booking"}
                                            </button>
                                            <span className="text-xs text-dim">⚡ Rate limited: 5 bookings/hour per IP</span>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </ShellLayout>
    );
}

/* ─── styles ─── */
const dateGroup: React.CSSProperties = {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
};
const dateHeader: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 16px",
    background: "var(--bg-surface)",
    borderBottom: "1px solid var(--border)",
};
const slotPillsRow: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    padding: "12px 16px",
};
const slotPill: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "7px 14px",
    borderRadius: 6,
    fontSize: 12,
    fontFamily: "var(--font-mono)",
    background: "var(--bg)",
    border: "1px solid var(--border-light)",
    color: "var(--text)",
    cursor: "pointer",
    transition: "all .15s",
};
const slotPillSelected: React.CSSProperties = {
    background: "var(--green-faint)",
    border: "1px solid var(--green)",
    color: "var(--green-bright)",
    boxShadow: "0 0 12px var(--green-glow)",
};
const slotPillBooked: React.CSSProperties = {
    opacity: 0.4,
    cursor: "not-allowed",
    color: "var(--text-dim)",
};
const successBox: React.CSSProperties = {
    background: "rgba(34,197,94,0.06)",
    border: "1px solid var(--green-dim)",
    borderRadius: 10,
    padding: "24px",
    textAlign: "center",
    margin: "16px 0",
};
