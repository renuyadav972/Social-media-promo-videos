import React from "react";
import { useCurrentFrame, interpolate, Img, staticFile } from "remotion";
import { INTER_FAMILY } from "../fonts";
import { NewConsoleShell } from "./NewConsoleShell";
import { Ico } from "./consoleIcons";

// ============================================================================
// Recreated AI-agent builder screens (the "Vibe Agent" surface) — built from
// reference frames of the call-scheduling recording so every state is clean,
// consistently named, and crisp at any zoom. Everything dynamic is a prop.
// ============================================================================
export const INK = "#1f2430"; export const SUB = "#6b7280"; export const HAIR = "#e6e7eb"; export const VIBE = "#9b5cf6"; export const OK = "#15a34a"; export const BAD = "#e5484d";
const F = `${INTER_FAMILY}, sans-serif`;
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ---- page header: back, name, status pill, actions -------------------------------------------
const Btn: React.FC<{ children: React.ReactNode; kind?: "ghost" | "dark" | "vibe" | "icon"; muted?: boolean }> = ({ children, kind = "ghost", muted }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 9, height: 42, padding: kind === "icon" ? "0 12px" : "0 18px", borderRadius: 10, fontSize: 16, fontWeight: 600, fontFamily: F,
    border: `1px solid ${kind === "vibe" ? "#c9a8ff" : kind === "dark" ? INK : HAIR}`, background: kind === "dark" ? INK : "#fff", color: kind === "dark" ? "#fff" : kind === "vibe" ? VIBE : muted ? "#9aa0ac" : INK }}>{children}</div>
);
export const AgentHeader: React.FC<{ name: string; status: "Unsaved" | "Draft" | "Active"; tabs: string[]; active: string; saved?: boolean }> = ({ name, status, tabs, active, saved }) => (
  <div style={{ padding: "0 36px", fontFamily: F }}>
    <div style={{ display: "flex", alignItems: "center", height: 84 }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.5 4 6.5 10l6 6" /></svg>
      <span style={{ marginLeft: 18, fontSize: 27, fontWeight: 600, color: INK, letterSpacing: -0.3 }}>{name}</span>
      <span style={{ marginLeft: 26, fontSize: 15, fontWeight: 600, color: status === "Active" ? OK : "#3a3d46", background: status === "Active" ? "#e7f8ee" : "#f1f2f4", borderRadius: 8, padding: "7px 13px" }}>{status}</span>
      <span style={{ flex: 1 }} />
      <div style={{ display: "flex", gap: 12 }}>
        <Btn kind="vibe"><VibeIcon /> Vibe Agent</Btn>
        <Btn kind="icon"><svg width="16" height="16" viewBox="0 0 20 20" fill={INK}><circle cx="10" cy="4" r="1.7" /><circle cx="10" cy="10" r="1.7" /><circle cx="10" cy="16" r="1.7" /></svg></Btn>
        {saved ? <Btn kind="icon"><svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round"><path d="M3 10a7 7 0 1 0 2-4.9" /><path d="M3 4v4h4" /><path d="M10 6v4l3 2" /></svg><svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke={INK} strokeWidth="2"><path d="m5 8 5 5 5-5" /></svg></Btn> : null}
        <Btn muted={!saved}><svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M5 3v14l11-7z" /></svg> Test agent</Btn>
        <Btn>Save as draft</Btn>
        <Btn kind="dark">Publish</Btn>
      </div>
    </div>
    <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${HAIR}`, marginTop: 4 }}>
      {tabs.map((t) => <div key={t} style={{ padding: "12px 16px 14px", fontSize: 17, fontWeight: t === active ? 600 : 500, color: t === active ? INK : "#3f4453", borderBottom: t === active ? `2px solid ${INK}` : "2px solid transparent", marginBottom: -1 }}>{t}</div>)}
    </div>
  </div>
);
const VibeIcon: React.FC = () => <svg width="20" height="14" viewBox="0 0 22 14" fill="none" stroke={VIBE} strokeWidth="1.8"><ellipse cx="11" cy="7" rx="9.5" ry="5.5" /><circle cx="11" cy="7" r="2.2" fill={VIBE} stroke="none" /></svg>;

// ---- flow canvas --------------------------------------------------------------------------
export const FlowCanvas: React.FC<{ built?: boolean; zoom?: string; reveal?: number; step?: number; from?: number; upto?: number; children?: React.ReactNode }> = ({ built, zoom = "100%", reveal, step, from, upto, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, borderRadius: 14, border: `1px solid ${HAIR}`, background: "#fff", backgroundImage: "radial-gradient(#d5d7de 1.2px, transparent 1.2px)", backgroundSize: "22px 22px", overflow: "hidden", fontFamily: F }}>
    {built ? <BuiltFlow reveal={reveal} step={step} from={from} upto={upto} /> : children ? null : <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", gap: 10, padding: "0 30px", height: 78, borderRadius: 14, border: `1.5px dashed #cfd2da`, background: "#fff", fontSize: 18, color: "#8a8f9c" }}><span style={{ width: 18, height: 18, borderRadius: 9, border: "1.5px solid #8a8f9c", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>+</span> Select Trigger</div>}
    <div style={{ position: "absolute", left: 14, bottom: 14, display: "flex", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, height: 44, padding: "0 14px", border: `1px solid ${HAIR}`, borderRadius: 10, background: "#fff", fontSize: 15, color: INK }}><span>−</span><span style={{ fontWeight: 600 }}>{zoom}</span><span>+</span><span style={{ width: 1, height: 20, background: HAIR }} /><span style={{ color: "#9aa0ac" }}>↶</span><span style={{ color: "#9aa0ac" }}>↷</span><span style={{ width: 1, height: 20, background: HAIR }} /><span style={{ color: "#9aa0ac" }}>⊞</span></div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, height: 44, padding: "0 14px", border: `1px solid ${HAIR}`, borderRadius: 10, background: "#fff", fontSize: 15, color: INK }}><span style={{ color: "#9aa0ac" }}>▷</span><span style={{ color: "#9aa0ac" }}>⊕</span><span style={{ color: "#9aa0ac" }}>▢</span><span style={{ width: 1, height: 20, background: HAIR }} /><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ color: "#9aa0ac" }}>◌</span> Global Prompt</span></div>
    </div>
    {children}
  </div>
);
const Node: React.FC<{ x: number; y: number; w?: number; tag?: string; icon: "call" | "voice" | "end"; title: string; sub: string; foot?: string; color?: string }> = ({ x, y, w = 250, tag, icon, title, sub, foot, color = OK }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, borderRadius: 12, border: `1px solid ${HAIR}`, background: "#fff", boxShadow: "0 2px 10px rgba(15,17,23,0.06)", padding: "12px 14px", fontFamily: F }}>
    {tag ? <div style={{ position: "absolute", left: 12, top: -11, fontSize: 10, fontWeight: 700, letterSpacing: 0.6, color: "#fff", background: "#a78bfa", borderRadius: 5, padding: "2px 7px" }}>{tag}</div> : null}
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 24, height: 24, borderRadius: 7, background: icon === "end" ? "#fde8e8" : "#e7f8ee", display: "inline-flex", alignItems: "center", justifyContent: "center", color: icon === "end" ? BAD : color, fontSize: 13 }}>{icon === "end" ? "⏹" : "☎"}</span><span style={{ fontSize: 14, fontWeight: 600, color: INK }}>{title}</span><span style={{ marginLeft: "auto", color: "#9aa0ac" }}>⋮</span></div>
    <div style={{ marginTop: 6, fontSize: 12, color: SUB, lineHeight: 1.35 }}>{sub}</div>
    {foot ? <div style={{ marginTop: 8, fontSize: 10, letterSpacing: 0.8, color: "#a9aeb9", fontWeight: 600 }}>{foot}</div> : null}
  </div>
);
const BuiltFlow: React.FC<{ reveal?: number; step?: number; from?: number; upto?: number }> = ({ reveal, step = 26, from = 0, upto = 99 }) => {
  const f = useCurrentFrame(); const at = (i: number) => (i >= upto ? 0 : i < from ? 1 : reveal == null ? 1 : ease(f, reveal + (i - from) * step, reveal + (i - from) * step + 10)); // upto: hide later stages (partial build); from: earlier stages already there
  const pop = (a: number): React.CSSProperties => ({ opacity: a, transform: `scale(${0.92 + 0.08 * a})`, transformOrigin: "50% 50%" });
  return (
    <div style={{ position: "absolute", left: 215, top: 110, width: 700, height: 560 }}>{/* centred on the 1078x812 canvas */}
      <svg style={{ position: "absolute", left: 0, top: 0, opacity: at(3) }} width={1100} height={800} fill="none" stroke="#c4c7d0" strokeWidth="1.5" strokeDasharray="5 5">
        <path d="M 320 118 V 246" /><path d="M 320 330 V 372 H 155 V 420" /><path d="M 320 372 H 520 V 420" />
      </svg>
      <div style={pop(at(0))}><Node x={195} y={40} tag="TRIGGER" icon="call" title="Voice Call" sub="Triggers when an incoming call is received on your number" /></div>
      <div style={pop(at(1))}><Node x={195} y={248} icon="voice" title="Elise Reception" sub="Understands customer queries and extracts key details" foot="ELISE RECEPTION" /></div>
      <div style={{ position: "absolute", left: 118, top: 384, fontSize: 11, color: SUB, background: "#fff", padding: "0 4px", opacity: at(3) }}>Call Closed ✎</div>
      <div style={{ position: "absolute", left: 480, top: 384, fontSize: 11, color: SUB, background: "#fff", padding: "0 4px", opacity: at(3) }}>Message Captured ✎</div>
      <div style={pop(at(2))}><Node x={30} y={422} icon="end" title="Call Closed" sub="Ends the current conversation" foot="CALL CLOSED" /></div>
      <div style={pop(at(2))}><Node x={395} y={422} icon="end" title="Message Recorded" sub="Ends the current conversation" foot="MESSAGE RECORDED" /></div>
    </div>
  );
};

