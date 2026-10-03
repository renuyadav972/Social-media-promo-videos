import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { MONO, SORA, INTER } from "./StyleFrames";

// ============================================================================
// Pipecat video — its own visual language: a bright white "pipeline" stage. Plivo
// purple is the single accent; a persistent PIPELINE strip across the top shows the
// audio path (Phone → Plivo → WebSocket → Pipecat bot) filling in as it is built.
// Screens sit in flat white cards with a purple top rule, headlines are left-aligned,
// section openers are black with purple words.
// ============================================================================
export const PP = "#cd3ef9"; export const PP_INK = "#0f1117"; export const PP_BG = "#fbfbfc"; export const PP_DIM = "#6b6f7b"; export const PP_LINE = "#e6e6ea";
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const Pk: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: PP }}>{children}</span>;

// the steps in the order the video builds them
export const PIPE = [["Pipecat bot", "deployed"], ["Audio Streaming", "Stream XML"], ["Plivo application", "Pipecat_Demo"], ["Phone number", "+1 806 209 0453"]];
export const PipeStrip: React.FC<{ active?: number; done?: number }> = ({ active = -1, done = 0 }) => {
  const f = useCurrentFrame(); const e = ease(f, 0, 16);
  return (
    <div style={{ position: "absolute", top: 118, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", opacity: e, fontFamily: INTER }}>
      {PIPE.map(([t, s], i) => { const on = i === active, isDone = i < done; return (
        <React.Fragment key={t}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px 8px 10px", borderRadius: 8, background: on ? PP : "#fff", border: `1px solid ${on ? PP : isDone ? PP : PP_LINE}`, color: on ? "#fff" : PP_INK }}>
            {isDone ? <span style={{ width: 16, height: 16, borderRadius: 8, background: PP, color: "#fff", fontSize: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>✓</span> : <span style={{ width: 8, height: 8, borderRadius: 2, background: on ? "#fff" : "#d0d2d9" }} />}<span style={{ fontSize: 14.5, fontWeight: 600 }}>{t}</span><span style={{ fontFamily: MONO, fontSize: 11.5, color: on ? "rgba(255,255,255,0.8)" : PP_DIM }}>{s}</span>
          </div>
          {i < 3 ? <div style={{ width: 70, height: 0, borderTop: `2px ${i < done ? "solid" : "dashed"} ${i < done ? PP : "#cfd1d8"}` }} /> : null}
        </React.Fragment>); })}
    </div>
  );
};
export const PipeStage: React.FC<{ chip?: string; active?: number; done?: number; strip?: boolean; children?: React.ReactNode }> = ({ chip, active, done, strip = true, children }) => (
  <AbsoluteFill style={{ background: PP_BG, fontFamily: SORA, color: PP_INK, overflow: "hidden" }}>
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${PP}22 1.4px, transparent 1.4px)`, backgroundSize: "28px 28px" }} />
    <div style={{ position: "absolute", top: 40, right: 60 }}><PlivoLogoSvg width={96} color={PP_INK} /></div>
    {chip ? <div style={{ position: "absolute", top: 46, left: 60, fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: PP, display: "flex", alignItems: "center", gap: 12 }}><span style={{ width: 10, height: 10, background: PP, borderRadius: 2 }} />{chip}</div> : null}
    {strip ? <PipeStrip active={active} done={done} /> : null}
    {children}
  </AbsoluteFill>
);
// a console screen in a flat white card with a purple rule, headline left-aligned above it
const CARD_SCALE = 0.72; const CARD_W = Math.round(1920 * CARD_SCALE); const CARD_H = Math.round(1080 * CARD_SCALE);
export const PipeFrame: React.FC<{ chip?: string; headline: React.ReactNode; active?: number; done?: number; still?: boolean; children: React.ReactNode }> = ({ chip, headline, active, done, still, children }) => {
  const f = useCurrentFrame(); const e = still ? 1 : ease(f, 0, 22); // still: the card was already on screen in the previous beat, so no fade
  return (
    <PipeStage chip={chip} active={active} done={done}>
      <div style={{ position: "absolute", top: 196, left: 0, right: 0, textAlign: "center", fontSize: 42, fontWeight: 600, letterSpacing: -1.3, opacity: e, transform: `translateY(${(1 - e) * 12}px)` }}>{headline}</div>
      <div style={{ position: "absolute", top: 272, left: Math.round((1920 - CARD_W) / 2), width: CARD_W, height: CARD_H, borderRadius: 16, overflow: "hidden", background: "#fff", boxShadow: `0 0 0 1px ${PP_LINE}, 0 30px 70px rgba(15,17,23,0.10)`, borderTop: `4px solid ${PP}`, opacity: e, transform: `scale(${0.985 + 0.015 * e})` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${CARD_SCALE})`, transformOrigin: "0 0" }}>{children}</div>
      </div>
    </PipeStage>
  );
};
// a UI fragment floated LEFT, text on the right
export const PipeSplit: React.FC<{ chip?: string; rect: { x: number; y: number; w: number; h: number }; title: React.ReactNode; sub?: string; bullets?: string[]; tag?: string; active?: number; done?: number; wide?: boolean; children: React.ReactNode }> = ({ chip, rect, title, sub, bullets, tag, active, done, wide, children }) => {
  const f = useCurrentFrame(); const e = ease(f, 0, 24); const e2 = ease(f, 8, 30);
  const Z = wide ? Math.min(700 / rect.h, 1680 / rect.w, 1.4) : Math.min(780 / rect.h, 900 / rect.w, 1.25); const w = rect.w * Z, h = rect.h * Z;
  const left = wide ? Math.round((1920 - w) / 2) : 120, top = wide ? 280 : Math.max(196, Math.round((1080 - h) / 2) + 40);
  return (
    <PipeStage chip={chip} active={active} done={done}>
      {wide ? <div style={{ position: "absolute", top: 196, left: 0, right: 0, textAlign: "center", fontSize: 42, fontWeight: 600, letterSpacing: -1.3, opacity: e2 }}>{title}</div> : (
        <div style={{ position: "absolute", left: left + w + 90, right: 120, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", opacity: e2, transform: `translateY(${(1 - e2) * 16}px)` }}>
          <div style={{ fontSize: 62, fontWeight: 600, letterSpacing: -2, lineHeight: 1.05 }}>{title}</div>
          {sub ? <div style={{ marginTop: 22, fontSize: 24, color: PP_DIM, fontFamily: INTER, lineHeight: 1.45 }}>{sub}</div> : null}
          {bullets ? <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 14 }}>{bullets.map((b, bi) => <div key={b} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 27, fontFamily: INTER, color: PP_INK, opacity: ease(f, 14 + bi * 10, 26 + bi * 10) }}><span style={{ width: 12, height: 12, borderRadius: 3, background: PP, flex: "none" }} />{b}</div>)}</div> : null}
          {tag ? <div style={{ marginTop: 28, display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 10, background: "#faeaff", color: "#8a1fb5", fontFamily: MONO, fontSize: 16, padding: "10px 16px", borderRadius: 8, border: `1px solid ${PP}55` }}>{tag}</div> : null}
        </div>)}
      <div style={{ position: "absolute", left, top, width: w, height: h, borderRadius: 16, overflow: "hidden", background: "#fff", boxShadow: `0 0 0 1px ${PP_LINE}, 0 30px 70px rgba(15,17,23,0.12)`, borderTop: `4px solid ${PP}`, opacity: e, transform: `translateX(${(e - 1) * 40}px)` }}>
        <div style={{ position: "absolute", left: -rect.x * Z, top: -rect.y * Z - 4, width: 1920, height: 1080, transform: `scale(${Z})`, transformOrigin: "0 0" }}>{children}</div>
      </div>
    </PipeStage>
  );
};
// section opener: black, one big line, purple words, a purple pipe glyph drawing across
export const PipeOpener: React.FC<{ chip?: string; title: React.ReactNode; steps?: number }> = ({ chip, title, steps }) => {
  const f = useCurrentFrame(); const e = ease(f, 0, 20);
  return (
    <AbsoluteFill style={{ background: PP_INK, fontFamily: SORA, color: "#fff", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 40, right: 60 }}><PlivoLogoSvg width={96} color="#fff" /></div>
      {chip ? <div style={{ position: "absolute", top: 46, left: 60, fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: PP, display: "flex", alignItems: "center", gap: 12 }}><span style={{ width: 10, height: 10, background: PP, borderRadius: 2 }} />{chip}</div> : null}
      <div style={{ position: "absolute", left: 120, right: 120, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", opacity: e, transform: `translateY(${(1 - e) * 20}px)` }}>
        <div style={{ fontSize: 104, fontWeight: 600, letterSpacing: -4, lineHeight: 1.1 }}>{title}</div>
        {steps != null ? <div style={{ marginTop: 100, display: "flex", gap: 22, fontFamily: INTER }}>{["Pipecat bot", "Plivo application", "Phone number"].map((t, i) => { const done = i < steps, on = i === steps; const e2 = ease(f, 14 + i * 6, 26 + i * 6); return <div key={t} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 30px 16px 18px", borderRadius: 999, fontSize: 28, fontWeight: 600, background: done ? "#fff" : on ? PP : "transparent", color: done ? PP_INK : on ? "#fff" : "rgba(255,255,255,0.6)", border: `2px solid ${done ? "#fff" : on ? PP : "rgba(255,255,255,0.35)"}`, opacity: e2, transform: `translateY(${(1 - e2) * 10}px)` }}><span style={{ width: 36, height: 36, borderRadius: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, background: done ? PP : "transparent", color: done ? "#fff" : "inherit", border: done ? "none" : "2px solid currentColor" }}>{done ? "✓" : on ? <span style={{ width: 14, height: 14, borderRadius: 7, background: "#fff", opacity: 0.55 + 0.45 * Math.abs(Math.sin(f / 7)) }} /> : String(i + 1)}</span>{t}{on ? <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, opacity: 0.85, marginLeft: 4 }}>NOW</span> : null}</div>; })}</div> : null}
        <div style={{ marginTop: 34, display: "flex", alignItems: "center", justifyContent: "center", gap: 0 }}>{[0, 1, 2, 3].map((i) => <React.Fragment key={i}><span style={{ width: 14, height: 14, borderRadius: 3, background: PP, opacity: ease(f, 10 + i * 8, 18 + i * 8) }} />{i < 3 ? <span style={{ width: 90 * ease(f, 12 + i * 8, 24 + i * 8), height: 2, background: PP }} /> : null}</React.Fragment>)}</div>
      </div>
    </AbsoluteFill>
  );
};
// terminal / code window on the stage
export const PipeTerm: React.FC<{ chip?: string; headline: React.ReactNode; title: string; active?: number; done?: number; children: React.ReactNode; top?: number; width?: number; left?: number }> = ({ chip, headline, title, active, done, children, top = 290, width = 1500, left = 210 }) => {
  const f = useCurrentFrame(); const e = ease(f, 6, 26);
  return (
    <PipeStage chip={chip} active={active} done={done}>
      <div style={{ position: "absolute", top: 196, left: 0, right: 0, textAlign: "center", fontSize: 42, fontWeight: 600, letterSpacing: -1.3, opacity: ease(f, 0, 20) }}>{headline}</div>
      <div style={{ position: "absolute", top, left, width, background: PP_INK, borderRadius: 16, boxShadow: "0 30px 70px rgba(15,17,23,0.18)", overflow: "hidden", opacity: e, transform: `translateY(${(1 - e) * 16}px)` }}>
        <div style={{ height: 44, display: "flex", alignItems: "center", gap: 8, padding: "0 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />)}
          <span style={{ marginLeft: 14, fontFamily: MONO, fontSize: 14, color: "rgba(255,255,255,0.45)" }}>{title}</span>
        </div>
        {children}
      </div>
    </PipeStage>
  );
};
// the phone on the light stage
export const PipePhone: React.FC<{ title: React.ReactNode; sub: string; number: string }> = ({ title, sub, number }) => {
  const f = useCurrentFrame(); const e = ease(f, 0, 24);
  return (
    <PipeStage chip="06 · TEST CALL" active={-1} done={4}>
      <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: 900, display: "flex", flexDirection: "column", justifyContent: "center", opacity: e }}>
        <div style={{ fontSize: 66, fontWeight: 600, letterSpacing: -2, lineHeight: 1.05 }}>{title}</div>
        <div style={{ marginTop: 22, fontSize: 25, color: PP_DIM, fontFamily: INTER }}>{sub}</div>
      </div>
      <div style={{ position: "absolute", left: 1210, top: 230, width: 360, height: 720, borderRadius: 48, background: PP_INK, boxShadow: "0 50px 120px rgba(15,17,23,0.35)", transform: `rotate(-6deg) translateY(${(1 - e) * 40}px)`, opacity: e, fontFamily: INTER, color: "#fff", textAlign: "center" }}>
        <div style={{ marginTop: 84, fontSize: 15, color: "rgba(255,255,255,0.6)" }}>mobile</div>
        <div style={{ marginTop: 8, fontSize: 32, fontWeight: 600, letterSpacing: -0.5 }}>{number}</div>
        <div style={{ marginTop: 10, fontSize: 17, color: "rgba(255,255,255,0.7)" }}>calling{".".repeat(1 + (Math.floor(f / 12) % 3))}</div>
        <div style={{ position: "absolute", left: 30, right: 30, top: 300, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", rowGap: 22 }}>
          {[["mute", "🎙"], ["keypad", "⌗"], ["speaker", "🔊"], ["add call", "＋"], ["FaceTime", "▣"], ["contacts", "☺"]].map(([l, ic]) => <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}><span style={{ width: 64, height: 64, borderRadius: 32, background: "rgba(255,255,255,0.14)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{ic}</span><span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{l}</span></div>)}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, display: "flex", justifyContent: "center" }}><span style={{ width: 70, height: 70, borderRadius: 35, background: "#e5484d", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 28, transform: "rotate(135deg)" }}>☎</span></div>
      </div>
    </PipeStage>
  );
};
// recap
export const PipeRecap: React.FC<{ title: React.ReactNode; cards: { icon: string; title: string; rows: [string, string][] }[] }> = ({ title, cards }) => {
  const f = useCurrentFrame();
  return (
    <PipeStage chip="08 · WHAT YOU BUILT" active={-1} done={4}>
      <div style={{ position: "absolute", top: 210, left: 0, right: 0, textAlign: "center", fontSize: 58, fontWeight: 600, letterSpacing: -2, opacity: ease(f, 0, 20) }}>{title}</div>
      <div style={{ position: "absolute", top: 370, left: 120, right: 120, display: "flex", gap: 26 }}>
        {cards.map((c, i) => { const e = ease(f, 10 + i * 14, 30 + i * 14); return (
          <div key={c.title} style={{ flex: 1, borderRadius: 16, padding: "28px 30px", background: "#fff", boxShadow: `0 0 0 1px ${PP_LINE}`, borderTop: `4px solid ${PP}`, opacity: e, transform: `translateY(${(1 - e) * 24}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}><span style={{ width: 42, height: 42, borderRadius: 10, background: "#faeaff", color: "#8a1fb5", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontFamily: MONO, fontWeight: 700 }}>{c.icon}</span><span style={{ fontSize: 26, fontWeight: 600 }}>{c.title}</span></div>
            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>{c.rows.map(([k, v]) => <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 15 }}><span style={{ color: PP_DIM }}>{k}</span><span style={{ color: "#8a1fb5" }}>{v}</span></div>)}</div>
          </div>); })}
      </div>
    </PipeStage>
  );
};
