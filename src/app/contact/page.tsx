import ShellLayout from "@/components/ShellLayout";

export const metadata = { title: "Contact — Sunny Kumar" };

export default function ContactPage() {
    return (
        <ShellLayout>
            <div className="term-window">
                <div className="term-bar">
                    <span className="term-bar-title">ping sunny@portfolio — contact</span>
                </div>
                <div className="term-body">
                    <div className="cmd-line">
                        <span className="prompt">sunny@portfolio:~$</span>
                        <span className="cmd-text">ping -c 4 sunnykumar5sept@gmail.com</span>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <div className="ping-line">PING sunnykumar5sept@gmail.com: 56 data bytes</div>
                        <div className="ping-line">64 bytes from sunny: icmp_seq=0 ttl=64 time=<span className="ping-time">0.3 ms</span></div>
                        <div className="ping-line">64 bytes from sunny: icmp_seq=1 ttl=64 time=<span className="ping-time">0.2 ms</span></div>
                        <div className="ping-line">64 bytes from sunny: icmp_seq=2 ttl=64 time=<span className="ping-time">0.1 ms</span></div>
                        <div className="ping-line green">--- ping statistics: 3 packets, 0% loss ---</div>
                    </div>

                    <div className="contact-grid">
                        <a href="mailto:sunnykumar5sept@gmail.com" className="contact-card">
                            <div className="contact-card-icon">✉</div>
                            <div className="contact-card-label">Email</div>
                            <div className="contact-card-value">sunnykumar5sept@gmail.com</div>
                            <div className="contact-card-cmd">$ mail -s &quot;Hi Sunny&quot; sunny</div>
                        </a>
                        <a href="https://www.linkedin.com/in/sunny-kumar-566269252/" target="_blank" rel="noreferrer" className="contact-card">
                            <div className="contact-card-icon">🔗</div>
                            <div className="contact-card-label">LinkedIn</div>
                            <div className="contact-card-value">linkedin.com/in/sunny-kumar</div>
                            <div className="contact-card-cmd">$ open linkedin.com</div>
                        </a>
                        <a href="https://github.com/Sunny70977" target="_blank" rel="noreferrer" className="contact-card">
                            <div className="contact-card-icon">💻</div>
                            <div className="contact-card-label">GitHub</div>
                            <div className="contact-card-value">github.com/Sunny70977</div>
                            <div className="contact-card-cmd">$ git clone sunny/repos</div>
                        </a>
                        <a href="/resume.pdf" target="_blank" rel="noreferrer" className="contact-card">
                            <div className="contact-card-icon">📄</div>
                            <div className="contact-card-label">Resume</div>
                            <div className="contact-card-value">resume.pdf</div>
                            <div className="contact-card-cmd">$ open resume.pdf</div>
                        </a>

                        <div className="contact-card">
                            <div className="contact-card-icon">📍</div>
                            <div className="contact-card-label">Location</div>
                            <div className="contact-card-value">India 🇮🇳</div>
                            <div className="contact-card-cmd">$ locate --user sunny</div>
                        </div>
                    </div>

                    <div className="cmd-line mt-24">
                        <span className="prompt">sunny@portfolio:~$</span>
                        <span className="cmd-text">echo &ldquo;Ready to collaborate?&rdquo;</span>
                    </div>
                    <div className="alert alert-success" style={{ marginTop: 8 }}>
                        Ready to collaborate? Book an interview slot or drop me an email! 🚀
                    </div>
                    <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                        <a href="/interview" className="btn btn-primary">📅 Book Interview →</a>
                        <a href="mailto:sunnykumar5sept@gmail.com" className="btn btn-outline">✉ Send Email</a>
                    </div>
                </div>
            </div>
        </ShellLayout>
    );
}
