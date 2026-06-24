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
import { IntroGlow } from "./IntroVariants";
import { MUSIC } from "./promoConfig";
import type { Motion } from "./StageClip";
import { PlivoAppShell } from "./cards/PlivoAppShell";
import { VibeQuestionCard } from "./cards/VibeQuestionCard";
import { ClickCursor } from "./cards/ClickCursor";
import { TestScenariosTable } from "./cards/TestScenariosTable";
import { SelfImprovementPanel } from "./cards/SelfImprovementPanel";
import { AgentChatPanel, type FeedMsg } from "./cards/AgentChatPanel";
import { StatusToast } from "./cards/StatusToast";
import {
  AgentFlowDiagram,
  type FlowNode,
  type FlowEdge,
} from "./cards/AgentFlowDiagram";

// ============================================================================
// VibePromoMerged — the merged cut: the tight cream cut's polish + the longer
// narrative. Vibe Agent (always named in full) describes → plans → you approve
// → it builds → Ask Buddy → it runs simulations IN the Flow tab (View
// simulations link, no separate screen) → Publish → connect a number → live.
// The tight cut (VibePromoTight) and the 63s purple cut stay untouched.
// ============================================================================

// ---- Beat layout ---------------------------------------------------------
// Durations in frames; `from` is derived cumulatively so the brand bumper (or
// any retime) auto-shifts everything downstream, and VO + captions follow.
const DUR = {
  brand: 110, // ~3.7s logo zoom-out, so the open doesn't feel rushed
  hook: 150, // fits the longer "idea to production" hook line
  intro: 100, // "Introducing Vibe Agent, by Plivo" title card
  describe: 165, // prompt + Vibe Agent PLANS (no flow built yet)
  approve: 100, // Vibe Agent asks, you approve
  build: 145, // flow assembles on canvas while Vibe Agent posts build progress
  simulate: 105, // Flow tab: Vibe Agent writes the sim summary + "View simulations"
  simscreen: 160, // click through → Simulations screen runs + fixes weak spots
  buddy: 120,
  publish: 120, // click Publish → agent goes live
  golive: 150, // connect a number; "...goes live. Yes. It's that simple."
  cta: 90, // "Build yours today" — the close (no separate brand end card now)
} as const;
const ORDER = ["brand", "hook", "intro", "describe", "approve", "build", "simulate", "simscreen", "buddy", "publish", "golive", "cta"] as const;
const BEAT = (() => {
  const out = {} as Record<(typeof ORDER)[number], { from: number; dur: number }>;
  let acc = 0;
  for (const k of ORDER) {
    out[k] = { from: acc, dur: DUR[k] };
    acc += DUR[k];
  }
  return out;
})();
export const MERGED_TOTAL_FRAMES = Object.values(DUR).reduce((a, b) => a + b, 0);

// ---- Voiceover clips (relative to /public), placed at absolute frames ----
const VO: { src: string; from: number }[] = [
  { src: "vo/merged/01-hook.mp3", from: BEAT.hook.from + 8 },
  { src: "vo/merged/01b-intro.mp3", from: BEAT.intro.from + 12 },
  { src: "vo/merged/02-describe.mp3", from: BEAT.describe.from + 6 },
  { src: "vo/merged/03-approve.mp3", from: BEAT.approve.from + 10 },
  { src: "vo/merged/03b-build.mp3", from: BEAT.build.from + 12 },
  { src: "vo/merged/04-buddy.mp3", from: BEAT.buddy.from + 8 },
  { src: "vo/merged/05-simulate.mp3", from: BEAT.simulate.from + 8 },
  { src: "vo/merged/07-publish.mp3", from: BEAT.publish.from + 10 },
  { src: "vo/merged/06-golive.mp3", from: BEAT.golive.from + 8 },
  { src: "vo/merged/08-cta.mp3", from: BEAT.cta.from + 8 },
];

