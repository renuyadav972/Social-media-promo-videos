import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { INTER_FAMILY } from "../fonts";
import { NewConsoleShell, PageHeader } from "./NewConsoleShell";
import { Ico } from "./consoleIcons";
import { ClickPulse } from "../OnboardingVoiceAgents";
import { INK, SUB, HAIR, OK } from "./AgentBuilder";

// ============================================================================
// Recreated screens for the Pipecat video: Plivo Applications (list + Create
// Application drawer + success toast), Configure Number with the Application type,
// the Pipecat Cloud dashboard (dark) and Plivo's Call Insights with the Audio
// Streams table. Built from the July recording's frames; all state is props.
// ============================================================================
const F = `${INTER_FAMILY}, sans-serif`;
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const Toast: React.FC<{ text: string }> = ({ text }) => <div style={{ position: "absolute", right: 40, top: 92, display: "flex", alignItems: "center", gap: 12, background: "#fff", border: `1px solid ${HAIR}`, borderLeft: `4px solid ${OK}`, borderRadius: 12, padding: "16px 20px", boxShadow: "0 16px 40px rgba(15,17,23,0.14)", fontFamily: F }}><span style={{ color: OK, fontSize: 18 }}>✓</span><div><div style={{ fontSize: 16, fontWeight: 700, color: INK }}>Success</div><div style={{ fontSize: 14.5, color: SUB }}>{text}</div></div></div>;

