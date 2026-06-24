import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "./fonts";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { FinaleCard } from "./FinaleCard";
import { TightStageClip } from "./TightStageClip";
import { TightCaptions, type Caption } from "./TightCaption";
import { MUSIC } from "./promoConfig";
import type { Motion } from "./StageClip";
import { PlivoAppShell } from "./cards/PlivoAppShell";
import { VibeQuestionCard } from "./cards/VibeQuestionCard";
import { ClickCursor } from "./cards/ClickCursor";
import { TestScenariosTable } from "./cards/TestScenariosTable";
import { SelfImprovementPanel } from "./cards/SelfImprovementPanel";
import { StatusToast } from "./cards/StatusToast";
import {
  AgentFlowDiagram,
  type FlowNode,
  type FlowEdge,
} from "./cards/AgentFlowDiagram";

// ============================================================================
// VibePromoTight — the tightened ~35s cream cut (1050 frames @ 30fps).
// Built to the feedback doc's 8-beat / frame-accurate spec. Reuses the same
// card primitives as the long cut, but on the off-white "cream" desk, with
// muted-friendly captions and per-beat zoom to the panel that matters.
// The original 63s purple cut stays untouched as VibePromoNative.
// ============================================================================

// ---- Beat layout ---------------------------------------------------------
// Durations in frames; `from` is derived cumulatively so the brand bumper (or
// any retime) auto-shifts everything downstream, and VO + captions follow.
const DUR = {
  brand: 110, // ~3.7s logo zoom-out, so the open doesn't feel rushed
  hook: 135,
  describe: 160, // prompt + Vibe PLANS (no flow built yet)
  approve: 100, // Vibe asks, you approve
  build: 120, // ONLY now the flow assembles (the one full-screen reveal)
  buddy: 115,
  simulate: 170,
  golive: 165, // fits "...goes live. Yes. It's that simple."
  endcard: 105,
  cta: 75,
} as const;
const ORDER = ["brand", "hook", "describe", "approve", "build", "buddy", "simulate", "golive", "endcard", "cta"] as const;
const BEAT = (() => {
  const out = {} as Record<(typeof ORDER)[number], { from: number; dur: number }>;
  let acc = 0;
  for (const k of ORDER) {
    out[k] = { from: acc, dur: DUR[k] };
    acc += DUR[k];
  }
  return out;
})();
export const TIGHT_TOTAL_FRAMES = Object.values(DUR).reduce((a, b) => a + b, 0);

// ---- Voiceover clips (relative to /public), placed at absolute frames ----
const VO: { src: string; from: number }[] = [
  { src: "vo/tight/01-hook.mp3", from: BEAT.hook.from + 10 },
  { src: "vo/tight/02-describe.mp3", from: BEAT.describe.from + 6 },
  { src: "vo/tight/03-approve.mp3", from: BEAT.approve.from + 10 },
  { src: "vo/tight/03b-build.mp3", from: BEAT.build.from + 12 },
  { src: "vo/tight/04-buddy.mp3", from: BEAT.buddy.from + 8 },
  { src: "vo/tight/05-simulate.mp3", from: BEAT.simulate.from + 8 },
  { src: "vo/tight/06-golive.mp3", from: BEAT.golive.from + 8 },
  { src: "vo/tight/07a-vibeagent.mp3", from: BEAT.endcard.from + 6 },
  { src: "vo/tight/07b-pleevo.mp3", from: BEAT.endcard.from + 46 },
  { src: "vo/tight/08-cta.mp3", from: BEAT.cta.from + 8 },
];

