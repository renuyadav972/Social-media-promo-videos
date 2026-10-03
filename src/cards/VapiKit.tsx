import React from "react";
import { useCurrentFrame } from "remotion";
import { INTER_FAMILY } from "../fonts";

// A recreated Vapi dashboard (dark). Generic org name, no keys, no credits.
const F = `${INTER_FAMILY}, sans-serif`;
export const VP_BG = "#0e1114"; export const VP_RAIL = "#0b0e11"; export const VP_PANEL = "#151a1f"; export const VP_LINE = "#232a31"; export const VP_INK = "#e9edf1"; export const VP_SUB = "#8b95a1"; export const VP_GREEN = "#5fd38d";
const NAV: [string, string[]][] = [["VAPI LABS", ["Composer"]], ["BUILD", ["Assistants", "Squads", "Tools", "Phone numbers", "Campaigns"]], ["TEST", ["Evals", "Simulations"]], ["OBSERVE", ["Logs", "Boards", "Structured outputs", "Monitoring", "Metrics"]]];
const Glyph: React.FC = () => <span style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${VP_SUB}`, display: "inline-block", marginRight: 12, opacity: 0.8 }} />;

export const VapiShell: React.FC<{ active: string; children: React.ReactNode }> = ({ active, children }) => (
  <div style={{ position: "absolute", inset: 0, background: VP_BG, fontFamily: F, color: VP_INK, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 300, background: VP_RAIL, borderRight: `1px solid ${VP_LINE}` }}>
      <div style={{ padding: "26px 24px 10px", fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}><span style={{ color: VP_GREEN }}>▾</span>vapi</div>
      <div style={{ margin: "10px 16px", padding: "10px 14px", borderRadius: 10, background: VP_PANEL, border: `1px solid ${VP_LINE}`, fontSize: 15, display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 24, height: 24, borderRadius: 6, background: VP_GREEN, color: "#000", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>W</span>Workspace<span style={{ marginLeft: "auto", color: VP_SUB }}>⇅</span></div>
      {NAV.map(([h, items]) => <div key={h}><div style={{ padding: "18px 26px 6px", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, letterSpacing: 1.5, color: VP_SUB }}>{h}</div>{items.map((n) => <div key={n} style={{ display: "flex", alignItems: "center", margin: "0 12px", padding: "10px 14px", borderRadius: 8, fontSize: 16, background: n === active ? "#1a2a22" : "transparent", color: n === active ? VP_GREEN : VP_INK }}><Glyph />{n}{n === "Campaigns" ? <span style={{ marginLeft: 10, fontSize: 11, color: "#f2b54a", background: "#3a2d14", padding: "2px 7px", borderRadius: 5 }}>Beta</span> : null}</div>)}</div>)}
    </div>
    <div style={{ position: "absolute", left: 300, top: 0, right: 0, bottom: 0 }}>{children}</div>
  </div>
);
const Topbar: React.FC<{ title: React.ReactNode; sub?: string; right?: React.ReactNode }> = ({ title, sub, right }) => <div style={{ height: 78, display: "flex", alignItems: "center", padding: "0 28px", borderBottom: `1px solid ${VP_LINE}` }}><div><div style={{ fontSize: 22, fontWeight: 600 }}>{title}</div>{sub ? <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, color: VP_SUB, marginTop: 2 }}>{sub}</div> : null}</div><div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>{right}</div></div>;
const Btn: React.FC<{ children: React.ReactNode; primary?: boolean; green?: boolean }> = ({ children, primary, green }) => <span style={{ height: 38, padding: "0 16px", borderRadius: 8, display: "inline-flex", alignItems: "center", fontSize: 15, fontWeight: 600, background: green ? "#1f5a3a" : primary ? VP_INK : "transparent", color: green ? "#bff0d0" : primary ? "#000" : VP_INK, border: green || primary ? "none" : `1px solid ${VP_LINE}` }}>{children}</span>;
const Section: React.FC<{ title: string; sub: string; children: React.ReactNode }> = ({ title, sub, children }) => <div style={{ margin: "22px 28px 0", background: VP_PANEL, border: `1px solid ${VP_LINE}`, borderRadius: 14, padding: "22px 26px" }}><div style={{ fontSize: 18, fontWeight: 600 }}>{title}</div><div style={{ fontSize: 13.5, color: VP_SUB, marginTop: 4, marginBottom: 16 }}>{sub}</div>{children}</div>;
const Row: React.FC<{ icon: string; label: string; help: string; children: React.ReactNode }> = ({ icon, label, help, children }) => <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginTop: 16 }}><span style={{ width: 38, height: 38, borderRadius: 9, background: "#1c232a", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 16, flex: "none" }}>{icon}</span><div style={{ flex: 1 }}><div style={{ fontSize: 15.5, fontWeight: 600 }}>{label}</div><div style={{ fontSize: 13, color: VP_SUB, marginTop: 2, marginBottom: 8 }}>{help}</div>{children}</div></div>;
const Field: React.FC<{ value?: string; placeholder?: string; select?: boolean; focus?: boolean; check?: boolean; mono?: boolean }> = ({ value, placeholder, select, focus, check, mono }) => <div style={{ height: 42, borderRadius: 8, background: "#0b0e11", border: `1px solid ${focus ? VP_GREEN : VP_LINE}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 15, color: value ? VP_INK : VP_SUB, fontFamily: mono ? "ui-monospace, Menlo, monospace" : F }}>{value || placeholder}{check ? <span style={{ marginLeft: "auto", color: VP_GREEN }}>●</span> : null}{select ? <span style={{ marginLeft: "auto", color: VP_SUB }}>⌄</span> : null}</div>;