// ---- the Vibe Agent panel --------------------------------------------------------------
export type VibeItem = { at: number; kind: "user" | "text" | "bullets" | "heading" | "check" | "checks" | "thinking"; text?: string; items?: string[]; done?: number };
export const VibePanel: React.FC<{ items: VibeItem[]; status?: "generating" | "idle"; typing?: string; typedFrom?: number; typedUntil?: number }> = ({ items, status = "generating", typing, typedFrom = 0, typedUntil = 60 }) => {
  const f = useCurrentFrame(); const shown = items.filter((it) => f >= it.at);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, borderRadius: 14, border: `1px solid ${HAIR}`, background: "#fff", fontFamily: F, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 18, padding: "22px 24px 8px", color: "#6b7280", fontSize: 16 }}><span>✎</span><span>⋯</span><span style={{ color: INK }}>✕</span></div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 22px 12px" }}>
          {shown.map((it, i) => {
            const a = ease(f, it.at, it.at + 8);
            if (it.kind === "user") return <div key={i} style={{ marginLeft: 120, marginTop: 18, marginBottom: 22, background: "#f1f2f4", borderRadius: 12, padding: "16px 18px", fontSize: 19, lineHeight: 1.45, color: INK, opacity: a }}>{it.text}</div>;
            if (it.kind === "heading") return <div key={i} style={{ marginTop: 16, fontSize: 19, fontWeight: 700, color: INK, opacity: a }}>{it.text}</div>;
            if (it.kind === "bullets") return <div key={i} style={{ marginTop: 10, opacity: a }}>{it.items!.map((b, j) => <div key={j} style={{ display: "flex", gap: 12, fontSize: 19, lineHeight: 1.5, color: INK, marginTop: 4 }}><span style={{ color: "#9aa0ac" }}>•</span><span>{b}</span></div>)}</div>;
            if (it.kind === "checks") return <div key={i} style={{ marginTop: 14 }}>{it.items!.map((c, j) => { const on = f >= it.at + j * 12; const doneN = it.done ?? it.items!.length; return <div key={j} style={{ display: "flex", alignItems: "center", gap: 12, height: 46, fontSize: 19, color: on ? INK : "#b4b8c2", opacity: ease(f, it.at + j * 12, it.at + j * 12 + 6) }}><span>{c}</span><span style={{ color: j < doneN ? INK : "#c8cbd3", fontSize: 17 }}>✓</span></div>; })}</div>;
            if (it.kind === "thinking") return <div key={i} style={{ marginTop: 30, fontSize: 19, color: "#a35cf0", opacity: a }}>Thinking...</div>;
            return <div key={i} style={{ marginTop: 14, fontSize: 19, lineHeight: 1.5, color: INK, opacity: a }}>{it.text}</div>;
          })}
        </div>
      </div>
      {status === "generating" ? <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 22px 6px", fontSize: 18, color: INK, background: "#fafafb", borderTop: `1px solid ${HAIR}` }}><span>Generating...</span><Spinner /></div> : null}
      <div style={{ margin: "6px 16px 16px", minHeight: 150, borderRadius: 14, border: `2px solid ${status === "generating" ? "#d9dbe3" : INK}`, padding: "16px 18px", fontSize: 18, color: typing ? INK : "#9aa0ac", position: "relative", lineHeight: 1.45 }}>
        {typing ? <span>{typing.slice(0, Math.floor(ease(f, typedFrom, typedUntil) * typing.length))}<span style={{ opacity: Math.round(f / 8) % 2 }}>▏</span></span> : "Queue a message. Sends when the agent is free..."}
        <div style={{ position: "absolute", right: 14, bottom: 12, width: 30, height: 30, borderRadius: 15, background: INK, display: "flex", alignItems: "center", justifyContent: "center" }}>{status === "generating" ? <span style={{ width: 11, height: 11, background: "#fff", borderRadius: 2 }} /> : <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 16V4M4 10l6-6 6 6" /></svg>}</div>
      </div>
    </div>
  );
};
const Spinner: React.FC = () => { const f = useCurrentFrame(); return <svg width="20" height="20" viewBox="0 0 20 20" style={{ transform: `rotate(${(f * 9) % 360}deg)` }} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round"><path d="M10 2.5a7.5 7.5 0 1 1-6.5 3.7" /></svg>; };
// the empty state before the first prompt: suggestion chips + the prompt box
export const VibeEmpty: React.FC<{ typing?: string; typedFrom?: number; typedUntil?: number }> = ({ typing, typedFrom = 0, typedUntil = 60 }) => {
  const f = useCurrentFrame(); const n = typing ? Math.floor(ease(f, typedFrom, typedUntil) * typing.length) : 0;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, borderRadius: 14, border: `1px solid ${HAIR}`, background: "#fff", fontFamily: F, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "22px 24px 8px", color: INK, fontSize: 16 }}>✕</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 60px" }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: INK }}>Start a conversation with <span style={{ color: VIBE }}>Vibe Agent</span></div>
        <div style={{ marginTop: 14, fontSize: 16, color: SUB, lineHeight: 1.5 }}>Build a new flow agent from scratch, ask questions about your flow, or request changes.</div>
      </div>
      <div style={{ display: "flex", gap: 10, padding: "0 16px 12px", overflow: "hidden" }}>{["Lead qualification", "Appointment booking", "Customer support", "Re"].map((c) => <span key={c} style={{ whiteSpace: "nowrap", fontSize: 14, color: INK, border: `1px solid ${HAIR}`, borderRadius: 999, padding: "8px 14px" }}>{c}</span>)}</div>
      <div style={{ margin: "0 16px 16px", minHeight: 150, borderRadius: 14, border: `2px solid ${INK}`, padding: "16px 18px", fontSize: 18, color: typing ? INK : "#9aa0ac", lineHeight: 1.45, position: "relative", overflow: "hidden" }}>
        {typing ? <span>{typing.slice(0, n)}<span style={{ opacity: Math.round(f / 8) % 2 }}>▏</span></span> : "Describe the agentic flow you want to build..."}
        <div style={{ position: "absolute", right: 14, bottom: 12, width: 30, height: 30, borderRadius: 15, background: n > 0 ? INK : "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 16V4M4 10l6-6 6 6" /></svg></div>
      </div>
    </div>
  );
};

