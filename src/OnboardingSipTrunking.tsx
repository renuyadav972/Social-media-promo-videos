import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
} from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "./fonts";
import { MUSIC } from "./promoConfig";
import type { Motion } from "./StageClip";
import { TightStageClip } from "./TightStageClip";
import { TightCaptions, type Caption } from "./TightCaption";
import { NewConsoleShell, PageHeader, DarkButton, TabRow, PURPLE } from "./cards/NewConsoleShell";
import { Ico } from "./cards/consoleIcons";
import {
  FadeIn,
  SubScreens,
  ClickPulse,
  AskBuddyScreen,
  OutroCard,
  BuyNumberDrawer,
  PhoneNumbersScreen,
} from "./OnboardingVoiceAgents";

// ============================================================================
// OnboardingSipTrunking — "what next" onboarding for SIP Trunking. Same recipe
// as OnboardingVoiceAgents: exact code recreations of the real console screens,
// cream stage tour, Sarah VO + captions + click pulses. Setup only, ~58s.
// ============================================================================

const INK = "#1f2430";
const SUB = "#6b7280";
const HAIR = "#ececef";
const EB = "#e6e7ea";
const GREEN = "#16a34a";
const FONT = `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif`;
const BODY = `${INTER_FAMILY}, ${SORA_FAMILY}, sans-serif`;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---- Beat layout (sized to Sarah VO) -------------------------------------
const LEAD = 10;
const DUR = {
  intro: 165, //  4.2s VO — SIP Trunking page
  inbound: 440, // 13.0s VO — Create Trunk (inbound) + URI
  outbound: 300, //  8.4s VO — Create Trunk (outbound) + ACL
  number: 330, //  9.5s VO — point a number at the trunk
  buddy: 360, // 10.6s VO — Ask Buddy
  close: 150, //  3.4s VO — CTA
} as const;
const ORDER = ["intro", "inbound", "outbound", "number", "buddy", "close"] as const;
const BEAT = (() => {
  const out = {} as Record<(typeof ORDER)[number], { from: number; dur: number }>;
  let acc = 0;
  for (const k of ORDER) { out[k] = { from: acc, dur: DUR[k] }; acc += DUR[k]; }
  return out;
})();
export const ONBOARDING_SIP_FRAMES = Object.values(DUR).reduce((a, b) => a + b, 0);
const M_STATIC: Motion = { keyframes: [{ at: 0, x: 0.5, y: 0.5, scale: 1.0 }] };

const VO: { beat: keyof typeof DUR; src: string }[] = [
  { beat: "intro", src: "vo/onboarding-sip-trunking/01-intro.mp3" },
  { beat: "inbound", src: "vo/onboarding-sip-trunking/02-inbound.mp3" },
  { beat: "outbound", src: "vo/onboarding-sip-trunking/03-outbound.mp3" },
  { beat: "number", src: "vo/onboarding-sip-trunking/04-number.mp3" },
  { beat: "buddy", src: "vo/onboarding-sip-trunking/05-buddy.mp3" },
  { beat: "close", src: "vo/onboarding-sip-trunking/06-close.mp3" },
];
const musicVol = (frame: number) => {
  const fade = MUSIC.fadeFrames;
  if (frame < fade) return (frame / fade) * MUSIC.bedVolume;
  const out = ONBOARDING_SIP_FRAMES - fade;
  if (frame > out) return ((ONBOARDING_SIP_FRAMES - frame) / fade) * MUSIC.bedVolume;
  return MUSIC.bedVolume;
};

const Beat: React.FC<{ k: keyof typeof DUR; stage?: boolean; children: React.ReactNode }> = ({ k, stage = true, children }) => (
  <Sequence from={BEAT[k].from} durationInFrames={BEAT[k].dur} layout="none">
    {stage ? <TightStageClip motion={M_STATIC}>{children}</TightStageClip> : children}
  </Sequence>
);

