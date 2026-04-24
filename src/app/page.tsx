"use client";
import { useEffect, useRef, useState } from "react";
import ShellLayout from "@/components/ShellLayout";
import Link from "next/link";

const ROLES = [
  "Software Developer",
  "Node.js Engineer",
  "TypeScript Enthusiast",
  "React Developer",
  "API Architect",
  "Problem Solver",
];

const ASCII = `
 ███████╗██╗   ██╗███╗   ██╗███╗   ██╗██╗   ██╗
 ██╔════╝██║   ██║████╗  ██║████╗  ██║╚██╗ ██╔╝
 ███████╗██║   ██║██╔██╗ ██║██╔██╗ ██║ ╚████╔╝ 
 ╚════██║██║   ██║██║╚██╗██║██║╚██╗██║  ╚██╔╝  
 ███████║╚██████╔╝██║ ╚████║██║ ╚████║   ██║   
 ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝   ╚═╝  
 ██╗  ██╗██╗   ██╗███╗   ███╗ █████╗ ██████╗   
 ██║ ██╔╝██║   ██║████╗ ████║██╔══██╗██╔══██╗  
 █████╔╝ ██║   ██║██╔████╔██║███████║██████╔╝  
 ██╔═██╗ ██║   ██║██║╚██╔╝██║██╔══██║██╔══██╗  
 ██║  ██╗╚██████╔╝██║ ╚═╝ ██║██║  ██║██║  ██║  
 ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝  
`;

export default function HomePage() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const [counters, setCounters] = useState({ exp: 0, proj: 0, tech: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /* Role typing effect */
  useEffect(() => {
    const role = ROLES[roleIdx];
    let i = 0;
    setDisplayed("");
    setTyping(true);
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayed(role.slice(0, i));
      if (i === role.length) {
        clearInterval(intervalRef.current!);
        setTyping(false);
        setTimeout(() => {
          setRoleIdx((r) => (r + 1) % ROLES.length);
        }, 1800);
      }
    }, 60);
    return () => clearInterval(intervalRef.current!);
  }, [roleIdx]);

  /* Counter animation */
  useEffect(() => {
    const targets = { exp: 1, proj: 10, tech: 15 };
    let frame = 0;
    const dur = 60;
    const id = setInterval(() => {
      frame++;
      const p = Math.min(frame / dur, 1);
      setCounters({
        exp: Math.round(p * targets.exp),
        proj: Math.round(p * targets.proj),
        tech: Math.round(p * targets.tech),
      });
      if (frame >= dur) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, []);

  return (
    <ShellLayout>
      <div className="term-window">
        <div className="term-bar">
          {/* <div className="win-btns" style={{ display: "flex", gap: 6 }}>
            <span className="win-btn red" /><span className="win-btn yellow" /><span className="win-btn green" />
          </div> */}
          <span className="term-bar-title">bash — sunny@portfolio:~</span>
          <span />
        </div>
        <div className="term-body">
          {/* whoami */}
          <div className="cmd-line">
            <span className="prompt">sunny@portfolio:~$</span>
            <span className="cmd-text">whoami &amp;&amp; cat README.md</span>
          </div>

          {/* ASCII art */}
          <div className="hero-ascii">
            <pre className="glow">{ASCII}</pre>
          </div>

          {/* Info grid */}
          <div className="grid-2col">
            <div>
              <div style={{ marginBottom: 6 }}>
                <span className="text-dim text-sm">name    : </span>
                <span className="text-bright">Sunny Kumar</span>
              </div>
              <div style={{ marginBottom: 6 }}>
                <span className="text-dim text-sm">role    : </span>
                <span className="typing-text">{displayed}</span>
                {typing && <span className="cursor-block" />}
              </div>
              <div style={{ marginBottom: 6 }}>
                <span className="text-dim text-sm">location: </span>
                <span className="text-muted">India 🇮🇳</span>
              </div>
              <div style={{ marginBottom: 6 }}>
                <span className="text-dim text-sm">status  : </span>
                <span className="text-green">✅ Open to opportunities</span>
              </div>
              <div style={{ marginBottom: 6 }}>
                <span className="text-dim text-sm">email   : </span>
                <a href="mailto:sunnykumar5sept@gmail.com" className="text-green" style={{ textDecoration: "none" }}>
                  sunnykumar5sept@gmail.com
                </a>
              </div>
            </div>

            {/* stats */}
            <div className="stats-row" style={{ alignSelf: "start" }}>
              <div className="stat-box">
                <div className="stat-num">{counters.exp}+</div>
                <div className="stat-lbl">yrs exp</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">{counters.proj}+</div>
                <div className="stat-lbl">projects</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">{counters.tech}+</div>
                <div className="stat-lbl">technologies</div>
              </div>
            </div>
          </div>

          {/* README */}
          <div className="cmd-line mt-24">
            <span className="prompt">sunny@portfolio:~$</span>
            <span className="cmd-text">cat README.md</span>
          </div>
          <div className="alert alert-info" style={{ marginTop: 8 }}>
            👋 Welcome! I'm a passionate Software Developer building scalable, modern web apps at <strong>Kraftshala</strong>.
            Navigate using the sidebar. Visit <strong>/book-interview</strong> to schedule a call with me directly!
          </div>

          {/* Quick links */}
          <div className="cmd-line mt-16">
            <span className="prompt">sunny@portfolio:~$</span>
            <span className="cmd-text">ls quicklinks/</span>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            <Link href="/about" className="btn btn-outline btn-sm">cd /about</Link>
            <Link href="/skills" className="btn btn-outline btn-sm">ls /skills</Link>
            <Link href="/projects" className="btn btn-outline btn-sm">ls /projects</Link>
            <Link href="/interview" className="btn btn-primary btn-sm">📅 book-interview</Link>
            <Link href="/contact" className="btn btn-outline btn-sm">ping /contact</Link>
          </div>
        </div>
      </div>
    </ShellLayout>
  );
}
