import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { BLUE, INK, MONO, SORA, INTER } from "./StyleFrames";
import { NewConsoleShell } from "./cards/NewConsoleShell";
import { ApplicationsScreen } from "./OnboardingVoiceApi";
import { ENV } from "./gptliveEnv";
import { WORDS } from "./gptliveWords";

// ============================================================================
// Format test: a presenter-led YouTube tutorial (cold-open call → talking head →
// screen share with a face bubble → captions) with an ANIMATED host instead of a
// person. Mouth + head motion are driven by the narration's loudness envelope.
// ============================================================================
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const CLIP = { q: "host-q", a: "bot-a", intro: "host-intro", screen: "host-screen" } as const;
const LEN = (k: string) => ENV[k].length;
const T = { q: 12, a: 12 + LEN("host-q") + 8, coldEnd: 12 + LEN("host-q") + 8 + LEN("bot-a") + 24 };
const T2 = { intro: T.coldEnd, introEnd: T.coldEnd + LEN("host-intro") + 16 };
const T3 = { screen: T2.introEnd, end: T2.introEnd + LEN("host-screen") + 30 };
export const GPTLIVE_TEST_FRAMES = T3.end;

// ---- the host ----------------------------------------------------------------
export const Host: React.FC<{ level: number; f: number; size?: number }> = ({ level, f, size = 520 }) => {
  const blink = (f % 96) < 5 ? 0.08 : 1; const bob = Math.sin(f / 11) * 4 + level * 6; const tilt = Math.sin(f / 23) * 2;
  const mouth = 6 + level * 34; const brow = -level * 4;
  return (
    <svg width={size} height={size} viewBox="0 0 520 520" style={{ overflow: "visible" }}>
      <g transform={`translate(0 ${bob}) rotate(${tilt} 260 300)`}>
        {/* shoulders / hoodie */}
        <path d="M60 520 C 60 420, 150 380, 260 380 C 370 380, 460 420, 460 520 Z" fill="#1f2430" />
        <path d="M200 385 C 220 430, 300 430, 320 385 Z" fill="#2a3040" />
        {/* neck */}
        <rect x="222" y="330" width="76" height="70" rx="28" fill="#f2c9a8" />
        {/* head */}
        <ellipse cx="260" cy="230" rx="130" ry="145" fill="#f6d2b1" />
        {/* hair */}
        <path d="M130 200 C 120 110, 190 70, 260 72 C 335 70, 405 110, 392 205 C 370 150, 330 130, 260 128 C 190 130, 150 150, 130 200 Z" fill="#2b2118" />
        {/* headset band + ear cup */}
        <path d="M128 200 C 120 120, 190 74, 260 74 C 330 74, 400 120, 392 200" fill="none" stroke="#3a3f4b" strokeWidth="10" strokeLinecap="round" />
        <rect x="108" y="196" width="40" height="64" rx="14" fill="#3a3f4b" />
        <path d="M148 250 C 170 290, 200 300, 236 296" fill="none" stroke="#3a3f4b" strokeWidth="8" strokeLinecap="round" />
        <circle cx="240" cy="298" r="8" fill="#3a3f4b" />
        {/* ears */}
        <ellipse cx="392" cy="236" rx="16" ry="24" fill="#efc4a0" />
        {/* eyebrows */}
        <path d={`M196 ${178 + brow} q 26 -12 52 -2`} fill="none" stroke="#2b2118" strokeWidth="8" strokeLinecap="round" />
        <path d={`M272 ${176 + brow} q 26 -10 52 2`} fill="none" stroke="#2b2118" strokeWidth="8" strokeLinecap="round" />
        {/* eyes */}
        <g transform={`translate(0 0) scale(1 ${blink})`} style={{ transformOrigin: "260px 214px" }}>
          <ellipse cx="222" cy="214" rx="14" ry="16" fill="#1a1a1f" /><circle cx="228" cy="208" r="4.5" fill="#fff" />
          <ellipse cx="298" cy="214" rx="14" ry="16" fill="#1a1a1f" /><circle cx="304" cy="208" r="4.5" fill="#fff" />
        </g>
        {/* nose */}
        <path d="M258 236 q -14 30 6 34" fill="none" stroke="#dba784" strokeWidth="6" strokeLinecap="round" />
        {/* mouth */}
        <path d={`M214 296 q 46 ${mouth} 92 0 q -46 ${-mouth * 0.25} -92 0 Z`} fill="#7a2b2b" />
        <path d={`M222 298 q 38 ${Math.min(10, mouth * 0.35)} 76 0`} fill="none" stroke="#f4b6b6" strokeWidth={Math.max(2, 6 - mouth * 0.1)} />
        {/* plivo tee mark */}
        <text x="230" y="470" fontFamily={SORA} fontSize="26" fontWeight="700" fill={BLUE}>plivo</text>
      </g>
    </svg>
  );
};

