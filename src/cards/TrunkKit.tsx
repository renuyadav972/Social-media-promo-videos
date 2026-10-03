import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { INTER_FAMILY } from "../fonts";
import { NewConsoleShell, PageHeader, TabRow } from "./NewConsoleShell";
import { Ico } from "./consoleIcons";
import { ClickPulse } from "../OnboardingVoiceAgents";
import { INK, SUB, HAIR, OK } from "./AgentBuilder";

// ============================================================================
// Recreated Plivo SIP Trunking screens (built from the xAI recording's frames) and a
// recreated LiveKit Cloud console (dark), for the LiveKit video. All state is props.
// ============================================================================
const F = `${INTER_FAMILY}, sans-serif`;
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ---- SIP Trunking list ---------------------------------------------------------------------
export type TrunkRow = { name: string; uri: string; numbers: number; status?: string };
export const SipTrunkingPage: React.FC<{ rows?: TrunkRow[]; drawer?: React.ReactNode; dim?: boolean; toast?: string; pulseAt?: number; children?: React.ReactNode }> = ({ rows = [], drawer, dim, toast, pulseAt, children }) => (
  <NewConsoleShell activeNav="SIP Trunking" topBar="live">
    <PageHeader title="SIP Trunking" subtitle="Manage your SIP trunks for inbound and outbound telephony connectivity" />
    <TabRow tabs={["Inbound Trunks", "Outbound Trunks"]} active="Inbound Trunks" />
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 30px 0", fontFamily: F }}>
      <div style={{ height: 40, width: 330, display: "inline-flex", alignItems: "center", gap: 8, padding: "0 12px", borderRadius: 9, border: `1px solid ${HAIR}`, fontSize: 14, color: "#9aa0ac" }}>Search by trunk name...</div>
      <div style={{ height: 40, display: "inline-flex", alignItems: "center", gap: 8, padding: "0 14px", borderRadius: 9, border: `1px solid ${HAIR}`, fontSize: 14.5, color: INK }}><Ico name="plus" size={14} /> Trunk Status</div>
      <div style={{ height: 40, width: 40, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 9, border: `1px solid ${HAIR}`, color: INK }}><Ico name="filter" size={15} /></div>
      <span style={{ flex: 1 }} />
      <div style={{ position: "relative", height: 40, display: "inline-flex", alignItems: "center", gap: 8, padding: "0 18px", borderRadius: 9, background: INK, color: "#fff", fontSize: 14.5, fontWeight: 600 }}><Ico name="plus" size={14} /> Create Trunk{pulseAt != null ? <ClickPulse at={pulseAt} /> : null}</div>
    </div>
    <div style={{ padding: "18px 30px 0", fontFamily: F }}>
      <div style={{ display: "flex", fontSize: 14, fontWeight: 600, color: INK, padding: "12px 12px", borderBottom: `1px solid ${HAIR}` }}><span style={{ flex: 2 }}>Trunk Name</span><span style={{ flex: 2.4 }}>Primary URI</span><span style={{ flex: 1.6 }}>Fallback URI</span><span style={{ flex: 1.4 }}>Linked Numbers</span><span style={{ flex: 1 }}>Status</span></div>
      {rows.map((r) => <div key={r.name} style={{ display: "flex", alignItems: "center", padding: "14px 12px", borderBottom: `1px solid ${HAIR}`, fontSize: 14.5, color: INK }}><span style={{ flex: 2 }}><div style={{ fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 12.5, color: SUB, marginTop: 2 }}>7f3a1c9e-…</div></span><span style={{ flex: 2.4 }}><div>{r.uri}</div><div style={{ fontSize: 12.5, color: SUB, marginTop: 2 }}>d21b0e4c-…</div></span><span style={{ flex: 1.6, color: SUB }}>—</span><span style={{ flex: 1.4 }}><span style={{ fontSize: 13, fontWeight: 600, background: "#f1f2f4", borderRadius: 6, padding: "5px 10px" }}>{r.numbers} Number{r.numbers === 1 ? "" : "s"}</span></span><span style={{ flex: 1 }}><span style={{ fontSize: 13, fontWeight: 600, color: OK, background: "#e7f8ee", borderRadius: 6, padding: "5px 10px" }}>{r.status ?? "Active"}</span></span></div>)}
      {rows.length === 0 ? <div style={{ padding: "60px 0", textAlign: "center", fontSize: 15, color: "#9aa0ac" }}>No inbound trunks yet</div> : null}
    </div>
    {dim ? <div style={{ position: "absolute", inset: 0, background: "rgba(15,17,23,0.45)" }} /> : null}
    {drawer}
    {toast ? <div style={{ position: "absolute", right: 40, top: 92, display: "flex", alignItems: "center", gap: 12, background: "#fff", border: `1px solid ${HAIR}`, borderLeft: `4px solid ${OK}`, borderRadius: 12, padding: "16px 20px", boxShadow: "0 16px 40px rgba(15,17,23,0.14)", fontFamily: F }}><span style={{ color: OK, fontSize: 18 }}>✓</span><div><div style={{ fontSize: 16, fontWeight: 700, color: INK }}>Success</div><div style={{ fontSize: 14.5, color: SUB }}>{toast}</div></div></div> : null}
    {children}
  </NewConsoleShell>
);

