import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "./fonts";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { BrandIntro } from "./BrandIntro";
import { TightStageClip } from "./TightStageClip";
import { TightCaptions, type Caption } from "./TightCaption";
import { MUSIC } from "./promoConfig";
import type { Motion } from "./StageClip";
import { NewConsoleShell, PageHeader, TabRow, DarkButton, LINK } from "./cards/NewConsoleShell";
import { Ico } from "./cards/consoleIcons";

// ============================================================================
// ConsoleComparison — a detailed, informational tour of the NEW Plivo console
// (~90s, grouped Build / Deploy / Monitor / Settings). Each group's narration
// runs 2-3 sentences and the screens switch IN SYNC with the words. Simulated
// but built to match the real Loom screens. Dead-static cameras, opacity-only
// reveals (no shimmer). Clean SVG icons, full tables, neutral palette.
// ============================================================================

const INK = "#1f2430";
const SUB = "#6b7280";
const HAIR = "#ececef";
const GREEN = "#16a34a";
const PURPLE = "#cd3ef9";

// ---- Beat layout (durations sized to each VO line) -----------------------
const DUR = {
  brand: 135,
  intro: 380,
  build: 515,
  deploy: 455,
  monitor: 430,
  settings: 665,
  cta: 200,
} as const;
const ORDER = ["brand", "intro", "build", "deploy", "monitor", "settings", "cta"] as const;
const BEAT = (() => {
  const out = {} as Record<(typeof ORDER)[number], { from: number; dur: number }>;
  let acc = 0;
  for (const k of ORDER) {
    out[k] = { from: acc, dur: DUR[k] };
    acc += DUR[k];
  }
  return out;
})();
export const CONSOLE_TOTAL_FRAMES = Object.values(DUR).reduce((a, b) => a + b, 0);

// ---- Voiceover (VO variant only) -----------------------------------------
const VO: { src: string; from: number }[] = [
  { src: "vo/console-comparison/01-intro.mp3", from: BEAT.intro.from + 8 },
  { src: "vo/console-comparison/02-build.mp3", from: BEAT.build.from + 8 },
  { src: "vo/console-comparison/03-deploy.mp3", from: BEAT.deploy.from + 8 },
  { src: "vo/console-comparison/04-monitor.mp3", from: BEAT.monitor.from + 8 },
  { src: "vo/console-comparison/05-settings.mp3", from: BEAT.settings.from + 8 },
  { src: "vo/console-comparison/06-cta.mp3", from: BEAT.cta.from + 8 },
];

// Sub-screen switch offsets within a group beat (frames from beat start).
const SUBAT = {
  buildApps: 380,
  deployWa: 220,
  deployComp: 340,
  monitorAnalytics: 250,
  monitorAlerting: 340,
  settingsIP: 220,
  settingsGeo: 325,
  settingsMsg: 430,
  settingsBilling: 550,
} as const;

// ---- Captions (per sub-screen; one purple keyword; no em-dashes) ---------
const cap = (from: number, start: number, end: number, pre: string, keyword: string, post?: string): Caption => ({ start: from + start, end: from + end, pre, keyword, post });
const CAPTIONS: Caption[] = [
  cap(BEAT.intro.from, 12, BEAT.intro.dur - 6, "Organized into ", "Build, Deploy, Monitor"),
  cap(BEAT.build.from, 12, SUBAT.buildApps - 6, "Build: ", "create your agents"),
  cap(BEAT.build.from, SUBAT.buildApps + 6, BEAT.build.dur - 6, "Trunking, apps and ", "endpoints"),
  cap(BEAT.deploy.from, 12, SUBAT.deployWa - 6, "Deploy: ", "phone numbers"),
  cap(BEAT.deploy.from, SUBAT.deployWa + 6, SUBAT.deployComp - 6, "Build ", "WhatsApp templates"),
  cap(BEAT.deploy.from, SUBAT.deployComp + 6, BEAT.deploy.dur - 6, "10DLC and toll-free ", "compliance"),
  cap(BEAT.monitor.from, 12, SUBAT.monitorAnalytics - 6, "Monitor: ", "all your logs"),
  cap(BEAT.monitor.from, SUBAT.monitorAnalytics + 6, SUBAT.monitorAlerting - 6, "Performance ", "analytics"),
  cap(BEAT.monitor.from, SUBAT.monitorAlerting + 6, BEAT.monitor.dur - 6, "Proactive ", "alerting"),
  cap(BEAT.settings.from, 12, SUBAT.settingsIP - 6, "Account settings under your ", "profile"),
  cap(BEAT.settings.from, SUBAT.settingsIP + 6, SUBAT.settingsGeo - 6, "Lock down with ", "IP whitelisting"),
  cap(BEAT.settings.from, SUBAT.settingsGeo + 6, SUBAT.settingsMsg - 6, "Reach control with ", "geo permissions"),
  cap(BEAT.settings.from, SUBAT.settingsMsg + 6, SUBAT.settingsBilling - 6, "Messaging and ", "voice settings"),
  cap(BEAT.settings.from, SUBAT.settingsBilling + 6, BEAT.settings.dur - 6, "Invoices, payments and ", "plans"),
];

// ---- helpers -------------------------------------------------------------
const FadeIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [4, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return <div style={{ height: "100%", opacity: op }}>{children}</div>;
};

// Crossfade between full-screen sub-screens at given frame offsets.
const SubScreens: React.FC<{ screens: { at: number; node: React.ReactNode }[] }> = ({ screens }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "relative", height: "100%" }}>
      {screens.map((s, i) => {
        const start = s.at;
        const end = i + 1 < screens.length ? screens[i + 1].at : 1e9;
        const inOp = i === 0 ? 1 : interpolate(f, [start - 10, start], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const outOp = i === screens.length - 1 ? 1 : interpolate(f, [end - 10, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const op = Math.min(inOp, outOp);
        if (op <= 0.001) return null;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, opacity: op }}>
            {s.node}
          </div>
        );
      })}
    </div>
  );
};

