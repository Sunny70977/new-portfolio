"use client";
import { useEffect, useRef } from "react";
import ShellLayout from "@/components/ShellLayout";

const SKILLS = [
    {
        cat: "Backend",
        items: [
            { name: "Node.js00000000000", pct: 90 },
            { name: "TypeScript", pct: 85 },
            { name: "Express.js", pct: 88 },
            { name: "REST APIs", pct: 92 },
        ],
    },
    {
        cat: "Frontend",
        items: [
            { name: "React.js", pct: 85 },
            { name: "Next.js", pct: 78 },
            { name: "JavaScript", pct: 90 },
            { name: "HTML/CSS", pct: 88 },
        ],
    },
    {
        cat: "Database",
        items: [
            { name: "PostgreSQL", pct: 82 },
            { name: "Sequelize ORM", pct: 80 },
            { name: "MongoDB", pct: 75 },
            { name: "Firebase", pct: 78 },
        ],
    },
    {
        cat: "DevOps & Tools",
        items: [
            { name: "Git / GitHub", pct: 88 },
            { name: "JWT / Auth", pct: 85 },
            { name: "Docker", pct: 65 },
            { name: "Linux / Bash", pct: 78 },
        ],
    },
];

const BADGES = [
    "Node.js", "TypeScript", "React", "Next.js", "Express", "PostgreSQL",
    "Sequelize", "Firebase", "JWT", "REST APIs", "MongoDB", "Docker",
    "Git", "Twilio", "Nodemailer", "Helmet", "CORS", "Bash", "Vite",
];

export default function SkillsPage() {
    const barsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fills = barsRef.current?.querySelectorAll<HTMLDivElement>(".skill-bar-fill");
        fills?.forEach((el) => {
            const w = el.dataset.width || "0";
            requestAnimationFrame(() => { el.style.width = w + "%"; });
        });
    }, []);

    return (
        <ShellLayout>
            <div className="term-window">
                <div className="term-bar">
                    <span className="term-bar-title">ls -la /skills — skill-matrix --show-proficiency</span>
                </div>
                <div className="term-body" ref={barsRef}>
                    <div className="cmd-line">
                        <span className="prompt">sunny@portfolio:~$</span>
                        <span className="cmd-text">skill-matrix --show-proficiency</span>
                    </div>

                    <div className="skills-grid mt-16">
                        {SKILLS.map((cat) => (
                            <div key={cat.cat} className="card">
                                <div className="skill-cat-title">📂 {cat.cat}/</div>
                                {cat.items.map((s) => (
                                    <div key={s.name} className="skill-item">
                                        <div className="skill-row">
                                            <span className="skill-name">{s.name}</span>
                                            <span className="skill-pct">{s.pct}%</span>
                                        </div>
                                        <div className="skill-bar-track">
                                            <div className="skill-bar-fill" data-width={s.pct} style={{ width: 0 }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="cmd-line mt-24">
                        <span className="prompt">sunny@portfolio:~$</span>
                        <span className="cmd-text">dpkg --list | grep installed</span>
                    </div>
                    <div style={{ marginTop: 12 }}>
                        {BADGES.map((b) => <span key={b} className="tech-badge">{b}</span>)}
                    </div>
                </div>
            </div>
        </ShellLayout>
    );
}