// ---- the builder page: header + canvas + Vibe panel -------------------------------------
const BASE_TABS = ["Flow", "Conversation Goal", "Agent Runs", "Simulations", "Settings"];
export const FULL_TABS = ["Flow", "Conversation Goal", "Agent Runs", "Simulations", "Event Callbacks", "Settings", "Knowledge Base", "Secrets", "Tools", "Voice Configuration"];

// ---- LiveFlow: the canvas keeps changing while Vibe Agent works. `g` is a global clock across the
// prompt (0-202), plan (253-600), approve (600-791) and build (791-1027) beats, so the construction is continuous.
const Ghost: React.FC<{ x: number; y: number; w?: number; label: string; a: number; x2?: boolean }> = ({ x, y, w = 250, label, a, x2 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: 74, borderRadius: 12, border: `1.5px dashed ${x2 ? BAD : "#b9bdc9"}`, background: x2 ? "#fff6f6" : "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: F, fontSize: 13, color: x2 ? BAD : "#8a8f9c", opacity: a, transform: `scale(${0.94 + 0.06 * a})` }}>
    {x2 ? <span style={{ fontWeight: 700 }}>✕</span> : <span style={{ width: 8, height: 8, borderRadius: 4, background: VIBE, opacity: 0.8 }} />}{label}
  </div>
);
export const LiveFlow: React.FC<{ g: number }> = ({ g }) => {
  const e = (a: number, b: number) => ease(g, a, b); const on = (a: number, b: number) => g >= a && g < b;
  const typed = (t: string, a: number, b: number) => t.slice(0, Math.round(e(a, b) * t.length));
  const pop = (a: number): React.CSSProperties => ({ opacity: a, transform: `scale(${0.92 + 0.08 * a})`, transformOrigin: "50% 50%" });
  const sel = (a: number, b: number): React.CSSProperties => (on(a, b) ? { boxShadow: `0 0 0 2px ${VIBE}, 0 8px 24px rgba(155,92,246,0.25)`, borderRadius: 12 } : {});
  const pan = -50 * e(430, 470); // the canvas pans up as the flow grows
  const badge = (a: number) => (g >= a ? <div style={{ position: "absolute", right: -8, top: -8, width: 22, height: 22, borderRadius: 11, background: OK, color: "#fff", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", ...pop(e(a, a + 8)) }}>✓</div> : null);
  const thinking = g >= 180 && g < 262;
  return (
    <div style={{ position: "absolute", left: 215, top: 110 + pan, width: 700, height: 560, fontFamily: F }}>
      {/* placeholder while the prompt is typed */}
      {g < 180 ? <div style={{ position: "absolute", left: 250, top: 240, display: "flex", alignItems: "center", gap: 10, padding: "0 30px", height: 78, borderRadius: 14, border: `1.5px dashed #cfd2da`, background: "#fff", fontSize: 18, color: "#8a8f9c" }}><span style={{ width: 18, height: 18, borderRadius: 9, border: "1.5px solid #8a8f9c", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>+</span> Select Trigger</div> : null}
      {thinking ? <Ghost x={195} y={40} label="Reading the prompt…" a={e(180, 192)} /> : null}
      {/* edges */}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1100} height={800} fill="none" strokeWidth="1.5" strokeDasharray="5 5">
        <path d="M 320 118 V 246" stroke={g >= 800 ? OK : "#c4c7d0"} strokeDasharray={g >= 800 ? "0" : "5 5"} style={{ opacity: e(300, 318) }} />
        <path d="M 320 330 V 372 H 155 V 420" stroke={g >= 800 ? OK : "#c4c7d0"} strokeDasharray={g >= 800 ? "0" : "5 5"} style={{ opacity: g >= 520 ? 1 : 0 }} />
        <path d="M 320 372 H 520 V 420" stroke={g >= 800 ? OK : "#c4c7d0"} strokeDasharray={g >= 800 ? "0" : "5 5"} style={{ opacity: g >= 520 ? 1 : 0 }} />
      </svg>
      {/* trigger */}
      {g >= 262 ? <div style={{ ...pop(e(262, 274)), position: "absolute", left: 195, top: 40, width: 250, ...sel(262, 300), ...sel(800, 830) }}><Node x={0} y={0} tag="TRIGGER" icon="call" title="Voice Call" sub="Triggers when an incoming call is received on your number" />{badge(960)}</div> : null}
      {/* voice node: ghost → drafted → named */}
      {on(300, 340) ? <Ghost x={195} y={248} label="Drafting the voice agent…" a={e(300, 312)} /> : null}
      {g >= 340 ? <div style={{ ...pop(e(340, 352)), position: "absolute", left: 195, top: 248, width: 250, ...sel(340, 420), ...sel(830, 862) }}><Node x={0} y={0} icon="voice" title={typed("Elise Reception", 346, 372) || "Voice agent"} sub={g < 380 ? "…" : typed("Understands customer queries and extracts key details", 380, 410)} foot={g >= 412 ? "ELISE RECEPTION" : undefined} />{badge(972)}</div> : null}
      {/* first plan: transfer + booking (ghosts) → after the change: message + call closed */}
      {on(470, 740) ? <Ghost x={30} y={422} label={g >= 700 ? "Transfer to Sarah" : "Transfer to Sarah"} a={e(470, 482) * (g >= 720 ? 1 - e(720, 740) : 1)} x2={g >= 700} /> : null}
      {on(486, 736) ? <Ghost x={395} y={422} label="Book appointment (Cal)" a={e(486, 498) * (g >= 716 ? 1 - e(716, 736) : 1)} x2={g >= 700} /> : null}
      {g >= 740 ? <div style={{ ...pop(e(740, 752)), position: "absolute", left: 30, top: 422, width: 250, ...sel(740, 770), ...sel(894, 924) }}><Node x={0} y={0} icon="end" title="Call Closed" sub="Ends the current conversation" foot="CALL CLOSED" />{badge(996)}</div> : null}
      {g >= 764 ? <div style={{ ...pop(e(764, 776)), position: "absolute", left: 395, top: 422, width: 250, ...sel(764, 794), ...sel(862, 894) }}><Node x={0} y={0} icon="end" title="Message Recorded" sub="Ends the current conversation" foot="MESSAGE RECORDED" />{badge(984)}</div> : null}
      {/* edge labels appear when the outcomes get wired */}
      <div style={{ position: "absolute", left: 118, top: 384, fontSize: 11, color: SUB, background: "#fff", padding: "0 4px", opacity: e(900, 912) }}>Call Closed ✎</div>
      <div style={{ position: "absolute", left: 480, top: 384, fontSize: 11, color: SUB, background: "#fff", padding: "0 4px", opacity: e(906, 918) }}>Message Captured ✎</div>
      {/* a small status chip on the canvas */}
      {g >= 180 && g < 1010 ? <div style={{ position: "absolute", left: -180, top: -80, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, color: VIBE, background: "#f4efff", borderRadius: 999, padding: "6px 12px", opacity: e(180, 192) }}><span style={{ width: 8, height: 8, borderRadius: 4, background: VIBE }} />{g < 262 ? "Vibe Agent is reading your prompt" : g < 470 ? "Vibe Agent is drafting the flow" : g < 700 ? "Waiting for your answer" : g < 800 ? "Updating the flow" : g < 960 ? "Configuring nodes" : "Verifying outcomes"}</div> : null}
      {g >= 1010 ? <div style={{ position: "absolute", left: -180, top: -80, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, color: OK, background: "#e7f8ee", borderRadius: 999, padding: "6px 12px", ...pop(e(1010, 1020)) }}>✓ Flow ready</div> : null}
    </div>
  );
};

export const BuilderPage: React.FC<{ name: string; status: "Unsaved" | "Draft" | "Active"; tabs?: string[]; active?: string; built?: boolean; zoom?: string; reveal?: number; step?: number; from?: number; upto?: number; flow?: React.ReactNode; panel: React.ReactNode; children?: React.ReactNode }> = ({ name, status, tabs = BASE_TABS, active = "Flow", built, zoom, step, from, upto, reveal, flow, panel, children }) => (
  <NewConsoleShell activeNav="Agents" topBar="live" rail="collapsed">
    <AgentHeader name={name} status={status} tabs={tabs} active={active} saved={status !== "Unsaved"} />
    <div style={{ position: "absolute", left: 92, top: 214, width: 1078, height: 812 }}><FlowCanvas built={built} zoom={zoom} reveal={reveal} step={step} from={from} upto={upto}>{flow}</FlowCanvas></div>
    <div style={{ position: "absolute", left: 1180, top: 214, width: 728, height: 812 }}>{panel}</div>
    {children}
  </NewConsoleShell>
);

// ---- simulations tab + transcript drawer ----------------------------------------------------
export const SIM_ROWS: [string, "Achieved" | "Not Achieved", "High" | "Medium"][] = [["Reject Cold Sales Call", "Not Achieved", "High"], ["Honor Do Not Contact", "Not Achieved", "High"], ["Hostile Message Refusal", "Not Achieved", "High"], ["Clarify Contact Details", "Not Achieved", "High"], ["Bot Question Message", "Achieved", "High"], ["Deflect Pricing Question", "Achieved", "High"], ["Urgent Frustrated Client", "Achieved", "Medium"], ["Clarify Vague Inquiry", "Not Achieved", "High"]];
const Pill: React.FC<{ ok: boolean; children: React.ReactNode }> = ({ ok, children }) => <span style={{ fontSize: 14, fontWeight: 600, color: ok ? OK : BAD, background: ok ? "#e7f8ee" : "#fdecec", borderRadius: 6, padding: "6px 10px" }}>{children}</span>;
export const SimulationsTable: React.FC<{ rows?: typeof SIM_ROWS; highlight?: string; width?: number; revealFrom?: number }> = ({ rows = SIM_ROWS, highlight, width = 1040, revealFrom }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width, fontFamily: F }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{ display: "flex", background: "#f1f2f4", borderRadius: 10, padding: 4 }}>{["Test Scenarios", "Simulation Results", "Keywords"].map((t, i) => <span key={t} style={{ padding: "9px 20px", borderRadius: 8, fontSize: 15, fontWeight: 600, color: i === 1 ? INK : SUB, background: i === 1 ? "#fff" : "transparent", boxShadow: i === 1 ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>{i === 2 ? "⊕ " : ""}{t}</span>)}</div>
        <span style={{ flex: 1 }} /><span style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 42, padding: "0 16px", border: `1px solid ${HAIR}`, borderRadius: 10, fontSize: 15, fontWeight: 600, color: INK }}><Ico name="download" size={16} /> Download JSON</span>
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ width: 46, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, paddingTop: 8 }}><span style={{ color: SUB }}>»</span><span style={{ width: 30, height: 30, borderRadius: 7, background: INK, color: "#fff", fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>1</span></div>
        <div style={{ flex: 1, border: `1px solid ${HAIR}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ display: "flex", padding: "16px 18px", fontSize: 15, fontWeight: 600, color: INK, borderBottom: `1px solid ${HAIR}` }}><span style={{ flex: 2.4 }}>Test Scenarios</span><span style={{ flex: 1.6 }}>Goal Status</span><span style={{ flex: 1.6 }}>Conversation Quality</span><span style={{ flex: 1 }}>Debug</span></div>
          {rows.map(([n, st, q], i) => { const vis = revealFrom == null || f >= revealFrom + i * 6; return (
            <div key={n} style={{ display: "flex", alignItems: "center", padding: "0 18px", height: 68, fontSize: 16, color: INK, borderBottom: `1px solid ${HAIR}`, background: n === highlight ? "#f4f5f7" : "#fff" }}>
              <span style={{ flex: 2.4 }}>{n}</span><span style={{ flex: 1.6, opacity: vis ? 1 : 0 }}><Pill ok={st === "Achieved"}>{st}</Pill></span><span style={{ flex: 1.6, fontSize: 15, fontWeight: 600, color: q === "High" ? OK : "#d97706", opacity: vis ? 1 : 0 }}>{q}</span><span style={{ flex: 1 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1px solid ${HAIR}`, borderRadius: 8, padding: "7px 12px", fontSize: 14, fontWeight: 600 }}>‹/› JSON ⌄</span></span>
            </div>); })}
        </div>
      </div>
    </div>
  );
};
export const TRANSCRIPT: [string, string][] = [["Agent", "Thanks for that. Just to confirm, your number is 7 1 8, 5 5 5, 0 1 6 3. Is that correct?"], ["User", "Yes, that's correct."], ["Agent", "Great, thank you. Would you like to provide an email address for Sarah, or is phone best?"], ["User", "Phone is best. Also, do projects usually take long?"], ["Agent", "I don't have details on timelines, but Sarah can talk through that with you. To make sure your message is clear, you're asking about project pricing and technical scope, and you'd like to know how long projects usually take. Is there anything important you'd like me to add for Sarah?"], ["User", "No, that's all. Phone is best."], ["Agent", "Evan, your message is recorded for Sarah. She'll call you back soon to discuss your questions. Thank you for calling, goodbye!"]];
export const TranscriptDrawer: React.FC<{ title?: string; lines?: [string, string][]; width?: number; height?: number; goal?: string; linesFrom?: number }> = ({ title = "Deflect Pricing Question", lines = TRANSCRIPT, width = 560, height = 812, goal = "Message ready for Sarah", linesFrom }) => { const f = useCurrentFrame(); return (
  <div style={{ width, height, borderLeft: `1px solid ${HAIR}`, background: "#fff", fontFamily: F, display: "flex", flexDirection: "column", overflow: "hidden" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 22px 0" }}><span style={{ fontSize: 19, fontWeight: 600, color: INK }}>{title}</span><span style={{ fontSize: 13, fontWeight: 600, color: OK, background: "#e7f8ee", borderRadius: 6, padding: "4px 9px" }}>Smoke</span><span style={{ marginLeft: "auto", color: INK, fontSize: 18 }}>✕</span></div>
    <div style={{ display: "flex", gap: 0, padding: "18px 22px 0", borderBottom: `1px solid ${HAIR}` }}>{["Transcript", "Scenario"].map((t, i) => <span key={t} style={{ padding: "0 4px 12px", marginRight: 24, fontSize: 17, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? INK : SUB, borderBottom: i === 0 ? `2px solid ${INK}` : "2px solid transparent" }}>{t}</span>)}</div>
    <div style={{ padding: "16px 22px", fontSize: 16, lineHeight: 1.5, color: INK }}>
      {lines.map(([w, t], i) => <div key={i} style={{ marginBottom: 12, opacity: linesFrom == null ? 1 : ease(f, linesFrom + i * 22, linesFrom + i * 22 + 8) }}><b>{w}:</b> {t}</div>)}
      <div style={{ marginTop: 6, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 10, background: "#f4f5f7", fontSize: 15, fontWeight: 600 }}><span>Extracted Variables ⓘ</span><span>›</span></div>
      <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 10, border: "1.5px dashed #cfd2da", fontSize: 15, color: SUB }}>Chosen path: <b style={{ color: INK }}>Message Captured</b></div>
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 10, background: "#f4f5f7", fontSize: 15, fontWeight: 600 }}><span>Eval Results</span><span>›</span></div>
      <div style={{ marginTop: 18, fontSize: 15, fontWeight: 600, color: INK }}>⌄ Goal Results</div>
      <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", padding: "12px 14px", borderRadius: 10, border: `1px solid ${HAIR}`, fontSize: 15 }}><span>{goal}</span><span style={{ color: OK, fontWeight: 600 }}>Achieved</span></div>
    </div>
  </div>
); };
export const SimulationsPage: React.FC<{ name: string; drawer?: boolean; highlight?: string; panel?: React.ReactNode; revealFrom?: number; linesFrom?: number; rows?: typeof SIM_ROWS }> = ({ name, drawer, highlight, panel, revealFrom, linesFrom, rows }) => (
  <NewConsoleShell activeNav="Agents" topBar="live" rail="collapsed">
    <AgentHeader name={name} status="Draft" tabs={FULL_TABS} active="Simulations" saved />
    <div style={{ position: "absolute", left: 92, top: 214, width: 1816, height: 812, borderRadius: 14, border: `1px solid ${HAIR}`, background: "#fff", overflow: "hidden", display: "flex" }}>
      <div style={{ padding: "18px 22px", flex: 1 }}><SimulationsTable rows={rows} highlight={highlight} width={drawer ? 1180 : panel ? 1050 : 1760} revealFrom={revealFrom} /></div>
      {drawer ? <TranscriptDrawer linesFrom={linesFrom} /> : null}
      {panel ? <div style={{ width: 700, position: "relative", margin: 12 }}>{panel}</div> : null}
    </div>
  </NewConsoleShell>
);