const stepLabel = (frame: number, start: number, end: number, items: string[]) => items[Math.min(items.length - 1, Math.max(0, Math.floor(interpolate(frame, [start, end], [0, items.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))))];

// ---- shared UI primitives ------------------------------------------------
const Chip: React.FC<{ icon?: React.ReactNode; children: React.ReactNode; caret?: boolean }> = ({ icon, children, caret }) => (
  <div style={{ height: 34, display: "inline-flex", alignItems: "center", gap: 7, padding: "0 12px", borderRadius: 8, border: `1px solid ${HAIR}`, background: "#fff", fontSize: 12.5, color: SUB, whiteSpace: "nowrap" }}>
    {icon ? <span style={{ display: "inline-flex", color: "#9aa0ac" }}>{icon}</span> : null}
    {children}
    {caret ? <span style={{ display: "inline-flex", color: "#b8bcc6" }}><Ico name="chevron" size={13} /></span> : null}
  </div>
);
const StatusPill: React.FC<{ tone?: "green" | "grey" | "red"; children: React.ReactNode }> = ({ tone = "grey", children }) => {
  const map = { green: [GREEN, "#e9f8ee"], grey: ["#6b7280", "#f1f2f4"], red: ["#dc2626", "#fdeaea"] } as const;
  const [fg, bg] = map[tone];
  return <span style={{ fontSize: 11.5, fontWeight: 600, color: fg, background: bg, borderRadius: 6, padding: "3px 9px" }}>{children}</span>;
};
const Th: React.FC<{ w?: number | string; flex?: number; right?: boolean; children: React.ReactNode }> = ({ w, flex, right, children }) => (
  <div style={{ width: w, flex, textAlign: right ? "right" : "left" }}>{children}</div>
);
const Table: React.FC<{ head: React.ReactNode; children: React.ReactNode }> = ({ head, children }) => (
  <div style={{ border: `1px solid ${HAIR}`, borderRadius: 12, overflow: "hidden", background: "#fff" }}>
    <div style={{ display: "flex", padding: "12px 18px", background: "#fafafb", fontSize: 11.5, color: "#9aa0ac", fontWeight: 600, borderBottom: `1px solid ${HAIR}` }}>{head}</div>
    {children}
  </div>
);
const Row: React.FC<{ last?: boolean; children: React.ReactNode }> = ({ last, children }) => (
  <div style={{ display: "flex", alignItems: "center", padding: "12px 18px", fontSize: 13, color: INK, borderBottom: last ? "none" : `1px solid ${HAIR}` }}>{children}</div>
);
const Pager: React.FC<{ label: string }> = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, padding: "12px 26px 0", color: SUB, fontSize: 12.5 }}>{label}</div>
);

// ==========================================================================
// Pages
// ==========================================================================

// ---- Home ----
const HomeInfo: React.FC<{ label: string; value: React.ReactNode; link?: string; mono?: boolean }> = ({ label, value, link, mono }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
    <div style={{ fontSize: 12, color: "#9aa0ac", fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 14.5, color: INK, fontWeight: 600, fontFamily: mono ? "ui-monospace, SFMono-Regular, Menlo, monospace" : undefined, whiteSpace: "nowrap" }}>{value}</div>
    {link ? <div style={{ fontSize: 12.5, color: LINK, fontWeight: 600 }}>{link}</div> : null}
  </div>
);
const StartCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: `1px solid ${HAIR}`, borderRadius: 12, padding: "15px 16px" }}>
    <div style={{ width: 38, height: 38, borderRadius: 10, background: "#f1f2f4", color: "#4b5160", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{title}</div>
      <div style={{ fontSize: 12, color: SUB, marginTop: 2 }}>{desc}</div>
    </div>
    <span style={{ color: "#c2c6cf", display: "inline-flex", transform: "rotate(-90deg)" }}><Ico name="chevron" size={14} /></span>
  </div>
);
const StartCol: React.FC<{ heading: string; sub: string; cards: { icon: React.ReactNode; title: string; desc: string }[] }> = ({ heading, sub, cards }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
    <div>
      <div style={{ fontSize: 14.5, fontWeight: 700, color: INK, fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif` }}>{heading}</div>
      <div style={{ fontSize: 12, color: SUB, marginTop: 3 }}>{sub}</div>
    </div>
    {cards.map((c) => (<StartCard key={c.title} {...c} />))}
  </div>
);
const HomePage: React.FC = () => (
  <div style={{ height: "100%", overflow: "hidden" }}>
    <PageHeader title="Welcome back!" />
    <div style={{ padding: "16px 26px 0" }}>
      <div style={{ background: "#fff", border: `1px solid ${HAIR}`, borderRadius: 14, padding: "18px 22px", display: "flex", gap: 26, alignItems: "center" }}>
        <HomeInfo label="Auth ID" value="MA0DK2MZG4YZKYMTNLNT" mono />
        <HomeInfo label="Auth Token" value="••••••••••••••••" mono />
        <div style={{ width: 1, height: 38, background: HAIR }} />
        <HomeInfo label="Remaining Credits" value="$83.94" link="Add Credits" />
        <HomeInfo label="Payment Mode" value="Prepaid" link="Setup Auto Recharge" />
        <HomeInfo label="Outbound CPS Limit" value="20" />
        <HomeInfo label="Monthly Usage" value="$200 of $100" />
      </div>
      <div style={{ marginTop: 22 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: INK, fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif` }}>Let's get you started</div>
        <div style={{ display: "flex", gap: 20, marginTop: 14 }}>
          <StartCol heading="Build your first use case" sub="Integrate your communication logic." cards={[{ icon: <Ico name="sip" />, title: "SIP Trunking", desc: "Connect your SIP infrastructure" }, { icon: <Ico name="code" />, title: "Applications", desc: "Create and manage applications" }]} />
          <StartCol heading="Deploy" sub="Launch across every channel." cards={[{ icon: <Ico name="hash" />, title: "Buy Phone Number", desc: "Buy voice and SMS numbers" }, { icon: <Ico name="whatsapp" />, title: "Buy WhatsApp Number", desc: "Profiles, numbers and templates" }]} />
          <StartCol heading="Monitor performance" sub="Track and gain realtime insight." cards={[{ icon: <Ico name="list" />, title: "Logs", desc: "View calls and messaging logs" }, { icon: <Ico name="bell" />, title: "Alerting", desc: "Configure alerts and notifications" }]} />
        </div>
      </div>
    </div>
  </div>
);

// ---- Agents ----
const AGENTS = [
  ["Appointment Booking Agent", "green", "voice", "Tushar Krishna", "2"],
  ["Customer Support", "green", "voice", "Bhushan Barsagade", "4"],
  ["Lead Qualification Agent", "green", "api", "Renu Yadav", "1"],
  ["Order Status Bot", "grey", "api", "Plivo Account", "0"],
  ["Healthcare Intake", "green", "voice", "Divya Menon", "3"],
  ["Survey Caller", "green", "voice", "Plivo Account", "1"],
  ["Collections Assistant", "grey", "api", "Renu Yadav", "2"],
  ["Outbound Reminders", "green", "voice", "Aarav Shah", "1"],
  ["Returns and Refunds", "green", "api", "Bhushan Barsagade", "5"],
  ["Feedback Collector", "grey", "voice", "Divya Menon", "0"],
  ["Renewal Outreach", "green", "voice", "Renu Yadav", "2"],
] as [string, "green" | "grey", "voice" | "api", string, string][];
const AgentsPage: React.FC = () => (
  <div style={{ height: "100%", overflow: "hidden" }}>
    <PageHeader title="Agents" subtitle="Manage agents for your organization" action={
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ height: 38, display: "inline-flex", alignItems: "center", padding: "0 16px", borderRadius: 8, border: `1px solid ${HAIR}`, color: INK, fontSize: 14, fontWeight: 500 }}>Import Agent</div>
        <DarkButton><span style={{ display: "inline-flex", marginRight: 6 }}><Ico name="plus" size={14} /></span>Create Agent</DarkButton>
      </div>
    } />
    <div style={{ display: "flex", gap: 10, padding: "14px 26px 0" }}>
      <Chip icon={<Ico name="search" size={14} />}>Search by name</Chip>
      <Chip caret>Status</Chip><Chip caret>Trigger</Chip><Chip caret>Created By</Chip>
    </div>
    <div style={{ padding: "14px 26px 0" }}>
      <Table head={<><Th flex={1.7}>Name</Th><Th w={90}>Status</Th><Th w={140}>Trigger</Th><Th flex={1.2}>Created By</Th><Th w={130}>Knowledge Bases</Th></>}>
        {AGENTS.map((r, i) => (
          <Row key={i} last={i === AGENTS.length - 1}>
            <div style={{ flex: 1.7, fontWeight: 500 }}>{r[0]}</div>
            <div style={{ width: 90 }}><StatusPill tone={r[1]}>{r[1] === "green" ? "Active" : "Draft"}</StatusPill></div>
            <div style={{ width: 140, color: SUB, display: "flex", alignItems: "center", gap: 7 }}><Ico name={r[2] === "voice" ? "phone" : "bolt"} size={13} />{r[2] === "voice" ? "Voice Call" : "API Request"}</div>
            <div style={{ flex: 1.2, color: SUB }}>{r[3]}</div>
            <div style={{ width: 130, color: SUB }}>{r[4]}</div>
          </Row>
        ))}
      </Table>
      <Pager label="1-50 of 2,726" />
    </div>
  </div>
);