// ---- studio background (warm bokeh, like a home-office set) --------------------
const Studio: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 30% 20%, #23283a 0%, #141826 55%, #0c0f19 100%)" }}>
    {Array.from({ length: 18 }, (_, i) => { const x = 980 + ((i * 97) % 900), y = 80 + ((i * 53) % 420), r = 6 + (i % 4) * 4; return <div key={i} style={{ position: "absolute", left: x, top: y, width: r * 2, height: r * 2, borderRadius: "50%", background: i % 3 === 0 ? "#ffd58a" : "#ffb35c", opacity: 0.35 + (i % 5) * 0.1, filter: "blur(1px)", boxShadow: `0 0 ${r * 3}px ${r}px rgba(255,190,110,0.25)` }} />; })}
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 220, background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)" }} />
  </AbsoluteFill>
);

// ---- iPhone call screen inset ---------------------------------------------------
const CallUI: React.FC<{ f: number; number: string; startAt: number; speaking: boolean }> = ({ f, number, startAt, speaking }) => {
  const secs = Math.max(0, Math.floor((f - startAt) / 30)); const e = ease(f, 0, 20);
  return (
    <div style={{ position: "absolute", right: 150, top: 90, width: 400, height: 860, borderRadius: 58, background: "linear-gradient(180deg,#1b1f2e,#0b0e1a)", boxShadow: "0 60px 120px rgba(0,0,0,0.55), inset 0 0 0 10px #05070f", color: "#fff", fontFamily: INTER, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 96, opacity: e, transform: `translateY(${(1 - e) * 30}px)` }}>
      <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: 1 }}>{number}</div>
      <div style={{ marginTop: 8, fontSize: 18, color: "rgba(255,255,255,0.6)", fontFamily: MONO }}>{`${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`}</div>
      <div style={{ marginTop: 10, fontSize: 15, color: speaking ? "#4ade80" : "rgba(255,255,255,0.45)", fontFamily: MONO, letterSpacing: 2 }}>{speaking ? "● GPT-LIVE-1 SPEAKING" : "● LIVE · PLIVO"}</div>
      <div style={{ marginTop: 90, display: "grid", gridTemplateColumns: "repeat(3, 92px)", gap: "26px 30px", justifyContent: "center" }}>
        {["mute", "keypad", "speaker", "add", "FaceTime", "contacts"].map((l, i) => <div key={l} style={{ textAlign: "center" }}><div style={{ width: 84, height: 84, borderRadius: 42, background: i === 2 ? "#fff" : "rgba(255,255,255,0.14)", margin: "0 auto" }} /><div style={{ marginTop: 8, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{l}</div></div>)}
      </div>
      <div style={{ marginTop: "auto", marginBottom: 70, width: 84, height: 84, borderRadius: 42, background: "#e5484d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>✕</div>
    </div>
  );
};

// ---- captions: white on a black rounded box, chunked like burned-in subtitles -----
const Captions: React.FC<{ clip: string; f: number; startAt: number }> = ({ clip, f, startAt }) => {
  const t = (f - startAt) / 30; const words = WORDS[clip]; if (t < 0) return null;
  const chunks: { s: number; e: number; text: string }[] = []; let cur: typeof words = [];
  for (const w of words) { cur.push(w); if (cur.length >= 6 || w.e - cur[0].s > 2.4 || /[.?!]$/.test(w.w)) { chunks.push({ s: cur[0].s, e: cur[cur.length - 1].e + 0.35, text: cur.map((x) => x.w).join(" ") }); cur = []; } }
  if (cur.length) chunks.push({ s: cur[0].s, e: cur[cur.length - 1].e + 0.35, text: cur.map((x) => x.w).join(" ") });
  const c = chunks.find((k) => t >= k.s - 0.05 && t < k.e); if (!c) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 74, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ maxWidth: 1100, background: "rgba(0,0,0,0.86)", color: "#fff", fontFamily: INTER, fontSize: 38, fontWeight: 600, lineHeight: 1.3, padding: "10px 22px", borderRadius: 10, textAlign: "center" }}>{c.text}</div>
    </div>
  );
};