// ---- Captions (corner cards over the product beats 2-6) ------------------
const CAPTIONS: Caption[] = [
  { start: BEAT.describe.from + 4, end: BEAT.approve.from - 3, pre: "Describe it. Vibe ", keyword: "plans", post: " the flow" },
  { start: BEAT.approve.from + 3, end: BEAT.build.from - 3, pre: "Review. ", keyword: "Approve", post: "." },
  { start: BEAT.build.from + 3, end: BEAT.buddy.from - 3, pre: "And it ", keyword: "builds itself", post: "." },
  { start: BEAT.buddy.from + 3, end: BEAT.simulate.from - 3, pre: "Stuck? Just ask ", keyword: "Buddy", post: ", your copilot" },
  { start: BEAT.simulate.from + 3, end: BEAT.golive.from - 3, pre: "Runs real ", keyword: "simulations", post: " · fixes weak spots" },
  { start: BEAT.golive.from + 3, end: BEAT.endcard.from - 3, pre: "Connect a number. ", keyword: "Go live", post: "." },
];

// ---- The agent flow tree (shared with the long cut's shape) --------------
const FLOW_NODES: FlowNode[] = [
  { id: "trigger", label: "Voice Call", sublabel: "Triggers on an incoming call", variant: "trigger", x: 360, y: 0, appearAtFrame: 0 },
  { id: "hub", label: "Help Desk Assistant", sublabel: "Greets, classifies and routes the caller.", variant: "purple", x: 360, y: 110, width: 220, appearAtFrame: 0 },
  { id: "specialist", label: "Specialist Transfer", sublabel: "Hands off to a human specialist.", variant: "purple", x: 30, y: 280, appearAtFrame: 0 },
  { id: "resolved", label: "Resolved Close", sublabel: "Ends after issue is resolved.", variant: "red", x: 230, y: 280, appearAtFrame: 0 },
  { id: "oos", label: "Out of Scope Close", sublabel: "Ends when out of scope.", variant: "red", x: 430, y: 280, appearAtFrame: 0 },
  { id: "dnc", label: "Handle DNC Close", sublabel: "Closes do-not-contact requests.", variant: "red", x: 640, y: 280, appearAtFrame: 0 },
  { id: "sp-failed", label: "Transfer Failed Close", variant: "red", x: -30, y: 440, appearAtFrame: 0 },
  { id: "sp-done", label: "Transfer Done Close", variant: "red", x: 150, y: 440, appearAtFrame: 0 },
];
const FLOW_EDGES: FlowEdge[] = [
  { from: "trigger", to: "hub", appearAtFrame: 0 },
  { from: "hub", to: "specialist", label: "Transfer To Specialist", appearAtFrame: 0 },
  { from: "hub", to: "resolved", label: "Issue Resolved", appearAtFrame: 0 },
  { from: "hub", to: "oos", label: "Out Of Scope", appearAtFrame: 0 },
  { from: "hub", to: "dnc", label: "Handle DNC", appearAtFrame: 0 },
  { from: "specialist", to: "sp-failed", appearAtFrame: 0 },
  { from: "specialist", to: "sp-done", appearAtFrame: 0 },
];
// Staggered timing for the "Vibe plans the flow" build (beat 2).
const stagger = (frames: number[]) => (i: number) => frames[Math.min(i, frames.length - 1)];
// Assembly timing for the BUILD beat (after approval): nodes pop in one by one.
const NODE_BUILD = stagger([8, 20, 42, 54, 66, 80, 96, 108]);
const EDGE_BUILD = stagger([16, 36, 48, 62, 76, 92, 104]);
const BUILD_NODES = FLOW_NODES.map((n, i) => ({ ...n, appearAtFrame: NODE_BUILD(i) }));
const BUILD_EDGES = FLOW_EDGES.map((e, i) => ({ ...e, appearAtFrame: EDGE_BUILD(i) }));

// Empty canvas placeholder shown BEFORE the flow is built (describe + approve),
// so it's clear nothing gets built until you approve.
const TriggerPlaceholder: React.FC = () => (
  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
    <div style={{ width: 240, padding: "14px 22px", borderRadius: 12, border: "1px dashed #d1d5db", color: "#9ca3af", fontSize: 15, textAlign: "center" }}>
      ⊕ Select Trigger
    </div>
  </div>
);