// ---- Applications ----
const APPS = [
  ["Default Number App", "292351f...8c", "3 Numbers", "1 Endpoint"],
  ["Direct Dial", "548580f...4a", "7 Numbers", "7 Endpoints"],
  ["cc-collector", "274640f...90", "1 Number", "0 Endpoints"],
  ["gibberlink-path-ivr", "909082f...3a", "2 Numbers", "1 Endpoint"],
  ["agent-transport-e2e", "985069f...11", "0 Numbers", "4 Endpoints"],
  ["support-router", "215322f...77", "5 Numbers", "2 Endpoints"],
  ["survey-outbound", "771204f...d2", "1 Number", "0 Endpoints"],
  ["voicemail-drop", "330418f...6e", "2 Numbers", "1 Endpoint"],
  ["after-hours-ivr", "662091f...ab", "4 Numbers", "3 Endpoints"],
] as [string, string, string, string][];
const ApplicationsPage: React.FC = () => (
  <div style={{ height: "100%", overflow: "hidden" }}>
    <PageHeader title="Applications" subtitle="Create and manage your voice and messaging applications" action={<DarkButton><span style={{ display: "inline-flex", marginRight: 6 }}><Ico name="plus" size={14} /></span>Create Application</DarkButton>} />
    <div style={{ display: "flex", gap: 10, padding: "14px 26px 0" }}>
      <Chip icon={<Ico name="search" size={14} />}>Search applications</Chip>
      <Chip caret>Type</Chip>
    </div>
    <div style={{ padding: "14px 26px 0" }}>
      <Table head={<><Th flex={1.4}>Application Name</Th><Th flex={1.3}>App ID</Th><Th w={150}>Linked Numbers</Th><Th w={150}>Linked Endpoints</Th></>}>
        {APPS.map((r, i) => (
          <Row key={i} last={i === APPS.length - 1}>
            <div style={{ flex: 1.4, fontWeight: 500 }}>{r[0]}</div>
            <div style={{ flex: 1.3, color: SUB, fontFamily: "ui-monospace, Menlo, monospace" }}>{r[1]}</div>
            <div style={{ width: 150, color: SUB }}>{r[2]}</div>
            <div style={{ width: 150, color: SUB }}>{r[3]}</div>
          </Row>
        ))}
      </Table>
      <Pager label="1-50 of 152" />
    </div>
  </div>
);

// ---- Phone Numbers ----
const NUMS = [
  ["+1 415 555 0142", "San Francisco, CA", "Local", ["Voice", "SMS", "MMS"]],
  ["+1 347 324 5320", "New York, NY", "Local", ["Voice", "SMS"]],
  ["+1 800 549 7426", "United States", "Toll-Free", ["Voice", "SMS"]],
  ["+44 20 7946 0991", "London, UK", "Local", ["Voice"]],
  ["+1 312 884 7710", "Chicago, IL", "Local", ["Voice", "SMS", "MMS"]],
  ["+1 213 555 0190", "Los Angeles, CA", "Local", ["Voice", "SMS"]],
  ["+61 2 8055 1300", "Sydney, AU", "Local", ["Voice"]],
  ["+1 646 555 0177", "New York, NY", "Local", ["Voice", "SMS", "MMS"]],
  ["+1 415 555 0188", "San Francisco, CA", "Local", ["Voice", "SMS"]],
  ["+1 800 233 9100", "United States", "Toll-Free", ["Voice", "SMS"]],
] as [string, string, string, string[]][];
const PhoneNumbersPage: React.FC = () => (
  <div style={{ height: "100%", overflow: "hidden" }}>
    <PageHeader title="Phone Numbers" subtitle="Manage your numbers across voice, SMS, and WhatsApp" action={<DarkButton><span style={{ display: "inline-flex", marginRight: 6 }}><Ico name="plus" size={14} /></span>Buy Number</DarkButton>} />
    <TabRow tabs={["Purchased Numbers", "Unrented Numbers", "Port-in", "Verified Caller IDs", "Sender IDs", "Rental Summary", "Lookup", "Other Settings"]} active="Purchased Numbers" />
    <div style={{ display: "flex", gap: 10, padding: "14px 26px 0" }}>
      <Chip icon={<Ico name="search" size={14} />}>Search by number</Chip>
      <Chip caret>Type</Chip><Chip caret>Capabilities</Chip>
    </div>
    <div style={{ padding: "14px 26px 0" }}>
      <Table head={<><Th w={200}>Number</Th><Th flex={1}>Location</Th><Th w={120}>Type</Th><Th w={220}>Capabilities</Th></>}>
        {NUMS.map((r, i) => (
          <Row key={i} last={i === NUMS.length - 1}>
            <div style={{ width: 200, fontWeight: 500, fontFamily: "ui-monospace, Menlo, monospace" }}>{r[0]}</div>
            <div style={{ flex: 1, color: SUB }}>{r[1]}</div>
            <div style={{ width: 120 }}><StatusPill>{r[2]}</StatusPill></div>
            <div style={{ width: 220, display: "flex", gap: 6 }}>{(r[3] as string[]).map((c) => (<span key={c} style={{ fontSize: 11.5, color: SUB, border: `1px solid ${HAIR}`, borderRadius: 5, padding: "2px 7px" }}>{c}</span>))}</div>
          </Row>
        ))}
      </Table>
      <Pager label="1-50 of 437" />
    </div>
  </div>
);