// ---- Applications list --------------------------------------------------------------------
export const ApplicationsPage: React.FC<{ rows?: [string, string][]; pulseAt?: number; toast?: string; dim?: boolean; drawer?: React.ReactNode }> = ({ rows = [["Default", "sip:10249802582335433@app.plivo.com"]], pulseAt, toast, dim, drawer }) => (
  <NewConsoleShell activeNav="Applications" topBar="live">
    <PageHeader title="Applications" subtitle="Manage your applications for call routing and messaging" action={<div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8, height: 42, padding: "0 18px", borderRadius: 10, background: INK, color: "#fff", fontSize: 15, fontWeight: 600, fontFamily: F }}><Ico name="plus" size={14} /> Create Application{pulseAt != null ? <ClickPulse at={pulseAt} /> : null}</div>} />
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 30px 0", fontFamily: F }}>
      <div style={{ height: 40, width: 330, display: "inline-flex", alignItems: "center", gap: 8, padding: "0 12px", borderRadius: 9, border: `1px solid ${HAIR}`, fontSize: 14, color: "#9aa0ac" }}>Search applications...</div>
      <div style={{ height: 40, width: 40, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 9, border: `1px solid ${HAIR}`, color: INK }}><Ico name="filter" size={15} /></div>
    </div>
    <div style={{ padding: "18px 30px 0", fontFamily: F }}>
      <div style={{ display: "flex", fontSize: 14, fontWeight: 600, color: INK, padding: "12px 12px", borderBottom: `1px solid ${HAIR}` }}><span style={{ flex: 2 }}>Application Name</span><span style={{ flex: 2.6 }}>SIP URI</span><span style={{ flex: 1.2 }}>Linked Numbers</span><span style={{ flex: 1.2 }}>Linked Endpoints</span><span style={{ flex: 1.4 }}>Updated At</span></div>
      {rows.map(([n, uri], i) => <div key={n} style={{ display: "flex", alignItems: "center", padding: "16px 12px", borderBottom: `1px solid ${HAIR}`, fontSize: 14.5, color: INK }}><span style={{ flex: 2, display: "flex", alignItems: "center", gap: 10 }}>{n}{n === "Default" ? <span style={{ fontSize: 12.5, fontWeight: 600, background: "#f1f2f4", borderRadius: 6, padding: "4px 8px" }}>Default Number App</span> : null}</span><span style={{ flex: 2.6, color: INK }}>{uri}</span><span style={{ flex: 1.2, color: SUB }}>-</span><span style={{ flex: 1.2, color: SUB }}>-</span><span style={{ flex: 1.4 }}>{i === 0 ? "Jul 9, 2026 10:54 AM" : "Jul 24, 2026 11:12 AM"}</span></div>)}
    </div>
    {dim ? <div style={{ position: "absolute", inset: 0, background: "rgba(15,17,23,0.45)" }} /> : null}
    {drawer}
    {toast ? <Toast text={toast} /> : null}
  </NewConsoleShell>
);
// ---- Create Application drawer -------------------------------------------------------------
const Lbl: React.FC<{ children: React.ReactNode; mt?: number }> = ({ children, mt = 16 }) => <div style={{ marginTop: mt, marginBottom: 8, fontSize: 14, fontWeight: 600, color: INK }}>{children}</div>;
const UrlRow: React.FC<{ method: string; value?: string; placeholder: string; focus?: boolean; caret?: boolean; methodOpen?: boolean }> = ({ method, value, placeholder, focus, caret, methodOpen }) => { const f = useCurrentFrame(); return <div style={{ display: "flex", gap: 10, position: "relative" }}><div style={{ width: 120, height: 44, borderRadius: 10, border: `1.5px solid ${methodOpen ? INK : HAIR}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 15, color: INK }}>{method}<span style={{ marginLeft: "auto", color: "#9aa0ac" }}>⌄</span></div>{methodOpen ? <div style={{ position: "absolute", left: 0, top: 50, width: 120, borderRadius: 10, border: `1px solid ${HAIR}`, background: "#fff", boxShadow: "0 18px 50px rgba(15,17,23,0.16)", zIndex: 3 }}>{["POST", "GET"].map((m) => <div key={m} style={{ padding: "10px 14px", fontSize: 15, background: m === "GET" ? "#f4f5f7" : "#fff" }}>{m}</div>)}</div> : null}<div style={{ flex: 1, height: 44, borderRadius: 10, border: `1.5px solid ${focus ? INK : HAIR}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 15, color: value ? INK : "#9aa0ac", overflow: "hidden", whiteSpace: "nowrap" }}>{value || placeholder}{caret ? <span style={{ opacity: Math.round(f / 8) % 2 }}>▏</span> : null}</div></div>; };
export const CreateApplicationDrawer: React.FC<{ name?: string; typingName?: boolean; url?: string; typingUrl?: boolean; method?: string; methodOpen?: boolean; right?: number }> = ({ name = "", typingName, url = "", typingUrl, method = "POST", methodOpen, right = 0 }) => (
  <div style={{ position: "absolute", top: 0, right, bottom: 0, width: 740, background: "#fff", boxShadow: "-24px 0 60px rgba(20,18,40,0.20)", padding: "28px 34px", fontFamily: F, color: INK }}>
    <div style={{ display: "flex", alignItems: "center" }}><span style={{ fontSize: 24, fontWeight: 700 }}>Create Application</span><span style={{ marginLeft: "auto", fontSize: 20 }}>✕</span></div>
    <Lbl mt={26}>Application Name</Lbl>
    <div style={{ height: 46, borderRadius: 10, border: `1.5px solid ${typingName ? INK : HAIR}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 15.5, color: name ? INK : "#9aa0ac" }}>{name || "Enter application name"}{typingName ? <Caret /> : null}</div>
    <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, fontSize: 14.5 }}><span style={{ width: 16, height: 16, borderRadius: 4, border: "1.5px solid #b4b8c2" }} />Default Number Application</div>
    <div style={{ marginTop: 22, fontSize: 15, fontWeight: 700 }}>Voice <span style={{ color: SUB, fontWeight: 400 }}>⌃</span></div>
    <div style={{ marginTop: 10, border: `1px solid ${HAIR}`, borderRadius: 12, padding: "14px 16px" }}>
      <Lbl mt={0}>Answer URL</Lbl><UrlRow method={method} value={url} placeholder="https://example.com/answer" focus={typingUrl} caret={typingUrl} methodOpen={methodOpen} />
      <Lbl>Hangup URL</Lbl><UrlRow method="POST" placeholder="https://example.com/hangup" />
      <Lbl>Fallback Answer URL</Lbl><UrlRow method="POST" placeholder="https://example.com/fallback" />
      <div style={{ marginTop: 16, display: "flex", gap: 40, fontSize: 14.5 }}><span style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 16, height: 16, borderRadius: 4, border: "1.5px solid #b4b8c2" }} />Public URI</span><span style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 16, height: 16, borderRadius: 4, border: "1.5px solid #b4b8c2" }} />Default Endpoint Application</span></div>
    </div>
    <div style={{ marginTop: 22, fontSize: 15, fontWeight: 700 }}>Messaging <span style={{ color: SUB, fontWeight: 400 }}>⌄</span></div>
    <Lbl mt={22}>Subaccount</Lbl><div style={{ height: 46, borderRadius: 10, border: `1px solid ${HAIR}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 15.5, color: "#9aa0ac" }}>Select<span style={{ marginLeft: "auto" }}>⌄</span></div>
    <div style={{ position: "absolute", right: 34, bottom: 30, fontSize: 15, fontWeight: 600, color: "#fff", background: INK, borderRadius: 10, padding: "13px 20px" }}>Create Application</div>
  </div>
);
const Caret: React.FC = () => { const f = useCurrentFrame(); return <span style={{ opacity: Math.round(f / 8) % 2 }}>▏</span>; };