const lvl = (clip: string, f: number, startAt: number) => { const i = f - startAt; return i >= 0 && i < ENV[clip].length ? ENV[clip][i] : 0; };

export const GptLiveHostTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0c0f19" }}>
      <Sequence from={T.q} layout="none"><Audio src={staticFile("vo/gptlive/host-q.mp3")} /></Sequence>
      <Sequence from={T.a} layout="none"><Audio src={staticFile("vo/gptlive/bot-a.mp3")} volume={0.95} /></Sequence>
      <Sequence from={T2.intro} layout="none"><Audio src={staticFile("vo/gptlive/host-intro.mp3")} /></Sequence>
      <Sequence from={T3.screen} layout="none"><Audio src={staticFile("vo/gptlive/host-screen.mp3")} /></Sequence>

      {/* 1 — cold open: the host on the phone with the bot */}
      <Sequence from={0} durationInFrames={T.coldEnd} layout="none">
        <AbsoluteFill>
          <Studio />
          <div style={{ position: "absolute", left: 220, top: 180 }}><Host f={f} level={lvl(CLIP.q, f, T.q)} size={640} /></div>
          <CallUI f={f} number="+1 806 209 0453" startAt={0} speaking={f >= T.a && f < T.a + LEN("bot-a")} />
          <Captions clip={CLIP.q} f={f} startAt={T.q} />
          <Captions clip={CLIP.a} f={f} startAt={T.a} />
        </AbsoluteFill>
      </Sequence>

      {/* 2 — talking head intro */}
      <Sequence from={T2.intro} durationInFrames={T2.introEnd - T2.intro} layout="none">
        <AbsoluteFill>
          <Studio />
          <div style={{ position: "absolute", left: 600, top: 150 }}><Host f={f} level={lvl(CLIP.intro, f, T2.intro)} size={720} /></div>
          <div style={{ position: "absolute", left: 72, top: 60, fontFamily: MONO, fontSize: 16, letterSpacing: 3, color: "rgba(255,255,255,0.55)" }}>PLIVO × OPENAI GPT-LIVE-1</div>
          <Captions clip={CLIP.intro} f={f} startAt={T2.intro} />
        </AbsoluteFill>
      </Sequence>

      {/* 3 — screen share with the host in a bubble */}
      <Sequence from={T3.screen} durationInFrames={T3.end - T3.screen} layout="none">
        <AbsoluteFill>
          <AbsoluteFill><NewConsoleShell activeNav="Applications" topBar="live"><ApplicationsScreen cursorAt={150} /></NewConsoleShell></AbsoluteFill>
          <div style={{ position: "absolute", right: 60, bottom: 60, width: 300, height: 300, borderRadius: "50%", overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,0.4), 0 0 0 6px #fff" }}>
            <Studio />
            <div style={{ position: "absolute", left: -20, top: 10 }}><Host f={f} level={lvl(CLIP.screen, f, T3.screen)} size={340} /></div>
          </div>
          <Captions clip={CLIP.screen} f={f} startAt={T3.screen} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