// ---- WhatsApp (Create Template modal over the templates list) ----
const WField: React.FC<{ label: string; value?: string; caret?: boolean; placeholder?: boolean }> = ({ label, value, caret, placeholder }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontSize: 12, color: SUB, marginBottom: 5, fontWeight: 500 }}>{label}</div>
    <div style={{ height: 36, border: `1px solid ${HAIR}`, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 11px", fontSize: 13, color: placeholder ? "#b0b4bd" : INK, justifyContent: "space-between" }}>
      <span>{value}</span>
      {caret ? <span style={{ color: "#b8bcc6", display: "inline-flex" }}><Ico name="chevron" size={14} /></span> : null}
    </div>
  </div>
);
const WhatsAppScreen: React.FC = () => (
  <div style={{ height: "100%", overflow: "hidden", position: "relative" }}>
    {/* faint templates list behind */}
    <div style={{ filter: "blur(0.5px)", opacity: 0.5 }}>
      <PageHeader title="WhatsApp" subtitle="Create and manage your WhatsApp templates" action={<DarkButton>Create Template</DarkButton>} />
      <TabRow tabs={["Numbers", "Templates", "Profiles"]} active="Templates" />
      <div style={{ padding: "16px 26px" }}>
        {["order_confirmation", "sample_automation", "sample_text", "shipping_update", "otp_login", "feedback_request"].map((t, i) => (
          <div key={t} style={{ display: "flex", alignItems: "center", padding: "12px 16px", border: `1px solid ${HAIR}`, borderTop: i ? "none" : `1px solid ${HAIR}`, fontSize: 13 }}>
            <span style={{ flex: 1, fontWeight: 500 }}>{t}</span>
            <StatusPill tone={i % 3 === 0 ? "green" : "grey"}>{i % 3 === 0 ? "Approved" : "Draft"}</StatusPill>
          </div>
        ))}
      </div>
    </div>
    {/* scrim + modal */}
    <div style={{ position: "absolute", inset: 0, background: "rgba(22,20,34,0.34)" }} />
    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 720, background: "#fff", borderRadius: 14, boxShadow: "0 30px 70px rgba(20,18,40,0.30)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${HAIR}` }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: INK }}>Create WhatsApp Template</div>
        <span style={{ flex: 1 }} />
        <span style={{ color: "#9aa0ac", fontSize: 16 }}>✕</span>
      </div>
      <div style={{ display: "flex" }}>
        {/* form */}
        <div style={{ flex: 1.25, padding: "18px 20px", borderRight: `1px solid ${HAIR}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: INK, marginBottom: 12 }}>Template configuration</div>
          <WField label="Name" value="order_confirmation_v2" />
          <WField label="WhatsApp Number" value="Acme Retail  ·  +1 415 555 0142" caret />
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}><WField label="Category" value="Utility" caret /></div>
            <div style={{ flex: 1 }}><WField label="Language" value="English" caret /></div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: INK, margin: "8px 0 10px" }}>Template content</div>
          <WField label="Header Type" value="None" caret />
          <div style={{ fontSize: 12, color: SUB, marginBottom: 5, fontWeight: 500 }}>Body</div>
          <div style={{ border: `1px solid ${HAIR}`, borderRadius: 8, padding: "10px 12px", fontSize: 12.5, color: "#b0b4bd", minHeight: 56 }}>Enter your message body...</div>
        </div>
        {/* preview */}
        <div style={{ width: 280, flexShrink: 0, padding: "18px 18px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", width: "100%", marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: SUB, fontWeight: 600 }}>Preview</span>
            <span style={{ flex: 1 }} />
            <div style={{ display: "flex", border: `1px solid ${HAIR}`, borderRadius: 7, overflow: "hidden", fontSize: 11 }}>
              <span style={{ padding: "4px 9px", background: "#f1f1f6", color: INK, fontWeight: 600 }}>Light</span>
              <span style={{ padding: "4px 9px", color: SUB }}>Dark</span>
            </div>
          </div>
          <div style={{ width: 220, height: 300, borderRadius: 22, border: "7px solid #1f2430", background: "#e5ddd5", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ height: 38, background: "#075e54", color: "#fff", display: "flex", alignItems: "center", gap: 8, padding: "0 12px", fontSize: 12, fontWeight: 600 }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#ffffff33" }} />Business Name
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ padding: "8px 10px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 28, background: "#fff", borderRadius: 16, padding: "0 12px", display: "flex", alignItems: "center", fontSize: 11, color: "#9aa0ac" }}>Type a message</div>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#075e54" }} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderTop: `1px solid ${HAIR}`, gap: 10 }}>
        <span style={{ flex: 1 }} />
        <div style={{ height: 36, display: "inline-flex", alignItems: "center", padding: "0 15px", borderRadius: 8, color: SUB, fontSize: 13.5 }}>Cancel</div>
        <div style={{ height: 36, display: "inline-flex", alignItems: "center", padding: "0 15px", borderRadius: 8, border: `1px solid ${HAIR}`, color: INK, fontSize: 13.5, fontWeight: 500 }}>Save as Draft</div>
        <DarkButton>Send for Verification</DarkButton>
      </div>
    </div>
  </div>
);

// ---- Compliance ----
const BrandItem: React.FC<{ name: string; id: string; tone: "green" | "red"; active?: boolean }> = ({ name, id, tone, active }) => (
  <div style={{ display: "flex", alignItems: "center", padding: "13px 14px", borderRadius: 10, border: `1px solid ${active ? "#cdd0d9" : HAIR}`, background: active ? "#f7f7f9" : "#fff", marginBottom: 10 }}>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>{name}</div>
      <div style={{ fontSize: 11.5, color: SUB, fontFamily: "ui-monospace, Menlo, monospace" }}>{id}</div>
    </div>
    <span style={{ flex: 1 }} />
    <StatusPill tone={tone}>{tone === "green" ? "Verified" : "Rejected"}</StatusPill>
  </div>
);
const CompliancePage: React.FC = () => (
  <div style={{ height: "100%", overflow: "hidden" }}>
    <PageHeader title="Compliance" subtitle="Register your 10DLC campaigns and toll-free numbers right here" action={<DarkButton><span style={{ display: "inline-flex", marginRight: 6 }}><Ico name="plus" size={14} /></span>New Registration</DarkButton>} />
    <TabRow tabs={["Drafts", "10DLC", "Toll-free"]} active="10DLC" />
    <div style={{ display: "flex", gap: 18, padding: "18px 26px 0" }}>
      <div style={{ width: 360 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: INK, marginBottom: 10 }}>Brands</div>
        <BrandItem name="Plivo Inc." id="BXXY12" tone="green" active />
        <BrandItem name="Acme Retail" id="BZZ901" tone="red" />
        <BrandItem name="Northwind Co." id="BQQ774" tone="green" />
        <BrandItem name="Globex LLC" id="BRT220" tone="green" />
      </div>
      <div style={{ flex: 1, border: `1px solid ${HAIR}`, borderRadius: 12, padding: "18px 20px", background: "#fff" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: INK, marginBottom: 14 }}>Campaign</div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
          <span style={{ color: "#dc2626", display: "inline-flex", marginTop: 1 }}><Ico name="warning" size={20} /></span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>Brand registration rejected</div>
            <div style={{ fontSize: 12.5, color: SUB, marginTop: 3 }}>Resolve the flagged details and resubmit for review. Most brands clear within one business day.</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <DarkButton>Edit and Resubmit</DarkButton>
          <div style={{ height: 38, display: "inline-flex", alignItems: "center", padding: "0 16px", borderRadius: 8, border: `1px solid ${HAIR}`, color: SUB, fontSize: 14 }}>View details</div>
        </div>
      </div>
    </div>
  </div>
);

// ---- Logs ----
const mkLog = (i: number) => {
  const mins = 18 - i; const tos = ["+1 801 549 7426", "+1 415 555 0142", "+44 20 7946 0991", "+1 312 884 7710"];
  return { date: `Jun 24, 2026 2:${mins < 10 ? "0" + mins : mins} PM`, from: "+1 347 324 5320", to: tos[i % tos.length], dir: i % 2 === 0 ? "Inbound" : "Outbound", cause: i % 5 === 0 ? "Busy" : "Normal Hangup", source: i % 2 ? "Callee" : "Caller", cost: "$0.0" + (160 + (i % 7) * 3) };
};
const LOGS = Array.from({ length: 11 }).map((_, i) => mkLog(i));
const LogsPage: React.FC = () => (
  <div style={{ height: "100%", overflow: "hidden" }}>
    <PageHeader title="Logs" subtitle="Your call, message, WhatsApp, verify, and recording logs in one view" />
    <TabRow tabs={["Voice Logs", "Message Logs", "WhatsApp Logs", "Zentrunk Logs", "Verify Logs", "Recordings"]} active="Voice Logs" />
    <div style={{ display: "flex", gap: 10, padding: "14px 26px 0", alignItems: "center" }}>
      <Chip icon={<Ico name="search" size={14} />}>Search by call UUID</Chip>
      <Chip caret>Account</Chip><Chip caret>Date range</Chip><Chip caret>Direction</Chip>
      <span style={{ flex: 1 }} />
      <Chip icon={<Ico name="download" size={14} />}>Export</Chip>
    </div>
    <div style={{ padding: "14px 26px 0" }}>
      <Table head={<><Th w={170}>Date</Th><Th w={155}>From</Th><Th w={155}>To</Th><Th w={100}>Direction</Th><Th w={140}>Hangup Cause</Th><Th w={120}>Source</Th><Th flex={1} right>Cost</Th></>}>
        {LOGS.map((r, i) => (
          <Row key={i} last={i === LOGS.length - 1}>
            <div style={{ width: 170 }}>{r.date}</div>
            <div style={{ width: 155, fontFamily: "ui-monospace, Menlo, monospace" }}>{r.from}</div>
            <div style={{ width: 155, fontFamily: "ui-monospace, Menlo, monospace" }}>{r.to}</div>
            <div style={{ width: 100, color: SUB }}>{r.dir}</div>
            <div style={{ width: 140, color: SUB }}>{r.cause}</div>
            <div style={{ width: 120, color: SUB }}>{r.source}</div>
            <div style={{ flex: 1, textAlign: "right" }}>{r.cost}</div>
          </Row>
        ))}
      </Table>
      <Pager label="1-50 of 4,988" />
    </div>
  </div>
);

// ---- Analytics: Voice Agents (matches the real flyout layout) ----
const AMetric: React.FC<{ label: string; value: string; delta?: string; up?: boolean; sub: string }> = ({ label, value, delta, up = true, sub }) => (
  <div style={{ flex: 1, border: `1px solid ${HAIR}`, borderRadius: 12, padding: "15px 16px", background: "#fff" }}>
    <div style={{ fontSize: 12.5, color: SUB }}>{label}</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
      <span style={{ fontSize: 25, fontWeight: 700, color: INK, letterSpacing: -0.5 }}>{value}</span>
      {delta ? <span style={{ fontSize: 12, color: up ? GREEN : "#dc2626", fontWeight: 600 }}>{up ? "+" : ""}{delta}</span> : null}
    </div>
    <div style={{ fontSize: 11.5, color: "#9aa0ac", marginTop: 5 }}>{sub}</div>
  </div>
);
const ABARS = [820, 1180, 640, 1520, 980, 1360, 1080];
const AnalyticsPage: React.FC = () => (
  <div style={{ height: "100%", overflow: "hidden" }}>
    <PageHeader title="Voice Agents" subtitle="Performance across all your voice agents" />
    <div style={{ display: "flex", gap: 10, padding: "14px 26px 0", alignItems: "center" }}>
      <div style={{ display: "flex", border: `1px solid ${HAIR}`, borderRadius: 8, overflow: "hidden", fontSize: 12.5 }}>
        {["All Calls", "Inbound", "Outbound"].map((t, i) => (<span key={t} style={{ padding: "7px 12px", color: i === 0 ? INK : SUB, background: i === 0 ? "#f1f1f6" : "#fff", fontWeight: i === 0 ? 600 : 500, borderLeft: i ? `1px solid ${HAIR}` : "none" }}>{t}</span>))}
      </div>
      <Chip>Date Range is between Jun 17 - 24, 2026</Chip>
      <span style={{ color: "#dc2626", fontSize: 12.5, fontWeight: 500 }}>Clear</span>
      <span style={{ flex: 1 }} />
      <div style={{ display: "flex", border: `1px solid ${HAIR}`, borderRadius: 8, overflow: "hidden", fontSize: 12.5 }}>
        {["Hourly", "Daily", "Weekly", "Monthly"].map((t, i) => (<span key={t} style={{ padding: "7px 12px", color: i === 0 ? INK : SUB, background: i === 0 ? "#f1f1f6" : "#fff", fontWeight: i === 0 ? 600 : 500, borderLeft: i ? `1px solid ${HAIR}` : "none" }}>{t}</span>))}
      </div>
    </div>
    <div style={{ display: "flex", gap: 14, padding: "16px 26px 0" }}>
      <AMetric label="Total Calls" value="4,907" delta="10804.4%" sub="76 inbound, 4831 outbound" />
      <AMetric label="User Engaged" value="274" delta="2183.3%" sub="61 inbound, 213 outbound" />
      <AMetric label="Goal Completion" value="61%" sub="of user engaged" />
    </div>
    <div style={{ display: "flex", gap: 14, padding: "14px 26px 0" }}>
      <AMetric label="Human Transfer" value="6%" delta="79.1%" up={false} sub="80% inbound, 4% outbound" />
      <AMetric label="Abandoned Mid-call" value="0%" sub="0% inbound, 0% outbound" />
      <AMetric label="Cost / Goal" value="$0.12" sub="per completed goal" />
    </div>
    <div style={{ margin: "16px 26px 0", border: `1px solid ${HAIR}`, borderRadius: 12, padding: "14px 18px 10px", background: "#fff" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: INK, marginBottom: 10 }}>Call Volume Over Time</div>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: 10, color: "#b0b4bd", paddingBottom: 16, height: 96, textAlign: "right" }}>
          <span>1600</span><span>1200</span><span>800</span><span>0</span>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 16, height: 96 }}>
          {ABARS.map((h, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{ width: "100%", maxWidth: 52, height: (h / 1600) * 96, background: "linear-gradient(180deg,#8b9bf0,#6b7fe6)", borderRadius: "4px 4px 0 0" }} />
              <span style={{ fontSize: 9.5, color: "#b0b4bd" }}>{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ---- Billing (inside the account area) ----
const BillingNav: React.FC = () => (
  <div style={{ width: 190, flexShrink: 0 }}>
    {["Overview", "Invoices & Receipts", "Payment Methods", "Plans & Pricing"].map((it) => {
      const active = it === "Invoices & Receipts";
      return (<div key={it} style={{ height: 34, display: "flex", alignItems: "center", padding: "0 12px", borderRadius: 8, fontSize: 13.5, fontWeight: active ? 600 : 500, color: active ? INK : "#4b5160", background: active ? "#f1f1f6" : "transparent", marginBottom: 2 }}>{it}</div>);
    })}
  </div>
);
const INV = [["Jun 01, 2026", "INV-20426", "May 2026"], ["May 01, 2026", "INV-19887", "Apr 2026"], ["Apr 01, 2026", "INV-19321", "Mar 2026"], ["Mar 01, 2026", "INV-18810", "Feb 2026"], ["Feb 01, 2026", "INV-18255", "Jan 2026"], ["Jan 01, 2026", "INV-17744", "Dec 2025"]];
const BillingPage: React.FC = () => (
  <div style={{ height: "100%", overflow: "hidden" }}>
    <PageHeader title="Billing" subtitle="Invoices, payment methods, and plans, all in one place" />
    <div style={{ display: "flex", padding: "16px 26px 0", gap: 8 }}>
      <BillingNav />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 26, borderBottom: `1px solid ${HAIR}`, marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: INK, paddingBottom: 11, borderBottom: `2px solid ${INK}` }}>Invoices</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: SUB, paddingBottom: 11 }}>Receipts</div>
        </div>
        <Table head={<><Th w={190}>Invoice Date</Th><Th w={190}>Invoice ID</Th><Th flex={1}>Invoice Period</Th><Th w={110}>Invoice</Th><Th w={110}>Usage</Th></>}>
          {INV.map((r, i) => (
            <Row key={i} last={i === INV.length - 1}>
              <div style={{ width: 190 }}>{r[0]}</div>
              <div style={{ width: 190, fontFamily: "ui-monospace, Menlo, monospace" }}>{r[1]}</div>
              <div style={{ flex: 1, color: SUB }}>{r[2]}</div>
              <div style={{ width: 110, color: LINK, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}><Ico name="download" size={13} />PDF</div>
              <div style={{ width: 110, color: LINK, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}><Ico name="download" size={13} />XLSX</div>
            </Row>
          ))}
        </Table>
      </div>
    </div>
  </div>
);

// ---- Alerting ----
const ALERTS = [
  ["High call failure rate", "Call failures", "> 5% in 10 min", "Email, Slack", "green"],
  ["Low account balance", "Account balance", "< $50", "Email", "green"],
  ["Daily spend spike", "Spend per day", "> $1,000", "Email, Webhook", "green"],
  ["Inbound queue backup", "Queue wait time", "> 60s", "Slack", "grey"],
  ["Verify failure surge", "Verify failures", "> 10% in 15 min", "Email", "green"],
  ["Number capacity", "Concurrent calls", "> 90% of CPS", "Email, Slack", "green"],
] as [string, string, string, string, "green" | "grey"][];
const AlertingPage: React.FC = () => (
  <div style={{ height: "100%", overflow: "hidden" }}>
    <PageHeader title="Alerting" subtitle="Configure alerts and notifications across your account" action={<DarkButton><span style={{ display: "inline-flex", marginRight: 6 }}><Ico name="plus" size={14} /></span>Create Alert</DarkButton>} />
    <div style={{ padding: "16px 26px 0" }}>
      <Table head={<><Th flex={1.5}>Alert Name</Th><Th flex={1.1}>Metric</Th><Th w={150}>Condition</Th><Th flex={1}>Channels</Th><Th w={90}>Status</Th></>}>
        {ALERTS.map((r, i) => (
          <Row key={i} last={i === ALERTS.length - 1}>
            <div style={{ flex: 1.5, fontWeight: 500 }}>{r[0]}</div>
            <div style={{ flex: 1.1, color: SUB }}>{r[1]}</div>
            <div style={{ width: 150, color: SUB }}>{r[2]}</div>
            <div style={{ flex: 1, color: SUB }}>{r[3]}</div>
            <div style={{ width: 90 }}><StatusPill tone={r[4]}>{r[4] === "green" ? "Active" : "Paused"}</StatusPill></div>
          </Row>
        ))}
      </Table>
    </div>
  </div>
);

// ---- IP Whitelisting ----
const CIDRS = [
  ["203.0.113.0", "/24", "Renu Yadav", "Jun 12, 2026"],
  ["198.51.100.42", "/32", "Bhushan Barsagade", "May 28, 2026"],
  ["192.0.2.0", "/24", "Renu Yadav", "May 03, 2026"],
  ["203.0.113.128", "/25", "Aarav Shah", "Apr 19, 2026"],
  ["198.51.100.0", "/24", "Divya Menon", "Mar 30, 2026"],
];
const IPWhitelistingPage: React.FC = () => (
  <div style={{ height: "100%", overflow: "hidden" }}>
    <PageHeader title="IP Whitelisting" subtitle="Manage whitelisted CIDR addresses for your organization" action={<DarkButton><span style={{ display: "inline-flex", marginRight: 6 }}><Ico name="plus" size={14} /></span>Add CIDR Address</DarkButton>} />
    <div style={{ padding: "16px 26px 0" }}>
      <Table head={<><Th w={260}>IP Address</Th><Th w={150}>Subnet Mask</Th><Th flex={1}>Added By</Th><Th w={170}>Added On</Th></>}>
        {CIDRS.map((r, i) => (
          <Row key={i} last={i === CIDRS.length - 1}>
            <div style={{ width: 260, fontFamily: "ui-monospace, Menlo, monospace", fontWeight: 500 }}>{r[0]}</div>
            <div style={{ width: 150, color: SUB, fontFamily: "ui-monospace, Menlo, monospace" }}>{r[1]}</div>
            <div style={{ flex: 1, color: SUB }}>{r[2]}</div>
            <div style={{ width: 170, color: SUB }}>{r[3]}</div>
          </Row>
        ))}
      </Table>
    </div>
  </div>
);

// ---- Geo Permissions ----
const GEO = [
  ["United States", "+1", "green"], ["United Kingdom", "+44", "green"], ["India", "+91", "green"],
  ["Germany", "+49", "green"], ["Australia", "+61", "green"], ["Canada", "+1", "green"],
  ["Brazil", "+55", "grey"], ["Nigeria", "+234", "grey"], ["Pakistan", "+92", "grey"], ["Singapore", "+65", "green"],
] as [string, string, "green" | "grey"][];
const GeoPermissionsPage: React.FC = () => (
  <div style={{ height: "100%", overflow: "hidden" }}>
    <PageHeader title="Geo Permissions - Voice" subtitle="Control which countries you can place calls to" action={<div style={{ height: 38, display: "inline-flex", alignItems: "center", padding: "0 16px", borderRadius: 8, border: `1px solid ${HAIR}`, color: INK, fontSize: 14, fontWeight: 500 }}>Export Geo Permissions</div>} />
    <TabRow tabs={["Country Permissions", "Custom Prefix Blacklist"]} active="Country Permissions" />
    <div style={{ display: "flex", gap: 10, padding: "14px 26px 0" }}>
      <Chip icon={<Ico name="search" size={14} />}>Search by country</Chip>
    </div>
    <div style={{ padding: "14px 26px 0" }}>
      <Table head={<><Th flex={1.4}>Country</Th><Th w={140}>Dial Code</Th><Th flex={1}>Outbound Calls</Th><Th w={120}>Status</Th></>}>
        {GEO.map((r, i) => (
          <Row key={i} last={i === GEO.length - 1}>
            <div style={{ flex: 1.4, fontWeight: 500 }}>{r[0]}</div>
            <div style={{ width: 140, color: SUB, fontFamily: "ui-monospace, Menlo, monospace" }}>{r[1]}</div>
            <div style={{ flex: 1, color: SUB }}>{r[2] === "green" ? "Allowed" : "Blocked"}</div>
            <div style={{ width: 120 }}>
              <div style={{ width: 38, height: 22, borderRadius: 11, background: r[2] === "green" ? INK : "#d6d8de", position: "relative" }}>
                <div style={{ position: "absolute", top: 2, left: r[2] === "green" ? 18 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff" }} />
              </div>
            </div>
          </Row>
        ))}
      </Table>
    </div>
  </div>
);

// ---- Messaging Settings (toggle page) ----
const ToggleRow: React.FC<{ label: string; desc: string; on: boolean }> = ({ label, desc, on }) => (
  <div style={{ display: "flex", alignItems: "center", padding: "16px 18px", border: `1px solid ${HAIR}`, borderRadius: 12, background: "#fff", marginBottom: 12 }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{label}</div>
      <div style={{ fontSize: 12.5, color: SUB, marginTop: 3 }}>{desc}</div>
    </div>
    <div style={{ width: 40, height: 23, borderRadius: 12, background: on ? INK : "#d6d8de", position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 2.5, left: on ? 19 : 2.5, width: 18, height: 18, borderRadius: "50%", background: "#fff" }} />
    </div>
  </div>
);
const MessagingSettingsPage: React.FC = () => (
  <div style={{ height: "100%", overflow: "hidden" }}>
    <PageHeader title="Messaging Settings" subtitle="Configure how SMS and MMS behave for your account" action={<DarkButton>Save Settings</DarkButton>} />
    <div style={{ padding: "18px 26px 0", maxWidth: 820 }}>
      <ToggleRow label="Allow texting to landline numbers" desc="Attempt delivery to numbers that may be landlines." on={false} />
      <ToggleRow label="Add opt-out instructions to toll-free messages" desc="Append standard opt-out language to outgoing toll-free SMS." on={true} />
      <ToggleRow label="SMS Pumping Protection" desc="Automatically block traffic patterns linked to SMS pumping fraud." on={true} />
      <ToggleRow label="Enhanced destination validation" desc="Validate destination numbers before sending to reduce errors." on={true} />
    </div>
  </div>
);

// ==========================================================================
// Beat scenes
// ==========================================================================
const IntroScene = () => (<FadeIn><NewConsoleShell activeNav="Home"><HomePage /></NewConsoleShell></FadeIn>);

const BuildScene = () => (
  <FadeIn>
    <SubScreens screens={[
      { at: 0, node: <NewConsoleShell activeNav="Agents"><AgentsPage /></NewConsoleShell> },
      { at: SUBAT.buildApps, node: <NewConsoleShell activeNav="Applications"><ApplicationsPage /></NewConsoleShell> },
    ]} />
  </FadeIn>
);

const DeployScene = () => (
  <FadeIn>
    <SubScreens screens={[
      { at: 0, node: <NewConsoleShell activeNav="Phone Numbers"><PhoneNumbersPage /></NewConsoleShell> },
      { at: SUBAT.deployWa, node: <NewConsoleShell activeNav="WhatsApp"><WhatsAppScreen /></NewConsoleShell> },
      { at: SUBAT.deployComp, node: <NewConsoleShell activeNav="Compliance"><CompliancePage /></NewConsoleShell> },
    ]} />
  </FadeIn>
);

const MonitorScene = () => (
  <FadeIn>
    <SubScreens screens={[
      { at: 0, node: <NewConsoleShell activeNav="Logs"><LogsPage /></NewConsoleShell> },
      { at: SUBAT.monitorAnalytics, node: <NewConsoleShell activeNav="Analytics" secondaryNav={{ title: "Analytics", items: ["Customer Metrics", "Conversations Overview", "Agent Performance", "Voice Agent", "Agent Availability", "Operations Overview"], active: "Voice Agent" }}><AnalyticsPage /></NewConsoleShell> },
      { at: SUBAT.monitorAlerting, node: <NewConsoleShell activeNav="Alerting"><AlertingPage /></NewConsoleShell> },
    ]} />
  </FadeIn>
);

const SettingsScene = () => {
  const f = useCurrentFrame();
  // Menu highlight steps with the VO (team, then two-factor / profile) before navigating.
  const item = stepLabel(f, 90, SUBAT.settingsIP - 20, ["Team Setup", "Profile"]);
  return (
    <FadeIn>
      <SubScreens screens={[
        { at: 0, node: <NewConsoleShell activeNav="Home" accountMenuOpen accountActiveItem={item}><HomePage /></NewConsoleShell> },
        { at: SUBAT.settingsIP, node: <NewConsoleShell activeNav="Home"><IPWhitelistingPage /></NewConsoleShell> },
        { at: SUBAT.settingsGeo, node: <NewConsoleShell activeNav="Home"><GeoPermissionsPage /></NewConsoleShell> },
        { at: SUBAT.settingsMsg, node: <NewConsoleShell activeNav="Home"><MessagingSettingsPage /></NewConsoleShell> },
        { at: SUBAT.settingsBilling, node: <NewConsoleShell activeNav="Home"><BillingPage /></NewConsoleShell> },
      ]} />
    </FadeIn>
  );
};

// ---- CTA ----
const CtaCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 110 }, durationInFrames: 24 });
  const exit = interpolate(frame, [durationInFrames - 12, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = enter * (1 - exit);
  const scale = 0.9 + enter * 0.1;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 95% at 50% 0%, #fbfaf8 0%, #f6f5f3 55%, #efeeea 100%)", justifyContent: "center", alignItems: "center", fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif` }}>
      <div style={{ opacity, transform: `scale(${scale})`, textAlign: "center" }}>
        <div style={{ fontSize: 50, fontWeight: 600, color: INK, letterSpacing: -1.2, lineHeight: 1.1 }}>
          Faster to find, <span style={{ color: PURPLE }}>simpler to manage</span>.
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 13, marginTop: 24 }}>
          <span style={{ fontSize: 22, fontWeight: 400, color: INK, opacity: 0.6 }}>The new</span>
          <PlivoLogoSvg width={144} />
          <span style={{ fontSize: 22, fontWeight: 400, color: INK, opacity: 0.6 }}>console</span>
        </div>
        <div style={{ marginTop: 28, display: "inline-block", background: "#1f2430", color: "#fff", fontSize: 20, fontWeight: 600, padding: "13px 30px", borderRadius: 12 }}>cx.plivo.com</div>
      </div>
    </AbsoluteFill>
  );
};