// A line that types in left-to-right; the whole string is always laid out
// (transparent tail) so wrapping never shifts and the frame stays steady.
const TypedText: React.FC<{
  text: string;
  startFrame: number;
  endFrame: number;
  style?: React.CSSProperties;
}> = ({ text, startFrame, endFrame, style }) => {
  const frame = useCurrentFrame();
  const n = Math.floor(
    interpolate(frame, [startFrame, endFrame], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const done = n >= text.length;
  const caretOn = Math.floor(frame / 14) % 2 === 0;
  return (
    <div style={style}>
      <span>{text.slice(0, n)}</span>
      {!done && frame >= startFrame ? (
        <span
          style={{
            display: "inline-block",
            width: 2,
            height: "1em",
            background: "#0f1117",
            verticalAlign: "text-bottom",
            opacity: caretOn ? 1 : 0,
            marginLeft: -1,
            marginRight: -1,
          }}
        />
      ) : null}
      <span style={{ color: "transparent" }}>{text.slice(n)}</span>
    </div>
  );
};

// ---- Beat 0 — Brand bumper (logo zoom-out) -------------------------------
// Opens framed tight on the "P" (scale 4), pulls back to reveal the full Plivo
// wordmark, holds calmly, then fades — the brand-bumper effect from the long
// cut, given its own ~3.7s so the open doesn't feel rushed.
const CREAM_BG = "radial-gradient(120% 95% at 50% 0%, #fbfaf8 0%, #f6f5f3 55%, #efeeea 100%)";
const BRAND_LOGO_W = 430;
const BRAND_P_OFFSET = -263.5 * (BRAND_LOGO_W / 720);
const BRAND_START_SCALE = 4;
const BrandBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const ease = { easing: Easing.inOut(Easing.cubic), ...clamp } as const;
  const easeOut = { easing: Easing.out(Easing.cubic), ...clamp } as const;
  const opacity = interpolate(frame, [0, 9, durationInFrames - 16, durationInFrames], [0, 1, 1, 0], ease);
  const scale = interpolate(frame, [9, 56], [BRAND_START_SCALE, 1], easeOut);
  const tx = interpolate(frame, [9, 56], [-BRAND_P_OFFSET * BRAND_START_SCALE, 0], easeOut);
  const wordmark = interpolate(frame, [40, 60], [0, 1], ease);
  return (
    <AbsoluteFill style={{ background: CREAM_BG, justifyContent: "center", alignItems: "center", overflow: "hidden", fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif` }}>
      <div
        style={{
          opacity,
          transform: `translateX(${tx}px) scale(${scale})`,
          transformOrigin: "center center",
          willChange: "transform, opacity",
        }}
      >
        <PlivoLogoSvg width={BRAND_LOGO_W} wordmarkOpacity={wordmark} />
      </div>
    </AbsoluteFill>
  );
};

// ---- Beat 1 — Hook (cream title) -----------------------------------------
const HookCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const ease = { easing: Easing.inOut(Easing.cubic), ...clamp } as const;
  const fadeOut = durationInFrames - 16;
  const hook = interpolate(frame, [8, 24, fadeOut, durationInFrames], [0, 1, 1, 0], ease);
  const hookScale = interpolate(frame, [8, 24], [0.97, 1], { easing: Easing.out(Easing.cubic), ...clamp });
  return (
    <AbsoluteFill
      style={{
        background: CREAM_BG,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif`,
      }}
    >
      <div style={{ opacity: hook, transform: `scale(${hookScale})`, textAlign: "center", padding: "0 180px", maxWidth: 1320 }}>
        <div style={{ fontSize: 56, fontWeight: 600, color: "#0f1117", lineHeight: 1.16, letterSpacing: -1.2 }}>
          What if a voice agent took just{" "}
          <span style={{ color: "#cd3ef9" }}>one prompt</span>?
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- Beat 2 — Describe; Vibe PLANS (nothing built yet) -------------------
const PROMPT =
  "Build an inbound help desk agent that greets callers, classifies the issue, and routes every call.";
const DescribeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const planOpacity = interpolate(frame, [66, 80], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <PlivoAppShell
      agentName="General Help Desk Assistant"
      agentStatus="Draft"
      activeTab="Flow"
      canvasToolbar
      canvas={<TriggerPlaceholder />}
      chatPanel={
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 22px 18px", color: "#0f1117" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, color: "#9ca3af", fontSize: 16 }}>
            <span>⋯</span>
            <span>✕</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#9ca3af", marginTop: 6, marginBottom: 14 }}>
            New Vibe Agent · your prompt
          </div>
          <TypedText
            text={PROMPT}
            startFrame={6}
            endFrame={60}
            style={{ fontSize: 19, lineHeight: 1.6, color: "#0f1117", fontWeight: 500 }}
          />
          <div style={{ marginTop: 22, opacity: planOpacity }}>
            <SelfImprovementPanel
              title="Vibe is planning your agent"
              items={[
                { label: "Mapping the conversation flow", appearAtFrame: 70, doneAtFrame: 98 },
                { label: "Defining routing and transfer logic", appearAtFrame: 90, doneAtFrame: 122 },
                { label: "Planning fallbacks and closes", appearAtFrame: 112, doneAtFrame: 142 },
                { label: "Preparing the build…", appearAtFrame: 138 },
              ]}
            />
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: "12px 14px", color: "#9ca3af", fontSize: 14, minHeight: 52, position: "relative", display: "flex", alignItems: "center" }}>
            <span>Describe the agentic flow you want to build...</span>
            <div
              style={{
                position: "absolute",
                right: 10,
                bottom: 8,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#cd3ef9",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              ↑
            </div>
          </div>
        </div>
      }
    />
  );
};

// ---- Beat 3 — Review / Approve -------------------------------------------
const READY_NODES = FLOW_NODES.map((n) => ({ ...n, appearAtFrame: 0 }));
const READY_EDGES = FLOW_EDGES.map((e) => ({ ...e, appearAtFrame: 0 }));

// Spotlight: dims the whole app (cream scrim) EXCEPT a clear rounded window
// over the component being narrated, so the eye locks onto it. Coordinates are
// in the app's own pixel space (the 1656x964 inset), so it scales with the
// camera and stays aligned no matter how far we push in. Rendered as a sibling
// ABOVE the app shell.
const Spotlight: React.FC<{
  left: number;
  top: number;
  width: number;
  height: number;
  radius?: number;
  dim?: number;
  appearAtFrame?: number;
}> = ({ left, top, width, height, radius = 14, dim = 0.66, appearAtFrame = 0 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [appearAtFrame, appearAtFrame + 12], [0, dim], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        borderRadius: radius,
        boxShadow: `0 0 0 4000px rgba(244, 243, 240, ${o})`,
        pointerEvents: "none",
        zIndex: 6,
      }}
    />
  );
};

