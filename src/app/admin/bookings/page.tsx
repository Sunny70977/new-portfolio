"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ShellLayout from "@/components/ShellLayout";
import { getAllBookings, cancelBooking } from "@/lib/api";
import toast from "react-hot-toast";

interface Booking {
    id: number;
    recruiterName: string;
    recruiterEmail: string;
    recruiterCompany: string;
    recruiterPhone: string;
    message?: string;
    createdAt: string;
    slot?: {
        date: string;
        startTime: string;
        endTime: string;
    };
}

export default function AdminBookingsPage() {
    const { isAdmin, loading, user } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [fetching, setFetching] = useState(true);
    const [cancelling, setCancelling] = useState<number | null>(null);

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) router.push("/admin-login");
    }, [loading, user, isAdmin, router]);

    const fetchBookings = async () => {
        setFetching(true);
        try {
            const res = await getAllBookings();
            setBookings(res.data);
        } catch {
            toast.error("Failed to fetch bookings");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => { if (isAdmin) fetchBookings(); }, [isAdmin]);

    const handleCancel = async (id: number, name: string) => {
        if (!confirm(`Cancel booking for ${name}? This will free the slot.`)) return;
        setCancelling(id);
        try {
            await cancelBooking(id);
            toast.success(`Booking cancelled & slot freed ✅`);
            fetchBookings();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Cancel failed";
            toast.error(`❌ ${msg}`);
        } finally {
            setCancelling(null);
        }
    };

    if (loading || !isAdmin) return <div className="login-page"><span className="spinner" /></div>;

    return (
        <ShellLayout>
            <div className="term-window">
                <div className="term-bar">
                    <span className="term-bar-title">admin — GET/DELETE /api/interviews/bookings</span>
                </div>
                <div className="term-body">
                    <div className="cmd-line">
                        <span className="prompt">admin@portfolio:~#</span>
                        <span className="cmd-text">GET /api/interviews/bookings — all bookings</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "12px 0" }}>
                        <span className="text-muted text-sm">{bookings.length} total booking{bookings.length !== 1 ? "s" : ""}</span>
                        <button className="btn btn-outline btn-xs" onClick={fetchBookings} disabled={fetching}>↻ refresh</button>
                    </div>

                    {fetching ? (
                        <div style={{ display: "flex", gap: 10, padding: "16px 0" }}>
                            <span className="spinner" /><span className="text-muted">Loading bookings…</span>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="alert alert-info">No bookings yet. Share your portfolio so recruiters can book a slot!</div>
                    ) : (
                        <>
                            {/* Desktop table */}
                            <div style={{ overflowX: "auto" }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Recruiter</th>
                                            <th>Company</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Slot</th>
                                            <th>Booked</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map((b) => (
                                            <tr key={b.id}>
                                                <td className="text-dim">#{b.id}</td>
                                                <td className="name">{b.recruiterName}</td>
                                                <td>{b.recruiterCompany}</td>
                                                <td><a href={`mailto:${b.recruiterEmail}`} className="text-green" style={{ textDecoration: "none" }}>{b.recruiterEmail}</a></td>
                                                <td>{b.recruiterPhone}</td>
                                                <td>
                                                    {b.slot
                                                        ? <span className="text-green">{b.slot.date} · {b.slot.startTime}–{b.slot.endTime}</span>
                                                        : <span className="text-dim">—</span>}
                                                </td>
                                                <td className="text-dim text-xs">{new Date(b.createdAt).toLocaleDateString("en-IN")}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-danger btn-xs"
                                                        onClick={() => handleCancel(b.id, b.recruiterName)}
                                                        disabled={cancelling === b.id}
                                                    >
                                                        {cancelling === b.id ? "…" : "✕ cancel"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Message preview cards */}
                            <div className="cmd-line mt-24">
                                <span className="prompt">admin@portfolio:~#</span>
                                <span className="cmd-text">cat bookings/*.message</span>
                            </div>
                            {bookings.filter((b) => b.message).map((b) => (
                                <div key={b.id} className="card mt-8" style={{ marginTop: 8 }}>
                                    <div style={{ marginBottom: 4 }}>
                                        <span className="text-bright">{b.recruiterName}</span>
                                        <span className="text-dim text-xs"> @ {b.recruiterCompany}</span>
                                    </div>
                                    <div className="text-muted text-sm">&ldquo;{b.message}&rdquo;</div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </ShellLayout>
    );
}
