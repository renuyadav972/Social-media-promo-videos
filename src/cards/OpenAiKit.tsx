import React from "react";
import { useCurrentFrame } from "remotion";
import { INTER_FAMILY } from "../fonts";

// A recreated OpenAI platform console (dark). No account details: generic project and org names.
const F = `${INTER_FAMILY}, sans-serif`;
export const OAI_BG = "#212121"; export const OAI_RAIL = "#171717"; export const OAI_INK = "#ececec"; export const OAI_SUB = "#a3a3a3"; export const OAI_HAIR = "#2f2f2f";
const NAV = ["Home", "Chat", "Agents", "Audio", "Images", "Codex", "API Keys", "Usage", "Logs", "Batches", "Storage", "Plugins", "Settings", "More"];
const Glyph: React.FC<{ i: number }> = ({ i }) => <span style={{ width: 18, height: 18, borderRadius: i % 3 === 0 ? 9 : 4, border: `1.5px solid ${OAI_SUB}`, display: "inline-block", marginRight: 12, opacity: 0.9 }} />;

export const OaiShell: React.FC<{ active: string; children: React.ReactNode }> = ({ active, children }) => (
  <div style={{ position: "absolute", inset: 0, background: OAI_BG, fontFamily: F, color: OAI_INK, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 346, background: OAI_RAIL, borderRight: `1px solid ${OAI_HAIR}` }}>
      <div style={{ display: "flex", alignItems: "center", padding: "30px 26px 22px", fontSize: 18, fontWeight: 600 }}>Default project <span style={{ marginLeft: 10, color: OAI_SUB, fontSize: 14 }}>⇅</span><span style={{ marginLeft: "auto", color: OAI_SUB, fontSize: 16 }}>▯</span></div>
      {NAV.map((n, i) => <div key={n} style={{ display: "flex", alignItems: "center", margin: "0 10px", padding: "13px 16px", borderRadius: 10, fontSize: 18, background: n === active ? "#2f2f2f" : "transparent" }}><Glyph i={i} />{n}{n === "Agents" ? <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 600, color: "#c7b2ff", background: "#3a2d5e", padding: "2px 7px", borderRadius: 5 }}>New</span> : null}</div>)}
      <div style={{ position: "absolute", left: 22, bottom: 26, display: "flex", alignItems: "center", gap: 12 }}><span style={{ width: 30, height: 30, borderRadius: 15, background: "#3b3b3b", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>W</span><span><div style={{ fontSize: 15, fontWeight: 600 }}>Workspace</div><div style={{ fontSize: 12.5, color: OAI_SUB }}>Organization</div></span></div>
    </div>
    <div style={{ position: "absolute", left: 346, top: 0, right: 0, bottom: 0 }}>{children}</div>
  </div>
);

const Tabs: React.FC<{ items: string[]; active: string }> = ({ items, active }) => <div style={{ display: "flex", gap: 26, padding: "0 32px", borderBottom: `1px solid ${OAI_HAIR}` }}>{items.map((t) => <div key={t} style={{ padding: "8px 0 12px", fontSize: 17, color: t === active ? OAI_INK : OAI_SUB, borderBottom: t === active ? `2px solid ${OAI_INK}` : "2px solid transparent" }}>{t}</div>)}</div>;

export const OaiWebhooksPage: React.FC<{ row?: boolean; url?: string }> = ({ row = true, url = "https://api.yourcompany.com/openai/webhook" }) => (
  <OaiShell active="Settings">
    <div style={{ display: "flex", alignItems: "center", padding: "24px 32px 18px" }}><span style={{ fontSize: 28, fontWeight: 600 }}>Project Settings</span><span style={{ marginLeft: "auto", display: "flex", gap: 12 }}><span style={{ fontSize: 16, fontWeight: 600, background: OAI_INK, color: "#111", padding: "10px 18px", borderRadius: 10 }}>＋ Create</span><span style={{ fontSize: 16, border: `1px solid #444`, padding: "10px 18px", borderRadius: 10 }}>Organization settings ↗</span></span></div>
    <Tabs items={["General", "Limits", "Members", "Groups", "Roles", "Webhooks", "Evaluations"]} active="Webhooks" />
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 260px 220px 140px", padding: "22px 44px 0", fontSize: 13.5, letterSpacing: 1.2, color: OAI_SUB, fontWeight: 600 }}><span>NAME</span><span>URL</span><span>EVENT TYPES</span><span>SIGNING SECRET</span><span /></div>
    {row ? <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 260px 220px 140px", alignItems: "center", padding: "26px 44px", fontSize: 17 }}><span>Voice Agent</span><span style={{ color: OAI_INK }}>{url} <span style={{ color: OAI_SUB, marginLeft: 8 }}>⧉</span></span><span><span style={{ fontSize: 14, background: "#3a3a3a", padding: "5px 9px", borderRadius: 6 }}>live.transport.incoming</span></span><span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 16 }}>whsec_...••••</span><span style={{ color: OAI_SUB, letterSpacing: 8 }}>◎ ⟳ ✎</span></div> : null}
  </OaiShell>
);

export const OaiLivePage: React.FC<{ voice?: string; model?: string }> = ({ voice = "Marin", model = "gpt-live-1" }) => {
  const f = useCurrentFrame(); const Row: React.FC<{ k: string; v: React.ReactNode; sel?: boolean }> = ({ k, v, sel = true }) => <div style={{ display: "flex", alignItems: "center", padding: "10px 0" }}><span style={{ width: 130, fontSize: 17, color: OAI_INK }}>{k}</span><span style={{ flex: 1, height: 44, borderRadius: 8, border: `1px solid #444`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 16 }}>{v}{sel ? <span style={{ marginLeft: "auto", color: OAI_SUB }}>⇅</span> : null}</span></div>;
  return (
    <OaiShell active="Audio">
      <div style={{ display: "flex", alignItems: "center", padding: "22px 32px 14px", borderBottom: `1px solid ${OAI_HAIR}` }}><span style={{ fontSize: 26, fontWeight: 600 }}>Live</span><span style={{ marginLeft: "auto", display: "flex", gap: 10, fontSize: 15 }}><span style={{ background: "#3a3a3a", borderRadius: 8, padding: "8px 14px" }}>Chat</span><span style={{ padding: "8px 14px", color: OAI_SUB }}>Logs</span><span style={{ border: "1px solid #444", borderRadius: 8, padding: "8px 14px" }}>Docs</span></span></div>
      <div style={{ position: "absolute", left: 0, top: 84, bottom: 0, width: 470, borderRight: `1px solid ${OAI_HAIR}`, padding: "22px 30px" }}>
        <div style={{ fontSize: 17, fontWeight: 600 }}>Start from a prompt</div>
        <div style={{ marginTop: 12, height: 150, borderRadius: 10, border: `1px solid #444`, padding: 14, fontSize: 15, color: OAI_SUB, lineHeight: 1.45 }}>Start with a single prompt to define your agent, how it should speak, and what it should do…</div>
        <div style={{ marginTop: 30, fontSize: 17, fontWeight: 600 }}>Voice model</div>
        <Row k="Model" v={model} /><Row k="Voice" v={voice} /><Row k="Opening" v={<span style={{ color: OAI_SUB }}>Optional first words</span>} sel={false} />
        <div style={{ marginTop: 24, fontSize: 17, fontWeight: 600 }}>Delegated model</div>
        <Row k="Type" v="Responses" sel={false} /><Row k="Model" v="gpt-5.6-terra" />
      </div>
      <div style={{ position: "absolute", left: 470, right: 0, top: 84, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: OAI_SUB }}>
        <div style={{ width: 46, height: 46, borderRadius: 10, background: "#3a3a3a", display: "flex", alignItems: "center", justifyContent: "center", color: OAI_INK, fontSize: 20, opacity: 0.6 + 0.4 * Math.abs(Math.sin(f / 9)) }}>|||</div>
        <div style={{ marginTop: 18, fontSize: 20, color: OAI_INK }}>Talk to GPT-Live</div><div style={{ marginTop: 8, fontSize: 15.5 }}>Start a voice conversation using your microphone.</div>
      </div>
    </OaiShell>
  );
};