const ApproveScene: React.FC = () => (
  <>
  <PlivoAppShell
    agentName="General Help Desk Assistant"
    agentStatus="Draft"
    activeTab="Flow"
    canvasToolbar
    canvas={<TriggerPlaceholder />}
    chatPanel={
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 20px", gap: 14, color: "#0f1117", fontSize: 14, lineHeight: 1.5 }}>
        <div style={{ display: "flex", justifyContent: "flex-end", color: "#9ca3af", fontSize: 16, gap: 12 }}>
          <span>⋯</span>
          <span>✕</span>
        </div>
        <div>
          · Greet the caller, identify the issue, and classify intent.
          <br />· Route to billing, technical, or general support.
          <br />· Transfer to a human specialist when needed.
        </div>
        <VibeQuestionCard
          header="Vibe Agent needs your input"
          question="Should I build this inbound help desk flow using the plan above?"
          options={[
            { title: "Approve", description: "Build the flow as planned with default routing and transfer logic.", emphasized: true },
            { title: "Revise", description: "Change the flow, routing, or call handling before you build." },
          ]}
          appearAtFrame={8}
          cursorOnOptionIndex={0}
          clickAtFrame={64}
        />
      </div>
    }
  />
  {/* Push focus onto the approve card; the flow behind it grays out. */}
  <Spotlight left={1176} top={150} width={480} height={814} radius={0} appearAtFrame={6} />
  </>
);