// ==========================================================================
// SIP Trunking list page (reference: real SIP Trunking frame)
// ==========================================================================
const TRUNK_ROWS: [string, string, string, string][] = [
  ["inbound-support", "15145490406574896", "support-uri", "76b8abc1-667e-4948-9478-574bab3f9deb"],
  ["inbound-sales", "33011732781436522", "sales-uri", "0e503f93-d0b2-4bb0-af89-f87c189a2ac1"],
];
const StatusPill: React.FC = () => (<span style={{ fontSize: 11.5, fontWeight: 600, color: GREEN, background: "#e9f8ee", borderRadius: 6, padding: "4px 12px" }}>Active</span>);
const NumPill: React.FC = () => (<span style={{ fontSize: 12, fontWeight: 600, color: INK, background: "#f1f2f4", borderRadius: 6, padding: "4px 10px" }}>1 Number</span>);
export const SipTrunkingScreen: React.FC<{ active?: string; behind?: boolean; cursorAt?: number }> = ({ active = "Inbound Trunks", behind, cursorAt }) => (
  <div style={{ height: "100%", overflow: "hidden", filter: behind ? "blur(0.3px)" : undefined }}>
    <PageHeader title="SIP Trunking" subtitle="Manage your SIP trunks for inbound and outbound telephony connectivity" action={
      <div style={{ position: "relative", display: "inline-block" }}>
        <DarkButton><span style={{ display: "inline-flex", marginRight: 6 }}><Ico name="plus" size={14} /></span>Create Trunk</DarkButton>
        {cursorAt != null ? <ClickPulse at={cursorAt} /> : null}
      </div>
    } />
    <TabRow tabs={["Inbound Trunks", "Outbound Trunks"]} active={active} />
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 26px 0" }}>
      <div style={{ height: 36, width: 320, display: "inline-flex", alignItems: "center", gap: 7, padding: "0 12px", borderRadius: 8, border: `1px solid ${HAIR}`, fontSize: 13, color: "#9aa0ac" }}><Ico name="search" size={14} />Search by primary URI UUID...</div>
      <div style={{ height: 36, display: "inline-flex", alignItems: "center", gap: 7, padding: "0 14px", borderRadius: 8, border: `1px solid ${HAIR}`, fontSize: 13.5, color: SUB }}><Ico name="plus" size={13} />Trunk Status</div>
      <div style={{ height: 36, width: 40, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: `1px solid ${HAIR}`, color: "#9aa0ac" }}><Ico name="filter" size={15} /></div>
    </div>
    <div style={{ padding: "16px 26px 0" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "0 6px 12px", fontSize: 12, color: "#9aa0ac", fontWeight: 600, borderBottom: `1px solid ${HAIR}` }}>
        <span style={{ flex: 1.2 }}>Trunk Name</span><span style={{ flex: 1.5 }}>Primary URI</span><span style={{ width: 130 }}>Fallback URI</span><span style={{ width: 140 }}>Linked Numbers</span><span style={{ width: 90 }}>Status</span><span style={{ width: 30 }} />
      </div>
      {TRUNK_ROWS.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", padding: "16px 6px", borderBottom: `1px solid ${HAIR}` }}>
          <div style={{ flex: 1.2 }}><div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{r[0]}</div><div style={{ fontSize: 12, color: SUB, fontFamily: "ui-monospace, Menlo, monospace", marginTop: 3 }}>{r[1]}</div></div>
          <div style={{ flex: 1.5 }}><div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{r[2]}</div><div style={{ fontSize: 12, color: SUB, fontFamily: "ui-monospace, Menlo, monospace", marginTop: 3 }}>{r[3]}</div></div>
          <div style={{ width: 130, color: SUB }}>-</div>
          <div style={{ width: 140 }}><NumPill /></div>
          <div style={{ width: 90 }}><StatusPill /></div>
          <div style={{ width: 30, color: "#c2c6cf", textAlign: "right" }}>⋮</div>
        </div>
      ))}
    </div>
  </div>
);