// Phone numbers list + the number page (Inbound Settings: assistant dropdown)
export const NUMBERS: [string, string][] = [["+1 (260) 321 2103", "Vapi · Untitled"], ["+1 (701) 719 8695", "Byo-phone-number · Plivo SIP Number"]];
export const VapiNumberPage: React.FC<{ numbers?: [string, string][]; selected?: number; assistant?: string; assistantOpen?: boolean; assistantHover?: boolean; saved?: boolean; scrolled?: boolean }> = ({ numbers = NUMBERS, selected = 1, assistant, assistantOpen, assistantHover, saved = true, scrolled }) => (
  <VapiShell active="Phone numbers">
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 300, borderRight: `1px solid ${VP_LINE}` }}>
      <div style={{ height: 78, display: "flex", alignItems: "center", padding: "0 20px", fontSize: 18, fontWeight: 600, borderBottom: `1px solid ${VP_LINE}` }}>Phone Numbers <span style={{ marginLeft: 8, color: VP_SUB, fontSize: 13 }}>{numbers.length}</span></div>
      <div style={{ margin: "16px 14px 0", height: 38, borderRadius: 8, border: `1px solid ${VP_LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600 }}>＋ Create Phone Number</div>
      <div style={{ margin: "12px 14px 0", height: 38, borderRadius: 8, background: "#0b0e11", border: `1px solid ${VP_LINE}`, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 14, color: VP_SUB }}>Search Phone Numbers</div>
      <div style={{ marginTop: 22 }}>{numbers.map(([n, s], i) => <div key={n} style={{ margin: "0 14px 8px", padding: "10px 14px", borderRadius: 8, background: i === selected ? "#1a2a22" : "transparent", borderLeft: i === selected ? `3px solid ${VP_GREEN}` : "3px solid transparent" }}><div style={{ fontSize: 15.5, fontWeight: 600 }}>{n}</div><div style={{ fontSize: 12.5, color: VP_SUB, marginTop: 2 }}>{s}</div></div>)}</div>
    </div>
    <div style={{ position: "absolute", left: 300, top: 0, right: 0, bottom: 0, overflow: "hidden" }}>
      <Topbar title={numbers[selected][0]} sub="00e7d9d0-357b-47c6-9c37-1d5237dd7d86" right={<><Btn>Test</Btn><Btn green={saved} primary={!saved}>{saved ? "Saved" : "Save"}</Btn></>} />
      <div style={{ position: "absolute", left: 0, right: 0, top: scrolled ? -470 + 78 : 78 }}>
        <Section title="Phone Number Details" sub="Give your phone number a descriptive name to help identify it in your list."><Row icon="🏷" label="Phone Number Label" help="A friendly name to help you identify this number in your list."><Field value="Plivo SIP Number" /></Row><Row icon="⌁" label="Provider" help="The carrier this number is provisioned through. Set at creation time."><Field value="Byo-phone-number" /></Row></Section>
        <Section title="Server URL" sub="Configure a custom server URL for this phone number."><Row icon="🌐" label="Server URL" help="The URL of your Vapi server."><Field placeholder="https://api.example.com/function" /></Row></Section>
        <Section title="Inbound Settings" sub="Assign an assistant to handle incoming calls to this phone number.">
          <Row icon="☎" label="Inbound Phone Number" help="The address callers dial to reach this number."><Field value="+17017198695" check /></Row>
          <Row icon="◍" label="Assistant" help="The assistant that answers inbound calls to this number."><div style={{ position: "relative" }}><Field value={assistant} placeholder="Select Assistant..." select focus={assistantOpen} />{assistantOpen ? <div style={{ position: "absolute", left: 0, right: 0, top: 48, borderRadius: 10, background: "#0b0e11", border: `1px solid ${VP_LINE}`, boxShadow: "0 20px 50px rgba(0,0,0,0.5)", zIndex: 3 }}><div style={{ padding: "12px 14px", fontSize: 14, color: VP_SUB, borderBottom: `1px solid ${VP_LINE}` }}>Search...</div><div style={{ padding: "12px 14px", fontSize: 15, background: assistantHover ? "#1a2a22" : "transparent" }}>Plivo Voice Assistant <span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, color: VP_SUB }}>(2645befb-801b-43e9-873d-77aa3864a998)</span></div></div> : null}</div></Row>
          <Row icon="⚇" label="Squad" help="Send calls to a squad to hand off between multiple assistants."><div style={{ height: 42, borderRadius: 8, background: "#2a2412", border: "1px solid #5a4a1a", display: "flex", alignItems: "center", padding: "0 14px", fontSize: 14, color: "#f2d27a" }}>⚠ No squads available. Create a squad to enable this feature.</div></Row>
          <Row icon="↪" label="Fallback Destination" help="Transfer calls here when the assistant or squad is unavailable."><Field placeholder="🇺🇸  5551234567" /></Row>
        </Section>
      </div>
    </div>
  </VapiShell>
);

// Create Phone Number dialog → BYO SIP Trunk Number
export const VapiImportDialog: React.FC<{ tab?: "byo" | "twilio"; number?: string; typing?: boolean; credentialOpen?: boolean; credential?: string; label?: string; busy?: boolean }> = ({ tab = "byo", number = "", typing, credentialOpen, credential, label = "", busy }) => {
  const f = useCurrentFrame(); const opts = ["Free Vapi Number", "Free Vapi SIP", "Import Twilio", "Import Vonage", "Import Telnyx", "BYO SIP Trunk Number"];
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", left: 280, top: 160, width: 1360, height: 720, borderRadius: 14, background: "#0f1317", border: `1px solid ${VP_LINE}`, boxShadow: "0 40px 120px rgba(0,0,0,0.6)", display: "flex", fontFamily: F, color: VP_INK }}>
        <div style={{ width: 320, borderRight: `1px solid ${VP_LINE}`, padding: "30px 24px" }}><div style={{ fontSize: 18, fontWeight: 600, marginBottom: 14 }}>Phone Number Options</div>{opts.map((o) => { const on = (tab === "byo" && o === "BYO SIP Trunk Number") || (tab === "twilio" && o === "Import Twilio"); return <div key={o} style={{ padding: "12px 16px", borderRadius: 8, fontSize: 17, background: on ? "#1a2a22" : "transparent", color: on ? VP_GREEN : VP_INK, borderLeft: on ? `3px solid ${VP_GREEN}` : "3px solid transparent" }}>{o}</div>; })}</div>
        <div style={{ flex: 1, padding: "30px 34px", position: "relative" }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Phone Number</div>
          <div style={{ marginTop: 10, height: 46, borderRadius: 8, background: "#0b0e11", border: `1px solid ${typing ? VP_GREEN : VP_LINE}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 17, color: number ? VP_INK : VP_SUB }}>{number || "+14155551234"}{typing ? <span style={{ opacity: Math.round(f / 8) % 2 }}>▏</span> : null}</div>
          <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}><span style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${VP_SUB}` }} /><div><div style={{ fontSize: 15 }}>Allow non-E164 phone numbers</div><div style={{ fontSize: 12.5, color: VP_SUB }}>Check this box to disable E164 format validation and use custom phone number formats</div></div></div>
          <div style={{ marginTop: 26, fontSize: 16, fontWeight: 600 }}>SIP Trunk Credential</div>
          <div style={{ position: "relative" }}><div style={{ marginTop: 10, height: 46, borderRadius: 8, background: "#0b0e11", border: `1px solid ${credentialOpen ? VP_GREEN : VP_LINE}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 17, color: credential ? VP_INK : VP_SUB }}>{credential || "Select a SIP trunk credential"}<span style={{ marginLeft: "auto", color: VP_SUB }}>⌄</span></div>
            {credentialOpen ? <div style={{ position: "absolute", left: 0, right: 0, top: 58, borderRadius: 10, background: "#0b0e11", border: `1px solid ${VP_LINE}`, boxShadow: "0 20px 50px rgba(0,0,0,0.5)", zIndex: 3 }}>{["PLIVO Trunk", "Plivo Zentrunk"].map((c, i) => <div key={c} style={{ padding: "13px 14px", fontSize: 16, background: i === 0 ? "#1a2a22" : "transparent" }}>{c}</div>)}</div> : null}</div>
          <div style={{ marginTop: 26, fontSize: 16, fontWeight: 600 }}>Label</div>
          <div style={{ marginTop: 10, height: 46, borderRadius: 8, background: "#0b0e11", border: `1px solid ${VP_LINE}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 17, color: label ? VP_INK : VP_SUB }}>{label || "Label for Phone Number"}</div>
          <div style={{ marginTop: 14, fontSize: 14, color: "#7fb3ff" }}>Read more about SIP trunking in the documentation</div>
          <div style={{ position: "absolute", right: 34, bottom: 30, display: "flex", gap: 12 }}><Btn>Cancel</Btn><span style={{ height: 38, padding: "0 16px", borderRadius: 8, display: "inline-flex", alignItems: "center", fontSize: 15, fontWeight: 600, background: number && credential ? "#1f5a3a" : "#16321f", color: number && credential ? "#bff0d0" : "#5d8a6a", opacity: busy ? 0.7 : 1 }}>{busy ? "Importing…" : "Import SIP Phone Number"}</span></div>
        </div>
      </div>
    </>
  );
};

// Logs → Calls
export const VapiLogsPage: React.FC<{ rows?: number }> = ({ rows = 1 }) => (
  <VapiShell active="Logs">
    <Topbar title="Logs" sub="Updated just now" right={<><Btn>⟳ Refresh</Btn><Btn>Export All</Btn></>} />
    <div style={{ display: "flex", gap: 28, padding: "0 28px", borderBottom: `1px solid ${VP_LINE}` }}>{["Calls", "Chat", "Sessions", "Webhooks", "API"].map((t, i) => <div key={t} style={{ padding: "16px 0 12px", fontSize: 16, color: i === 0 ? VP_GREEN : VP_SUB, borderBottom: i === 0 ? `2px solid ${VP_GREEN}` : "2px solid transparent" }}>{t}</div>)}</div>
    <div style={{ display: "flex", gap: 12, padding: "20px 28px 0" }}>{["📅 Last 7 days", "Call ID", "Assistants", "Squads", "Phone Numbers"].map((t) => <div key={t} style={{ height: 40, padding: "0 14px", borderRadius: 8, border: `1px solid ${VP_LINE}`, background: "#0b0e11", display: "flex", alignItems: "center", fontSize: 14.5, color: VP_SUB, minWidth: 170 }}>{t}</div>)}</div>
    <div style={{ display: "grid", gridTemplateColumns: "150px 240px 90px 220px 210px 130px 150px 200px", padding: "28px 28px 12px", fontSize: 14, color: VP_SUB, borderBottom: `1px solid ${VP_LINE}`, margin: "0" }}>{["Call ID", "Assistant / Squad", "Version", "Assistant Phone Number", "Customer Phone Number", "Type", "Ended Reason", "Start Time"].map((h) => <span key={h}>{h}</span>)}</div>
    {rows > 0 ? <div style={{ display: "grid", gridTemplateColumns: "150px 240px 90px 220px 210px 130px 150px 200px", alignItems: "center", padding: "18px 28px", fontSize: 14.5, borderBottom: `1px solid ${VP_LINE}` }}><span style={{ fontFamily: "ui-monospace, Menlo, monospace", color: VP_SUB }}>01a0...8a79</span><span><div>◍ Plivo Voice Assistant</div><div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, color: VP_SUB }}>2645...a998</div></span><span style={{ fontFamily: "ui-monospace, Menlo, monospace", color: VP_GREEN, fontSize: 12 }}>v1</span><span><div>+1 (701) 719 8695</div><div style={{ fontSize: 12, color: VP_SUB }}>Plivo SIP Number</div></span><span>+1 (415) 481 3244</span><span><span style={{ background: "#1a2a22", color: VP_GREEN, padding: "4px 10px", borderRadius: 6, fontSize: 13 }}>☎ Inbound</span></span><span><span style={{ background: "#14303a", color: "#7fd7ff", padding: "4px 10px", borderRadius: 6, fontSize: 13 }}>Customer</span></span><span>Sep 21, 2026, 15:30</span></div> : <div style={{ padding: "80px 0", textAlign: "center", color: VP_SUB, fontSize: 15 }}>No call logs available</div>}
  </VapiShell>
);