// ---- Create Trunk drawer -------------------------------------------------------------------
const Radio: React.FC<{ on?: boolean; children: React.ReactNode }> = ({ on, children }) => <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15.5, color: INK }}><span style={{ width: 18, height: 18, borderRadius: 9, border: `1.5px solid ${on ? INK : "#b4b8c2"}`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{on ? <span style={{ width: 9, height: 9, borderRadius: 5, background: INK }} /> : null}</span>{children}</div>;
const Field: React.FC<{ label: React.ReactNode; right?: React.ReactNode; children: React.ReactNode; mt?: number }> = ({ label, right, children, mt = 18 }) => <div style={{ marginTop: mt }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 14.5, fontWeight: 600, color: INK, marginBottom: 8 }}><span>{label}</span>{right ? <span style={{ fontWeight: 500, color: INK, fontSize: 14 }}>{right}</span> : null}</div>{children}</div>;
const Input: React.FC<{ value?: string; placeholder?: string; focus?: boolean; caret?: boolean; select?: boolean }> = ({ value, placeholder, focus, caret, select }) => { const f = useCurrentFrame(); return <div style={{ height: 46, borderRadius: 10, border: `1.5px solid ${focus ? INK : HAIR}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 15.5, color: value ? INK : "#9aa0ac", background: "#fff" }}>{value || placeholder}{caret ? <span style={{ opacity: Math.round(f / 8) % 2 }}>▏</span> : null}{select ? <span style={{ marginLeft: "auto", color: "#9aa0ac" }}>⌄</span> : null}</div>; };
export const NUMBER_LIST: [string, string][] = [["+1 775 239 8525", ""]]; // the one number used in the video, no alias tag
export const CreateTrunkDrawer: React.FC<{ name?: string; typing?: boolean; nameFocus?: boolean; platform?: string; platformOpen?: boolean; platformHover?: string; uri?: string; uriOpen?: boolean; uriHover?: string; uris?: string[]; uriAddress?: string; numbers?: [string, string][]; numbersOpen?: boolean; numbersHover?: string; linked?: string[]; showPlatform?: boolean; right?: number; v2?: boolean }> = ({ name = "", typing, nameFocus, platform, platformOpen, platformHover, uri, uriOpen, uriHover, uris = ["LiveKit"], uriAddress = "sip:…livekit.cloud;transport=tls", numbers = NUMBER_LIST, numbersOpen, numbersHover, linked = [], showPlatform, right = 0, v2 }) => (
  <div style={{ position: "absolute", top: 0, right, bottom: 0, width: 760, background: "#fff", boxShadow: "-24px 0 60px rgba(20,18,40,0.20)", padding: "28px 34px", fontFamily: F, color: INK }}>
    <div style={{ display: "flex", alignItems: "center" }}><span style={{ fontSize: 24, fontWeight: 700 }}>Create Trunk</span><span style={{ marginLeft: "auto", fontSize: 20 }}>✕</span></div>
    <Field label="Trunk Name" mt={26}><Input value={name} placeholder="Enter trunk name" focus={nameFocus} caret={typing} /></Field>
    {showPlatform ? <Field label="SIP Platform"><div style={{ position: "relative" }}><Input value={platform} placeholder="Select the SIP platform" select focus={platformOpen} />{platformOpen ? <div style={{ position: "absolute", left: 0, right: 0, top: 54, borderRadius: 12, border: `1px solid ${HAIR}`, background: "#fff", boxShadow: "0 18px 50px rgba(15,17,23,0.16)", zIndex: 3, padding: "6px 0" }}>{["LiveKit Cloud", "Retell AI", "Vapi", "ElevenLabs Agents", "xAI (SpaceXAI)", "OpenAI Realtime", "Custom SIP Platform"].map((p) => <div key={p} style={{ padding: "11px 16px", fontSize: 15.5, background: p === (platformHover || platform) ? "#f4f5f7" : "#fff" }}>{p}</div>)}</div> : null}</div></Field> : null}
    <Field label="Trunk Direction"><div style={{ display: "flex", gap: 34 }}><Radio on>Inbound</Radio>{v2 ? null : <Radio>Outbound</Radio>}</div></Field>
    <div style={{ marginTop: 18, fontSize: 14.5, fontWeight: 600, display: "flex", alignItems: "center" }}>{v2 ? "Trunk URIs" : "Trunk Authentication"}{v2 ? <span style={{ marginLeft: "auto", fontSize: 14, fontWeight: 400 }}><span style={{ color: SUB }}>⊕</span> Create new URI</span> : null}</div>
    <div style={{ marginTop: 10, border: `1px solid ${HAIR}`, borderRadius: 12, padding: "14px 16px" }}>
      <Field label={v2 ? <>Primary URI <span style={{ color: SUB, fontWeight: 400 }}>ⓘ</span></> : "Primary URI"} right={v2 ? undefined : <><span style={{ color: SUB }}>⊕</span> Create new URI</>} mt={0}><div style={{ position: "relative" }}><Input value={uri ? (v2 ? uri : `${uri}  ·  ${uriAddress}`) : ""} placeholder="Select Primary URI" select focus={uriOpen} />{uriOpen ? <div style={{ position: "absolute", left: 0, right: 0, top: 54, borderRadius: 12, border: `1px solid ${HAIR}`, background: "#fff", boxShadow: "0 18px 50px rgba(15,17,23,0.16)", zIndex: 3 }}><div style={{ padding: "12px 16px", fontSize: 15, color: "#9aa0ac", borderBottom: `1px solid ${HAIR}` }}>Search...</div>{uris.map((u) => <div key={u} style={{ display: "flex", padding: "11px 16px", fontSize: 15.5, background: u === uriHover ? "#f4f5f7" : "#fff" }}><span>{u}</span><span style={{ marginLeft: "auto", color: SUB, fontSize: 13 }}>{uriAddress}</span></div>)}</div> : null}</div></Field>
      <Field label="Fallback URI (Optional)" right={v2 ? undefined : <><span style={{ color: SUB }}>⊕</span> Create new URI</>}><Input placeholder="Select Fallback URI" select /></Field>
    </div>
    <div style={{ marginTop: 18, fontSize: 14.5, fontWeight: 600 }}>Message</div>
    <div style={{ marginTop: 10, border: `1px solid ${HAIR}`, borderRadius: 12, padding: "14px 16px" }}><Field label={v2 ? "Inbound SMS (Optional)" : "Message URL Configuration (Optional)"} mt={0}><div style={{ display: "flex", gap: 10 }}><div style={{ width: 120, height: 46, borderRadius: 10, border: `1px solid ${HAIR}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 15 }}>POST<span style={{ marginLeft: "auto", color: "#9aa0ac" }}>⌄</span></div><div style={{ flex: 1 }}><Input placeholder="Enter a URL" /></div></div></Field></div>
    <Field label={<>Link Numbers <span style={{ fontWeight: 400, color: SUB, fontStyle: "italic" }}>(Optional)</span></>} right={<>Buy new number ↗</>}>
      <div style={{ position: "relative" }}>
        {numbersOpen ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 54, borderRadius: 12, border: `1px solid ${HAIR}`, background: "#fff", boxShadow: "0 18px 50px rgba(15,17,23,0.16)", zIndex: 3 }}><div style={{ padding: "12px 16px", fontSize: 15, color: "#9aa0ac", borderBottom: `1px solid ${HAIR}` }}>Search...</div>{numbers.map(([n, a]) => <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", fontSize: 15, background: n === numbersHover ? "#f4f5f7" : "#fff" }}><span style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${linked.includes(n) ? INK : "#b4b8c2"}`, background: linked.includes(n) ? INK : "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11 }}>{linked.includes(n) ? "✓" : ""}</span><span>{n}</span>{a ? <span style={{ color: SUB }}>({a})</span> : null}</div>)}</div> : null}
        <div style={{ minHeight: 46, borderRadius: 10, border: `1.5px solid ${numbersOpen ? INK : HAIR}`, display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", fontSize: 15.5, color: linked.length ? INK : "#9aa0ac" }}>{linked.length ? linked.map((n) => <span key={n} style={{ fontSize: 14, background: "#f1f2f4", borderRadius: 6, padding: "5px 10px" }}>{n} <span style={{ color: SUB }}>✕</span></span>) : "Select phone numbers..."}<span style={{ marginLeft: "auto", color: "#9aa0ac" }}>⌄</span></div>
      </div>
    </Field>
    <div style={{ position: "absolute", right: 34, bottom: 30, fontSize: 15, fontWeight: 600, color: "#fff", background: INK, borderRadius: 10, padding: "13px 20px" }}>Create Trunk</div>
  </div>
);

// ---- LiveKit Cloud console (dark) ------------------------------------------------------
const LK_BG = "#0b0d10", LK_PANEL = "#111418", LK_LINE = "#1f2329", LK_TEXT = "#e6e8ec", LK_MUTED = "#8b929c", LK_CYAN = "#1fd5f9";
const LkStat: React.FC<{ label: string; value: React.ReactNode; w?: number }> = ({ label, value, w }) => <div style={{ width: w, flex: w ? undefined : 1, background: LK_PANEL, border: `1px solid ${LK_LINE}`, borderRadius: 8, padding: "16px 18px" }}><div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11.5, letterSpacing: 1, color: LK_MUTED }}>{label}</div><div style={{ marginTop: 10, fontSize: 24, color: LK_TEXT }}>{value}</div></div>;
export const LiveKitShell: React.FC<{ active: string; crumb: string; children: React.ReactNode; actions?: React.ReactNode }> = ({ active, crumb, children, actions }) => (
  <div style={{ width: "100%", height: "100%", background: LK_BG, color: LK_TEXT, fontFamily: F, display: "flex", position: "relative" }}>
    <div style={{ width: 236, borderRight: `1px solid ${LK_LINE}`, padding: "22px 14px", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, padding: "0 10px 22px" }}>LiveKit</div>
      {["Overview", "Sessions", "Agents", "Voices", "Telephony", "Egresses", "Ingresses", "Settings", "Billing"].map((it) => <div key={it} style={{ display: "flex", alignItems: "center", gap: 12, height: 40, padding: "0 12px", borderRadius: 8, fontSize: 15, color: it === active ? LK_CYAN : "#c5cad2", background: it === active ? "rgba(31,213,249,0.08)" : "transparent" }}><span style={{ width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${it === active ? LK_CYAN : "#5c636d"}` }} />{it}{["Agents", "Voices"].includes(it) ? <span style={{ marginLeft: "auto", color: "#5c636d" }}>+</span> : null}</div>)}
      <span style={{ flex: 1 }} />
      {["Search", "Support", "What's new"].map((it) => <div key={it} style={{ display: "flex", alignItems: "center", gap: 12, height: 40, padding: "0 12px", fontSize: 15, color: "#c5cad2" }}><span style={{ width: 16, height: 16, borderRadius: 3, border: "1.5px solid #5c636d" }} />{it}</div>)}
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10, padding: "0 6px" }}><div style={{ flex: 1, height: 38, borderRadius: 8, border: `1px solid ${LK_LINE}`, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 14 }}>Plivo Demo<span style={{ marginLeft: "auto", color: "#5c636d" }}>⌄</span></div><div style={{ width: 34, height: 34, borderRadius: 8, background: "#f5c400", color: "#000", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>R</div></div>
    </div>
    <div style={{ flex: 1, position: "relative", padding: "0 36px" }}>
      <div style={{ display: "flex", alignItems: "center", height: 74 }}><div><div style={{ fontSize: 13, color: LK_MUTED }}>Plivo Demo /</div><div style={{ fontSize: 20, marginTop: 2 }}>{crumb}</div></div><span style={{ flex: 1 }} />{actions}</div>
      {children}
    </div>
  </div>
);
export const LiveKitOverview: React.FC = () => (
  <LiveKitShell active="Overview" crumb="Overview" actions={<div style={{ height: 36, borderRadius: 8, border: `1px solid ${LK_LINE}`, padding: "0 14px", display: "flex", alignItems: "center", fontSize: 14, color: "#c5cad2" }}>Past 7 days ⌄</div>}>
    <div style={{ display: "flex", alignItems: "center", marginTop: 6, fontSize: 15 }}>Get started<span style={{ flex: 1 }} /><span style={{ color: LK_MUTED, fontSize: 13 }}>Dismiss</span></div>
    <div style={{ display: "flex", gap: 14, marginTop: 14 }}>{[["Project API keys", "Create and manage access keys to integrate LiveKit into..."], ["AI Agents", "Build and deploy multimodal and voice AI agents"], ["Voice AI quickstart ↗", "Build your first voice AI agent in under 10 minutes"], ["Telephony integration ↗", "Let your voice AI agent make and receive phone calls"]].map(([t, s]) => <div key={t} style={{ flex: 1, background: LK_PANEL, border: `1px solid ${LK_LINE}`, borderRadius: 8, padding: "16px 18px", display: "flex", gap: 14 }}><span style={{ width: 34, height: 34, borderRadius: 8, background: "#1a1f25", flexShrink: 0 }} /><div><div style={{ fontSize: 15 }}>{t}</div><div style={{ marginTop: 6, fontSize: 13, color: LK_MUTED, lineHeight: 1.4 }}>{s}</div></div></div>)}</div>
    <div style={{ display: "flex", gap: 14, marginTop: 24 }}>
      <LkStat label="CONNECTION SUCCESS ⓘ" value={<div><div style={{ fontSize: 40, color: LK_CYAN, textAlign: "center", marginTop: 20 }}>100%</div><div style={{ marginTop: 30, borderTop: `1px dashed ${LK_CYAN}`, position: "relative" }}><span style={{ position: "absolute", right: 0, top: -4, width: 8, height: 8, borderRadius: 4, background: LK_CYAN }} /></div></div>} />
      <LkStat label="PLATFORMS ⓘ" value={<div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 14 }}><span style={{ width: 120, height: 120, borderRadius: 60, border: `10px solid ${LK_CYAN}` }} /><span style={{ fontSize: 13, color: "#c5cad2" }}><span style={{ display: "inline-block", width: 10, height: 10, background: LK_CYAN, marginRight: 8 }} />Linux 100%</span></div>} />
      <LkStat label="CONNECTION TYPE ⓘ" value={<div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 14 }}><span style={{ width: 120, height: 120, borderRadius: 60, border: `10px solid ${LK_CYAN}` }} /><span style={{ fontSize: 13, color: "#c5cad2" }}><span style={{ display: "inline-block", width: 10, height: 10, background: LK_CYAN, marginRight: 8 }} />UDP 100%</span></div>} />
      <LkStat label="TOP COUNTRIES ⓘ" value={<div style={{ fontSize: 13, marginTop: 6 }}><div style={{ display: "flex", color: LK_MUTED, borderBottom: `1px solid ${LK_LINE}`, paddingBottom: 6 }}><span style={{ width: 30 }}>#</span><span style={{ flex: 1 }}>NAME</span><span>COUNT</span></div><div style={{ display: "flex", paddingTop: 10, color: LK_TEXT }}><span style={{ width: 30 }}>1</span><span style={{ flex: 1 }}>United States</span><span>7</span></div></div>} />
    </div>
    <div style={{ marginTop: 26, fontSize: 15 }}>⌄ Participants</div>
    <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
      <LkStat label="WEBRTC PARTICIPANT MINUTES ⓘ" value={<div style={{ fontSize: 40, color: LK_CYAN, textAlign: "center", marginTop: 40 }}>14 <span style={{ fontSize: 22 }}>min</span></div>} />
      <LkStat label="PARTICIPANT MINUTES BY KIND ⓘ" value={<div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 10 }}><span style={{ width: 120, height: 120, borderRadius: 60, border: `10px solid ${LK_CYAN}`, borderRightColor: "#c85cff", borderBottomColor: "#ff9f43" }} /><div style={{ fontSize: 13, color: "#c5cad2", lineHeight: 1.9 }}><div><span style={{ display: "inline-block", width: 10, height: 10, background: LK_CYAN, marginRight: 8 }} />WebRTC participant minutes 14 min</div><div><span style={{ display: "inline-block", width: 10, height: 10, background: "#c85cff", marginRight: 8 }} />Agent session minutes 14 min</div><div><span style={{ display: "inline-block", width: 10, height: 10, background: "#ff9f43", marginRight: 8 }} />SIP participant minutes 6 min</div></div></div>} />
    </div>
  </LiveKitShell>
);
export const LiveKitAgents: React.FC<{ agent?: string; highlightAt?: number }> = ({ agent = "plivo-livekit-agent", highlightAt }) => {
  const f = useCurrentFrame(); const hi = highlightAt != null ? ease(f, highlightAt, highlightAt + 12) : 0;
  return (
    <LiveKitShell active="Agents" crumb="Agents" actions={<div style={{ display: "flex", gap: 10 }}><div style={{ height: 36, borderRadius: 8, border: `1px solid ${LK_LINE}`, padding: "0 14px", display: "flex", alignItems: "center", fontSize: 14, color: "#c5cad2" }}>⟳ Auto-refresh off ⌄</div><div style={{ height: 36, borderRadius: 8, border: `1px solid ${LK_LINE}`, padding: "0 14px", display: "flex", alignItems: "center", fontSize: 14, color: "#c5cad2" }}>Launch Console</div><div style={{ height: 36, borderRadius: 8, background: LK_CYAN, padding: "0 14px", display: "flex", alignItems: "center", fontSize: 14, fontWeight: 600, color: "#000" }}>Deploy new agent ⌄</div></div>}>
      <div style={{ display: "flex", gap: 14, marginTop: 6 }}><LkStat label="AGENTS DEPLOYED ⓘ" value="1" /><LkStat label="CONCURRENT AGENT SESSIONS ⓘ" value="0" /><LkStat label="AGENT SESSION MINUTES THIS BILLING PERIOD ⓘ" value={<span>0<span style={{ color: LK_MUTED }}>/1,000 min</span></span>} /></div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 22, fontSize: 15 }}>Overview<span style={{ flex: 1 }} /><span style={{ height: 32, borderRadius: 8, border: `1px solid ${LK_LINE}`, padding: "0 12px", display: "flex", alignItems: "center", fontSize: 13, color: "#c5cad2" }}>Past 7 days ⌄</span></div>
      <div style={{ marginTop: 12, background: LK_PANEL, border: `1px solid ${LK_LINE}`, borderRadius: 8, padding: "16px 18px", height: 200, position: "relative" }}><div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11.5, letterSpacing: 1, color: LK_MUTED }}>AGENT SESSIONS SERVED ⓘ</div><div style={{ marginTop: 8, fontSize: 12, color: "#c5cad2" }}><span style={{ display: "inline-block", width: 8, height: 8, background: LK_CYAN, marginRight: 6 }} />Total number of active sessions <span style={{ display: "inline-block", width: 8, height: 8, background: "#c85cff", margin: "0 6px 0 14px" }} />Agent dispatch errors</div>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 18, right: 18, top: 70 + i * 26, borderTop: `1px dashed ${LK_LINE}` }} />)}<div style={{ position: "absolute", left: 18, right: 18, bottom: 34, borderTop: `2px solid ${LK_CYAN}` }} /><div style={{ position: "absolute", left: 18, right: 18, bottom: 12, display: "flex", justifyContent: "space-between", fontSize: 11, color: LK_MUTED }}><span>Jul 15</span><span>Jul 17</span><span>Jul 19</span><span>Jul 21</span><span>Jul 22</span></div></div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 22, fontSize: 15 }}>Your agents<span style={{ flex: 1 }} /><span style={{ color: "#5c636d" }}>⊞ ☰</span></div>
      <div style={{ marginTop: 12, width: 430, background: LK_PANEL, border: `1px solid ${LK_LINE}`, borderRadius: 8, padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", fontSize: 16 }}><span style={{ padding: "2px 8px", margin: "-2px -8px", borderRadius: 6, boxShadow: hi ? `0 0 0 2px ${LK_CYAN}, 0 0 0 ${Math.round(hi * 6)}px rgba(31,213,249,0.18)` : "none", background: hi ? "rgba(31,213,249,0.10)" : "transparent" }}>{agent}</span> <span style={{ marginLeft: 8, color: LK_MUTED }}>☁</span><span style={{ marginLeft: "auto", color: LK_MUTED }}>⋮</span></div>
        <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, color: LK_MUTED, marginTop: 4 }}>CA_V3J8ujWdrv5t</div>
        <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, letterSpacing: 1, color: LK_MUTED, marginTop: 14 }}>CONCURRENT SESSIONS</div><div style={{ fontSize: 15, marginTop: 4 }}>0</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, fontSize: 12 }}><span style={{ color: "#4ade80", fontFamily: "ui-monospace, Menlo, monospace", letterSpacing: 1 }}>■ RUNNING</span><span style={{ color: LK_MUTED }}>Deployed <span style={{ background: "#1a1f25", padding: "2px 6px", borderRadius: 4, fontFamily: "ui-monospace, Menlo, monospace" }}>orbs253LQGHj</span> 4 minutes ago</span></div>
      </div>
    </LiveKitShell>
  );
};

// ---- Create new URI modal (opens over the drawer; the platform preset pre-fills the address) ----
export const CreateUriModal: React.FC<{ platform: string; address: string; name?: string; typing?: boolean; created?: boolean }> = ({ platform, address, name = "", typing }) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(15,17,23,0.55)" }} />
      <div style={{ position: "absolute", left: 600, top: 300, width: 720, borderRadius: 16, background: "#fff", boxShadow: "0 40px 120px rgba(15,17,23,0.35)", padding: "28px 32px", fontFamily: F, color: INK }}>
        <div style={{ display: "flex", alignItems: "center" }}><span style={{ fontSize: 22, fontWeight: 700 }}>Create new {platform} SIP URI</span><span style={{ marginLeft: "auto", fontSize: 20 }}>✕</span></div>
        <div style={{ marginTop: 22, fontSize: 14.5, fontWeight: 600 }}>Name</div>
        <div style={{ marginTop: 8, height: 46, borderRadius: 10, border: `1.5px solid ${typing ? INK : HAIR}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 15.5, color: name ? INK : "#9aa0ac" }}>{name || "Enter origination URI name"}{typing ? <span style={{ opacity: Math.round(f / 8) % 2 }}>▏</span> : null}</div>
        <div style={{ marginTop: 18, fontSize: 14.5, fontWeight: 600 }}>URI</div>
        <div style={{ marginTop: 8, height: 46, borderRadius: 10, border: `1px solid ${HAIR}`, background: "#f7f7f9", display: "flex", alignItems: "center", padding: "0 14px", fontSize: 15, color: INK }}>{address}<span style={{ marginLeft: "auto", fontSize: 12.5, color: SUB }}>pre-filled by the {platform} preset</span></div>
        <div style={{ marginTop: 18, fontSize: 14.5, fontWeight: 600 }}>Transport</div>
        <div style={{ marginTop: 8, display: "flex", gap: 10 }}>{["TLS", "TCP", "UDP"].map((t) => <span key={t} style={{ fontSize: 14, fontWeight: 600, padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${t === "TLS" ? INK : HAIR}`, background: t === "TLS" ? INK : "#fff", color: t === "TLS" ? "#fff" : INK }}>{t}</span>)}</div>
        <div style={{ marginTop: 26, display: "flex", justifyContent: "flex-end", gap: 10 }}><span style={{ fontSize: 15, fontWeight: 600, border: `1px solid ${HAIR}`, borderRadius: 10, padding: "12px 18px" }}>Cancel</span><span style={{ fontSize: 15, fontWeight: 600, color: "#fff", background: INK, borderRadius: 10, padding: "12px 18px" }}>Create URI</span></div>
      </div>
    </>
  );
};

// ---- OpenAI Realtime preset: the URI is built from the customer's project ID ------------------------
export const CreateProjectUriModal: React.FC<{ name?: string; typing?: boolean; projectId?: string; projectTyping?: boolean; auth?: boolean; busy?: boolean }> = ({ name = "", typing, projectId = "", projectTyping, auth, busy }) => {
  const f = useCurrentFrame(); const caret = <span style={{ opacity: Math.round(f / 8) % 2 }}>▏</span>;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(15,17,23,0.55)" }} />
      <div style={{ position: "absolute", left: 600, top: 300, width: 720, borderRadius: 16, background: "#fff", boxShadow: "0 40px 120px rgba(15,17,23,0.35)", padding: "28px 32px", fontFamily: F, color: INK }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ width: 26, height: 26, borderRadius: 7, background: INK, color: "#fff", fontSize: 13, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>⌬</span><span style={{ fontSize: 22, fontWeight: 700 }}>Create new OpenAI Realtime SIP URI</span><span style={{ marginLeft: "auto", fontSize: 20 }}>✕</span></div>
        <div style={{ marginTop: 22, fontSize: 14.5, fontWeight: 600 }}>Name</div>
        <div style={{ marginTop: 8, height: 46, borderRadius: 10, border: `1.5px solid ${typing ? INK : HAIR}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 15.5, color: name ? INK : "#9aa0ac" }}>{name || "Enter origination URI name"}{typing ? caret : null}</div>
        <div style={{ marginTop: 18, fontSize: 14.5, fontWeight: 600 }}>Project ID <span style={{ fontWeight: 400, color: SUB }}>ⓘ</span></div>
        <div style={{ marginTop: 8, height: 46, borderRadius: 10, border: `1.5px solid ${projectTyping ? INK : HAIR}`, display: "flex", alignItems: "center", fontSize: 15.5, overflow: "hidden" }}>
          <span style={{ padding: "0 14px", height: "100%", display: "flex", alignItems: "center", background: "#f7f7f9", borderRight: `1px solid ${HAIR}`, color: SUB }}>sip:</span>
          <span style={{ padding: "0 12px", flex: 1, color: projectId ? INK : "#9aa0ac", fontFamily: projectId ? "ui-monospace, Menlo, monospace" : F, fontSize: projectId ? 15 : 15.5 }}>{projectId || "proj_…"}{projectTyping ? caret : null}</span>
          <span style={{ padding: "0 14px", height: "100%", display: "flex", alignItems: "center", background: "#f7f7f9", borderLeft: `1px solid ${HAIR}`, color: SUB }}>@sip.api.openai.com</span>
        </div>
        <div style={{ marginTop: 18, display: "flex", gap: 10 }}><span style={{ fontSize: 14, fontWeight: 600, padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${INK}`, background: INK, color: "#fff" }}>TLS</span></div>
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12 }}><span style={{ width: 40, height: 22, borderRadius: 11, background: auth ? INK : "#d7dae0", position: "relative" }}><span style={{ position: "absolute", top: 3, left: auth ? 21 : 3, width: 16, height: 16, borderRadius: 8, background: "#fff" }} /></span><span style={{ fontSize: 14.5, color: INK }}>Authentication needed</span></div>
        <div style={{ marginTop: 26, display: "flex", justifyContent: "flex-start" }}><span style={{ fontSize: 15, fontWeight: 600, color: "#fff", background: INK, borderRadius: 10, padding: "12px 18px", opacity: busy ? 0.6 : 1 }}>{busy ? "Creating…" : "Create URI"}</span></div>
      </div>
    </>
  );
};
