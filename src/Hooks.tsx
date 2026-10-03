import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { BLUE, INK, CREAM, MONO, SORA, INTER, Grid, Logo } from "./StyleFrames";

// ============================================================================
// Story-driven hooks (motion cut to the words) for the LiveKit and Pipecat videos.
// ============================================================================
export const ease = (f: number, a: number, b: number, e = Easing.out(Easing.cubic)) => interpolate(f, [a, b], [0, 1], { easing: e, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const punch = (f: number, at: number) => { const p = ease(f, at, at + 12, Easing.out(Easing.back(2.2))); return { opacity: Math.min(1, ease(f, at, at + 6)), transform: `scale(${0.6 + 0.4 * p})` }; };

export const Rings: React.FC<{ f: number; at: number; color?: string; cx?: number; cy?: number }> = ({ f, at, color = "rgba(255,255,255,0.55)", cx = 960, cy = 540 }) => (
  <>
    {[0, 1, 2].map((i) => { const t = ((f - at - i * 14) % 42) / 42; const on = f >= at + i * 14; const r = 60 + t * 360; return on ? <div key={i} style={{ position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: "50%", border: `3px solid ${color}`, opacity: (1 - t) * 0.9, pointerEvents: "none" }} /> : null; })}
  </>
);
export const Dial: React.FC<{ f: number; at: number; number: string; step?: number; color?: string; size?: number }> = ({ f, at, number, step = 5, color = "#fff", size = 132 }) => (
  <div style={{ fontFamily: MONO, fontSize: size, fontWeight: 600, letterSpacing: 4, color, display: "inline-flex" }}>
    {number.split("").map((c, i) => { const s = punch(f, at + i * step); return <span key={i} style={{ display: "inline-block", ...s, minWidth: c === " " ? 34 : undefined }}>{c}</span>; })}
  </div>
);
export const Phone: React.FC<{ f: number; enterAt: number; shakeAt?: number; children: React.ReactNode; left?: number }> = ({ f, enterAt, shakeAt, children, left = 700 }) => {
  const e = ease(f, enterAt, enterAt + 26); const shake = shakeAt != null && f >= shakeAt && f < shakeAt + 18 ? Math.sin((f - shakeAt) * 2.2) * 14 * (1 - (f - shakeAt) / 18) : 0;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 1600, pointerEvents: "none" }}>
      <div style={{ marginLeft: left, width: 400, height: 820, borderRadius: 56, background: "linear-gradient(180deg,#141a33,#0b0f24)", boxShadow: "0 60px 120px rgba(15,17,23,0.35), inset 0 0 0 10px #05070f", transform: `rotateY(${-18 - (1 - e) * 30}deg) rotateX(8deg) rotateZ(6deg) translateY(${(1 - e) * 80}px) translateX(${shake}px)`, opacity: e, color: "#fff", fontFamily: INTER, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 110, overflow: "hidden" }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};
export const Bubble: React.FC<{ f: number; at: number; text: string; me?: boolean }> = ({ f, at, text, me }) => {
  const e = ease(f, at, at + 10); const n = Math.max(0, Math.floor((f - at - 4) * 1.4)); const shown = text.slice(0, n);
  return f >= at ? (
    <div style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", opacity: e, transform: `translateY(${(1 - e) * 10}px)` }}>
      <div style={{ maxWidth: 520, background: me ? BLUE : "rgba(255,255,255,0.08)", color: "#fff", borderRadius: 18, padding: "14px 18px", fontSize: 22, lineHeight: 1.35, fontFamily: INTER }}>{shown}{n < text.length ? <span style={{ opacity: Math.round(f / 6) % 2 }}>▍</span> : null}</div>
    </div>
  ) : null;
};
export const Wave: React.FC<{ f: number; active: boolean; color?: string; n?: number }> = ({ f, active, color = BLUE, n = 40 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 4, height: 60 }}>
    {Array.from({ length: n }, (_, i) => <span key={i} style={{ width: 6, height: active ? 6 + 50 * Math.abs(Math.sin(i * 0.7 + f * 0.32)) * (0.4 + 0.6 * Math.abs(Math.sin(i * 0.23 + 1))) : 6, borderRadius: 3, background: color, opacity: active ? 0.9 : 0.35 }} />)}
  </div>
);

