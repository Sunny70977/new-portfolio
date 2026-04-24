import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Sunny Kumar — Portfolio Terminal",
  description:
    "Software Developer portfolio. Node.js, TypeScript, React, PostgreSQL. Book an interview directly from the terminal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <SpeedInsights />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#111811",
                color: "#d4e8d4",
                border: "1px solid #1e2e1e",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "13px",
              },
              success: { iconTheme: { primary: "#22c55e", secondary: "#0a0f0a" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#0a0f0a" } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
