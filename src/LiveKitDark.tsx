import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { MONO, SORA, INTER } from "./StyleFrames";

// ============================================================================
// LiveKit video — its own visual language: a dark developer stage, gradient
// highlights, and a persistent CALL ROUTE bar (number → trunk → LiveKit → agent)
// that lights up as each piece is built. Console screens sit in glowing windows.
// ============================================================================
// Brand stage (plivo.com/brand): Gray 50 page, Dark ink, Plivo Blue accents, purple→blue gradient for highlighted words.
export const DK_BG = "#f9fafb"; export const DK_INK = "#0f1117"; export const DK_DIM = "rgba(15,17,23,0.58)"; export const DK_LINE = "rgba(15,17,23,0.10)"; export const BLUE = "#323dfe"; export const PURPLE = "#cd3ef9";
export const GRAD = "linear-gradient(90deg, #cd3ef9 0%, #323dfe 100%)";
export const OnBlue = React.createContext(false);
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const Grad: React.FC<{ children: React.ReactNode }> = ({ children }) => { const onBlue = React.useContext(OnBlue); return onBlue ? <span style={{ background: "#fff", color: BLUE, borderRadius: 18, padding: "0 18px", display: "inline-block" }}>{children}</span> : <span style={{ backgroundImage: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{children}</span>; };

// the route bar: which piece is being built (active) and how many are done
// the steps in the order the video builds them (not the call path)
export const ROUTE = [["LiveKit agent", "plivo-livekit-agent"], ["Plivo SIP trunk", "inbound"], ["Phone number", "+1 775 239 8525"], ["Dispatch rule", "lk CLI"]];
export const RouteBar: React.FC<{ active?: number; done?: number }> = ({ active = -1, done = 0 }) => {
  const f = useCurrentFrame(); const e = ease(f, 0, 18);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, display: "flex", justifyContent: "center", alignItems: "center", opacity: e, transform: `translateY(${(1 - e) * 10}px)`, fontFamily: INTER }}>
      {ROUTE.map(([t, s], i) => { const isDone = i < done, isOn = i === active; return (
        <React.Fragment key={t}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 999, border: `1.5px solid ${isOn ? "transparent" : isDone ? BLUE : DK_LINE}`, background: isOn ? BLUE : "#fff", color: isOn ? "#fff" : isDone ? DK_INK : DK_DIM, boxShadow: isOn ? "0 10px 30px rgba(50,61,254,0.25)" : "none" }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: isOn ? "#fff" : isDone ? BLUE : "rgba(15,17,23,0.2)" }} /><span style={{ fontSize: 15, fontWeight: 600 }}>{t}</span><span style={{ fontFamily: MONO, fontSize: 12, opacity: 0.75 }}>{s}</span>
          </div>
          {i < 3 ? <div style={{ width: 54, height: 2, background: i < done ? BLUE : "rgba(15,17,23,0.12)" }} /> : null}
        </React.Fragment>); })}
    </div>
  );
};
const RouteBarBlue: React.FC<{ active?: number; done?: number }> = ({ active = -1, done = 0 }) => {
  const f = useCurrentFrame(); const e = ease(f, 0, 18);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, display: "flex", justifyContent: "center", alignItems: "center", opacity: e, fontFamily: INTER }}>
      {ROUTE.map(([t, s], i) => { const isDone = i < done, isOn = i === active; return (
        <React.Fragment key={t}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 999, border: `1.5px solid ${isOn ? "#fff" : isDone ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)"}`, background: isOn ? "#fff" : "transparent", color: isOn ? BLUE : isDone ? "#fff" : "rgba(255,255,255,0.7)" }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: isOn ? BLUE : isDone ? "#fff" : "rgba(255,255,255,0.4)" }} /><span style={{ fontSize: 15, fontWeight: 600 }}>{t}</span><span style={{ fontFamily: MONO, fontSize: 12, opacity: 0.75 }}>{s}</span>
          </div>
          {i < 3 ? <div style={{ width: 54, height: 2, background: i < done ? "#fff" : "rgba(255,255,255,0.3)" }} /> : null}
        </React.Fragment>); })}
    </div>
  );
};
// the three steps of the video, as a checklist that fills in as the video goes
export const STEPS3 = ["Your agent", "SIP trunk", "Dispatch rule"];
export const StepsCheck: React.FC<{ now: number; at?: number; light?: boolean }> = ({ now, at = 12, light }) => {
  const f = useCurrentFrame(); const pulse = 0.55 + 0.45 * Math.abs(Math.sin(f / 7));
  return (
    <div style={{ display: "flex", gap: 22, justifyContent: "center", fontFamily: INTER }}>
      {STEPS3.map((t, i) => { const done = i < now, on = i === now; const e = ease(f, at + i * 6, at + i * 6 + 12);
        // three clearly different states: done = white with a blue check, now = dark ink with a pulsing dot, later = faint outline
        const bg = done ? "#fff" : on ? INK_ : "transparent"; const fg = done ? INK_ : on ? "#fff" : light ? "rgba(15,17,23,0.45)" : "rgba(255,255,255,0.7)"; const border = done ? (light ? BLUE : "#fff") : on ? INK_ : light ? "rgba(15,17,23,0.25)" : "rgba(255,255,255,0.45)";
        return (
        <div key={t} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 30px 16px 18px", borderRadius: 999, background: bg, color: fg, border: `2px solid ${border}`, fontSize: 28, fontWeight: 600, boxShadow: on ? "0 16px 40px rgba(15,17,23,0.25)" : "none", opacity: e, transform: `translateY(${(1 - e) * 10}px)` }}>
          <span style={{ width: 36, height: 36, borderRadius: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, background: done ? BLUE : "transparent", color: done ? "#fff" : fg, border: done ? "none" : `2px solid ${on ? "#fff" : border}` }}>{done ? "✓" : on ? <span style={{ width: 14, height: 14, borderRadius: 7, background: "#fff", opacity: pulse }} /> : String(i + 1)}</span>
          {t}{on ? <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, opacity: 0.8, marginLeft: 4 }}>NOW</span> : null}
        </div>); })}
    </div>
  );
};
const INK_ = "#0f1117";
export const DarkStage: React.FC<{ chip?: string; active?: number; done?: number; route?: boolean; children?: React.ReactNode }> = ({ chip, active, done, route = true, children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(60% 50% at 18% 12%, rgba(50,61,254,0.10) 0%, rgba(50,61,254,0) 70%), radial-gradient(40% 40% at 88% 90%, rgba(205,62,249,0.08) 0%, rgba(205,62,249,0) 70%), ${DK_BG}`, fontFamily: SORA, color: DK_INK, overflow: "hidden" }}>
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(15,17,23,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(15,17,23,0.045) 1px, transparent 1px)", backgroundSize: "96px 96px" }} />
    <div style={{ position: "absolute", top: 40, right: 60 }}><PlivoLogoSvg width={96} color={DK_INK} /></div>
    {chip ? <div style={{ position: "absolute", top: 44, left: 60, fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: DK_DIM, display: "flex", alignItems: "center", gap: 12 }}><span style={{ width: 22, height: 2, background: BLUE }} />{chip}</div> : null}
    {children}
    {route ? <RouteBar active={active} done={done} /> : null}
  </AbsoluteFill>
);

// a console screen in a glowing window under a headline (same window geometry as the brand frame,
// so spotlight coordinates inside StepScene are unchanged)
const FRAME_SCALE = 0.70; const FRAME_W = Math.round(1920 * FRAME_SCALE); const FRAME_H = Math.round(1080 * FRAME_SCALE); const CHROME = 36;
export const DarkFrame: React.FC<{ chip?: string; headline?: React.ReactNode; url?: string; active?: number; done?: number; children: React.ReactNode }> = ({ chip, headline, url = "cx.plivo.com", active, done, children }) => {
  const f = useCurrentFrame(); const e = ease(f, 0, 22);
  return (
    <DarkStage chip={chip} active={active} done={done}>
      <div style={{ position: "absolute", top: 96, left: 0, right: 0, textAlign: "center", fontSize: 46, fontWeight: 600, letterSpacing: -1.4, opacity: e, transform: `translateY(${(1 - e) * 14}px)` }}>{headline}</div>
      <div style={{ position: "absolute", top: 176, left: Math.round((1920 - FRAME_W) / 2), width: FRAME_W, height: FRAME_H + CHROME, borderRadius: 18, overflow: "hidden", boxShadow: `0 0 0 1px ${DK_LINE}, 0 30px 70px rgba(15,17,23,0.16)`, background: "#fff", transform: `scale(${0.985 + 0.015 * e})`, opacity: e }}>
        <div style={{ height: CHROME, background: "#f3f4f6", borderBottom: `1px solid ${DK_LINE}`, display: "flex", alignItems: "center", gap: 8, padding: "0 16px" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 11, height: 11, borderRadius: 6, background: c }} />)}
          <span style={{ marginLeft: 16, fontFamily: MONO, fontSize: 13, color: DK_DIM }}>{url}</span>
        </div>
        <div style={{ position: "relative", width: FRAME_W, height: FRAME_H, overflow: "hidden" }}><div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${FRAME_SCALE})`, transformOrigin: "0 0" }}>{children}</div></div>
      </div>
    </DarkStage>
  );
};
// a UI fragment cut out and floated large at the right, text on the left
export const DarkSplit: React.FC<{ chip?: string; rect: { x: number; y: number; w: number; h: number }; title: React.ReactNode; sub?: string; bullets?: string[]; tag?: string; active?: number; done?: number; wide?: boolean; still?: boolean; children: React.ReactNode }> = ({ chip, rect, title, sub, bullets, tag, active, done, wide, still, children }) => {
  const f = useCurrentFrame(); const e = still ? 1 : ease(f, 0, 24); const e2 = ease(f, 8, 30);
  const Z = wide ? Math.min(760 / rect.h, 1700 / rect.w, 1.4) : Math.min(800 / rect.h, 940 / rect.w, 1.25); const w = rect.w * Z, h = rect.h * Z;
  const left = wide ? Math.round((1920 - w) / 2) : 1920 - w - 120, top = wide ? 190 : Math.max(120, Math.round((1080 - 120 - h) / 2) + 20);
  return (
    <DarkStage chip={chip} active={active} done={done}>
      {wide ? <div style={{ position: "absolute", top: 96, left: 0, right: 0, textAlign: "center", fontSize: 46, fontWeight: 600, letterSpacing: -1.4, opacity: e2 }}>{title}</div> : (
        <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: Math.max(560, left - 200), display: "flex", flexDirection: "column", justifyContent: "center", opacity: e2, transform: `translateY(${(1 - e2) * 16}px)` }}>
          <div style={{ fontSize: 66, fontWeight: 600, letterSpacing: -2, lineHeight: 1.05 }}>{title}</div>
          {sub ? <div style={{ marginTop: 24, fontSize: 25, color: DK_DIM, fontFamily: INTER, lineHeight: 1.45 }}>{sub}</div> : null}
          {bullets ? <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14 }}>{bullets.map((b, i) => <div key={b} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 27, fontFamily: INTER, color: DK_INK, opacity: ease(f, 14 + i * 10, 26 + i * 10) }}><span style={{ width: 12, height: 12, borderRadius: 6, background: BLUE, flex: "none" }} />{b}</div>)}</div> : null}
          {tag ? <div style={{ marginTop: 30, display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 10, background: "rgba(21,163,74,0.10)", color: "#15a34a", fontFamily: MONO, fontSize: 17, padding: "10px 16px", borderRadius: 10, border: "1px solid rgba(21,163,74,0.25)" }}>{tag}</div> : null}
        </div>)}
      <div style={{ position: "absolute", left, top, width: w, height: h, borderRadius: 18, overflow: "hidden", boxShadow: `0 0 0 1px ${DK_LINE}, 0 30px 70px rgba(15,17,23,0.16)`, background: "#fff", opacity: e, transform: `translateX(${(1 - e) * 40}px)` }}>
        <div style={{ position: "absolute", left: -rect.x * Z, top: -rect.y * Z, width: 1920, height: 1080, transform: `scale(${Z})`, transformOrigin: "0 0" }}>{children}</div>
      </div>
    </DarkStage>
  );
};
// section opener: one line, huge, the key words in the gradient, a line drawing under it
export const DarkOpener: React.FC<{ chip?: string; title: React.ReactNode; active?: number; done?: number; steps?: number }> = ({ chip, title, active, done, steps }) => {
  const f = useCurrentFrame(); const e = ease(f, 0, 20);
  return (
    <OnBlue.Provider value={true}>
      <AbsoluteFill style={{ background: BLUE, fontFamily: SORA, color: "#fff", overflow: "hidden" }}>
        <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1.4px)", backgroundSize: "30px 30px", opacity: 0.6 }} />
        <div style={{ position: "absolute", top: 40, right: 60 }}><PlivoLogoSvg width={96} color="#fff" /></div>
        {chip ? <div style={{ position: "absolute", top: 44, left: 60, fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", gap: 12 }}><span style={{ width: 22, height: 2, background: "#fff" }} />{chip}</div> : null}
        <div style={{ position: "absolute", left: 120, right: 120, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", opacity: e, transform: `translateY(${(1 - e) * 20}px)` }}>
          <div style={{ fontSize: 108, fontWeight: 600, letterSpacing: -4, lineHeight: 1.14 }}>{title}</div>
          {steps != null ? <div style={{ marginTop: 120 }}><StepsCheck now={steps} at={14} /></div> : null}
        </div>
        <RouteBarBlue active={active} done={done} />
      </AbsoluteFill>
    </OnBlue.Provider>
  );
};
// what you'll need: three dark cards
export const NeedDark: React.FC<{ at: [number, number, number] }> = ({ at }) => {
  const f = useCurrentFrame();
  const cards = [{ icon: "◉", title: "A LiveKit agent", sub: "deployed on LiveKit Cloud" }, { icon: "☎", title: "A Plivo account", sub: "with a phone number" }, { icon: ">_", title: "The LiveKit CLI", sub: "lk, installed" }];
  return (
    <DarkStage chip="00 · BEFORE YOU START" route={false}>
      <div style={{ position: "absolute", top: 170, left: 0, right: 0, textAlign: "center", fontSize: 72, fontWeight: 600, letterSpacing: -2.4, opacity: ease(f, 0, 20) }}>What you'll <Grad>need.</Grad></div>
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 30 }}>
        {cards.map((c, i) => { const e = ease(f, at[i], at[i] + 18); return (
          <div key={c.title} style={{ width: 470, borderRadius: 24, padding: "36px 34px", background: "#fff", border: `1px solid ${DK_LINE}`, boxShadow: "0 24px 60px rgba(15,17,23,0.10)", opacity: e, transform: `translateY(${(1 - e) * 30}px)` }}>
            <span style={{ width: 60, height: 60, borderRadius: 18, background: BLUE, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontFamily: MONO, fontWeight: 700 }}>{c.icon}</span>
            <div style={{ marginTop: 22, fontSize: 32, fontWeight: 600 }}>{c.title}</div>
            <div style={{ marginTop: 8, fontSize: 21, color: DK_DIM, fontFamily: INTER }}>{c.sub}</div>
          </div>); })}
      </div>
    </DarkStage>
  );
};
// "Go on, call it" — the phone on the dark stage
export const PhoneDark: React.FC<{ title: React.ReactNode; sub: string; number: string }> = ({ title, sub, number }) => {
  const f = useCurrentFrame(); const e = ease(f, 0, 24); const ring = (f * 3) % 360;
  return (
    <DarkStage chip="04 · TEST CALL" active={-1} done={4}>
      <div style={{ position: "absolute", left: 140, top: 0, bottom: 0, width: 900, display: "flex", flexDirection: "column", justifyContent: "center", opacity: e }}>
        <div style={{ fontSize: 66, fontWeight: 600, letterSpacing: -2, lineHeight: 1.05 }}>{title}</div>
        <div style={{ marginTop: 22, fontSize: 25, color: DK_DIM, fontFamily: INTER }}>{sub}</div>
      </div>
      <div style={{ position: "absolute", left: 1210, top: 200, width: 360, height: 720, borderRadius: 48, background: "linear-gradient(180deg,#1c2130,#0b0f24)", border: "10px solid #05070f", boxShadow: "0 50px 120px rgba(15,17,23,0.35)", transform: `rotate(-6deg) translateY(${(1 - e) * 40}px)`, opacity: e, fontFamily: INTER, color: "#fff", textAlign: "center" }}>
        <div style={{ marginTop: 84, fontSize: 15, color: "rgba(255,255,255,0.6)" }}>mobile</div>
        <div style={{ marginTop: 8, fontSize: 32, fontWeight: 600, letterSpacing: -0.5 }}>{number}</div>
        <div style={{ marginTop: 10, fontSize: 17, color: "rgba(255,255,255,0.7)" }}>calling{".".repeat(1 + (Math.floor(f / 12) % 3))}</div>
        <div style={{ position: "absolute", left: 30, right: 30, top: 300, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", rowGap: 22 }}>
          {[["mute", "🎙"], ["keypad", "⌗"], ["speaker", "🔊"], ["add call", "＋"], ["FaceTime", "▣"], ["contacts", "☺"]].map(([l, ic]) => <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}><span style={{ width: 64, height: 64, borderRadius: 32, background: "rgba(255,255,255,0.14)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{ic}</span><span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{l}</span></div>)}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, display: "flex", justifyContent: "center" }}><span style={{ width: 70, height: 70, borderRadius: 35, background: "#e5484d", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 28, transform: `rotate(${135 + Math.sin(ring / 20) * 6}deg)` }}>☎</span></div>
      </div>
    </DarkStage>
  );
};
// recap on the dark stage: the route, complete
export const RecapDark: React.FC<{ title: React.ReactNode; cards: { icon: string; title: string; rows: [string, string][] }[] }> = ({ title, cards }) => {
  const f = useCurrentFrame();
  return (
    <DarkStage chip="05 · WHAT YOU BUILT" active={-1} done={4}>
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontSize: 62, fontWeight: 600, letterSpacing: -2, opacity: ease(f, 0, 20) }}>{title}</div>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0 }}><StepsCheck now={3} at={8} light /></div>
      <div style={{ position: "absolute", top: 360, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 30 }}>
        {cards.map((c, i) => { const e = ease(f, 10 + i * 14, 30 + i * 14); return (
          <div key={c.title} style={{ width: 470, borderRadius: 24, padding: "30px 32px", background: "#fff", border: `1px solid ${DK_LINE}`, boxShadow: "0 24px 60px rgba(15,17,23,0.10)", opacity: e, transform: `translateY(${(1 - e) * 24}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}><span style={{ width: 44, height: 44, borderRadius: 13, background: BLUE, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontFamily: MONO, fontWeight: 700 }}>{c.icon}</span><span style={{ fontSize: 27, fontWeight: 600 }}>{c.title}</span></div>
            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>{c.rows.map(([k, v]) => <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 15 }}><span style={{ color: DK_DIM }}>{k}</span><span style={{ color: BLUE, fontWeight: 600 }}>{v}</span></div>)}</div>
          </div>); })}
      </div>
    </DarkStage>
  );
};
