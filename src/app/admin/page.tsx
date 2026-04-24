"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ShellLayout from "@/components/ShellLayout";
import Link from "next/link";

export default function AdminDashboard() {
    const { isAdmin, loading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) router.push("/admin-login");
    }, [loading, user, isAdmin, router]);

    if (loading) return <div className="login-page"><span className="spinner" /></div>;
    if (!isAdmin) return null;

    return (
        <ShellLayout>
            <div className="term-window">
                <div className="term-bar">
                    <span className="term-bar-title">admin@portfolio — dashboard</span>
                </div>
                <div className="term-body">
                    <div className="cmd-line">
                        <span className="prompt">admin@portfolio:~#</span>
                        <span className="cmd-text">dashboard --status</span>
                    </div>
                    <div className="alert alert-success" style={{ marginTop: 12, marginBottom: 20 }}>
                        🛡 Logged in as <strong>{user?.phoneNumber}</strong> · Role: <span className="badge-admin">ADMIN</span>
                    </div>

                    <div className="admin-grid">
                        <Link href="/admin/slots" className="card" style={{ textDecoration: "none", display: "block" }}>
                            <div style={{ fontSize: 28, marginBottom: 10 }}>📆</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--green-bright)", marginBottom: 6 }}>Manage Slots</div>
                            <div className="text-muted text-sm">Add or delete availability slots. POST/DELETE /api/admin/availability</div>
                            <div className="btn btn-outline btn-sm" style={{ marginTop: 14, display: "inline-flex" }}>Open →</div>
                        </Link>
                        <Link href="/admin/bookings" className="card" style={{ textDecoration: "none", display: "block" }}>
                            <div style={{ fontSize: 28, marginBottom: 10 }}>📋</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--green-bright)", marginBottom: 6 }}>View Bookings</div>
                            <div className="text-muted text-sm">See all confirmed bookings. Cancel any booking and free the slot. GET/DELETE /api/interviews/bookings</div>
                            <div className="btn btn-outline btn-sm" style={{ marginTop: 14, display: "inline-flex" }}>Open →</div>
                        </Link>
                    </div>

                    <div className="cmd-line mt-24">
                        <span className="prompt">admin@portfolio:~#</span>
                        <span className="cmd-text">cat api-routes.md | grep admin</span>
                    </div>
                    <div style={{ marginTop: 10 }}>
                        {[
                            { method: "POST", url: "/api/admin/availability", desc: "Add a new slot" },
                            { method: "GET", url: "/api/admin/availability", desc: "All slots (inc. booked)" },
                            { method: "DELETE", url: "/api/admin/availability/:id", desc: "Delete unbooked slot" },
                            { method: "GET", url: "/api/interviews/bookings", desc: "All bookings with details" },
                            { method: "DELETE", url: "/api/interviews/bookings/:id", desc: "Cancel booking + free slot" },
                        ].map((r) => (
                            <div key={r.url + r.method} style={{ display: "flex", gap: 12, alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                                <span className={r.method === "GET" ? "badge-get" : r.method === "POST" ? "badge-post" : "badge-delete"}>
                                    {r.method}
                                </span>
                                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text)" }}>{r.url}</span>
                                <span className="text-dim text-xs">{r.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ShellLayout>
    );
}