// ---- Configure Number with the Application type -------------------------------------------
const Radio: React.FC<{ on?: boolean; children: React.ReactNode }> = ({ on, children }) => <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 16, color: INK }}><span style={{ width: 18, height: 18, borderRadius: 9, border: `1.5px solid ${on ? INK : "#b4b8c2"}`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{on ? <span style={{ width: 9, height: 9, borderRadius: 5, background: INK }} /> : null}</span>{children}</div>;
export const ConfigureNumberApp: React.FC<{ number?: string; place?: string; appOpen?: boolean; picked?: string; hover?: string; saving?: boolean }> = ({ number = "+1 806 209 0453", place = "Texas, United States", appOpen, picked, hover = "Pipecat_Demo", saving }) => (
  <div style={{ position: "absolute", left: 1170, top: 16, width: 730, height: 1048, borderRadius: 18, background: "#fff", boxShadow: "0 30px 90px rgba(15,17,23,0.28)", padding: "30px 34px", fontFamily: F, color: INK }}>
    <div style={{ display: "flex", alignItems: "center" }}><span style={{ fontSize: 24, fontWeight: 700 }}>Configure Number</span><span style={{ marginLeft: "auto", fontSize: 20 }}>✕</span></div>
    <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 14 }}><span style={{ width: 38, height: 26, borderRadius: 4, background: "linear-gradient(#b22234 0 50%, #fff 50%)", position: "relative", overflow: "hidden" }}><span style={{ position: "absolute", left: 0, top: 0, width: 16, height: 14, background: "#3c3b6e" }} /></span><div><div style={{ fontSize: 17, fontWeight: 600 }}>{number}</div><div style={{ fontSize: 14, color: SUB }}>{place}</div></div></div>
    <div style={{ marginTop: 22, fontSize: 16, fontWeight: 600 }}>Number Type</div><div style={{ fontSize: 16 }}>Local</div>
    <div style={{ marginTop: 18, fontSize: 16, fontWeight: 600 }}>Capabilities</div><div style={{ marginTop: 8, display: "flex", gap: 8 }}>{["Voice", "SMS", "MMS"].map((c) => <span key={c} style={{ fontSize: 14, fontWeight: 600, background: "#f1f2f4", borderRadius: 6, padding: "5px 10px" }}>{c}</span>)}</div>
    <div style={{ marginTop: 18, fontSize: 15, fontWeight: 600 }}>Alias</div><div style={{ marginTop: 8, height: 46, borderRadius: 10, border: `1px solid ${HAIR}` }} />
    <div style={{ marginTop: 18, fontSize: 15, fontWeight: 600 }}>Application Type</div>
    <div style={{ marginTop: 10, display: "flex", gap: 34 }}><Radio>AI Agents</Radio><Radio on>Application</Radio><Radio>SIP Trunk</Radio></div>
    <div style={{ marginTop: 18, fontSize: 15, fontWeight: 600 }}>Application <span style={{ fontWeight: 400, color: SUB, fontStyle: "italic" }}>(optional)</span></div>
    <div style={{ position: "relative" }}>
      <div style={{ marginTop: 8, height: 48, borderRadius: 10, border: `1.5px solid ${appOpen ? INK : HAIR}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 16, color: picked ? INK : "#9aa0ac" }}>{picked || "Select application"}<span style={{ marginLeft: "auto", color: "#9aa0ac" }}>⌄</span></div>
      {appOpen ? <div style={{ position: "absolute", left: 0, right: 0, top: 62, borderRadius: 12, border: `1px solid ${HAIR}`, background: "#fff", boxShadow: "0 18px 50px rgba(15,17,23,0.16)", overflow: "hidden", zIndex: 2 }}><div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", fontSize: 15, color: "#9aa0ac", borderBottom: `1px solid ${HAIR}` }}><Ico name="search" size={15} /> Search...</div>{["Default", "Pipecat_Demo"].map((a) => <div key={a} style={{ padding: "11px 16px", fontSize: 15.5, color: INK, background: a === hover ? "#f4f5f7" : "#fff" }}>{a}</div>)}</div> : null}
    </div>
    <div style={{ marginTop: 18, fontSize: 15, fontWeight: 600 }}>Sub Account</div><div style={{ marginTop: 8, height: 48, borderRadius: 10, border: `1px solid ${HAIR}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 16, color: "#9aa0ac" }}>Select sub account<span style={{ marginLeft: "auto" }}>⌄</span></div>
    <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 600 }}><span style={{ width: 40, height: 22, borderRadius: 11, background: "#e6e7eb", position: "relative" }}><span style={{ position: "absolute", left: 3, top: 3, width: 16, height: 16, borderRadius: 8, background: "#fff" }} /></span>CNAM Lookup <span style={{ color: "#9aa0ac", fontWeight: 400 }}>ⓘ</span></div>
    <div style={{ marginTop: 18, fontSize: 15, fontWeight: 600 }}>CNAM (Caller ID Name)</div><div style={{ marginTop: 8, height: 46, borderRadius: 10, border: `1px solid ${HAIR}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 15, color: "#9aa0ac" }}>e.g. ACME INC</div>
    <div style={{ position: "absolute", left: 34, right: 34, bottom: 30, display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 15, fontWeight: 600, color: "#e5484d", border: "1px solid #e5484d", borderRadius: 10, padding: "12px 18px" }}>Delete Number</span><span style={{ fontSize: 15, fontWeight: 600, color: "#fff", background: saving ? "#6b6f7b" : INK, borderRadius: 10, padding: "12px 18px" }}>{saving ? "⟳ Save changes" : "Save changes"}</span></div>
  </div>
);

// ---- Pipecat Cloud dashboard (dark) ---------------------------------------------------------
const PC_BG = "#0c0e13", PC_PANEL = "#14171d", PC_LINE = "#252932", PC_TEXT = "#e6e8ec", PC_MUTED = "#8b929c";
export const PipecatDashboard: React.FC<{ sessions: number; bot?: string; workspace?: string }> = ({ sessions, bot = "plivo-demo-bot", workspace = "your-workspace" }) => (
  <div style={{ width: "100%", height: "100%", background: PC_BG, color: PC_TEXT, fontFamily: F, position: "relative" }}>
    <div style={{ display: "flex", alignItems: "center", height: 74, padding: "0 30px", borderBottom: `1px solid ${PC_LINE}` }}>
      <span style={{ fontSize: 26 }}>🐈</span><div style={{ marginLeft: 16 }}><div style={{ fontSize: 16, fontWeight: 600 }}>plivo <span style={{ color: PC_MUTED, fontWeight: 400 }}>⌃⌄</span></div><div style={{ fontSize: 12, color: PC_MUTED }}>{workspace}</div></div><span style={{ margin: "0 18px", color: PC_MUTED }}>/</span><span style={{ fontSize: 16 }}>{bot} <span style={{ color: PC_MUTED }}>⌃⌄</span></span>
      <span style={{ flex: 1 }} /><span style={{ fontSize: 13, background: "#1a2b1f", color: "#4ade80", borderRadius: 999, padding: "5px 12px", border: "1px solid #24452c" }}>$7.02 / $10.00</span><span style={{ marginLeft: 22, fontSize: 15 }}>Community</span><span style={{ marginLeft: 22, fontSize: 15 }}>Docs</span><span style={{ marginLeft: 22, width: 30, height: 30, borderRadius: 15, background: "#2a2f3a" }} />
    </div>
    <div style={{ display: "flex", gap: 30, padding: "0 30px", height: 52, alignItems: "center", borderBottom: `1px solid ${PC_LINE}`, fontSize: 15 }}>{["Overview", "Deployments", "Sessions", "Logs", "Sandbox", "Settings"].map((t, i) => <span key={t} style={{ color: i === 0 ? PC_TEXT : PC_MUTED, borderBottom: i === 0 ? `2px solid ${PC_TEXT}` : "2px solid transparent", paddingBottom: 14, marginBottom: -16 }}>{t}</span>)}</div>
    <div style={{ display: "flex", alignItems: "center", padding: "26px 30px 0" }}><span style={{ fontSize: 22, fontWeight: 600 }}>{bot}</span><span style={{ flex: 1 }} /><span style={{ fontSize: 14, border: `1px solid ${PC_LINE}`, borderRadius: 8, padding: "8px 14px" }}>⟳ Redeploy</span><span style={{ marginLeft: 10, fontSize: 14, border: `1px solid ${PC_LINE}`, borderRadius: 8, padding: "8px 14px" }}>Refresh</span></div>
    <div style={{ margin: "22px 30px 0", background: PC_PANEL, border: `1px solid ${PC_LINE}`, borderRadius: 12, padding: "22px 24px" }}>
      <div style={{ display: "flex", alignItems: "center" }}><div><div style={{ fontSize: 18, fontWeight: 600 }}>{bot}</div><div style={{ fontSize: 13, color: PC_MUTED, marginTop: 4 }}>Updated: an hour ago</div><div style={{ marginTop: 12, display: "flex", gap: 8 }}>{["Build 33da8e...", "agent-1x", "us-west"].map((t) => <span key={t} style={{ fontSize: 12, fontFamily: "ui-monospace, Menlo, monospace", border: `1px solid ${PC_LINE}`, borderRadius: 6, padding: "4px 10px", color: PC_MUTED }}>{t}</span>)}</div></div><span style={{ flex: 1 }} /><span style={{ width: 34, height: 34, borderRadius: 17, background: "#1a2b1f", border: "1px solid #24452c", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#4ade80" }}>♥</span><span style={{ marginLeft: 14, color: PC_MUTED }}>⋯</span></div>
      <div style={{ marginTop: 24, display: "flex", borderTop: `1px solid ${PC_LINE}`, paddingTop: 20 }}><div style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 11.5, letterSpacing: 1.5, color: PC_MUTED, fontFamily: "ui-monospace, Menlo, monospace" }}>ACTIVE SESSIONS</div><div style={{ fontSize: 30, fontWeight: 600, marginTop: 8 }}>{sessions}</div></div><div style={{ width: 1, background: PC_LINE }} /><div style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 11.5, letterSpacing: 1.5, color: PC_MUTED, fontFamily: "ui-monospace, Menlo, monospace" }}>RESERVED INSTANCES</div><div style={{ fontSize: 30, fontWeight: 600, marginTop: 8 }}>1</div></div></div>
    </div>
    <div style={{ display: "flex", gap: 22, margin: "22px 30px 0" }}>
      <div style={{ flex: 1, background: PC_PANEL, border: `1px solid ${PC_LINE}`, borderRadius: 12, padding: "22px 24px" }}><div style={{ fontSize: 16, fontWeight: 600 }}>Active Deployment</div><div style={{ marginTop: 10, fontSize: 13, fontFamily: "ui-monospace, Menlo, monospace", color: PC_MUTED }}>1aaee43e-478f-43c4-9a80-debb5087b4cc</div><div style={{ fontSize: 13, color: PC_MUTED, marginTop: 6 }}>Updated: an hour ago</div><div style={{ marginTop: 10, fontSize: 13, color: PC_MUTED }}>◇ Build 33da8e55</div></div>
      <div style={{ flex: 1, background: PC_PANEL, border: `1px solid ${PC_LINE}`, borderRadius: 12, padding: "22px 24px" }}><div style={{ fontSize: 16, fontWeight: 600 }}>REST Start URL</div><div style={{ marginTop: 8, fontSize: 12.5, color: PC_MUTED }}>Call this URL with a Public API Key to start this agent. See the docs for more start options.</div><div style={{ marginTop: 12, height: 42, borderRadius: 8, border: `1px solid ${PC_LINE}`, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 13.5, fontFamily: "ui-monospace, Menlo, monospace" }}>https://api.pipecat.daily.co/v1/public/{bot}/start<span style={{ marginLeft: "auto", color: PC_MUTED }}>⧉</span></div></div>
    </div>
    <div style={{ position: "absolute", left: 30, right: 30, bottom: 22, display: "flex", alignItems: "center", fontSize: 13, color: PC_MUTED }}><span>🐈 pipecatcloud © 2026</span><span style={{ flex: 1 }} /><span>Changelog</span><span style={{ marginLeft: 22 }}>Pricing</span><span style={{ marginLeft: 22 }}>Examples</span></div>
  </div>
);

// ---- Plivo Call Insights with the Audio Streams table -------------------------------------
export const CallInsightsPage: React.FC<{ revealFrom?: number }> = ({ revealFrom }) => {
  const f = useCurrentFrame(); const Row: React.FC<{ k: string; v: string; k2?: string; v2?: string }> = ({ k, v, k2, v2 }) => <div style={{ display: "flex", padding: "9px 0", fontSize: 14.5 }}><span style={{ flex: 1 }}><b>{k}:</b> {v}</span>{k2 ? <span style={{ flex: 1 }}><b>{k2}:</b> {v2}</span> : null}</div>;
  return (
    <NewConsoleShell activeNav="Logs" topBar="live">
      <div style={{ padding: "26px 30px 0", fontFamily: F, color: INK }}>
        <div style={{ fontSize: 15, color: SUB }}>‹ Call Insights for 91c7b244-03d3-40f1-b317-7218c6bffe4a</div>
        <div style={{ display: "flex", gap: 26, marginTop: 18, borderBottom: `1px solid ${HAIR}`, fontSize: 15 }}>{["Call Insights", "Debug Logs"].map((t, i) => <span key={t} style={{ padding: "0 4px 12px", fontWeight: i === 0 ? 600 : 500, color: i === 0 ? INK : SUB, borderBottom: i === 0 ? `2px solid ${INK}` : "2px solid transparent", marginBottom: -1 }}>{t}</span>)}</div>
        <div style={{ marginTop: 14 }}>
          <Row k="Call End Time" v="Jul 24, 2026 11:15:38 AM" k2="Type" v2="PSTN" /><Row k="Call Duration" v="58s" k2="Total Cost" v2="$0.0055" /><Row k="Hangup cause" v="Normal Hangup" k2="Hangup Source" v2="Caller" /><Row k="STIR Verification" v="Verified" /><Row k="Originator" v="Mobile Number ⓘ" k2="Terminated To" v2="Plivo MS ⓘ" /><Row k="Originator Region" v="United States ⓘ" k2="Ring Duration" v2="-" />
        </div>
        <div style={{ marginTop: 18, fontSize: 15, fontWeight: 700 }}>Call Relations</div>
        <div style={{ marginTop: 10, border: `1px solid ${HAIR}`, borderRadius: 10, overflow: "hidden", fontSize: 13.5 }}><div style={{ display: "flex", padding: "12px 14px", fontWeight: 600, background: "#fafafb", borderBottom: `1px solid ${HAIR}` }}><span style={{ flex: 1.6 }}>UUID</span><span style={{ flex: 1.6 }}>From</span><span style={{ flex: 1.6 }}>To</span><span style={{ flex: 0.8 }}>Relation</span><span style={{ flex: 0.8 }}>Duration</span><span style={{ flex: 0.8 }}>Cost</span><span style={{ flex: 1.6 }}>Start Time</span><span style={{ flex: 1.2 }}>Hangup Cause</span></div><div style={{ display: "flex", padding: "14px 14px" }}><span style={{ flex: 1.6 }}>91c7b244-03d3-40f1-...</span><span style={{ flex: 1.6 }}>+1 737 ••• ••••, United Stat...</span><span style={{ flex: 1.6 }}>+18062090453, United Sta...</span><span style={{ flex: 0.8 }}>Self</span><span style={{ flex: 0.8 }}>58s</span><span style={{ flex: 0.8 }}>$0.0055</span><span style={{ flex: 1.6 }}>Jul 24, 2026 11:14:40 AM</span><span style={{ flex: 1.2 }}>Normal Hangup</span></div></div>
        <div style={{ marginTop: 22, fontSize: 15, fontWeight: 700, opacity: revealFrom == null ? 1 : ease(f, revealFrom, revealFrom + 10) }}>Audio Streams</div>
        <div style={{ marginTop: 10, border: `1px solid ${HAIR}`, borderRadius: 10, overflow: "hidden", fontSize: 13.5, opacity: revealFrom == null ? 1 : ease(f, revealFrom + 6, revealFrom + 18) }}><div style={{ display: "flex", padding: "12px 14px", fontWeight: 600, background: "#fafafb", borderBottom: `1px solid ${HAIR}` }}><span style={{ flex: 1.6 }}>UUID</span><span style={{ flex: 1.6 }}>Start Time</span><span style={{ flex: 1.6 }}>End Time</span><span style={{ flex: 0.8 }}>Duration</span><span style={{ flex: 1.2 }}>Rounded Bill Duration</span><span style={{ flex: 1 }}>Hangup Reason</span><span style={{ flex: 1 }}>Billed Amount</span></div><div style={{ display: "flex", padding: "14px 14px" }}><span style={{ flex: 1.6 }}>4b62d7e6-79d7-4a17-994...</span><span style={{ flex: 1.6 }}>Jul 24, 2026 11:14:40 AM</span><span style={{ flex: 1.6 }}>Jul 24, 2026 11:15:38 AM</span><span style={{ flex: 0.8 }}>58s</span><span style={{ flex: 1.2 }}>1m</span><span style={{ flex: 1 }}>Call Hangup</span><span style={{ flex: 1 }}>$0.0000 ⓘ</span></div></div>
      </div>
    </NewConsoleShell>
  );
};