// ---- LiveKit ------------------------------------------------------------------
export type LKHookT = { agent: number; livekit: number; card: number; smart: number; fast: number; now: number; nobody: number; fix: number; five: number; number: number; people: number; plivo: number; end: number };
export const HookLiveKit: React.FC<{ t: LKHookT }> = ({ t }) => {
  const f = useCurrentFrame();
  const blue = f >= t.fix && f < t.plivo; const late = f >= t.plivo;
  const fixIn = ease(f, t.fix, t.fix + 14); const outIn = ease(f, t.plivo, t.plivo + 14);
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: SORA, overflow: "hidden" }}>
      <Grid />
      {/* Phase A/B/C — cream: words punch in, the phone tries to call and bounces */}
      {!blue && !late ? (
        <>
          <Logo />
          <div style={{ position: "absolute", left: 140, top: 500, width: 900 }}>
            <div style={{ fontSize: 96, fontWeight: 600, color: INK, letterSpacing: -3.5, lineHeight: 1 }}>
              <span style={{ display: "inline-block", ...punch(f, t.agent) }}>Your voice agent</span><br />
              <span style={{ display: "inline-block", color: BLUE, ...punch(f, t.livekit) }}>on LiveKit.</span>
            </div>
            <div style={{ marginTop: 40, fontSize: 88, fontWeight: 700, color: "#e5484d", letterSpacing: -3.5, lineHeight: 1, ...punch(f, t.nobody) }}>Nobody can call it.</div>
          </div>
          {/* the agent card, with a call counter stuck at zero */}
          <div style={{ position: "absolute", left: 140, top: 200, width: 560, background: "#0f1117", borderRadius: 20, padding: "18px 24px", color: "#fff", fontFamily: INTER, boxShadow: "0 30px 70px rgba(15,17,23,0.3)", ...punch(f, t.card) }}>
            <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 2, color: "#8ea2ff" }}>LIVEKIT CLOUD · AGENT</div>
            <div style={{ marginTop: 10, fontSize: 26, fontWeight: 600 }}>plivo-livekit-agent</div>
            <div style={{ marginTop: 14, display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(48,164,108,0.18)", color: "#4ade80", fontFamily: MONO, fontSize: 13, padding: "6px 12px", borderRadius: 999 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: "#4ade80" }} />RUNNING</span>
              <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 13, color: f >= t.nobody ? "#ff6b6b" : "rgba(255,255,255,0.5)" }}>calls today: <b style={{ fontSize: 18 }}>0</b></span>
            </div>
            <div style={{ marginTop: 16 }}><Wave f={f} active={f < t.now} n={34} /></div>
          </div>
          {/* the phone that cannot get through */}
          <Phone f={f} enterAt={t.now - 20} shakeAt={t.nobody} left={1180}>
            <div style={{ width: 110, height: 110, borderRadius: 55, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>☎</div>
            <div style={{ marginTop: 26, fontSize: 28, fontWeight: 600 }}>Calling the agent…</div>
            <div style={{ marginTop: 8, fontFamily: MONO, fontSize: 14, letterSpacing: 2, color: "#8ea2ff", opacity: f < t.nobody ? 1 : 0 }}>RINGING</div>
            {f >= t.nobody ? <div style={{ marginTop: 40, background: "rgba(229,72,77,0.18)", border: "2px solid #e5484d", color: "#ff6b6b", fontFamily: MONO, fontSize: 22, letterSpacing: 3, padding: "12px 22px", borderRadius: 12, transform: `rotate(-8deg) scale(${0.7 + 0.3 * ease(f, t.nobody, t.nobody + 10, Easing.out(Easing.back(3)))})` }}>NO ROUTE</div> : null}
          </Phone>
          {f >= t.now - 20 && f < t.nobody ? <Rings f={f} at={t.now - 10} color="rgba(50,61,254,0.35)" cx={1380} cy={540} /> : null}
        </>
      ) : null}
      {/* Phase D — blue: the fix. A number dials in, rings, callers arrive */}
      {blue ? (
        <AbsoluteFill style={{ background: BLUE, opacity: fixIn }}>
          <Grid dark /><Logo white />
          <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontSize: 108, fontWeight: 600, color: "#fff", letterSpacing: -3.5, ...punch(f, t.fix) }}>Let's fix that.</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 292, textAlign: "center", fontFamily: INTER, fontSize: 26, color: "rgba(255,255,255,0.85)", ...punch(f, t.five) }}><span style={{ background: "rgba(255,255,255,0.14)", padding: "10px 20px", borderRadius: 999 }}>≈ five minutes, start to finish</span></div>
          {/* the plan, in the order we'll build it: agent → Plivo SIP trunk → a real number */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", alignItems: "center", gap: 0 }}>
            {[["Your LiveKit agent", "already running", t.five + 20], ["Plivo SIP Trunking", "one inbound trunk", t.number - 10], ["A real phone number", "+1 775 239 8525", t.number + 24]].map(([a, b, at], i) => (
              <React.Fragment key={String(a)}>
                {i > 0 ? <div style={{ width: 90, height: 4, background: "rgba(255,255,255,0.55)", borderRadius: 2, ...punch(f, Number(at) - 8) }} /> : null}
                <div style={{ width: 400, background: "#fff", color: INK, borderRadius: 22, padding: "26px 30px", boxShadow: "0 24px 60px rgba(0,0,0,0.18)", ...punch(f, Number(at)) }}>
                  <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: BLUE }}>0{i + 1}</div>
                  <div style={{ marginTop: 10, fontSize: 30, fontWeight: 600, letterSpacing: -0.8 }}>{a}</div>
                  <div style={{ marginTop: 6, fontSize: 19, color: "#55586a", fontFamily: INTER }}>{b}</div>
                </div>
              </React.Fragment>))}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", color: "#fff", fontSize: 34, fontWeight: 600, ...punch(f, t.people + 10) }}>Real people on the line, through Plivo.</div>
        </AbsoluteFill>
      ) : null}
      {/* Phase E — cream: All through Plivo */}
      {late ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: outIn }}>
          <Grid />
          <div style={{ ...punch(f, t.plivo) }}><PlivoLogoSvg width={300} color={INK} /></div>
          <div style={{ marginTop: 14, fontSize: 124, fontWeight: 600, color: BLUE, letterSpacing: -4, lineHeight: 1, ...punch(f, t.plivo + 8) }}>SIP Trunking</div>
          <div style={{ marginTop: 30 }}><Wave f={f} active n={56} /></div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ---- Pipecat ------------------------------------------------------------------
