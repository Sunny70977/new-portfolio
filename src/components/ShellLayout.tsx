"use client";
import { useState } from "react";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="app-shell">
            <TopBar onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
            <div className="main-layout">
                <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
                <main className="page-content">{children}</main>
            </div>

            {/* Overlay for mobile clicking */}
            {isMobileMenuOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}
