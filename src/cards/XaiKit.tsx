import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { INTER_FAMILY } from "../fonts";

// ============================================================================
// Recreated xAI console (dark) for the Grok voice-agent video: Voice Agents page with
// the "Build a voice agent" modal, the agent page (Configuration / Deployment), the
// "New phone number" modal (Direct SIP). Built from frames of the recording; no account
// details (balance, team, avatar photo) are reproduced. All state is props.
// ============================================================================
const F = `${INTER_FAMILY}, sans-serif`; const BG = "#0a0a0a", PANEL = "#141414", LINE = "#262626", TEXT = "#f2f2f2", MUTED = "#8a8a8a", CHIP = "#1f1f1f";
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const XMark: React.FC<{ size?: number }> = ({ size = 22 }) => <svg width={size} height={size * 1.1} viewBox="0 0 466 517" fill={TEXT}><polygon points="0.12 182.71 234.14 516.92 338.15 516.92 104.13 182.71 0.12 182.71" /><polygon points="0 516.92 104.08 516.92 156.08 442.67 104.04 368.34 0 516.92" /><polygon points="466.04 0 361.96 0 182.1 256.86 234.15 331.18 466.04 0" /><polygon points="380.78 516.92 466.04 516.92 466.04 37.16 380.78 158.92 380.78 516.92" /></svg>;
const NAV: [string, string[]][] = [["", ["Dashboard", "API Keys", "Models", "Usage", "Logs"]], ["API", ["Code", "Chat", "Image", "Video", "Voice Agents", "Voice", "Storage", "Batches"]], ["Platforms", ["Grok Business"]]];
export const XaiShell: React.FC<{ active?: string; children: React.ReactNode }> = ({ active = "Voice Agents", children }) => (
  <div style={{ width: "100%", height: "100%", background: BG, color: TEXT, fontFamily: F, display: "flex", position: "relative", overflow: "hidden" }}>
    <div style={{ width: 236, borderRight: `1px solid ${LINE}`, padding: "22px 18px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><XMark /><span style={{ color: MUTED }}>⌕</span></div>
      <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 10, fontSize: 14, padding: "0 4px" }}><span style={{ width: 20, height: 20, borderRadius: 5, background: CHIP, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: MUTED }}>V</span>Voice-Agents<span style={{ marginLeft: "auto", color: MUTED }}>⌃⌄</span></div>
      {NAV.map(([sec, items]) => <div key={sec || "top"} style={{ marginTop: sec ? 26 : 22 }}>{sec ? <div style={{ fontSize: 12, color: MUTED, padding: "0 6px 8px" }}>{sec}</div> : null}{items.map((it) => <div key={it} style={{ display: "flex", alignItems: "center", gap: 12, height: 34, padding: "0 8px", borderRadius: 6, fontSize: 14, color: it === active ? TEXT : "#c4c4c4", background: it === active ? CHIP : "transparent" }}><span style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${it === active ? TEXT : "#5a5a5a"}` }} />{it}{it === "Voice Agents" ? <span style={{ marginLeft: "auto", fontSize: 11, color: "#e5484d" }}>Beta</span> : null}{it === "Grok Business" ? <span style={{ marginLeft: "auto", color: MUTED }}>↗</span> : null}</div>)}</div>)}
    </div>
    <div style={{ flex: 1, position: "relative", padding: "38px 44px" }}>{children}</div>
  </div>
);
export const TEMPLATES: [string, string, string][] = [["🎧", "Customer Support", "Answer questions, resolve issues, and route calls to the right team."], ["📈", "Lead Qualification", "Ask a few questions and qualify inbound leads before handoff."], ["📅", "Appointment Scheduling", "Book, reschedule and confirm appointments over the phone."], ["🧾", "Order Status", "Look up orders and give callers a clear status update."], ["🙋", "Front Desk", "Greet callers, take messages and answer common questions."]];
export const VoiceAgentsPage: React.FC<{ hover?: string; modal?: React.ReactNode }> = ({ hover, modal }) => (
  <XaiShell>
    <div style={{ fontSize: 30, fontWeight: 600 }}>Voice Agents</div>
    <div style={{ marginTop: 8, fontSize: 15, color: MUTED }}>Build, configure and deploy voice agents that can talk to your users over the phone.</div>
    <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 12 }}><div style={{ flex: 1, height: 42, borderRadius: 8, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 14, color: MUTED }}>⌕ Search agents…</div><div style={{ height: 42, borderRadius: 8, background: TEXT, color: BG, display: "flex", alignItems: "center", padding: "0 16px", fontSize: 14, fontWeight: 600 }}>Create agent <span style={{ marginLeft: 10 }}>⌄</span></div></div>
    <div style={{ marginTop: 34, fontSize: 15, color: MUTED }}>Get started with a template</div>
    <div style={{ marginTop: 14, borderTop: `1px solid ${LINE}` }}>{TEMPLATES.map(([ic, t, d]) => <div key={t} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 12px", borderBottom: `1px solid ${LINE}`, background: t === hover ? CHIP : "transparent", borderRadius: 8 }}><span style={{ width: 34, height: 34, borderRadius: 17, background: CHIP, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{ic}</span><div><div style={{ fontSize: 15, fontWeight: 600 }}>{t}</div><div style={{ fontSize: 13.5, color: MUTED, marginTop: 3 }}>{d}</div></div><span style={{ marginLeft: "auto", color: MUTED }}>Try ›</span></div>)}</div>
    {modal ? <><div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />{modal}</> : null}
  </XaiShell>
);
export type Chat = { at: number; who: "you" | "bot" | "thinking"; text?: string };
export const BuildModal: React.FC<{ chat: Chat[]; typing?: string; typedFrom?: number; typedUntil?: number; card?: boolean; cardAt?: number }> = ({ chat, typing = "", typedFrom = 0, typedUntil = 60, card, cardAt = 0 }) => {
  const f = useCurrentFrame(); const n = Math.floor(ease(f, typedFrom, typedUntil) * typing.length);
  return (
    <div style={{ position: "absolute", left: 300, top: 60, width: 1000, height: 940, borderRadius: 16, background: "#161616", border: `1px solid ${LINE}`, boxShadow: "0 40px 120px rgba(0,0,0,0.6)", padding: "28px 34px", fontFamily: F, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center" }}><span style={{ fontSize: 20, fontWeight: 600 }}>Build a voice agent</span><span style={{ marginLeft: "auto", fontSize: 14, border: `1px solid ${LINE}`, borderRadius: 8, padding: "7px 14px" }}>Skip</span></div>
      <div style={{ marginTop: 28, fontSize: 15.5, lineHeight: 1.55, color: "#d8d8d8", maxWidth: 860 }}>Hey! I'm here to help you set up a voice agent in just a couple of minutes. What's the use case you're building for? Describe it in your own words, or tap a template below.</div>
      <div style={{ flex: 1, marginTop: 10, display: "flex", flexDirection: "column", gap: 18, overflow: "hidden" }}>
        {chat.filter((c) => f >= c.at).map((c, i) => c.who === "you" ? <div key={i} style={{ alignSelf: "flex-end", maxWidth: 640, background: "#2a2a2a", borderRadius: 12, padding: "12px 16px", fontSize: 15.5, lineHeight: 1.5, opacity: ease(f, c.at, c.at + 8) }}>{c.text}</div> : c.who === "thinking" ? <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: MUTED, opacity: ease(f, c.at, c.at + 8) }}><span style={{ letterSpacing: 2 }}>⁙</span>Thinking</div> : <div key={i} style={{ maxWidth: 820, fontSize: 15.5, lineHeight: 1.55, color: "#d8d8d8", opacity: ease(f, c.at, c.at + 8) }}>{c.text}</div>)}
        {card && f >= cardAt ? <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 6, opacity: ease(f, cardAt, cardAt + 10) }}><span style={{ width: 36, height: 36, borderRadius: 18, background: "linear-gradient(135deg,#c084fc,#f472b6)" }} /><span style={{ fontSize: 16, fontWeight: 600 }}>Athena Pottery Support</span><span style={{ marginLeft: "auto", fontSize: 14, border: `1px solid ${LINE}`, borderRadius: 8, padding: "8px 14px" }}>View agent</span></div> : null}
      </div>
      <div style={{ height: 46, borderRadius: 10, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 15, color: n > 0 ? TEXT : MUTED }}>{n > 0 ? <>{typing.slice(0, n)}<span style={{ opacity: Math.round(f / 8) % 2 }}>▏</span></> : "Describe your agent's use case…"}<span style={{ marginLeft: "auto", width: 28, height: 28, borderRadius: 14, background: n > 0 ? TEXT : "#333", color: BG, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>↑</span></div>
    </div>
  );
};
const TABS = ["Configuration", "Speech", "Deployment", "Conversations", "Insights"];
export const AgentPage: React.FC<{ name?: string; tab: string; live?: boolean; children?: React.ReactNode; modal?: React.ReactNode; toast?: string }> = ({ name = "Athena Pottery Support", tab, live = true, children, modal, toast }) => (
  <XaiShell>
    <div style={{ fontSize: 14, color: "#c4c4c4" }}>← Back</div>
    <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 18 }}><span style={{ width: 54, height: 54, borderRadius: 27, background: "linear-gradient(135deg,#c084fc,#f472b6)" }} /><div><div style={{ fontSize: 24, fontWeight: 600 }}>{name}</div><div style={{ marginTop: 5, fontSize: 13, color: MUTED, display: "flex", alignItems: "center", gap: 10 }}>Last published a moment ago{live ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: CHIP, borderRadius: 999, padding: "3px 9px", color: TEXT }}><span style={{ width: 6, height: 6, borderRadius: 3, background: "#4ade80" }} />Live</span> : null}</div></div><span style={{ flex: 1 }} /><span style={{ fontSize: 14, border: `1px solid ${LINE}`, borderRadius: 8, padding: "9px 14px" }}>◉ Try it live</span><span style={{ marginLeft: 10, fontSize: 14, background: TEXT, color: BG, borderRadius: 8, padding: "9px 14px", fontWeight: 600 }}>Publish</span></div>
    <div style={{ marginTop: 26, display: "flex", gap: 6 }}>{TABS.map((t) => <span key={t} style={{ fontSize: 14.5, padding: "8px 12px", borderRadius: 8, background: t === tab ? CHIP : "transparent", color: t === tab ? TEXT : "#c4c4c4" }}>{t}</span>)}</div>
    <div style={{ marginTop: 26, position: "relative" }}>{children}</div>
    {modal ? <><div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />{modal}</> : null}
    {toast ? <div style={{ position: "absolute", right: 40, bottom: 40, background: "#1c1c1c", border: `1px solid ${LINE}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, maxWidth: 360, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>{toast}</div> : null}
  </XaiShell>
);
export const ConfigurationBody: React.FC = () => (
  <>
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 10, background: PANEL, border: `1px solid ${LINE}`, fontSize: 14 }}>☎ Set up a phone number to call your agent<span style={{ marginLeft: "auto", background: TEXT, color: BG, borderRadius: 8, padding: "7px 12px", fontWeight: 600 }}>Set up</span></div>
    <div style={{ marginTop: 26, display: "flex", alignItems: "center" }}><span style={{ fontSize: 14, fontWeight: 600 }}>Instructions</span><span style={{ marginLeft: "auto", fontSize: 13, color: "#c4c4c4" }}>✦ Improve with Grok</span></div>
    <div style={{ marginTop: 10, borderRadius: 10, border: `1px solid ${LINE}`, background: PANEL, padding: "18px 20px", fontSize: 13.5, lineHeight: 1.6, color: "#d8d8d8", fontFamily: "ui-monospace, Menlo, monospace", whiteSpace: "pre-wrap" }}>{`## Conversation Flow
- Greet the caller warmly.
- Ask how you can help.
- For appointment requests, collect their full name and callback number.
- Confirm the details before ending the call.
- Answer basic questions from the facts provided; say you don't know if asked something else.
- Business hours: Monday to Friday, 8 AM to 5 PM CST.

## Guardrails & Escalation
Stay in scope for pottery orders and appointments only. Do not give advice on pottery techniques, pricing, or other topics.

## Voice & Communication Style
Speak naturally in short sentences. Use the caller's name when known. Confirm details clearly.`}</div>
  </>
);
export const ConfigurationVoiceBody: React.FC = () => (
  <>
    <div style={{ display: "flex", alignItems: "center" }}><div><div style={{ fontSize: 14, fontWeight: 600 }}>Model ⓘ</div><div style={{ fontSize: 13, color: MUTED, marginTop: 3 }}>Select the voice model that powers this agent.</div></div><span style={{ marginLeft: "auto", fontSize: 13, border: `1px solid ${LINE}`, borderRadius: 8, padding: "6px 12px" }}>◉ Latest ⌄</span></div>
    <div style={{ marginTop: 24, display: "flex", alignItems: "center" }}><div><div style={{ fontSize: 14, fontWeight: 600 }}>Welcome message</div><div style={{ fontSize: 13, color: MUTED, marginTop: 3 }}>When on, the agent opens with a greeting. When off, it waits for the caller to speak.</div></div><span style={{ marginLeft: "auto", width: 40, height: 22, borderRadius: 11, background: TEXT, position: "relative" }}><span style={{ position: "absolute", right: 3, top: 3, width: 16, height: 16, borderRadius: 8, background: BG }} /></span></div>
    <div style={{ marginTop: 12, borderRadius: 10, border: `1px solid ${LINE}`, background: PANEL, padding: "16px 18px", fontSize: 14, color: "#d8d8d8", minHeight: 90 }}>Hi, thanks for calling Athena Pottery! How can I help you today?</div>
    <div style={{ marginTop: 12, display: "flex", alignItems: "center", padding: "12px 18px", borderRadius: 10, border: `1px solid ${LINE}` }}><div><div style={{ fontSize: 14, fontWeight: 600 }}>Caller can interrupt</div><div style={{ fontSize: 13, color: MUTED, marginTop: 3 }}>When on, caller speech can interrupt the opening message.</div></div><span style={{ marginLeft: "auto", width: 40, height: 22, borderRadius: 11, background: TEXT, position: "relative" }}><span style={{ position: "absolute", right: 3, top: 3, width: 16, height: 16, borderRadius: 8, background: BG }} /></span></div>
    <div style={{ marginTop: 24, display: "flex", alignItems: "center" }}><span style={{ fontSize: 14, fontWeight: 600 }}>Tools <span style={{ color: MUTED, fontWeight: 400 }}>1</span></span><span style={{ marginLeft: "auto", fontSize: 13 }}>+ Add tool</span></div>
    <div style={{ marginTop: 10, fontSize: 13.5, fontFamily: "ui-monospace, Menlo, monospace", color: "#d8d8d8" }}>⚙ end_call_athena_pottery_support</div>
  </>
);
export type NumRow = { name: string; number: string; by: string; when: string };
export const DeploymentBody: React.FC<{ rows: NumRow[]; pulseAt?: number }> = ({ rows }) => (
  <>
    <div style={{ display: "flex", alignItems: "center" }}><div><div style={{ fontSize: 15, fontWeight: 600 }}>Phone numbers</div><div style={{ fontSize: 13, color: MUTED, marginTop: 3 }}>Let users call the agent using phone numbers provisioned by SpaceXAI or other providers.</div></div><span style={{ marginLeft: "auto", fontSize: 14, background: TEXT, color: BG, borderRadius: 8, padding: "9px 14px", fontWeight: 600 }}>Add number</span></div>
    <div style={{ marginTop: 18, display: "flex", fontSize: 13, color: MUTED, padding: "0 10px 10px", borderBottom: `1px solid ${LINE}` }}><span style={{ flex: 1.4 }}>Name</span><span style={{ flex: 2 }}>Number</span><span style={{ flex: 1.4 }}>Provisioned by</span><span style={{ flex: 1.2 }}>Updated</span><span style={{ width: 30 }} /></div>
    {rows.map((r) => <div key={r.number} style={{ display: "flex", alignItems: "center", fontSize: 14.5, padding: "16px 10px", borderBottom: `1px solid ${LINE}` }}><span style={{ flex: 1.4 }}>{r.name}</span><span style={{ flex: 2 }}>{r.number}</span><span style={{ flex: 1.4 }}>{r.by}</span><span style={{ flex: 1.2, color: MUTED }}>{r.when}</span><span style={{ width: 30, color: MUTED }}>⋯</span></div>)}
    <div style={{ marginTop: 30, display: "flex", alignItems: "center" }}><div><div style={{ fontSize: 15, fontWeight: 600 }}>Post-call notifications</div><div style={{ fontSize: 13, color: MUTED, marginTop: 3 }}>No email is sent when a call ends.</div></div><span style={{ marginLeft: "auto", fontSize: 14, border: `1px solid ${LINE}`, borderRadius: 8, padding: "8px 14px" }}>Manage</span></div>
    <div style={{ marginTop: 30 }}><div style={{ fontSize: 15, fontWeight: 600 }}>Code integration</div><div style={{ fontSize: 13, color: MUTED, marginTop: 3 }}>Connect to this saved agent over the realtime Voice Agent API.</div><div style={{ marginTop: 12, display: "flex", gap: 8 }}>{["TypeScript", "Python", "Go"].map((t, i) => <span key={t} style={{ fontSize: 13, padding: "6px 12px", borderRadius: 8, background: i === 0 ? CHIP : "transparent" }}>{t}</span>)}</div></div>
  </>
);
export const PLIVO_RANGES = ["13.52.9.0/25", "216.120.187.128/26", "18.214.109.128/25", "18.215.142.0/26", "204.89.148.128/26", "3.120.121.128/26", "18.228.70.64/26", "54.233.191.0/27", "13.238.202.192/26", "18.136.1.128/26", "204.89.149.128/27", "15.207.90.192/31", "204.89.151.128/27", "204.89.151.160/27"];
export const NewNumberModal: React.FC<{ name?: string; typingName?: boolean; number?: string; typingNumber?: boolean; tab?: string; ips?: number }> = ({ name = "", typingName, number = "", typingNumber, tab = "Direct SIP", ips = 0 }) => {
  const f = useCurrentFrame(); const caret = <span style={{ opacity: Math.round(f / 8) % 2 }}>▏</span>;
  return (
    <div style={{ position: "absolute", left: 500, top: 210, width: 720, borderRadius: 14, background: "#161616", border: `1px solid ${LINE}`, boxShadow: "0 40px 120px rgba(0,0,0,0.6)", padding: "26px 28px", fontFamily: F }}>
      <div style={{ display: "flex" }}><div><div style={{ fontSize: 18, fontWeight: 600 }}>New phone number</div><div style={{ fontSize: 13.5, color: MUTED, marginTop: 4 }}>Let users call the agent using a custom phone number.</div></div><span style={{ marginLeft: "auto", color: MUTED }}>✕</span></div>
      <div style={{ marginTop: 20, display: "flex", gap: 6 }}>{["Provisioned numbers", "Direct SIP", "Twilio"].map((t) => <span key={t} style={{ fontSize: 13.5, padding: "7px 12px", borderRadius: 999, background: t === tab ? CHIP : "transparent", color: t === tab ? TEXT : "#c4c4c4" }}>{t}</span>)}</div>
      <div style={{ marginTop: 22, fontSize: 13.5, color: "#c4c4c4" }}>Name</div>
      <div style={{ marginTop: 8, height: 44, borderRadius: 8, border: `1px solid ${typingName ? TEXT : LINE}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 14.5, color: name ? TEXT : MUTED }}>{name || "Name of the phone number"}{typingName ? caret : null}</div>
      <div style={{ marginTop: 18, fontSize: 13.5, color: "#c4c4c4" }}>Phone number</div>
      <div style={{ marginTop: 8, height: 44, borderRadius: 8, border: `1px solid ${typingNumber ? TEXT : LINE}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 14.5, color: number ? TEXT : MUTED }}>{number || "+14155550123"}{typingNumber ? caret : null}</div>
      <div style={{ marginTop: 18, fontSize: 13.5, color: "#c4c4c4" }}>SIP URI ⓘ</div>
      <div style={{ marginTop: 8, height: 44, borderRadius: 8, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 14, fontFamily: "ui-monospace, Menlo, monospace", color: "#d8d8d8" }}>sip:{number ? number.replace(/[^\d+]/g, "") : "{number}"}@sip.voice.x.ai;transport=tls<span style={{ marginLeft: "auto", color: MUTED }}>⧉</span></div>
      <div style={{ marginTop: 18, display: "flex", alignItems: "center", fontSize: 13.5, color: "#c4c4c4" }}>Allowed addresses ⓘ<span style={{ marginLeft: "auto" }}>Presets ⌄</span></div>
      <div style={{ marginTop: 8, display: "flex", gap: 10 }}><div style={{ flex: 1, height: 44, borderRadius: 8, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 14, fontFamily: "ui-monospace, Menlo, monospace", color: ips > 0 ? "#d8d8d8" : MUTED }}>{ips > 0 && ips < PLIVO_RANGES.length ? PLIVO_RANGES[ips] : "203.0.113.0/24"}</div><div style={{ height: 44, borderRadius: 8, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 14 }}>+ Add</div></div>{ips > 0 ? <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>{PLIVO_RANGES.slice(0, Math.min(ips, PLIVO_RANGES.length)).map((r) => <span key={r} style={{ fontSize: 12.5, fontFamily: "ui-monospace, Menlo, monospace", background: CHIP, color: TEXT, borderRadius: 6, padding: "4px 8px" }}>{r} ✕</span>)}</div> : null}
      <div style={{ marginTop: 18, fontSize: 13.5, color: "#c4c4c4" }}>Authentication ⌄</div>
      <div style={{ marginTop: 26, display: "flex", alignItems: "center" }}><span style={{ fontSize: 13.5, border: `1px solid ${LINE}`, borderRadius: 8, padding: "8px 12px" }}>Steps for SIP providers ↗</span><span style={{ flex: 1 }} /><span style={{ fontSize: 14, border: `1px solid ${LINE}`, borderRadius: 8, padding: "9px 14px" }}>Cancel</span><span style={{ marginLeft: 10, fontSize: 14, background: number ? TEXT : "#333", color: number ? BG : MUTED, borderRadius: 8, padding: "9px 14px", fontWeight: 600 }}>Add number</span></div>
    </div>
  );
};
