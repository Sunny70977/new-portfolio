import ShellLayout from "@/components/ShellLayout";

export const metadata = { title: "Projects — Sunny Kumar" };

const PROJECTS = [
    {
        name: "portfolio-backend",
        featured: true,
        status: "running",
        desc: "Production-grade REST API for interview scheduling. JWT auth, Firebase integration, email + WhatsApp notifications, rate limiting, CORS, Helmet security.",
        tech: ["TypeScript", "Node.js", "Express", "PostgreSQL", "JWT", "Firebase", "Twilio", "Sequelize"],
        meta: ["9 endpoints", "Rate-limited", "Auth-protected"],
        github: "#",
        live: "#",
    },
    {
        name: "kraftshala-lms",
        featured: false,
        status: "running",
        desc: "EdTech LMS serving 1000+ students. Course progress tracking, assessments, notifications, admin dashboard.",
        tech: ["React", "Node.js", "MongoDB", "REST API", "JWT"],
        meta: ["1000+ users", "EdTech", "Production"],
        github: "#",
        live: "#",
    },
    {
        name: "portfolio-terminal-ui",
        featured: false,
        status: "running",
        desc: "This terminal-themed Next.js SSR portfolio integrating live interview scheduling APIs with Linux green-on-black aesthetics.",
        tech: ["Next.js", "TypeScript", "React", "CSS", "REST API", "Firebase"],
        meta: ["SSR", "Terminal UI", "Animated"],
        github: "#",
        live: "#",
    },
    {
        name: "notification-service",
        featured: false,
        status: "done",
        desc: "Multi-channel notification microservice supporting Email (Gmail + Nodemailer) and WhatsApp (Twilio). Retry logic and HTML templates.",
        tech: ["Node.js", "Nodemailer", "Twilio", "TypeScript"],
        meta: ["Email + WhatsApp", "Retry logic"],
        github: "#",
        live: null,
    },
    {
        name: "youth-fest",
        featured: false,
        status: "done",
        desc: "Event management website built for a college youth festival. Dynamic event listings, registration flow, and responsive design.",
        tech: ["JavaScript", "HTML", "CSS"],
        meta: ["Event Website", "College Project"],
        github: "https://github.com/Sunny70977/youth-fest",
        live: null,
    },
    {
        name: "JHAJI",
        featured: false,
        status: "done",
        desc: "JavaScript web application project. Interactive UI with dynamic content rendering.",
        tech: ["JavaScript", "HTML", "CSS"],
        meta: ["Web App", "JavaScript"],
        github: "https://github.com/Sunny70977/JHAJI",
        live: null,
    },
    {
        name: "currency-converter",
        featured: false,
        status: "done",
        desc: "Real-time currency converter web app. Fetches live exchange rates and converts between multiple currencies instantly.",
        tech: ["JavaScript", "HTML", "CSS", "REST API"],
        meta: ["Live Rates", "Multi-currency"],
        github: "https://github.com/Sunny70977/Currency-Converter",
        live: null,
    },
    {
        name: "tic-tac-toe-game",
        featured: false,
        status: "done",
        desc: "Browser-based Tic Tac Toe game with two-player mode. Clean game logic with win/draw detection and reset functionality.",
        tech: ["JavaScript", "HTML", "CSS"],
        meta: ["2-Player", "Game Logic"],
        github: "https://github.com/Sunny70977/TIC-TAC-TOE-GAME",
        live: null,
    },
    {
        name: "netflix-clone",
        featured: false,
        status: "done",
        desc: "Pixel-perfect Netflix homepage UI clone built with pure HTML and CSS. Responsive layout replicating the streaming platform's landing page.",
        tech: ["HTML", "CSS"],
        meta: ["UI Clone", "Responsive"],
        github: "https://github.com/Sunny70977/Netflixclone",
        live: null,
    },
    {
        name: "alarm-clock",
        featured: false,
        status: "done",
        desc: "Python-based alarm clock application with time scheduling, custom alert sounds, and a simple command-line interface.",
        tech: ["Python"],
        meta: ["CLI App", "Scheduling"],
        github: "https://github.com/Sunny70977/Alarm-clock",
        live: null,
    },
    {
        name: "python-projects",
        featured: false,
        status: "done",
        desc: "Collection of Python scripts and mini-projects covering automation, data manipulation, and algorithmic problem solving.",
        tech: ["Python"],
        meta: ["Scripts", "Automation"],
        github: "https://github.com/Sunny70977/Python.proj",
        live: null,
    },
    {
        name: "react-codes",
        featured: false,
        status: "done",
        desc: "React.js learning repository with components, hooks, and patterns built while mastering the React ecosystem.",
        tech: ["React", "JavaScript", "JSX"],
        meta: ["Learning", "Components"],
        github: "https://github.com/Sunny70977/React-codes",
        live: null,
    },
    {
        name: "my-portfolio",
        featured: false,
        status: "done",
        desc: "Original static portfolio website built with pure HTML and CSS — the predecessor to this terminal-themed version.",
        tech: ["HTML", "CSS"],
        meta: ["Portfolio v1", "Static"],
        github: "https://github.com/Sunny70977/my-portfolio",
        live: null,
    },
];

export default function ProjectsPage() {
    return (
        <ShellLayout>
            <div className="term-window">
                <div className="term-bar">
                    <span className="term-bar-title">ls projects/ --detailed</span>
                </div>
                <div className="term-body">
                    <div className="cmd-line">
                        <span className="prompt">sunny@portfolio:~$</span>
                        <span className="cmd-text">ls projects/ --detailed --sort=featured</span>
                    </div>

                    <div className="projects-grid mt-16">
                        {PROJECTS.map((p) => (
                            <div key={p.name} className={`proj-card${p.featured ? " proj-featured" : ""}`}>
                                {p.featured && <div className="proj-featured-badge">FEATURED</div>}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                    <div className="proj-name">📁 {p.name}/</div>
                                    <span className={p.status === "running" ? "proj-status-running" : "proj-status-done"}>
                                        ● {p.status}
                                    </span>
                                </div>
                                <div className="proj-desc">{p.desc}</div>
                                <div className="proj-techs">
                                    {p.tech.map((t) => <span key={t} className="proj-tech">{t}</span>)}
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                        {p.meta.map((m) => <span key={m} className="text-xs text-dim">⬡ {m}</span>)}
                                    </div>
                                    <div className="proj-links">
                                        {p.github && <a href={p.github} className="btn btn-outline btn-xs">GitHub ↗</a>}
                                        {p.live && <a href={p.live} className="btn btn-primary btn-xs">Live ↗</a>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ShellLayout>
    );
}
