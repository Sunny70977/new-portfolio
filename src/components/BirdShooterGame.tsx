"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

interface Point {
    x: number;
    y: number;
}

interface Bird extends Point {
    id: number;
    speed: number;
    direction: number; // 1: flies left, -1: flies right
    startY: number;    // base y-coordinate for sine wave
    waveOffset: number;// random offset for wave phase
}

interface Bullet extends Point {
    id: number;
    active: boolean;
    vx: number;
    vy: number;
}

interface Particle extends Point {
    id: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
}

interface FloatingText extends Point {
    id: number;
    life: number;
    text: string;
}

const GUN_X = 300;
const GUN_Y = 190;

export default function BirdShooterGame() {
    const [isPlaying, setIsPlaying] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);

    const [score, setScore] = useState(0);

    // Game state refs to avoid dependency issues in requestAnimationFrame
    const gameState = useRef({
        mouseX: 300,
        mouseY: 100,
        birds: [] as Bird[],
        bullets: [] as Bullet[],
        particles: [] as Particle[],
        floatingTexts: [] as FloatingText[],
        lastBirdSpawn: 0,
        birdIdCounter: 0,
        bulletIdCounter: 0,
        particleIdCounter: 0,
        textIdCounter: 0,
    });

    const spawnBird = (timestamp: number) => {
        if (timestamp - gameState.current.lastBirdSpawn > 1000) {
            const spawnRight = Math.random() > 0.5;
            const startY = Math.random() * 80 + 20; // keep birds in top half
            gameState.current.birds.push({
                x: spawnRight ? 650 : -50,
                y: startY,
                speed: Math.random() * 1.5 + 1.2,
                direction: spawnRight ? 1 : -1,
                startY: startY,
                waveOffset: Math.random() * Math.PI * 2, // Random phase
                id: gameState.current.birdIdCounter++,
            });
            gameState.current.lastBirdSpawn = timestamp;
        }
    };

    const shoot = () => {
        if (!isPlaying) return;
        const dx = gameState.current.mouseX - GUN_X;
        const dy = gameState.current.mouseY - GUN_Y;
        const angle = Math.atan2(dy, dx);
        const speed = 7;

        gameState.current.bullets.push({
            x: GUN_X + Math.cos(angle) * 30, // Spawn at end of barrel
            y: GUN_Y + Math.sin(angle) * 30,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            id: gameState.current.bulletIdCounter++,
            active: true
        });
    };

    const createExplosion = (x: number, y: number) => {
        const colors = ["#ef4444", "#f59e0b", "#eab308", "#22c55e", "#06b6d4"];
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            gameState.current.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                color: colors[Math.floor(Math.random() * colors.length)],
                id: gameState.current.particleIdCounter++
            });
        }
    };

    const update = (timestamp: number) => {
        if (!isPlaying) return;

        spawnBird(timestamp);

        const state = gameState.current;

        // Move bullets
        state.bullets.forEach(b => {
            b.x += b.vx;
            b.y += b.vy;
        });

        // Move birds
        state.birds.forEach(b => {
            if (b.direction === 1) {
                b.x -= b.speed;
            } else {
                b.x += b.speed;
            }
            // Add subtle sine wave up/down motion
            b.y = b.startY + Math.sin(b.x * 0.05 + b.waveOffset) * 15;
        });

        // Move particles
        state.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // gravity
            p.life -= 0.02;
        });

        // Move floating texts
        (state.floatingTexts || []).forEach(t => {
            t.y -= 0.5; // float upwards
            t.life -= 0.02; // fade out
        });

        // Collision detection
        state.bullets.forEach(bullet => {
            if (!bullet.active) return;
            state.birds.forEach(bird => {
                // simple box/radius collision
                if (
                    Math.abs(bullet.x - bird.x) < 20 &&
                    Math.abs(bullet.y - bird.y) < 20
                ) {
                    bullet.active = false;
                    const oldX = bird.x;
                    bird.x = -1000; // mark for removal
                    createExplosion(oldX + 10, bird.y);

                    // Spawn flying score text
                    if (!state.floatingTexts) state.floatingTexts = [];
                    state.floatingTexts.push({
                        x: oldX,
                        y: bird.y - 10,
                        life: 1.0,
                        text: "+1",
                        id: state.textIdCounter++
                    });

                    setScore((prev) => prev + 1);
                }
            });
        });

        // Cleanup out-of-bounds entities
        state.bullets = state.bullets.filter(b => b.x > -50 && b.x < 650 && b.y > -50 && b.y < 250 && b.active);
        state.birds = state.birds.filter(b => (b.direction === 1 ? b.x > -50 : b.x < 650));
        state.particles = state.particles.filter(p => p.life > 0);
        state.floatingTexts = (state.floatingTexts || []).filter(t => t.life > 0);
    };

    const draw = (ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, 600, 200);

        const state = gameState.current;

        // Draw sky
        ctx.fillStyle = "#0d140d"; // var(--bg-surface)
        ctx.fillRect(0, 0, 600, 200);

        // Draw birds
        ctx.font = "24px Arial";
        state.birds.forEach(bird => {
            // Flip bird if it's moving from left to right (-1)
            if (bird.direction === -1) {
                ctx.save();
                ctx.translate(bird.x + 12, bird.y); // translate to center roughly
                ctx.scale(-1, 1); // flip horizontally
                ctx.fillText("🐦", -12, 20); // adjust position
                ctx.restore();
            } else {
                ctx.fillText("🐦", bird.x, bird.y + 20);
            }
        });

        // Draw cannon barrel
        const angle = Math.atan2(state.mouseY - GUN_Y, state.mouseX - GUN_X);
        ctx.save();
        ctx.translate(GUN_X, GUN_Y);
        ctx.rotate(angle);
        ctx.fillStyle = "#64748b"; // metallic grey for barrel

        // Draw rounded barrel
        ctx.beginPath();
        ctx.roundRect(0, -8, 30, 16, 4);
        ctx.fill();

        ctx.fillStyle = "#f59e0b"; // ammo tip / sight
        ctx.beginPath();
        ctx.roundRect(26, -5, 6, 10, 2);
        ctx.fill();
        ctx.restore();

        // Draw turret base
        ctx.fillStyle = "#334155";
        ctx.beginPath();
        ctx.arc(GUN_X, GUN_Y + 10, 24, Math.PI, 0); // half circle base
        ctx.fill();
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.arc(GUN_X, GUN_Y, 12, 0, Math.PI * 2); // joint circle
        ctx.fill();

        // Draw bullets
        ctx.fillStyle = "#f59e0b"; // var(--amber)
        state.bullets.forEach(bullet => {
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw particles
        state.particles.forEach(particle => {
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        });

        // Draw floating text points
        ctx.font = "bold 16px var(--font-mono, monospace)";
        (state.floatingTexts || []).forEach(t => {
            ctx.globalAlpha = t.life;
            ctx.fillStyle = "#4ade80"; // var(--green-bright)
            ctx.fillText(t.text, t.x + 10, t.y);
            ctx.globalAlpha = 1.0;
        });
    };

    const loop = useCallback((timestamp: number) => {
        if (!isPlaying) return;

        update(timestamp);

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) draw(ctx);
        }

        requestRef.current = requestAnimationFrame(loop);
    }, [isPlaying]);

    useEffect(() => {
        if (isPlaying) {
            requestRef.current = requestAnimationFrame(loop);
        } else {
            cancelAnimationFrame(requestRef.current);
            // Draw static state when stopped
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext("2d");
                if (ctx) draw(ctx);
            }
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isPlaying, loop]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isPlaying) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            // Calculate scale relative to actual canvas resolution vs display size
            const scaleX = 600 / rect.width;
            const scaleY = 200 / rect.height;
            gameState.current.mouseX = (e.clientX - rect.left) * scaleX;
            gameState.current.mouseY = (e.clientY - rect.top) * scaleY;
        }
    };

    const handleStop = () => {
        setIsPlaying(false);
    };

    const handlePlay = () => {
        setIsPlaying(true);
        // Reset state
        setScore(0);
        gameState.current = {
            mouseX: 300,
            mouseY: 100,
            birds: [],
            bullets: [],
            particles: [],
            floatingTexts: [],
            lastBirdSpawn: 0,
            birdIdCounter: 0,
            bulletIdCounter: 0,
            particleIdCounter: 0,
            textIdCounter: 0,
        };
    };

    return (
        <div style={{ marginTop: 24, padding: "16px 0", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ color: "var(--green-bright)", fontSize: 13, fontWeight: 600 }}>🎯 Target Practice </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ color: "var(--text-muted)", fontSize: 13 }}>Score: <span style={{ color: "var(--green-bright)" }}>{score}</span></span>
                    {!isPlaying ? (
                        <button
                            onClick={handlePlay}
                            className="btn btn-primary btn-sm"
                        >
                            ▶ Play
                        </button>
                    ) : (
                        <button
                            onClick={handleStop}
                            className="btn btn-danger btn-sm"
                        >
                            ⏹ Stop
                        </button>
                    )}
                </div>
            </div>
            <p style={{ color: "var(--text-dim)", fontSize: 11, marginBottom: 12 }}>Move mouse over the canvas to aim and Click to shoot.</p>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={200}
                    style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        cursor: isPlaying ? 'crosshair' : 'default',
                        backgroundColor: "var(--bg)" // using global variable correctly!
                    }}
                    onMouseMove={handleMouseMove}
                    onClick={shoot}
                />
            </div>
        </div>
    );
}
