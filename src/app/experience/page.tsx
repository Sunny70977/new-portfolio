import ShellLayout from "@/components/ShellLayout";

export const metadata = { title: "Experience — Sunny Kumar" };

export default function ExperiencePage() {
    return (
        <ShellLayout>
            <div className="term-window">
                <div className="term-bar">
                    <span className="term-bar-title">cat experience/resume.log</span>
                </div>
                <div className="term-body">
                    <div className="cmd-line">
                        <span className="prompt">sunny@portfolio:~$</span>
                        <span className="cmd-text">cat experience/resume.log | pretty-print</span>
                    </div>

                    <div className="timeline mt-20">

                        <div className="tl-entry">
                            <div className="tl-dot active" />
                            <div className="tl-label">2024 — Present</div>
                            <div className="tl-title">
                                Software Developer
                                <span className="tl-current">CURRENT</span>
                            </div>
                            <div className="tl-company">@ Kraftshala — EdTech</div>
                            <ul className="tl-points">
                                <li>Building and maintaining EdTech LMS features for 1000+ active students</li>
                                <li>Designed RESTful APIs using Node.js + TypeScript + MySQL</li>
                                <li>Implemented interview scheduling system with email + WhatsApp notifications</li>
                                <li>Integrated Firebase Auth + JWT for secure multi-role authentication</li>
                                <li>Set up Helmet security headers, rate limiting, and CORS protection</li>
                                <li>Led performance optimisation and codebase refactor for scale</li>
                            </ul>
                            <div className="tl-tech">
                                {["Node.js", "TypeScript", "React", "MySQL", "Sequelize"].map((t) => (
                                    <span key={t} className="tech-badge">{t}</span>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ShellLayout>
    );
}
