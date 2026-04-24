"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { firebaseLogin } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import toast from "react-hot-toast";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    // Initialize invisible recaptcha when component mounts
    useEffect(() => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
            });
        }
    }, []);

    const sendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone.trim()) { toast.error("Phone number is required"); return; }

        let formattedPhone = phone.trim();
        if (!formattedPhone.startsWith("+")) {
            formattedPhone = "+91" + formattedPhone; // default to +91 if no code provided
        }

        setLoading(true);
        try {
            const appVerifier = window.recaptchaVerifier;
            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            setConfirmationResult(confirmation);
            setStep("OTP");
            toast.success("OTP sent to your phone! 📲");
        } catch (err: unknown) {
            console.error(err);
            toast.error("❌ Failed to send OTP. Check your Firebase API keys.");
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp.trim() || !confirmationResult) return;

        setLoading(true);
        try {
            // 1. Verify OTP with Firebase
            const result = await confirmationResult.confirm(otp.trim());
            const idToken = await result.user.getIdToken();

            // 2. Send Firebase ID Token to our Backend
            const res = await firebaseLogin(idToken);

            // 3. Complete login with OUR backend's custom JWT
            login(res.data.token, res.data.user);
            toast.success(`✅ Logged in as ${res.data.user.role}`);
            router.push(res.data.user.role === "admin" ? "/admin" : "/");

        } catch (err: unknown) {
            console.error(err);
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Invalid OTP or backend error";
            toast.error(`❌ ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div id="recaptcha-container"></div>

            <div className="login-box">
                <div className="term-window">
                    <div className="term-bar">
                        <div style={{ display: "flex", gap: 6 }}>
                            <span className="win-btn red" /><span className="win-btn yellow" /><span className="win-btn green" />
                        </div>
                        <span className="term-bar-title">firebase-auth.sh — user login</span>
                        <span />
                    </div>

                    <div className="term-body">
                        <div className="cmd-line">
                            <span className="prompt">guest@portfolio:~$</span>
                            <span className="cmd-text">./login --provider firebase</span>
                        </div>

                        <div className="alert alert-info" style={{ margin: "12px 0" }}>
                            🔐 Authenticate via Firebase Phone OTP to continue.
                        </div>

                        {step === "PHONE" ? (
                            <form onSubmit={sendOTP}>
                                <div className="form-group">
                                    <label className="form-label">phoneNumber <span className="req">*</span></label>
                                    <div className="input-wrap">
                                        <span className="input-prefix">$</span>
                                        <input
                                            type="tel"
                                            className="term-input"
                                            placeholder="+919876543210"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <span className="text-xs text-dim" style={{ marginTop: 6, display: "block" }}>
                                        Include country code (e.g. +91)
                                    </span>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
                                    {loading ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Sending SMS…</> : "▶ Send OTP"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={verifyOTP}>
                                <div className="form-group">
                                    <label className="form-label">Enter OTP <span className="req">*</span></label>
                                    <div className="input-wrap">
                                        <span className="input-prefix">$</span>
                                        <input
                                            type="text"
                                            className="term-input"
                                            placeholder="123456"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: "100%", marginBottom: 10 }} disabled={loading}>
                                    {loading ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Verifying…</> : "▶ Verify & Login"}
                                </button>
                                <button type="button" className="btn btn-outline btn-sm" style={{ width: "100%" }} onClick={() => setStep("PHONE")}>
                                    ← Back to Phone
                                </button>
                            </form>
                        )}

                        <div className="text-xs text-dim" style={{ marginTop: 24, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                            Backend validates Google Firebase ID Token and responds with custom JWT.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Add TS definition for window.recaptchaVerifier
declare global {
    interface Window {
        recaptchaVerifier: any;
    }
}
