import ShellLayout from "@/components/ShellLayout";
import BirdShooterGame from "@/components/BirdShooterGame";

export const metadata = { title: "About — Sunny Kumar" };

export default function AboutPage() {
    return (
        <ShellLayout>
            <div className="term-window">
                <div className="term-bar">
                    <span className="term-bar-title">cat /about/sunny.json</span>
                </div>
                <div className="term-body">
                    <div className="cmd-line">
                        <span className="prompt">sunny@portfolio:~$</span>
                        <span className="cmd-text">cat about/sunny.json</span>
                    </div>

                    {/* JSON viewer */}
                    <div className="json-block">
                        <div className="json-line"><span className="json-brace">{"{"}</span></div>
                        <div className="json-line pl-2"><span className="json-key">&quot;name&quot;</span><span className="json-colon">:</span><span className="json-str"> &quot;Sunny Kumar&quot;</span><span style={{ color: "var(--text-dim)" }}>,</span></div>
                        <div className="json-line pl-2"><span className="json-key">&quot;title&quot;</span><span className="json-colon">:</span><span className="json-str"> &quot;Software Developer &amp; Problem Solver&quot;</span><span style={{ color: "var(--text-dim)" }}>,</span></div>
                        <div className="json-line pl-2"><span className="json-key">&quot;location&quot;</span><span className="json-colon">:</span><span className="json-str"> &quot;India 🇮🇳&quot;</span><span style={{ color: "var(--text-dim)" }}>,</span></div>
                        <div className="json-line pl-2"><span className="json-key">&quot;company&quot;</span><span className="json-colon">:</span><span className="json-str"> &quot;Kraftshala&quot;</span><span style={{ color: "var(--text-dim)" }}>,</span></div>
                        <div className="json-line pl-2"><span className="json-key">&quot;email&quot;</span><span className="json-colon">:</span><span className="json-str"> &quot;sunnykumar5sept@gmail.com&quot;</span><span style={{ color: "var(--text-dim)" }}>,</span></div>
                        <div className="json-line pl-2"><span className="json-key">&quot;bio&quot;</span><span className="json-colon">:</span><span className="json-str"> &quot;Passionate developer who thrives at the intersection of clean code and excellent UX. I build robust APIs with Node.js + TypeScript and craft seamless frontends with React &amp; Next.js.&quot;</span><span style={{ color: "var(--text-dim)" }}>,</span></div>
                        <div className="json-line pl-2"><span className="json-key">&quot;interests&quot;</span><span className="json-colon">:</span> <span className="json-brace">[</span></div>
                        <div className="json-line pl-4"><span className="json-str">&quot;Movies &quot;</span>, <span className="json-str">&quot;Coding&quot;</span>, <span className="json-str">&quot;Cricket&quot;</span></div>
                        <div className="json-line pl-2"><span className="json-brace">]</span><span style={{ color: "var(--text-dim)" }}>,</span></div>
                        <div className="json-line pl-2"><span className="json-key">&quot;education&quot;</span><span className="json-colon">:</span> <span className="json-brace">{"{"}</span></div>
                        <div className="json-line pl-4"><span className="json-key">&quot;degree&quot;</span><span className="json-colon">:</span><span className="json-str"> &quot;B.Tech — Computer Science&quot;</span><span style={{ color: "var(--text-dim)" }}>,</span></div>
                        <div className="json-line pl-2"><span className="json-brace">{"}"}</span><span style={{ color: "var(--text-dim)" }}>,</span></div>
                        <div className="json-line pl-2"><span className="json-key">&quot;openToWork&quot;</span><span className="json-colon">:</span><span className="json-bool"> true</span></div>
                        <div className="json-line"><span className="json-brace">{"}"}</span></div>
                    </div>

                    {/* Bird shooter game */}
                    <div className="cmd-line mt-20">
                        <span className="prompt">sunny@portfolio:~$</span>
                        <span className="cmd-text">./play_bird_shooter.sh</span>
                    </div>
                    <BirdShooterGame />
                </div>
            </div>
        </ShellLayout>
    );
}
