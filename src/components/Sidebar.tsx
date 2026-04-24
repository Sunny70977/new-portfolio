"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const NAV = [
    { href: "/", icon: "~", label: "/home" },
    { href: "/about", icon: "👤", label: "/about" },
    { href: "/skills", icon: "⚙", label: "/skills" },
    { href: "/projects", icon: "📁", label: "/projects" },
    { href: "/experience", icon: "💼", label: "/experience" },
    { href: "/interview", icon: "📅", label: "/book-interview" },
    { href: "/contact", icon: "✉", label: "/contact" },
];

const ADMIN_NAV = [
    { href: "/admin", icon: "🛡", label: "/admin/dashboard" },
    { href: "/admin/slots", icon: "📆", label: "/admin/slots" },
    { href: "/admin/bookings", icon: "📋", label: "/admin/bookings" },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { user, isAdmin, logout } = useAuth();
    const [uptime, setUptime] = useState("0d 0h 0m");
    const [time, setTime] = useState("");
    const [isPhotoOpen, setIsPhotoOpen] = useState(false);

    useEffect(() => {
        const start = Date.now();
        const tick = () => {
            const diff = Math.floor((Date.now() - start) / 1000);
            const d = Math.floor(diff / 86400);
            const h = Math.floor((diff % 86400) / 3600);
            const m = Math.floor((diff % 3600) / 60);
            setUptime(`${d}d ${h}h ${m}m`);
            setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
        };
        tick();
        const id = setInterval(tick, 60_000);
        return () => clearInterval(id);
    }, []);

    return (
        <aside className={`sidebar ${isOpen ? "mobile-open" : ""}`}>
            {onClose && (
                <button className="mobile-close-btn" onClick={onClose}>×</button>
            )}
            {/* User */}
            <div className="sidebar-user">
                <div
                    className="sidebar-avatar"
                    onClick={() => setIsPhotoOpen(true)}
                    style={{ cursor: "pointer" }}
                    title="View Profile Photo"
                >
                    <Image src="/photo.jpg" alt="Sunny Kumar" width={44} height={44} />
                </div>
                <div className="sidebar-name">Sunny Kumar</div>
                <div className="sidebar-role" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    Software Developer
                    {isAdmin && <span className="badge-admin">ADMIN</span>}
                </div>
            </div>

            {/* Public nav */}
            <div className="nav-group-label">navigation</div>
            {NAV.map((n) => (
                <Link
                    key={n.href}
                    href={n.href}
                    onClick={onClose}
                    className={`nav-link${pathname === n.href ? " active" : ""}`}
                >
                    <span className="nav-icon">{n.icon}</span>
                    <span className="nav-label">{n.label}</span>
                    <span className="nav-arrow">›</span>
                </Link>
            ))}

            {/* Admin nav */}
            {isAdmin && (
                <>
                    <div className="nav-group-label mt-8">admin panel</div>
                    {ADMIN_NAV.map((n) => (
                        <Link
                            key={n.href}
                            href={n.href}
                            onClick={onClose}
                            className={`nav-link${pathname.startsWith(n.href) ? " active" : ""}`}
                        >
                            <span className="nav-icon">{n.icon}</span>
                            <span className="nav-label">{n.label}</span>
                            <span className="nav-arrow">›</span>
                        </Link>
                    ))}
                </>
            )}

            {/* Auth */}
            <div className="nav-group-label mt-8">auth</div>
            {user ? (
                <button className="nav-link" style={{ background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer" }} onClick={() => { logout(); onClose?.(); }}>
                    <span className="nav-icon">🚪</span>
                    <span className="nav-label text-red">/logout</span>
                </button>
            ) : (
                <Link href="/admin-login" onClick={onClose} className={`nav-link${pathname === "/admin-login" ? " active" : ""}`}>
                    <span className="nav-icon">🔑</span>
                    <span className="nav-label">/admin-login</span>
                    <span className="nav-arrow">›</span>
                </Link>
            )}

            {/* Footer */}
            <div className="sidebar-footer">
                <div className="sys-info-row"><span className="sys-key">OS:</span><span className="sys-val">Ubuntu 22.04</span></div>
                <div className="sys-info-row"><span className="sys-key">Shell:</span><span className="sys-val">bash 5.1</span></div>
                <div className="sys-info-row"><span className="sys-key">Node:</span><span className="sys-val">v20.11.0</span></div>
                <div className="sys-info-row"><span className="sys-key">Time:</span><span className="sys-val">{time}</span></div>
                <div className="sys-info-row"><span className="sys-key">Uptime:</span><span className="sys-val">{uptime}</span></div>
            </div>

            {/* Photo Modal via React Portal to escape clipping / stacking contexts */}
            {isPhotoOpen && typeof window !== "undefined" && createPortal(
                <div className="photo-modal-overlay" onClick={() => setIsPhotoOpen(false)}>
                    <div
                        className="photo-modal-content"
                        onClick={(e) => e.stopPropagation()} /* Prevent closing when clicking the image itself if needed */
                    >
                        <Image
                            src="/photo.jpg"
                            alt="Sunny Kumar (Enlarged)"
                            width={500}
                            height={500}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}
                            unoptimized
                        />
                    </div>
                </div>,
                document.body
            )}
        </aside>
    );
}