// ---- Captions (corner cards over the product beats) ----------------------
// Order: describe → approve → build → simulate(flow) → simscreen → buddy → publish → golive.
const CAPTIONS: Caption[] = [
  { start: BEAT.describe.from + 4, end: BEAT.approve.from - 3, pre: "Describe it. ", keyword: "Vibe Agent", post: " plans the flow" },
  { start: BEAT.approve.from + 3, end: BEAT.build.from - 3, pre: "Review. ", keyword: "Approve", post: "." },
  { start: BEAT.build.from + 3, end: BEAT.simulate.from - 3, pre: "And it ", keyword: "builds itself", post: "." },
  { start: BEAT.simulate.from + 3, end: BEAT.simscreen.from - 3, pre: "Pressure-tested for ", keyword: "the messiest callers", post: "" },
  { start: BEAT.simscreen.from + 3, end: BEAT.buddy.from - 3, pre: "Weak spots, ", keyword: "fixed automatically", post: "" },
  { start: BEAT.buddy.from + 3, end: BEAT.publish.from - 3, pre: "Stuck? Just ask ", keyword: "Buddy", post: ", your copilot" },
  { start: BEAT.publish.from + 3, end: BEAT.golive.from - 3, pre: "One click to ", keyword: "publish", post: "" },
  { start: BEAT.golive.from + 3, end: BEAT.cta.from - 3, pre: "Connect a number. ", keyword: "Go live", post: "." },
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
      <div style={{ opacity: hook, transform: `scale(${hookScale})`, textAlign: "center", padding: "0 90px", maxWidth: 1680 }}>
        <div style={{ fontSize: 50, fontWeight: 600, color: "#0f1117", lineHeight: 1.22, letterSpacing: -1.0 }}>
          What if you could take a voice agent from an idea to production in just{" "}
          <span style={{ color: "#cd3ef9" }}>one prompt</span>?
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- Beat 1b — Introducing Vibe Agent -----------------------------------
const IntroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const ease = { easing: Easing.inOut(Easing.cubic), ...clamp } as const;
  const easeOut = { easing: Easing.out(Easing.cubic), ...clamp } as const;
  const fadeOut = durationInFrames - 16;
  const all = interpolate(frame, [0, 10, fadeOut, durationInFrames], [0, 1, 1, 0], ease);
  const eyebrow = interpolate(frame, [6, 20], [0, 1], easeOut);
  const name = interpolate(frame, [16, 32], [0, 1], easeOut);
  const nameScale = interpolate(frame, [16, 32], [0.95, 1], easeOut);
  const by = interpolate(frame, [28, 42], [0, 1], easeOut);
  return (
    <AbsoluteFill
      style={{
        background: CREAM_BG,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif`,
      }}
    >
      <div style={{ opacity: all, textAlign: "center" }}>
        <div style={{ opacity: eyebrow, fontSize: 22, fontWeight: 600, letterSpacing: 7, color: "#9ca3af", textTransform: "uppercase", marginBottom: 20 }}>
          Introducing
        </div>
        <div
          style={{
            opacity: name,
            transform: `scale(${nameScale})`,
            fontSize: 80,
            fontWeight: 600,
            letterSpacing: -2.6,
            lineHeight: 1.0,
            backgroundImage: "linear-gradient(95deg, #cd3ef9 0%, #9333ea 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Vibe Agent
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 20, opacity: by }}>
          <span style={{ fontSize: 26, fontWeight: 400, color: "#0f1117", opacity: 0.55 }}>by</span>
          <PlivoLogoSvg width={140} />
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
              title="Vibe Agent is planning your flow"
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

// ---- Beat 4 — Build: the flow assembles on the canvas WHILE Vibe Agent posts
// its build progress in the panel (so it's clearly Vibe Agent doing the work).
const BuildScene: React.FC = () => (
  <PlivoAppShell
    agentName="General Help Desk Assistant"
    agentStatus="Draft"
    activeTab="Flow"
    canvasToolbar
    canvas={
      <div style={{ padding: "24px 28px 0", width: "100%" }}>
        <AgentFlowDiagram nodes={BUILD_NODES} edges={BUILD_EDGES} canvasHeight={600} />
      </div>
    }
    chatPanel={
      <AgentChatPanel
        messages={[
          { kind: "thought", label: "Thought for 1 second", at: 6 },
          { kind: "action", label: "Creating the flow structure", at: 14, doneAt: 46 },
          { kind: "action", label: "Configuring conversation and routing", at: 40, doneAt: 80 },
          {
            kind: "tracker",
            at: 60,
            counter: "3/4",
            subtitle: "Building the approved help desk flow.",
            steps: [
              { label: "Create the call flow structure", doneAt: 52 },
              { label: "Configure conversation and routing", doneAt: 86 },
              { label: "Set identity, voice, and speech guidance", doneAt: 120 },
              { label: "Review, save, and test the flow", doneAt: 99999 },
            ],
          },
          { kind: "thought", label: "Thought for 2 seconds", at: 84 },
          { kind: "action", label: "Setting identity, voice, and speech guidance", at: 92, doneAt: 122 },
          { kind: "action", label: "Saving and validating the flow", at: 124, doneAt: 140 },
        ]}
      />
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
    buddyCursorFrame={14}
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

// ---- Beat 6 — Vibe Agent runs simulations IN the Flow tab ----------------
// Per feedback: don't cut to a separate Simulations screen. Vibe Agent writes
// the simulation summary right in the Flow chat panel, with a "View
// simulations" link to tune them. The flow stays on the canvas (grayed out).
const SimSparkle: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M10 2.5 11.4 8 17 9.5 11.4 11 10 16.5 8.6 11 3 9.5 8.6 8Z" fill="#cd3ef9" />
  </svg>
);
const SimulationScene: React.FC = () => (
  <>
    <PlivoAppShell
      agentName="General Help Desk Assistant"
      agentStatus="Draft"
      activeTab="Flow"
      canvasToolbar
      canvas={
        <div style={{ padding: "24px 32px 0", width: "100%" }}>
          <AgentFlowDiagram nodes={READY_NODES} edges={READY_EDGES} canvasHeight={600} />
        </div>
      }
      chatPanel={
        <AgentChatPanel
          composer="Ask Vibe Agent to refine anything…"
          messages={[
            { kind: "action", label: "Flow saved successfully", at: 0, doneAt: 0 },
            { kind: "thought", label: "Thought for 2 seconds", at: 0 },
            { kind: "action", label: "Mapping the conversation goals", at: 0, doneAt: 0 },
            { kind: "thought", label: "Thought for 1 second", at: 4 },
            { kind: "action", label: "Saving the reporting goals", at: 10, doneAt: 30 },
            { kind: "action", label: "Generating smoke scenarios", at: 26, doneAt: 56 },
            { kind: "action", label: "Running smoke tests", at: 52, doneAt: 84 },
            { kind: "text", text: (<>Pressure-tested against your <b>messiest callers</b>. Fully functional.</>), at: 64 },
            { kind: "link", label: "View and tune the simulations", at: 76, clickAt: 92 },
          ]}
        />
      }
    />
    {/* Focus the Vibe Agent panel; gray the flow out. */}
    <Spotlight left={1176} top={150} width={480} height={814} radius={0} appearAtFrame={8} />
  </>
);

// ---- Beat 6b — Simulations SCREEN (clicked through from the Flow tab) ----
// The tests run and pass/fail; the two weak rows flip from red "Needs work /
// Low" to green "High" as Vibe Agent fixes them — so you actually SEE the
// simulations running and being fixed.
const SIM_TABS = ["Flow", "Conversation Goal", "Agent Runs", "Simulations", "Settings", "Knowledge Base", "Secrets", "Tools"];
const SimScreenScene: React.FC = () => (
  <>
    <PlivoAppShell
      agentName="General Help Desk Assistant"
      agentStatus="Draft"
      activeTab="Simulations"
      highlightActiveTab
      tabs={SIM_TABS}
      canvas={
        <div style={{ padding: "20px 0 0 30px", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <TestScenariosTable
            rows={[
              { name: "Router restart resolves issue", goal: "Resolve the issue", passAtFrame: 18 },
              { name: "Warranty basics are resolved", goal: "Answer accurately", quality: "Medium", passAtFrame: 30 },
              { name: "Caller shares login secrets", goal: "Refuse safely", passAtFrame: 44 },
              { name: "Do not contact request", goal: "Honor opt-out", passAtFrame: 58 },
              { name: "Frustrated caller accepts transfer", goal: "Offer human transfer", passAtFrame: 96, startsFailed: true },
              { name: "Unsafe server repair escalates", goal: "Escalate safely", passAtFrame: 122, startsFailed: true },
            ]}
          />
        </div>
      }
    />
    {/* Show only the simulations table; gray the rest of the page out. */}
    <Spotlight left={70} top={166} width={874} height={430} radius={14} appearAtFrame={10} />
  </>
);

// ---- Beat 5b — Vibe Agent maps the conversation goals --------------------
const GOALS = [
  "Resolve the caller's issue",
  "Answer questions accurately",
  "Refuse unsafe requests",
  "Honor do-not-contact opt-outs",
  "Offer a human transfer when needed",
  "Escalate risky situations safely",
];
const GoalsScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
    <PlivoAppShell
      agentName="General Help Desk Assistant"
      agentStatus="Draft"
      activeTab="Conversation Goal"
      highlightActiveTab
      tabs={SIM_TABS}
      canvas={
        <div style={{ padding: "26px 0 0 40px", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ width: 740, background: "#fff", border: "1px solid #eef0f4", borderRadius: 14, padding: "24px 28px", color: "#0f1117" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 20, fontWeight: 700 }}>
              <SimSparkle /> Conversation Goals
            </div>
            <div style={{ fontSize: 13.5, color: "#6b7280", marginTop: 6, marginBottom: 14 }}>
              Vibe Agent mapped these from your prompt. Every simulated call is scored against them.
            </div>
            {GOALS.map((g, i) => {
              const at = 10 + i * 13;
              const appear = interpolate(frame, [at, at + 10], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const done = frame >= at + 14;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: i ? "1px solid #f4f5f7" : "none", opacity: appear }}>
                  <span style={{ width: 20, height: 20, borderRadius: 6, background: done ? "#ecfdf5" : "#f4f5f7", color: done ? "#059669" : "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                    {done ? "✓" : "•"}
                  </span>
                  <span style={{ fontSize: 15 }}>{g}</span>
                </div>
              );
            })}
          </div>
        </div>
      }
    />
    {/* Show only the goals card; gray the rest of the page out. */}
    <Spotlight left={74} top={150} width={812} height={470} radius={14} appearAtFrame={8} />
    </>
  );
};

// ---- Beat 7 — Publish: one click takes the agent live --------------------
const PublishScene: React.FC = () => {
  const frame = useCurrentFrame();
  const published = frame >= 56;
  return (
    <PlivoAppShell
      agentName="General Help Desk Assistant"
      agentStatus={published ? "Published" : "Draft"}
      activeTab="Flow"
      canvasToolbar
      publishCursorFrame={46}
      canvas={
        <div style={{ padding: "24px 32px 0", width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
          <AgentFlowDiagram nodes={READY_NODES} edges={READY_EDGES} canvasHeight={620} />
        </div>
      }
      overlay={
        <StatusToast
          title="Published"
          body="Your agent is live and ready to take calls."
          variant="success"
          appearAtFrame={62}
          chime
        />
      }
    />
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
  const enter = interpolate(frame, [4, 20], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Quick scale-in pop, then HOLD dead still — a continuous zoom shimmered the
  // text/button ("shaky"), so the catch happens on entrance only.
  const scale = interpolate(frame, [4, 22], [0.92, 1.0], {
    easing: Easing.out(Easing.cubic),
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
// IMPORTANT: these are LOCKED cameras — a single fixed framing per beat, zero
// movement (not even a settle). Any continuous scaling, however small, shimmers
// fine UI text / 1px lines ("shaky"). A constant transform renders identical
// pixels every frame, so it's rock-steady. The content (typing, nodes
// assembling, rows flipping, cursor, toast) supplies all the motion. Only
// Buddy keeps a move — a single deliberate pan from the button to the panel,
// which the user confirmed reads clean because it then holds.
const M_DESCRIBE: Motion = {
  // Establish on the full app, then zoom into the Vibe Agent panel and HOLD.
  keyframes: [
    { at: 0.0, x: 0.5, y: 0.46, scale: 1.02 },
    { at: 0.12, x: 0.5, y: 0.46, scale: 1.02, ease: "linear" },
    { at: 0.32, x: 0.806, y: 0.52, scale: 1.46, ease: "easeInOut" },
    { at: 1.0, x: 0.806, y: 0.52, scale: 1.46, ease: "linear" },
  ],
};
const M_APPROVE: Motion = { keyframes: [{ at: 0.0, x: 0.806, y: 0.5, scale: 1.66 }] };
const M_BUILD: Motion = { keyframes: [{ at: 0.0, x: 0.5, y: 0.52, scale: 1.02 }] };
const M_GOALS: Motion = { keyframes: [{ at: 0.0, x: 0.33, y: 0.46, scale: 1.5 }] };
const M_BUDDY: Motion = {
  // Establish on the full app (Ask Buddy button visible + clicked), then pan
  // into JUST the Buddy panel and HOLD.
  keyframes: [
    { at: 0.0, x: 0.5, y: 0.4, scale: 1.05 },
    { at: 0.18, x: 0.5, y: 0.4, scale: 1.05, ease: "linear" },
    { at: 0.4, x: 0.806, y: 0.45, scale: 1.85, ease: "easeInOut" },
    { at: 1.0, x: 0.806, y: 0.45, scale: 1.85, ease: "linear" },
  ],
};
const M_SIMULATE: Motion = { keyframes: [{ at: 0.0, x: 0.806, y: 0.5, scale: 1.52 }] };
const M_SIMSCREEN: Motion = { keyframes: [{ at: 0.0, x: 0.327, y: 0.46, scale: 1.7 }] };
const M_PUBLISH: Motion = { keyframes: [{ at: 0.0, x: 0.72, y: 0.26, scale: 1.34 }] };
const M_GOLIVE: Motion = { keyframes: [{ at: 0.0, x: 0.5, y: 0.58, scale: 1.58 }] };

const musicVolumeAtFrame = (frame: number) => {
  const fade = MUSIC.fadeFrames;
  if (frame < fade) return (frame / fade) * MUSIC.bedVolume;
  const out = MERGED_TOTAL_FRAMES - fade;
  if (frame > out) return ((MERGED_TOTAL_FRAMES - frame) / fade) * MUSIC.bedVolume;
  return MUSIC.bedVolume;
};

export const VibePromoMerged: React.FC<{ voiceOver?: boolean }> = ({ voiceOver = false }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#f6f5f3" }}>
      {/* Preppier bed (from the Vimeo reference). It's a hot master, so it's
          kept subtle under the VO and modest on the music-only cut. */}
      <Audio
        src={staticFile("vibe-music.mp3")}
        volume={voiceOver ? (f) => musicVolumeAtFrame(f) * 0.05 : (f) => musicVolumeAtFrame(f) * 0.4}
      />

      <Sequence from={BEAT.brand.from} durationInFrames={BEAT.brand.dur} layout="none">
        <BrandBeat />
      </Sequence>
      <Sequence from={BEAT.hook.from} durationInFrames={BEAT.hook.dur} layout="none">
        <HookCard />
      </Sequence>
      <Sequence from={BEAT.intro.from} durationInFrames={BEAT.intro.dur} layout="none">
        <IntroGlow />
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
      <Sequence from={BEAT.simscreen.from} durationInFrames={BEAT.simscreen.dur} layout="none">
        <TightStageClip motion={M_SIMSCREEN}>
          <SimScreenScene />
        </TightStageClip>
      </Sequence>
      <Sequence from={BEAT.publish.from} durationInFrames={BEAT.publish.dur} layout="none">
        <TightStageClip motion={M_PUBLISH}>
          <PublishScene />
        </TightStageClip>
      </Sequence>
      <Sequence from={BEAT.golive.from} durationInFrames={BEAT.golive.dur} layout="none">
        <TightStageClip motion={M_GOLIVE}>
          <GoLiveScene />
        </TightStageClip>
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
