"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { devLogin } from "@/lib/api";
import toast from "react-hot-toast";

const ASCII_LOCK = `
  ██╗      ██████╗  ██████╗██╗  ██╗
  ██║     ██╔═══██╗██╔════╝██║ ██╔╝
  ██║     ██║   ██║██║     █████╔╝ 
  ██║     ██║   ██║██║     ██╔═██╗
  ███████╗╚██████╔╝╚██████╗██║  ██╗
  ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝
`;

export default function AdminLoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [logLines, setLogLines] = useState<string[]>([
        "Initialising secure admin terminal...",
        "Loading auth module...",
        "Ready. Awaiting credentials.",
    ]);

    const pushLog = (line: string) =>
        setLogLines((l) => [...l.slice(-12), line]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone.trim()) { toast.error("Phone is required"); return; }
        pushLog(`$ sudo auth --phone ${phone.trim()}`);
        pushLog("Verifying identity via backend JWT...");
        setLoading(true);
        try {
            const res = await devLogin(phone.trim());
            const { token, user } = res.data;
            pushLog(`✅ Authenticated — role: ${user.role}`);
            if (user.role !== "admin") {
                pushLog("⛔ Access denied — admin role required.");
                toast.error("You are not an admin. Ask the DB admin to upgrade your role.");
                return;
            }
            login(token, user);
            pushLog("🔓 Admin session started. Redirecting...");
            toast.success("Welcome back, Admin!");
            setTimeout(() => router.push("/admin"), 800);
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                "Authentication failed";
            pushLog(`❌ Error: ${msg}`);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            {/* Scanlines */}
            <div style={styles.scanlines} />

            <div style={styles.container}>
                {/* Top bar */}
                <div style={styles.topBar}>
                    <div style={styles.winBtns}>
                        <span style={{ ...styles.wb, background: "#ef4444" }} />
                        <span style={{ ...styles.wb, background: "#f59e0b" }} />
                        <span style={{ ...styles.wb, background: "#22c55e" }} />
                    </div>
                    <span style={styles.topBarTitle}>root@portfolio — admin secure shell</span>
                    <span style={styles.topBarTime}>{new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>

                <div style={styles.body}>
                    {/* ASCII logo */}
                    <pre style={styles.ascii}>{ASCII_LOCK}</pre>
                    <div style={styles.subtitle}>ADMIN PANEL — RESTRICTED ACCESS</div>

                    {/* Log output */}
                    <div style={styles.logBox}>
                        {logLines.map((l, i) => (
                            <div key={i} style={styles.logLine}>
                                <span style={styles.logArrow}>&gt; </span>
                                <span style={l.startsWith("✅") || l.startsWith("🔓") ? { color: "#22c55e" }
                                    : l.startsWith("❌") || l.startsWith("⛔") ? { color: "#ef4444" }
                                        : l.startsWith("$") ? { color: "#fde68a" }
                                            : { color: "#6b8f6b" }}>{l}</span>
                            </div>
                        ))}
                        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                            <span style={styles.logArrow}>$</span>
                            <span style={{ color: "#22c55e", animation: "blink 1s step-end infinite" }}>█</span>
                        </div>
                    </div>

                    {/* Login form */}
                    <form onSubmit={handleLogin} style={styles.form}>
                        <div style={styles.formRow}>
                            <label style={styles.label}>
                                <span style={{ color: "#22c55e" }}>root@portfolio:~#</span> enter Phone Number
                            </label>
                            <div style={styles.inputWrap}>
                                <span style={styles.inputPrefix}>$</span>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    style={styles.input}
                                    placeholder="+91XXXXXXXXXX"
                                    autoFocus
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} style={{
                            ...styles.btn,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? "not-allowed" : "pointer",
                        }}>
                            {loading
                                ? <span>⠋ Authenticating…</span>
                                : <span>▶ sudo login --admin</span>}
                        </button>
                    </form>

                    {/* Hint */}
                    <div style={styles.hint}>
                        <div>POST /api/auth/dev-login · JWT stored in cookie · 24h expiry</div>
                        <div style={{ marginTop: 4, opacity: 0.6 }}>
                            To grant admin: <code style={{ color: "#fde68a" }}>UPDATE &quot;Users&quot; SET role=&apos;admin&apos; WHERE &quot;phoneNumber&quot;=&apos;+91...&apos;;</code>
                        </div>
                    </div>

                    {/* Back link */}
                    <a href="/" style={styles.backLink}>← back to portfolio</a>
                </div>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
        body { margin: 0; background: #050a05; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes flicker {
          0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:.85} 94%{opacity:1}
          96%{opacity:.9} 97%{opacity:1}
        }
      `}</style>
        </div>
    );
}

/* ─── inline styles (no Tailwind, pure CSS-in-JS so it's self-contained) ─── */
const font = "'JetBrains Mono', monospace";

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050a05",
        fontFamily: font,
        padding: 20,
        position: "relative",
        animation: "flicker 8s infinite",
    },
    scanlines: {
        position: "fixed",
        inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,0,0.015) 2px,rgba(0,255,0,0.015) 4px)",
        pointerEvents: "none",
        zIndex: 10,
    },
    container: {
        width: "100%",
        maxWidth: 560,
        border: "1px solid #1a2e1a",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 0 60px rgba(34,197,94,0.12), 0 0 120px rgba(34,197,94,0.05)",
        background: "#0a0f0a",
    },
    topBar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        background: "#0d140d",
        borderBottom: "1px solid #1a2e1a",
    },
    winBtns: { display: "flex", gap: 6 },
    wb: { width: 12, height: 12, borderRadius: "50%", display: "inline-block" },
    topBarTitle: { fontSize: 12, color: "#4a6b4a", fontFamily: font },
    topBarTime: { fontSize: 12, color: "#22c55e", fontFamily: font },
    body: { padding: 28 },
    ascii: {
        color: "#22c55e",
        fontSize: 13,
        lineHeight: 1.3,
        margin: "0 0 4px",
        textShadow: "0 0 10px rgba(34,197,94,0.5)",
        fontFamily: font,
        overflow: "hidden",
    },
    subtitle: {
        fontSize: 10,
        letterSpacing: "2.5px",
        color: "#4a6b4a",
        textAlign: "center" as const,
        marginBottom: 20,
        fontFamily: font,
    },
    logBox: {
        background: "#060c06",
        border: "1px solid #1a2e1a",
        borderRadius: 6,
        padding: "12px 14px",
        marginBottom: 20,
        maxHeight: 180,
        overflowY: "auto" as const,
        fontFamily: font,
    },
    logLine: { fontSize: 12, lineHeight: 1.7, color: "#6b8f6b" },
    logArrow: { color: "#22c55e", marginRight: 4 },
    form: { marginBottom: 16 },
    formRow: { marginBottom: 12 },
    label: { display: "block", fontSize: 12, color: "#4a6b4a", marginBottom: 6, fontFamily: font },
    inputWrap: {
        display: "flex",
        alignItems: "center",
        background: "#060c06",
        border: "1px solid #253525",
        borderRadius: 6,
    },
    inputPrefix: { padding: "0 10px", color: "#22c55e", fontSize: 14, fontFamily: font },
    input: {
        flex: 1,
        background: "transparent",
        border: "none",
        outline: "none",
        padding: "10px 12px 10px 0",
        fontFamily: font,
        fontSize: 14,
        color: "#d4e8d4",
    },
    btn: {
        width: "100%",
        padding: "12px",
        background: "#22c55e",
        color: "#050a05",
        border: "none",
        borderRadius: 6,
        fontFamily: font,
        fontSize: 14,
        fontWeight: 700,
        boxShadow: "0 0 20px rgba(34,197,94,0.3)",
        transition: "all .15s",
    },
    hint: {
        fontSize: 11,
        color: "#2d4a2d",
        lineHeight: 1.7,
        borderTop: "1px solid #1a2e1a",
        paddingTop: 14,
        marginTop: 4,
        fontFamily: font,
    },
    backLink: {
        display: "block",
        marginTop: 16,
        fontSize: 12,
        color: "#4a6b4a",
        textDecoration: "none",
        fontFamily: font,
        textAlign: "center" as const,
    },
};
