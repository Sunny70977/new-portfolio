"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface TopBarProps {
    onToggleMenu?: () => void;
}

export default function TopBar({ onToggleMenu }: TopBarProps) {
    const { user, isAdmin } = useAuth();
    const router = useRouter();
    const [time, setTime] = useState("");

    useEffect(() => {
        const fmt = () =>
            setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        fmt();
        const id = setInterval(fmt, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <header className="topbar">
            <div className="topbar-left">
                <div className="mobile-menu-btn" onClick={onToggleMenu}>
                    ☰
                </div>
                {/* <div className="win-btns">
                    <span className="win-btn red" />
                    <span className="win-btn yellow" />
                    <span className="win-btn green" />
                </div> */}
                <span className="topbar-title" onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
                    sunny@portfolio<span className="dim">:~$</span>&nbsp;
                    <span className="blink">█</span>
                </span>
            </div>
            <div className="topbar-right">
                {user && (
                    <span className="topbar-status">
                        <span style={{ color: "var(--amber)" }}>{user.phoneNumber}</span>
                        {isAdmin && <span className="badge-admin" style={{ marginLeft: 6 }}>ADMIN</span>}
                    </span>
                )}
                <span className="topbar-status">
                    <span className="dot-online">●</span> API :5000
                </span>
                <span className="topbar-status" style={{ color: "var(--green)", fontWeight: 600 }}>
                    {time}
                </span>
            </div>
        </header>
    );
}