// ---- Voice Configuration -----------------------------------------------------------------
export const VOICES: [string, string][] = [["Elise", "A warm and approachable voice suited to customer support."], ["Sarah", "Clear and confident. Fits sales and onboarding calls."], ["Rachel", "Calm and friendly. Ideal for appointment reminders."], ["Emily", "Bright and upbeat, good for retail and hospitality."], ["Charlotte", "Measured and professional, suited to finance and legal."], ["Bella", "Soft and patient. Works well for healthcare intake."]];
const Radio: React.FC<{ on?: boolean; children: React.ReactNode }> = ({ on, children }) => <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 17, color: INK }}><span style={{ width: 18, height: 18, borderRadius: 9, border: `1.5px solid ${on ? INK : "#b4b8c2"}`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{on ? <span style={{ width: 9, height: 9, borderRadius: 5, background: INK }} /> : null}</span>{children}</div>;
const Label: React.FC<{ children: React.ReactNode; info?: boolean }> = ({ children, info }) => <div style={{ marginTop: 22, marginBottom: 8, fontSize: 15, fontWeight: 600, color: INK }}>{children}{info ? <span style={{ marginLeft: 6, color: "#9aa0ac", fontWeight: 400 }}>ⓘ</span> : null}</div>;
export const VoiceConfigCard: React.FC<{ voice: string; speed: number; listOpen?: boolean; hover?: string; width?: number }> = ({ voice, speed, listOpen, hover, width = 1080 }) => (
  <div style={{ position: "relative", width, borderRadius: 14, border: `1px solid ${HAIR}`, background: "#fff", padding: "26px 30px 30px", fontFamily: F }}>
    <div style={{ display: "flex", alignItems: "flex-start" }}><div><div style={{ fontSize: 18, fontWeight: 700, color: INK }}>Language, voice & pronunciations settings</div><div style={{ marginTop: 6, fontSize: 14.5, color: SUB }}>Customise how the AI Agent speaks during a call. These apply only to call conversation blocks.</div></div><span style={{ marginLeft: "auto", color: "#9aa0ac" }}>⌃</span></div>
    <Label>Language</Label>
    <div style={{ height: 46, borderRadius: 10, border: `1px solid ${HAIR}`, display: "flex", alignItems: "center", padding: "0 12px" }}><span style={{ fontSize: 14, background: "#f1f2f4", borderRadius: 6, padding: "6px 10px" }}>English (US) <span style={{ color: SUB }}>✕</span></span><span style={{ marginLeft: "auto", color: "#9aa0ac" }}>⌄</span></div>
    <Label>Voice Model</Label>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}><Radio on>Higher Speech Accuracy, Higher Latency</Radio><Radio>High Speech Accuracy, Lower Latency</Radio></div>
    <Label>Voice</Label>
    <div style={{ position: "relative" }}>
      <div style={{ height: 48, borderRadius: 10, border: `1.5px solid ${listOpen ? INK : HAIR}`, display: "flex", alignItems: "center", gap: 12, padding: "0 14px", fontSize: 16, color: voice ? INK : "#9aa0ac" }}><span style={{ width: 22, height: 22, borderRadius: 11, background: INK, color: "#fff", fontSize: 10, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>▶</span>{voice || "Select a voice"}<span style={{ marginLeft: "auto", color: "#9aa0ac" }}>✕</span></div>
      {listOpen ? <div style={{ position: "absolute", left: 0, right: 0, top: 56, zIndex: 3, borderRadius: 12, border: `1px solid ${HAIR}`, background: "#fff", boxShadow: "0 18px 50px rgba(15,17,23,0.16)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "10px 18px 0", gap: 26, fontSize: 15, fontWeight: 600, borderBottom: `1px solid ${HAIR}` }}>{["Male", "Female", "Custom"].map((t) => <span key={t} style={{ padding: "6px 2px 10px", color: t === "Female" ? INK : SUB, borderBottom: t === "Female" ? `2px solid ${INK}` : "2px solid transparent" }}>{t}</span>)}<span style={{ marginLeft: "auto", fontSize: 15, fontWeight: 600, color: INK, paddingBottom: 8 }}>+ Add Custom Voice</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", fontSize: 15, color: "#9aa0ac", borderBottom: `1px solid ${HAIR}` }}><Ico name="search" size={15} /> Search...</div>
        {VOICES.map(([n, d]) => <div key={n} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 18px", background: n === hover ? "#f4f5f7" : "#fff" }}><span style={{ width: 22, height: 22, borderRadius: 11, background: INK, color: "#fff", fontSize: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>▶</span><span style={{ width: 26, height: 26, borderRadius: 13, background: "#ffe3c2", flexShrink: 0 }} /><div><div style={{ fontSize: 15.5, fontWeight: 600, color: INK }}>{n}</div><div style={{ fontSize: 13, color: SUB }}>{d}</div></div></div>)}
      </div> : null}
    </div>
    <Label info>Voice speed</Label>
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}><div style={{ flex: 1, position: "relative", height: 6, borderRadius: 3, background: "#e6e7eb" }}><div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${((speed - 0.5) / 1.5) * 100}%`, borderRadius: 3, background: INK }} /><div style={{ position: "absolute", top: -6, left: `calc(${((speed - 0.5) / 1.5) * 100}% - 9px)`, width: 18, height: 18, borderRadius: 9, background: INK, border: "3px solid #fff", boxShadow: "0 0 0 1px #c4c7d0" }} /></div><span style={{ fontSize: 15, fontWeight: 600, color: INK, width: 40 }}>{speed.toFixed(2)}</span></div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: SUB, marginTop: 8, paddingRight: 58 }}><span>Slower</span><span>Faster</span></div>
    <Label info>Background audio</Label>
    <div style={{ height: 46, borderRadius: 10, border: `1px solid ${HAIR}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 16, color: INK }}>None<span style={{ marginLeft: "auto", color: "#9aa0ac" }}>⌄</span></div>
    <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 14, fontSize: 15, fontWeight: 600, color: INK }}>Thinking sounds <span style={{ color: "#9aa0ac", fontWeight: 400 }}>ⓘ</span><span style={{ marginLeft: "auto", color: "#9aa0ac" }}>⚙</span><span style={{ width: 40, height: 22, borderRadius: 11, background: INK, position: "relative" }}><span style={{ position: "absolute", right: 3, top: 3, width: 16, height: 16, borderRadius: 8, background: "#fff" }} /></span></div>
    <div style={{ marginTop: 22, fontSize: 15, fontWeight: 600, color: INK }}>+ Add Pronunciation</div>
  </div>
);
export const VoiceConfigPage: React.FC<{ name: string; voice: string; speed: number; listOpen?: boolean; hover?: string; children?: React.ReactNode }> = ({ name, voice, speed, listOpen, hover, children }) => (
  <NewConsoleShell activeNav="Agents" topBar="live" rail="collapsed">
    <AgentHeader name={name} status="Draft" tabs={FULL_TABS} active="Voice Configuration" saved />
    <div style={{ position: "absolute", left: 92, top: 214 }}><VoiceConfigCard voice={voice} speed={speed} listOpen={listOpen} hover={hover} /></div>
    {children}
  </NewConsoleShell>
);