// ==========================================================================
// Create Trunk drawer (reference: real Create Trunk frames)
// ==========================================================================
const DrawLabel: React.FC<{ children: React.ReactNode; right?: React.ReactNode }> = ({ children, right }) => (
  <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
    <span style={{ fontSize: 13, color: SUB, fontWeight: 500 }}>{children}</span><span style={{ flex: 1 }} />{right}
  </div>
);
const DropBox: React.FC<{ value?: string }> = ({ value }) => (
  <div style={{ height: 42, border: `1px solid ${HAIR}`, borderRadius: 9, display: "flex", alignItems: "center", padding: "0 13px", fontSize: 14, color: value ? INK : "#b0b4bd", justifyContent: "space-between", marginBottom: 16 }}><span>{value || ""}</span><span style={{ color: "#b8bcc6" }}><Ico name="chevron" size={15} /></span></div>
);
const NewLink: React.FC<{ children: React.ReactNode; cursorAt?: number }> = ({ children, cursorAt }) => (
  <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 5, color: PURPLE, fontSize: 13, fontWeight: 600 }}><Ico name="plus" size={12} />{children}{cursorAt != null ? <ClickPulse at={cursorAt} /> : null}</span>
);
const Radio: React.FC<{ label: string; on?: boolean }> = ({ label, on }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14, fontWeight: 500, color: INK }}>
    <span style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${on ? PURPLE : "#c2c6cf"}`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{on ? <span style={{ width: 9, height: 9, borderRadius: "50%", background: PURPLE }} /> : null}</span>{label}
  </div>
);
const Toggle: React.FC<{ on?: boolean; label: string }> = ({ on, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
    <div style={{ width: 40, height: 23, borderRadius: 12, background: on ? PURPLE : "#d6d8de", position: "relative", flexShrink: 0 }}><div style={{ position: "absolute", top: 2.5, left: on ? 19 : 2.5, width: 18, height: 18, borderRadius: "50%", background: "#fff" }} /></div>
    <span style={{ fontSize: 14, color: INK }}>{label}</span>
  </div>
);

type TrunkCursor = "create" | "trunk";
const CreateTrunkDrawer: React.FC<{ mode: "inbound" | "outbound"; filled?: boolean; cursor?: TrunkCursor; cursorAt?: number }> = ({ mode, filled, cursor, cursorAt }) => (
  <div style={{ height: "100%", position: "relative" }}>
    <SipTrunkingScreen active={mode === "inbound" ? "Inbound Trunks" : "Outbound Trunks"} behind />
    <div style={{ position: "absolute", inset: 0, background: "rgba(22,20,34,0.18)" }} />
    <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 560, background: "#fff", boxShadow: "-24px 0 60px rgba(20,18,40,0.20)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "18px 24px", borderBottom: `1px solid ${HAIR}` }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: INK, fontFamily: FONT }}>Create Trunk</div><span style={{ flex: 1 }} /><span style={{ color: "#9aa0ac" }}>✕</span>
      </div>
      <div style={{ flex: 1, overflow: "hidden", padding: "18px 24px" }}>
        <DrawLabel>Trunk Name</DrawLabel>
        <div style={{ height: 42, border: `1px solid ${HAIR}`, borderRadius: 9, display: "flex", alignItems: "center", padding: "0 13px", fontSize: 14, color: INK, marginBottom: 18 }}>{mode === "inbound" ? "inbound-support" : "outbound-sales"}</div>
        <div style={{ display: "flex", gap: 28, marginBottom: 20 }}><Radio label="Inbound" on={mode === "inbound"} /><Radio label="Outbound" on={mode === "outbound"} /></div>
        {mode === "inbound" ? (
          <>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: INK, marginBottom: 12 }}>Trunk Authentication</div>
            <DrawLabel right={<NewLink cursorAt={cursor === "create" ? cursorAt : undefined}>Create new URI</NewLink>}>Primary URI</DrawLabel>
            <DropBox value={filled ? "support-uri" : undefined} />
            <DrawLabel right={<NewLink>Create new URI</NewLink>}>Fallback URI (Optional)</DrawLabel>
            <DropBox />
            <DrawLabel>Link Numbers (Optional)</DrawLabel>
            <DropBox value={filled ? "+1 512 555 0142" : undefined} />
          </>
        ) : (
          <>
            <DrawLabel>Authentication Type</DrawLabel>
            <DropBox value="Access control list" />
            <DrawLabel right={<NewLink cursorAt={cursor === "create" ? cursorAt : undefined}>Create new ACL</NewLink>}>Access Control List</DrawLabel>
            <DropBox value={filled ? "office-acl" : undefined} />
            <div style={{ marginTop: 8 }}><Toggle on={filled} label="Secure Trunking" /></div>
          </>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "14px 24px", borderTop: `1px solid ${HAIR}` }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <DarkButton purple={!!filled}>Create Trunk</DarkButton>
          {cursor === "trunk" && cursorAt != null ? <ClickPulse at={cursorAt} /> : null}
        </div>
      </div>
    </div>
  </div>
);

// Centered modals over the drawer
const CenterModal: React.FC<{ title: string; children: React.ReactNode; footer: string; cursorAt?: number; behind: React.ReactNode }> = ({ title, children, footer, cursorAt, behind }) => (
  <div style={{ height: "100%", position: "relative" }}>
    {behind}
    <div style={{ position: "absolute", inset: 0, background: "rgba(22,20,34,0.4)" }} />
    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 560, background: "#fff", borderRadius: 16, boxShadow: "0 30px 70px rgba(20,18,40,0.3)", padding: "24px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}><div style={{ fontSize: 20, fontWeight: 700, color: INK, fontFamily: FONT }}>{title}</div><span style={{ flex: 1 }} /><span style={{ color: "#9aa0ac", fontSize: 16 }}>✕</span></div>
      {children}
      <div style={{ position: "relative", display: "inline-block", marginTop: 20 }}>
        <DarkButton>{footer}</DarkButton>
        {cursorAt != null ? <ClickPulse at={cursorAt} /> : null}
      </div>
    </div>
  </div>
);
const ModalField: React.FC<{ label: string; ph: string; area?: boolean }> = ({ label, ph, area }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontSize: 13.5, color: INK, fontWeight: 500, marginBottom: 7 }}>{label}</div>
    <div style={{ minHeight: area ? 90 : 44, border: `1px solid ${HAIR}`, borderRadius: 9, padding: area ? "12px 13px" : "0 13px", display: area ? "block" : "flex", alignItems: "center", fontSize: 14, color: "#b0b4bd" }}>{ph}</div>
  </div>
);
const CreateURIModal: React.FC<{ cursorAt?: number }> = ({ cursorAt }) => (
  <CenterModal title="Create new URI" footer="Create URI" cursorAt={cursorAt} behind={<CreateTrunkDrawer mode="inbound" cursor="create" />}>
    <ModalField label="Name" ph="Enter origination URI name" />
    <ModalField label="URI" ph="Enter FQDN or IP address" />
    <Toggle label="Authentication needed" />
  </CenterModal>
);
const CreateACLModal: React.FC<{ cursorAt?: number }> = ({ cursorAt }) => (
  <CenterModal title="Create new IP access control list" footer="Create ACL" cursorAt={cursorAt} behind={<CreateTrunkDrawer mode="outbound" cursor="create" />}>
    <ModalField label="Name" ph="Enter a name to identify this IP group" />
    <ModalField label="IP address list" ph="192.0.2.0/24" area />
  </CenterModal>
);

// ==========================================================================
// Captions
// ==========================================================================
const cap = (beat: keyof typeof DUR, start: number, end: number, pre: string, keyword: string, post = ""): Caption => ({ start: BEAT[beat].from + start, end: BEAT[beat].from + end, pre, keyword, post });
const CAPTIONS: Caption[] = [
  cap("intro", 14, 158, "Connect your ", "voice traffic", "."),
  cap("inbound", 14, 150, "Click ", "Create Trunk", "."),
  cap("inbound", 160, 300, "For incoming calls, choose ", "Inbound", "."),
  cap("inbound", 310, 432, "Add a ", "Primary URI", ", and link a number."),
  cap("outbound", 14, 160, "For outgoing calls, go ", "Outbound", "."),
  cap("outbound", 170, 292, "Secure it with an ", "IP access control list", "."),
  cap("number", 14, 150, "Point a number at your trunk in ", "Phone Numbers", "."),
  cap("number", 160, 322, "Set the type to ", "SIP Trunk", "."),
  cap("buddy", 14, 150, "Stuck? Ask ", "Buddy", "."),
  cap("buddy", 160, 352, "It answers with ", "steps and docs", "."),
  cap("close", 12, 145, "Your trunks are ", "live", "."),
];

// SIP-specific Ask Buddy answer
const SIP_BUDDY_A = (
  <>
    <div style={{ fontSize: 13.5, color: INK, lineHeight: 1.55, marginTop: 12 }}>
      Open <b>SIP Trunking</b> and click <b>Create Trunk</b>. Choose <b>Inbound</b> or <b>Outbound</b>, add a URI or an access control list, then link a number.
    </div>
    <div style={{ fontSize: 13.5, color: INK, lineHeight: 1.55, marginTop: 10 }}>
      Want me to open the exact docs for termination or origination?
    </div>
  </>
);

// ==========================================================================
// Root composition
// ==========================================================================
export const OnboardingSipTrunking: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#f6f5f3" }}>
    <Audio src={staticFile(MUSIC.src)} loop volume={(f) => musicVol(f) * 0.62} />

    <Beat k="intro"><FadeIn><NewConsoleShell activeNav="SIP Trunking"><SipTrunkingScreen /></NewConsoleShell></FadeIn></Beat>
    <Beat k="inbound"><FadeIn><SubScreens screens={[
      { at: 0, node: <NewConsoleShell activeNav="SIP Trunking"><SipTrunkingScreen cursorAt={60} /></NewConsoleShell> },
      { at: 110, node: <NewConsoleShell activeNav="SIP Trunking"><CreateTrunkDrawer mode="inbound" cursor="create" cursorAt={185} /></NewConsoleShell> },
      { at: 220, node: <NewConsoleShell activeNav="SIP Trunking"><CreateURIModal cursorAt={300} /></NewConsoleShell> },
      { at: 340, node: <NewConsoleShell activeNav="SIP Trunking"><CreateTrunkDrawer mode="inbound" filled cursor="trunk" cursorAt={410} /></NewConsoleShell> },
    ]} /></FadeIn></Beat>
    <Beat k="outbound"><FadeIn><SubScreens screens={[
      { at: 0, node: <NewConsoleShell activeNav="SIP Trunking"><CreateTrunkDrawer mode="outbound" cursor="create" cursorAt={70} /></NewConsoleShell> },
      { at: 120, node: <NewConsoleShell activeNav="SIP Trunking"><CreateACLModal cursorAt={195} /></NewConsoleShell> },
      { at: 210, node: <NewConsoleShell activeNav="SIP Trunking"><CreateTrunkDrawer mode="outbound" filled cursor="trunk" cursorAt={275} /></NewConsoleShell> },
    ]} /></FadeIn></Beat>
    <Beat k="number"><FadeIn><SubScreens screens={[
      { at: 0, node: <NewConsoleShell activeNav="Phone Numbers"><PhoneNumbersScreen cursorAt={70} /></NewConsoleShell> },
      { at: 110, node: <NewConsoleShell activeNav="Phone Numbers"><BuyNumberDrawer step="search" cursorAt={185} /></NewConsoleShell> },
      { at: 220, node: <NewConsoleShell activeNav="Phone Numbers"><BuyNumberDrawer step="configure" appType="SIP Trunk" cursorAt={300} /></NewConsoleShell> },
    ]} /></FadeIn></Beat>
    <Beat k="buddy"><FadeIn><AskBuddyScreen clickAt={55} answerAt={110} question="How do I set up a SIP trunk?" answer={SIP_BUDDY_A} /></FadeIn></Beat>
    <Beat k="close" stage={false}><OutroCard sub="Your trunks are ready to carry calls." /></Beat>

    <TightCaptions captions={CAPTIONS} />
    {VO.map((v) => (
      <Sequence key={v.beat} from={BEAT[v.beat].from + LEAD} durationInFrames={DUR[v.beat]} layout="none">
        <Audio src={staticFile(v.src)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