export type PCHookT = { bot: number; great: number; ready: number; now: number; number: number; plivo: number; pickup: number; receptionist: number; end: number };
export const HookPipecat: React.FC<{ t: PCHookT }> = ({ t }) => {
  const f = useCurrentFrame(); const blue = f >= t.now && f < t.pickup - 14; const late = f >= t.pickup - 14;
  const answered = f >= t.pickup;
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: SORA, overflow: "hidden" }}>
      <Grid />
      {/* Phase A — the bot is already mid-conversation */}
      {!blue && !late ? (
        <>
          <Logo />
          <div style={{ position: "absolute", left: 140, top: 300, width: 760 }}>
            <div style={{ fontSize: 104, fontWeight: 600, color: INK, letterSpacing: -3.5, lineHeight: 1 }}><span style={{ display: "inline-block", ...punch(f, t.bot) }}>Your</span> <span style={{ display: "inline-block", color: BLUE, ...punch(f, t.bot) }}>Pipecat bot.</span></div>
            <div style={{ marginTop: 28, fontSize: 40, fontWeight: 600, color: INK, letterSpacing: -1, ...punch(f, t.great) }}>It works great.</div>
            <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 12, background: "#e7f8ee", color: "#15a34a", fontFamily: MONO, fontSize: 22, padding: "10px 18px", borderRadius: 999, ...punch(f, t.ready) }}><span style={{ width: 10, height: 10, borderRadius: 5, background: "#15a34a" }} />READY TO TALK</div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 200, width: 760, background: "#0f1117", borderRadius: 24, padding: "26px 28px 24px", boxShadow: "0 40px 90px rgba(15,17,23,0.3)", display: "flex", flexDirection: "column", gap: 14, ...punch(f, t.bot - 6) }}>
            <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 2, color: "#8ea2ff" }}>PIPECAT · plivo-demo-bot · LIVE TEST</div>
            <Bubble f={f} at={t.bot + 6} text="Hi, thanks for calling Redbud Studio. How can I help?" />
            <Bubble f={f} at={t.great - 6} text="I'd like to book a session for Friday." me />
            <Bubble f={f} at={t.ready - 4} text="Sure. Morning or afternoon?" />
            <div style={{ marginTop: 6 }}><Wave f={f} active={f >= t.ready - 4} n={44} /></div>
          </div>
        </>
      ) : null}
      {/* Phase B — blue: a real phone number, with Plivo */}
      {blue ? (
        <AbsoluteFill style={{ background: BLUE, opacity: ease(f, t.now, t.now + 12) }}>
          <Grid dark /><Logo white />
          <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontSize: 100, fontWeight: 600, color: "#fff", letterSpacing: -3.5, ...punch(f, t.now) }}>Now, a real phone number.</div>
          {/* the plan, in the order we'll build it */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center", alignItems: "center" }}>
            {[["Your Pipecat bot", "deployed on Pipecat Cloud", t.now + 24], ["Plivo Audio Streaming", "an Answer URL that returns Stream XML", t.number], ["A real phone number", "+1 806 209 0453", t.number + 26]].map(([a, b, at], i) => (
              <React.Fragment key={String(a)}>
                {i > 0 ? <div style={{ width: 90, height: 4, background: "rgba(255,255,255,0.55)", borderRadius: 2, ...punch(f, Number(at) - 8) }} /> : null}
                <div style={{ width: 400, background: "#fff", color: INK, borderRadius: 22, padding: "26px 30px", boxShadow: "0 24px 60px rgba(0,0,0,0.18)", ...punch(f, Number(at)) }}>
                  <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: BLUE }}>0{i + 1}</div>
                  <div style={{ marginTop: 10, fontSize: 30, fontWeight: 600, letterSpacing: -0.8 }}>{a}</div>
                  <div style={{ marginTop: 6, fontSize: 19, color: "#55586a", fontFamily: INTER }}>{b}</div>
                </div>
              </React.Fragment>))}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 730, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, color: "#fff", fontSize: 36, fontWeight: 600, ...punch(f, t.plivo) }}>with <span style={{ background: "#fff", borderRadius: 14, padding: "8px 18px", display: "inline-flex" }}><PlivoLogoSvg width={150} color={INK} /></span></div>
        </AbsoluteFill>
      ) : null}
      {/* Phase C — the phone rings, the bot picks up */}
      {late ? (
        <>
          <Logo />
          <div style={{ position: "absolute", left: 150, top: 330, width: 800 }}>
            <div style={{ fontSize: 84, fontWeight: 600, color: INK, letterSpacing: -2.6, lineHeight: 1.02 }}><span style={{ display: "inline-block", ...punch(f, t.pickup - 6) }}>It picks up</span><br /><span style={{ display: "inline-block", color: BLUE, ...punch(f, t.receptionist) }}>like a receptionist.</span></div>
            <div style={{ marginTop: 26, fontSize: 28, color: "#55586a", fontFamily: INTER, ...punch(f, t.receptionist + 10) }}>Real callers, real conversations, no one on hold.</div>
          </div>
          <Phone f={f} enterAt={t.pickup - 14} left={700}>
            <div style={{ width: 110, height: 110, borderRadius: 55, background: answered ? "#30a46c" : BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, transition: "none" }}>{answered ? "☎" : "?"}</div>
            <div style={{ marginTop: 26, fontSize: 30, fontWeight: 600 }}>{answered ? "Connected" : "Customer"}</div>
            <div style={{ marginTop: 8, fontFamily: MONO, fontSize: 15, letterSpacing: 2, color: "#8ea2ff" }}>{answered ? `00:${String(Math.floor((f - t.pickup) / 30)).padStart(2, "0")}` : "INCOMING CALL"}</div>
            {answered ? <div style={{ marginTop: 40, padding: "0 26px", width: "100%", display: "flex", flexDirection: "column", gap: 10 }}><Bubble f={f} at={t.pickup + 8} text="Redbud Studio, this is your receptionist. How can I help?" /></div> : null}
            {!answered ? <div style={{ marginTop: "auto", marginBottom: 90, display: "flex", gap: 90 }}><span style={{ width: 84, height: 84, borderRadius: 42, background: "#e5484d", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>✕</span><span style={{ width: 84, height: 84, borderRadius: 42, background: "#30a46c", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 34, transform: `scale(${1 + 0.08 * Math.abs(Math.sin(f / 4))})` }}>☎</span></div> : null}
          </Phone>
          {!answered ? <Rings f={f} at={t.pickup - 14} color="rgba(50,61,254,0.35)" cx={1360} cy={470} /> : null}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