// ---- Cameras ----
const M_STATIC: Motion = { keyframes: [{ at: 0.0, x: 0.5, y: 0.5, scale: 1.0 }] };

const musicVolumeAtFrame = (frame: number) => {
  const fade = MUSIC.fadeFrames;
  if (frame < fade) return (frame / fade) * MUSIC.bedVolume;
  const out = CONSOLE_TOTAL_FRAMES - fade;
  if (frame > out) return ((CONSOLE_TOTAL_FRAMES - frame) / fade) * MUSIC.bedVolume;
  return MUSIC.bedVolume;
};

const Beat: React.FC<{ k: keyof typeof DUR; motion?: Motion; children: React.ReactNode }> = ({ k, motion, children }) => (
  <Sequence from={BEAT[k].from} durationInFrames={BEAT[k].dur} layout="none">
    {motion ? <TightStageClip motion={motion}>{children}</TightStageClip> : children}
  </Sequence>
);

export const ConsoleComparison: React.FC<{ voiceOver?: boolean }> = ({ voiceOver = false }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#f6f5f3" }}>
      <Audio src={staticFile(MUSIC.src)} loop volume={voiceOver ? (f) => musicVolumeAtFrame(f) * 0.3 : musicVolumeAtFrame} />
      <Beat k="brand"><BrandIntro /></Beat>
      <Beat k="intro" motion={M_STATIC}><IntroScene /></Beat>
      <Beat k="build" motion={M_STATIC}><BuildScene /></Beat>
      <Beat k="deploy" motion={M_STATIC}><DeployScene /></Beat>
      <Beat k="monitor" motion={M_STATIC}><MonitorScene /></Beat>
      <Beat k="settings" motion={M_STATIC}><SettingsScene /></Beat>
      <Beat k="cta"><CtaCard /></Beat>
      <TightCaptions captions={CAPTIONS} />
      {voiceOver ? VO.map((v, i) => (<Sequence key={i} from={v.from} layout="none"><Audio src={staticFile(v.src)} /></Sequence>)) : null}
    </AbsoluteFill>
  );
};