// ---- Beat 4 — Build: ONLY now the flow assembles (full-screen reveal) -----
const BuildScene: React.FC = () => (
  <PlivoAppShell
    agentName="General Help Desk Assistant"
    agentStatus="Draft"
    activeTab="Flow"
    canvasToolbar
    canvas={
      <div style={{ padding: "24px 32px 0", width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
        <AgentFlowDiagram nodes={BUILD_NODES} edges={BUILD_EDGES} canvasHeight={620} />
      </div>
    }
  />
);

// ---- Beat 4 — Ask Buddy ---------------------------------------------------
const BuddyAvatar: React.FC<{ size?: number }> = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
    <line x1="28" y1="6" x2="28" y2="14" stroke="#2f6bff" strokeWidth="2.5" />
    <circle cx="28" cy="5" r="3" fill="#2f6bff" />
    <rect x="9" y="13" width="38" height="34" rx="12" fill="#2f6bff" />
    <rect x="15" y="24" width="26" height="12" rx="6" fill="#0f1733" />
    <circle cx="23" cy="30" r="2.3" fill="#fff" />
    <circle cx="33" cy="30" r="2.3" fill="#fff" />
  </svg>
);
const BUDDY_Q = "How do I connect a phone number?";
const AskBuddyCompact: React.FC = () => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [12, 26], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const typeStart = 18;
  const typeEnd = 46;
  const answerAt = 58;
  const n = Math.floor(interpolate(frame, [typeStart, typeEnd], [0, BUDDY_Q.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const typed = BUDDY_Q.slice(0, n);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", color: "#0f1117", fontSize: 14, opacity: open, transform: `translateX(${(1 - open) * 40}px)` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: "1px solid #eef0f4", fontWeight: 600 }}>
        <span>Ask Buddy</span>
        <span style={{ color: "#9ca3af" }}>✕</span>
      </div>
      <div style={{ flex: 1, overflow: "hidden", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <BuddyAvatar size={30} />
          <div>
            <div style={{ fontWeight: 700 }}>Hi, I'm Buddy!</div>
            <div style={{ fontSize: 12.5, color: "#6b7280" }}>Ask me anything about Plivo.</div>
          </div>
        </div>
        {n > 0 ? (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ background: "#eff2f9", borderRadius: 12, padding: "9px 13px", maxWidth: 320, fontSize: 14 }}>{typed}</div>
          </div>
        ) : null}
        {frame >= answerAt ? (
          <div style={{ display: "flex", gap: 10 }}>
            <BuddyAvatar size={22} />
            <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>
              Open <b>Voice Configuration</b>, pick your number, choose the inbound trunk, then <b>Save</b>.
              {frame >= answerAt + 22 ? (
                <>
                  <div style={{ fontSize: 13, fontWeight: 700, marginTop: 10, marginBottom: 4 }}>Sources:</div>
                  <div style={{ color: "#2f6bff", textDecoration: "underline", fontSize: 12.5 }}>plivo.com/docs/voice-agents/routing</div>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
const BuddyScene: React.FC = () => (
  <>
  <PlivoAppShell
    agentName="General Help Desk Assistant"
    agentStatus="Draft"
    activeTab="Flow"
    buddyCursorFrame={10}
    canvas={
      <div style={{ padding: "24px 32px 0", width: "100%" }}>
        <AgentFlowDiagram nodes={READY_NODES} edges={READY_EDGES} canvasHeight={600} />
      </div>
    }
    chatPanel={<AskBuddyCompact />}
  />
  {/* After the click opens the panel, spotlight Buddy and gray the flow out. */}
  <Spotlight left={1176} top={150} width={480} height={814} radius={0} appearAtFrame={30} />
  </>
);

// ---- Beat 5 — Simulations run, then weak spots get fixed -----------------
// ONE continuous screen, LEFT-aligned (like a real dashboard page). 4 rows
// pass as the sims run; 2 weak rows sit at "Needs work / Low" and flip to
// "High" as Vibe fixes them, with an "improving" checklist below — so the
// table never moves position the way a hard cut between two screens did.
const SIM_TABS = ["Flow", "Conversation Goal", "Agent Runs", "Simulations", "Settings", "Knowledge Base", "Secrets", "Tools"];
const SimulationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const noteOpacity = interpolate(frame, [80, 96], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
    <PlivoAppShell
      agentName="General Help Desk Assistant"
      agentStatus="Draft"
      activeTab="Simulations"
      highlightActiveTab
      tabCursor={{ label: "Simulations", clickAtFrame: 14 }}
      tabs={SIM_TABS}
      canvas={
        <div style={{ padding: "20px 0 0 30px", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <TestScenariosTable
            rows={[
              { name: "Router restart resolves issue", passAtFrame: 22 },
              { name: "Warranty basics are resolved", passAtFrame: 32 },
              { name: "Caller shares login secrets", passAtFrame: 44 },
              { name: "Do not contact request", passAtFrame: 56 },
              { name: "Frustrated caller accepts transfer", passAtFrame: 112, startsFailed: true },
              { name: "Unsafe server repair escalates", passAtFrame: 128, startsFailed: true },
            ]}
          />
          <div style={{ marginTop: 18, opacity: noteOpacity }}>
            <SelfImprovementPanel
              title="Vibe is improving your agent"
              items={[
                { label: "Tightening support boundaries", appearAtFrame: 88, doneAtFrame: 116 },
                { label: "Improving transfer capture", appearAtFrame: 102, doneAtFrame: 130 },
                { label: "Rerunning failed tests…", appearAtFrame: 122 },
              ]}
            />
          </div>
        </div>
      }
    />
    {/* Show only the simulations; gray the rest of the page out. */}
    <Spotlight left={70} top={166} width={874} height={476} radius={14} appearAtFrame={30} />
    </>
  );
};

// ---- Beat 6 — Connect a number, go live ----------------------------------
const PhoneIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M7.5 3.5 5 4.5c-1 .4-1.5 1.4-1.2 2.4a13 13 0 0 0 8.3 8.3c1 .3 2-.2 2.4-1.2l1-2.5-3.2-1.6-1.3 1.3a9.5 9.5 0 0 1-3.4-3.4l1.3-1.3z" fill="#cd3ef9" />
  </svg>
);
const GoLiveScene: React.FC = () => (
  <>
  <PlivoAppShell
    agentName="General Help Desk Assistant"
    agentStatus="Published"
    activeTab="Voice Configuration"
    tabs={["Flow", "Conversation Goal", "Agent Runs", "Simulations", "Settings", "Knowledge Base", "Secrets", "Tools", "Voice Configuration"]}
    canvas={
      <div style={{ padding: "40px", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: 600, background: "#fff", border: "1px solid #eef0f4", borderRadius: 14, padding: 28, fontSize: 14, color: "#0f1117" }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Voice Configuration</div>
          <div style={{ fontSize: 14, color: "#6b7280", marginTop: 6, marginBottom: 22 }}>
            Connect a phone number so customers can call your agent.
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#9ca3af", marginBottom: 8 }}>
            Inbound phone number
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px" }}>
            <PhoneIcon />
            <div style={{ fontSize: 18, fontWeight: 600 }}>+1 (415) 555-0142</div>
            <div style={{ marginLeft: "auto", background: "#ecfdf5", color: "#059669", fontWeight: 600, fontSize: 12, padding: "4px 10px", borderRadius: 8 }}>Purchased</div>
          </div>
          <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 20, margin: "8px 0" }}>↓</div>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#9ca3af", marginBottom: 8 }}>
            Routes to agent
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, border: "1px solid #cd3ef9", background: "#fdf4ff", borderRadius: 10, padding: "14px 16px" }}>
            <span style={{ fontSize: 18 }}>🤖</span>
            <div style={{ fontSize: 15, fontWeight: 600 }}>General Help Desk Assistant</div>
            <div style={{ marginLeft: "auto", background: "#ecfdf5", color: "#059669", fontWeight: 600, fontSize: 12, padding: "4px 10px", borderRadius: 8 }}>● Active</div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
            <div style={{ background: "#0f1117", color: "#fff", fontWeight: 600, fontSize: 14, padding: "10px 22px", borderRadius: 9, position: "relative" }}>
              Save configuration
              <ClickCursor clickAtFrame={84} approach="tl" offset={{ x: 74, y: 16 }} />
            </div>
          </div>
        </div>
      </div>
    }
    overlay={
      <StatusToast
        title="Phone number connected"
        body="Your agent is live. Incoming calls now route to it."
        variant="success"
        appearAtFrame={104}
        chime
      />
    }
  />
  {/* Show only the phone-number card; gray the rest of the page out. */}
  <Spotlight left={540} top={312} width={636} height={512} radius={16} appearAtFrame={18} />
  </>
);

// ---- Beat 8 — CTA ---------------------------------------------------------
const CtaCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const enter = interpolate(frame, [4, 22], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // The "catch": the logo zoomed OUT at the open, so the CTA zooms IN — a
  // steady push across the whole beat to bookend the film.
  const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.13], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(120% 95% at 50% 0%, #fbfaf8 0%, #f6f5f3 55%, #efeeea 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif`,
      }}
    >
      <div style={{ opacity: enter, transform: `scale(${scale})`, textAlign: "center" }}>
        <div style={{ fontSize: 60, fontWeight: 600, color: "#0f1117", letterSpacing: -1.4 }}>
          Build <span style={{ color: "#cd3ef9" }}>yours</span> today
        </div>
        <div
          style={{
            marginTop: 26,
            display: "inline-block",
            background: "#0f1117",
            color: "#fff",
            fontSize: 22,
            fontWeight: 600,
            padding: "14px 34px",
            borderRadius: 12,
          }}
        >
          cx.plivo.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- Per-beat camera motions ---------------------------------------------
// All moves use the centering camera: fx,fy = the component's center in frame.
const M_DESCRIBE: Motion = {
  // Stay tight on the chat panel: read the prompt, then the planning checklist.
  keyframes: [
    { at: 0.0, x: 0.806, y: 0.44, scale: 1.5 },
    { at: 0.4, x: 0.806, y: 0.48, scale: 1.52, ease: "linear" },
    { at: 1.0, x: 0.806, y: 0.58, scale: 1.5, ease: "easeInOut" },
  ],
};
const M_APPROVE: Motion = {
  // Push tight onto the approve card; everything else grays out.
  keyframes: [
    { at: 0.0, x: 0.806, y: 0.5, scale: 1.6 },
    { at: 1.0, x: 0.806, y: 0.5, scale: 1.72, ease: "easeInOut" },
  ],
};
const M_BUILD: Motion = {
  // The ONE full-screen reveal: open on the first node, pull back to the whole
  // tree as it assembles.
  keyframes: [
    { at: 0.0, x: 0.5, y: 0.34, scale: 1.34 },
    { at: 1.0, x: 0.49, y: 0.56, scale: 1.0, ease: "easeInOut" },
  ],
};
const M_BUDDY: Motion = {
  // Open on the Ask Buddy button click, then push tight onto JUST the Buddy panel.
  keyframes: [
    { at: 0.0, x: 0.84, y: 0.12, scale: 1.55 },
    { at: 0.16, x: 0.84, y: 0.12, scale: 1.55, ease: "linear" },
    { at: 0.36, x: 0.806, y: 0.45, scale: 1.85, ease: "easeInOut" },
    { at: 1.0, x: 0.806, y: 0.45, scale: 1.85, ease: "linear" },
  ],
};
const M_SIMULATE: Motion = {
  keyframes: [
    // ONLY the simulations table fills the frame; drift down to the checklist.
    { at: 0.0, x: 0.327, y: 0.4, scale: 1.86 },
    { at: 0.45, x: 0.327, y: 0.44, scale: 1.86, ease: "linear" },
    { at: 1.0, x: 0.33, y: 0.56, scale: 1.78, ease: "easeInOut" },
  ],
};
const M_GOLIVE: Motion = {
  // ONLY the phone-number card (now vertically centered), gentle animated push.
  keyframes: [
    { at: 0.0, x: 0.515, y: 0.58, scale: 1.42 },
    { at: 0.5, x: 0.515, y: 0.58, scale: 1.56, ease: "easeInOut" },
    { at: 1.0, x: 0.5, y: 0.58, scale: 1.6, ease: "linear" },
  ],
};

const musicVolumeAtFrame = (frame: number) => {
  const fade = MUSIC.fadeFrames;
  if (frame < fade) return (frame / fade) * MUSIC.bedVolume;
  const out = TIGHT_TOTAL_FRAMES - fade;
  if (frame > out) return ((TIGHT_TOTAL_FRAMES - frame) / fade) * MUSIC.bedVolume;
  return MUSIC.bedVolume;
};

export const VibePromoTight: React.FC<{ voiceOver?: boolean }> = ({ voiceOver = false }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#f6f5f3" }}>
      <Audio
        src={staticFile(MUSIC.src)}
        volume={voiceOver ? (f) => musicVolumeAtFrame(f) * 0.3 : musicVolumeAtFrame}
      />

      <Sequence from={BEAT.brand.from} durationInFrames={BEAT.brand.dur} layout="none">
        <BrandBeat />
      </Sequence>
      <Sequence from={BEAT.hook.from} durationInFrames={BEAT.hook.dur} layout="none">
        <HookCard />
      </Sequence>
      <Sequence from={BEAT.describe.from} durationInFrames={BEAT.describe.dur} layout="none">
        <TightStageClip motion={M_DESCRIBE}>
          <DescribeScene />
        </TightStageClip>
      </Sequence>
      <Sequence from={BEAT.approve.from} durationInFrames={BEAT.approve.dur} layout="none">
        <TightStageClip motion={M_APPROVE}>
          <ApproveScene />
        </TightStageClip>
      </Sequence>
      <Sequence from={BEAT.build.from} durationInFrames={BEAT.build.dur} layout="none">
        <TightStageClip motion={M_BUILD}>
          <BuildScene />
        </TightStageClip>
      </Sequence>
      <Sequence from={BEAT.buddy.from} durationInFrames={BEAT.buddy.dur} layout="none">
        <TightStageClip motion={M_BUDDY}>
          <BuddyScene />
        </TightStageClip>
      </Sequence>
      <Sequence from={BEAT.simulate.from} durationInFrames={BEAT.simulate.dur} layout="none">
        <TightStageClip motion={M_SIMULATE}>
          <SimulationScene />
        </TightStageClip>
      </Sequence>
      <Sequence from={BEAT.golive.from} durationInFrames={BEAT.golive.dur} layout="none">
        <TightStageClip motion={M_GOLIVE}>
          <GoLiveScene />
        </TightStageClip>
      </Sequence>
      <Sequence from={BEAT.endcard.from} durationInFrames={BEAT.endcard.dur} layout="none">
        <FinaleCard />
      </Sequence>
      <Sequence from={BEAT.cta.from} durationInFrames={BEAT.cta.dur} layout="none">
        <CtaCard />
      </Sequence>

      {/* Muted-friendly captions over the product beats. */}
      <TightCaptions captions={CAPTIONS} />

      {/* Voiceover (VO variant only). */}
      {voiceOver
        ? VO.map((v, i) => (
            <Sequence key={i} from={v.from} layout="none">
              <Audio src={staticFile(v.src)} />
            </Sequence>
          ))
        : null}
    </AbsoluteFill>
  );
};