// ---- Configure Number modal ---------------------------------------------------------------
export const AGENT_LIST = ["Call Scheduling Agent"]; // only the agent this video builds
export const ConfigureNumberModal: React.FC<{ number?: string; place?: string; dropdownOpen?: boolean; picked?: string; hover?: string }> = ({ number = "+1 806 209 0453", place = "Texas, United States", dropdownOpen, picked, hover = "Call Scheduling Agent" }) => (
  <div style={{ position: "absolute", left: 1170, top: 16, width: 730, height: 1048, borderRadius: 18, background: "#fff", boxShadow: "0 30px 90px rgba(15,17,23,0.28)", padding: "30px 34px", fontFamily: F, color: INK }}>
    <div style={{ display: "flex", alignItems: "center" }}><span style={{ fontSize: 24, fontWeight: 700 }}>Configure Number</span><span style={{ marginLeft: "auto", fontSize: 20, color: INK }}>✕</span></div>
    <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 14 }}><span style={{ width: 38, height: 26, borderRadius: 4, background: "linear-gradient(#b22234 0 50%, #fff 50%)", position: "relative", overflow: "hidden" }}><span style={{ position: "absolute", left: 0, top: 0, width: 16, height: 14, background: "#3c3b6e" }} /></span><div><div style={{ fontSize: 17, fontWeight: 600 }}>{number}</div><div style={{ fontSize: 14, color: SUB }}>{place}</div></div></div>
    <div style={{ marginTop: 22, fontSize: 16, fontWeight: 600 }}>Number Type</div><div style={{ fontSize: 16 }}>Local</div>
    <div style={{ marginTop: 18, fontSize: 16, fontWeight: 600 }}>Capabilities</div><div style={{ marginTop: 8, display: "flex", gap: 8 }}>{["Voice", "SMS", "MMS"].map((c) => <span key={c} style={{ fontSize: 14, fontWeight: 600, background: "#f1f2f4", borderRadius: 6, padding: "5px 10px" }}>{c}</span>)}</div>
    <div style={{ marginTop: 18, fontSize: 15, fontWeight: 600 }}>Alias</div><div style={{ marginTop: 8, height: 46, borderRadius: 10, border: `1px solid ${HAIR}` }} />
    <div style={{ marginTop: 18, fontSize: 15, fontWeight: 600 }}>Application Type</div>
    <div style={{ marginTop: 10, display: "flex", gap: 34 }}><Radio on>AI Agents</Radio><Radio>Application</Radio><Radio>SIP Trunk</Radio></div>
    <div style={{ marginTop: 18, fontSize: 15, fontWeight: 600 }}>Associated Call Agent Flow (Optional)</div>
    <div style={{ position: "relative" }}>
      <div style={{ marginTop: 8, height: 48, borderRadius: 10, border: `1.5px solid ${dropdownOpen ? INK : HAIR}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 16, color: picked ? INK : "#9aa0ac" }}>{picked || "Select call agent"}<span style={{ marginLeft: "auto", color: "#9aa0ac" }}>{picked ? "✕" : "⌄"}</span></div>
      {dropdownOpen ? <div style={{ position: "absolute", left: 0, right: 0, top: 62, borderRadius: 12, border: `1px solid ${HAIR}`, background: "#fff", boxShadow: "0 18px 50px rgba(15,17,23,0.16)", overflow: "hidden", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", fontSize: 15, color: "#9aa0ac", borderBottom: `1px solid ${HAIR}` }}><Ico name="search" size={15} /> Search...</div>
        {AGENT_LIST.map((a) => <div key={a} style={{ padding: "11px 16px", fontSize: 15.5, color: INK, background: a === hover ? "#f4f5f7" : "#fff" }}>{a}</div>)}
      </div> : null}
    </div>
    <div style={{ marginTop: 18, fontSize: 15, fontWeight: 600 }}>Associated Message Agent Flow (Optional)</div><div style={{ marginTop: 8, height: 48, borderRadius: 10, border: `1px solid ${HAIR}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 16, color: "#9aa0ac" }}>Select message agent<span style={{ marginLeft: "auto" }}>⌄</span></div>
    <div style={{ marginTop: 18, fontSize: 15, fontWeight: 600 }}>Sub Account</div><div style={{ marginTop: 8, height: 48, borderRadius: 10, border: `1px solid ${HAIR}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 16, color: "#9aa0ac" }}>Select sub account<span style={{ marginLeft: "auto" }}>⌄</span></div>
    <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 600 }}><span style={{ width: 40, height: 22, borderRadius: 11, background: "#e6e7eb", position: "relative" }}><span style={{ position: "absolute", left: 3, top: 3, width: 16, height: 16, borderRadius: 8, background: "#fff" }} /></span>CNAM Lookup <span style={{ color: "#9aa0ac", fontWeight: 400 }}>ⓘ</span></div>
    <div style={{ position: "absolute", left: 34, right: 34, bottom: 30, display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 15, fontWeight: 600, color: BAD, border: `1px solid ${BAD}`, borderRadius: 10, padding: "12px 18px" }}>Delete Number</span><span style={{ fontSize: 15, fontWeight: 600, color: "#fff", background: INK, borderRadius: 10, padding: "12px 18px" }}>Save changes</span></div>
  </div>
);

// ---- Ask Buddy panel ----------------------------------------------------------------------
export const BUDDY_ANSWER: React.ReactNode = <>To connect a phone number to your AI voice agent:<br /><br />1. Open your agent flow in <u>AI Agents</u>.<br />2. Add the <b>"When a call is received"</b> trigger under Incoming Call.<br />3. Publish the agent.<br />4. Go to <u>Phone Numbers</u>, open your number, choose <b>AI Agents</b> as the application type, and pick your agent under Associated Call Agent Flow.<br /><br />Inbound calls to that number will now reach your agent.</>;
export const BuddyPanel: React.FC<{ typing?: string; typedFrom?: number; typedUntil?: number; sentAt?: number; answerAt?: number; answer?: React.ReactNode }> = ({ typing = "", typedFrom = 0, typedUntil = 60, sentAt = 9999, answerAt = 9999, answer = BUDDY_ANSWER }) => {
  const f = useCurrentFrame(); const sent = f >= sentAt; const n = sent ? 0 : Math.floor(ease(f, typedFrom, typedUntil) * typing.length);
  return (
    <div style={{ position: "absolute", left: 1360, top: 0, width: 560, height: 1080, background: "#fff", borderLeft: `1px solid ${HAIR}`, boxShadow: "-16px 0 34px rgba(20,18,40,0.06)", display: "flex", flexDirection: "column", fontFamily: F }}>
      <div style={{ display: "flex", alignItems: "center", padding: "18px 24px", borderBottom: `1px solid ${HAIR}` }}><span style={{ fontSize: 18, fontWeight: 700, color: INK }}>Ask Buddy</span><span style={{ flex: 1 }} /><span style={{ color: "#9aa0ac", fontSize: 16, letterSpacing: 6 }}>✎›</span></div>
      <div style={{ flex: 1, padding: "26px 26px 0", overflow: "hidden" }}>
        {!sent ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: 30 }}>
          <Img src={staticFile("kit/buddy.png")} style={{ width: 130, height: 156, objectFit: "cover" }} />
          <div style={{ marginTop: 18, fontSize: 20, fontWeight: 700, color: INK }}>Hi, I'm Buddy!</div>
          <div style={{ marginTop: 8, fontSize: 15, color: SUB }}>Ask me anything about Plivo products and services.</div>
          <div style={{ marginTop: 6, fontSize: 13, color: "#9aa0ac" }}>Tip: You can open and close Buddy with <span style={{ border: `1px solid ${HAIR}`, borderRadius: 4, padding: "0 5px" }}>⌘</span> <span style={{ border: `1px solid ${HAIR}`, borderRadius: 4, padding: "0 5px" }}>I</span></div>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>{["How do I send an SMS with Plivo?", "How do I make an outbound call?", "How do I configure a phone number?", "How do I build a voice agent?"].map((q) => <span key={q} style={{ fontSize: 14.5, color: INK, border: `1px solid ${HAIR}`, borderRadius: 999, padding: "9px 16px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>{q}</span>)}</div>
        </div> : <>
          <div style={{ display: "flex", justifyContent: "flex-end" }}><div style={{ background: "#f1f2f4", color: INK, borderRadius: "12px 12px 3px 12px", padding: "12px 16px", fontSize: 15.5, maxWidth: 400 }}>{typing}</div></div>
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>{["Searched docs", "Searched docs"].map((s, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: "#9aa0ac", fontSize: 13.5, opacity: ease(f, sentAt + 10 + i * 10, sentAt + 16 + i * 10) }}><span style={{ color: OK }}>✓</span> {s}</div>)}</div>
          {f >= answerAt ? <div style={{ marginTop: 16, fontSize: 15.5, lineHeight: 1.55, color: INK, opacity: ease(f, answerAt, answerAt + 10) }}>{answer}</div> : null}
        </>}
      </div>
      <div style={{ padding: "14px 20px 20px" }}><div style={{ minHeight: 92, borderRadius: 12, border: `1px solid ${HAIR}`, padding: "12px 14px", fontSize: 15, color: n > 0 ? INK : "#9aa0ac", position: "relative", lineHeight: 1.45 }}>{n > 0 ? <>{typing.slice(0, n)}<span style={{ opacity: Math.round(f / 8) % 2 }}>▏</span></> : "What would you like to know?"}<div style={{ position: "absolute", left: 14, bottom: 10, color: "#9aa0ac", fontSize: 13, letterSpacing: 4 }}>⊕ ⊡ ☺</div><div style={{ position: "absolute", right: 12, bottom: 10, display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#9aa0ac" }}>{n} / 1000 <span style={{ width: 26, height: 26, borderRadius: 6, background: INK, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>↵</span></div></div></div>
    </div>
  );
};

// ---- publish: the click, the toast, the status flip ----------------------------------------
export const PublishFx: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame(); if (f < at - 12) return null; const t = f - at;
  return (
    <>
      {t < 0 ? <div style={{ position: "absolute", left: 1836 - 24, top: 98 - 24, width: 48, height: 48, borderRadius: 24, border: `3px solid ${VIBE}`, opacity: ease(f, at - 12, at), pointerEvents: "none" }} /> : null}
      {t >= 0 ? <div style={{ position: "absolute", left: 1836 - 22 - t * 3, top: 98 - 22 - t * 3, width: 44 + t * 6, height: 44 + t * 6, borderRadius: 999, border: `3px solid ${VIBE}`, opacity: Math.max(0, 1 - t / 30), pointerEvents: "none" }} /> : null}
      {t >= 18 ? <div style={{ position: "absolute", right: 40, top: 212, display: "flex", alignItems: "center", gap: 12, background: "#fff", border: `1px solid ${HAIR}`, borderLeft: `4px solid ${OK}`, borderRadius: 12, padding: "16px 20px", boxShadow: "0 16px 40px rgba(15,17,23,0.14)", fontFamily: F, opacity: ease(f, at + 18, at + 28) }}><span style={{ color: OK, fontSize: 18 }}>✓</span><div><div style={{ fontSize: 16, fontWeight: 700, color: INK }}>Success</div><div style={{ fontSize: 14.5, color: SUB }}>Agent published successfully</div></div></div> : null}
    </>
  );
};
