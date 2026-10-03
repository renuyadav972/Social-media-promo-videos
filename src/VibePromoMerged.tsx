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
import { VibeIntroCard } from "./VibeIntroCard";
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
// Shared beats (everything after the opening) — identical in both cuts.
export const DUR_COMMON: Record<string, number> = {
  describe: 170, // prompt + Vibe Agent PLANS (v3 VO is a touch longer)
  approve: 100, // Vibe Agent asks, you approve
  build: 145, // flow assembles on canvas while Vibe Agent posts build progress
  simulate: 105, // Flow tab: Vibe Agent writes the sim summary + "View simulations"
  simscreen: 145, // results table: sims run and achieve one by one
  buddy: 120,
  publish: 120, // click Publish → agent goes live
  golive: 150, // connect a number; "...goes live. Yes. It's that simple."
  cta: 90, // "Build yours today" — the close
};
export const COMMON_ORDER = ["describe", "approve", "build", "simulate", "simscreen", "buddy", "publish", "golive", "cta"];

type BeatMap = Record<string, { from: number; dur: number }>;
export const buildBeats = (introDur: Record<string, number>, order: string[]): { BEAT: BeatMap; total: number; order: string[] } => {
  const BEAT: BeatMap = {};
  let acc = 0;
  for (const k of order) {
    const dur = introDur[k] ?? DUR_COMMON[k];
    BEAT[k] = { from: acc, dur };
    acc += dur;
  }
  return { BEAT, total: acc, order };
};

// V1 = original opening (brand bumper → hook → "Introducing" gradient card).
const LAYOUT_V1 = buildBeats({ brand: 110, hook: 150, intro: 100 }, ["brand", "hook", "intro", ...COMMON_ORDER]);
// V2 = single cream topic-first title card (Pipecat intro format).
const LAYOUT_V2 = buildBeats({ intro2: 190 }, ["intro2", ...COMMON_ORDER]);
export const MERGED_TOTAL_FRAMES = LAYOUT_V1.total;
export const MERGED_V2_TOTAL_FRAMES = LAYOUT_V2.total;

// ---- Split cuts: two short videos carved out of the same beats -----------
// Both keep the ORIGINAL merged video untouched; they just render a subset of
// the beats with their own cream title card. Video 1 = build the agent (incl.
// simulations + Ask Buddy as the "stuck? get help" moment). Video 2 = publish,
// connect a phone number, and go live.
// Video 1 = build the agent AND publish it (it's not live until it's
// published). Video 2 = give the published agent a phone number: buy a
// number → connect it to the workflow → make a test call. Title-card
// durations are sized to fit each intro VO (buildintro 7.0s, goliveintro 7.7s).
const BUILD_ORDER = ["coldopen", "buildtitle", "describe", "approve", "build", "simulate", "simscreen", "buddy", "publish", "cta"];
const GOLIVE_ORDER = ["golivetitle", "buynumber", "connect", "testcall", "cta"];
const LAYOUT_BUILD = buildBeats({ coldopen: 150, buildtitle: 190, buddy: 175, cta: 200 }, BUILD_ORDER);
// Video 1's Buddy asks a build-time question (not "connect a number", which is
// Video 2's topic), with a generic Buddy VO so audio matches on-screen text.
const BUILD_BUDDY: BuddyContent = {
  question: "How do I add a knowledge base?",
  answer: (<>Open the <b>Knowledge Base</b> tab, upload your docs or add a URL, then <b>Save</b>. Your agent uses them to answer.</>),
  source: "plivo.com/docs/voice-agents/knowledge-base",
};
const BUILD_VO_OVERRIDE = { buddy: "vo/merged/04-buddy-build.mp3", cta: "vo/merged/08-cta-build.mp3" };
const LAYOUT_GOLIVE = buildBeats({ golivetitle: 265, buynumber: 185, connect: 175, testcall: 205 }, GOLIVE_ORDER);
export const BUILD_TOTAL_FRAMES = LAYOUT_BUILD.total;
export const GOLIVE_TOTAL_FRAMES = LAYOUT_GOLIVE.total;

// ---- Voiceover clips (relative to /public), placed at absolute frames ----
// One entry per beat; offset is frames after the beat starts. buildVO emits a
// clip only for beats present in this cut, so any subset of beats works.
export const VO_CONTENT: Record<string, { src: string; off: number }> = {
  hook: { src: "vo/merged/01-hook.mp3", off: 8 },
  intro: { src: "vo/merged/01b-intro.mp3", off: 12 },
  intro2: { src: "vo/merged/00-introv2.mp3", off: 10 },
  // Split cut 1 intro: agent line during the cold-open, then the narrator
  // bridges (negative off so it starts during the cold-open pull-back).
  coldopen: { src: "vo/merged/00-intro-agent.mp3", off: 30 },
  buildtitle: { src: "vo/merged/00-intro-narrate.mp3", off: -25 },
  golivetitle: { src: "vo/merged/00-goliveintro.mp3", off: 12 },
  describe: { src: "vo/merged/02-describe.mp3", off: 6 },
  approve: { src: "vo/merged/03-approve.mp3", off: 10 },
  build: { src: "vo/merged/03b-build.mp3", off: 12 },
  buddy: { src: "vo/merged/04-buddy.mp3", off: 8 },
  simulate: { src: "vo/merged/05-simulate.mp3", off: 8 },
  publish: { src: "vo/merged/07-publish.mp3", off: 10 },
  golive: { src: "vo/merged/06-golive.mp3", off: 8 },
  // Split-cut V2 body beats (buy → connect → test call).
  buynumber: { src: "vo/merged/09-buynumber.mp3", off: 10 },
  connect: { src: "vo/merged/10-connect.mp3", off: 8 },
  testcall: { src: "vo/merged/11-testcall.mp3", off: 10 },
  cta: { src: "vo/merged/08-cta.mp3", off: 8 },
};
export const buildVO = (BEAT: BeatMap, overrides: Record<string, string> = {}): { src: string; from: number }[] =>
  Object.entries(VO_CONTENT)
    .filter(([k]) => BEAT[k])
    .map(([k, v]) => ({ src: overrides[k] ?? v.src, from: BEAT[k].from + v.off }));

// ---- Captions (corner cards over the product beats) ----------------------
// One entry per beat; a caption runs from its beat's start until the next beat
// present in this cut starts. buildCaptions walks the actual order so subsets
// (the split cuts) get correct end frames with no per-cut wiring.
export const CAPTION_CONTENT: Record<string, { pre: string; keyword: string; post: string; startOff: number }> = {
  describe: { pre: "Describe it. ", keyword: "Vibe Agent", post: " plans the flow", startOff: 4 },
  approve: { pre: "Review. ", keyword: "Approve", post: ".", startOff: 3 },
  build: { pre: "And it ", keyword: "builds itself", post: ".", startOff: 3 },
  simulate: { pre: "Pressure-tested for ", keyword: "the messiest callers", post: "", startOff: 3 },
  simscreen: { pre: "Every scenario, ", keyword: "achieved", post: "", startOff: 4 },
  buddy: { pre: "Stuck? Just ask ", keyword: "Buddy", post: ", your copilot", startOff: 3 },
  publish: { pre: "One click to ", keyword: "publish", post: ". It's live.", startOff: 3 },
  golive: { pre: "Connect a number. ", keyword: "Go live", post: ".", startOff: 3 },
  buynumber: { pre: "Phone Numbers. ", keyword: "Buy a number", post: ".", startOff: 3 },
  connect: { pre: "Point it at ", keyword: "your workflow", post: ".", startOff: 3 },
  testcall: { pre: "Then ", keyword: "make a test call", post: ".", startOff: 3 },
};
export const buildCaptions = (BEAT: BeatMap, order: string[]): Caption[] => {
  const out: Caption[] = [];
  for (let i = 0; i < order.length; i++) {
    const name = order[i];
    const c = CAPTION_CONTENT[name];
    if (!c || !BEAT[name]) continue;
    const next = order[i + 1];
    const end = next && BEAT[next] ? BEAT[next].from - 3 : BEAT[name].from + BEAT[name].dur - 3;
    out.push({ start: BEAT[name].from + c.startOff, end, pre: c.pre, keyword: c.keyword, post: c.post });
  }
  return out;
};

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
export const BrandBeat: React.FC = () => {
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
export const HookCard: React.FC = () => {
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
// Buddy's on-screen Q&A is a prop so each cut can show a topic-appropriate
// example (merged/build differ). Defaults keep the original merged content.
export type BuddyContent = { question: string; answer: React.ReactNode; source: string };
const BUDDY_DEFAULT: BuddyContent = {
  question: "How do I connect a phone number?",
  answer: (<>Open <b>Voice Configuration</b>, pick your number, choose the inbound trunk, then <b>Save</b>.</>),
  source: "plivo.com/docs/voice-agents/routing",
};
const AskBuddyCompact: React.FC<{ content?: BuddyContent }> = ({ content = BUDDY_DEFAULT }) => {
  const frame = useCurrentFrame();
  const q = content.question;
  const open = interpolate(frame, [12, 26], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const typeStart = 18;
  const typeEnd = 46;
  const answerAt = 58;
  const n = Math.floor(interpolate(frame, [typeStart, typeEnd], [0, q.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const typed = q.slice(0, n);
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
              {content.answer}
              {frame >= answerAt + 22 ? (
                <>
                  <div style={{ fontSize: 13, fontWeight: 700, marginTop: 10, marginBottom: 4 }}>Sources:</div>
                  <div style={{ color: "#2f6bff", textDecoration: "underline", fontSize: 12.5 }}>{content.source}</div>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
const BuddyScene: React.FC<{ content?: BuddyContent }> = ({ content }) => (
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
    chatPanel={<AskBuddyCompact content={content} />}
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
            { kind: "action", label: "Creating the flow structure", at: 0, doneAt: 0 },
            { kind: "action", label: "Configuring conversation and routing", at: 0, doneAt: 0 },
            { kind: "action", label: "Setting identity, voice, and speech guidance", at: 0, doneAt: 0 },
            { kind: "action", label: "Reviewing and saving the flow", at: 0, doneAt: 0 },
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

// ---- Beat 6b — Simulations SCREEN (clicked through from the Flow tab) -----
// Tests run and land "Achieved", then the camera cuts to the per-run detail
// panel (Eval Results / Goal Results) — recreated from the real product so it
// reads as a genuine simulation report, not a placeholder.
const SIM_TABS = ["Flow", "Conversation Goal", "Agent Runs", "Simulations", "Settings", "Knowledge Base", "Secrets", "Tools"];
const EvalRow: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #f4f5f7" }}>
    <span style={{ fontSize: 13.5, color: "#374151" }}>{label}</span>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 13.5, fontWeight: 600, color }}>{value}</span>
      <span style={{ color: "#cbd5e1", fontSize: 13 }}>›</span>
    </div>
  </div>
);
const SimDetailPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const show = interpolate(frame, [92, 108], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", color: "#0f1117", fontFamily: `${INTER_FAMILY}, ${SORA_FAMILY}, sans-serif`, opacity: show, transform: `translateX(${(1 - show) * 26}px)` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", borderBottom: "1px solid #eef0f4" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontWeight: 600, fontSize: 14.5 }}>Caller shares login secrets</span>
          <span style={{ background: "#fdf4ff", color: "#a21caf", fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 999 }}>Smoke</span>
        </div>
        <span style={{ color: "#9ca3af" }}>✕</span>
      </div>
      <div style={{ display: "flex", gap: 22, padding: "11px 18px 0", borderBottom: "1px solid #eef0f4" }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, borderBottom: "2px solid #0f1117", paddingBottom: 9 }}>Transcript</span>
        <span style={{ fontSize: 13.5, color: "#9ca3af", paddingBottom: 9 }}>Scenario</span>
      </div>
      <div style={{ flex: 1, overflow: "hidden", padding: "14px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#6b7280", fontSize: 12.5, marginBottom: 13 }}>
          <span>Extracted Variables</span><span>▾</span>
        </div>
        <div style={{ border: "1px dashed #d1d5db", borderRadius: 8, padding: "10px 12px", fontSize: 13.5, marginBottom: 18 }}>
          Chosen path: <b>Refuse and escalate</b>
        </div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Eval Results</div>
        <EvalRow label="Instruction Following" value="High" color="#059669" />
        <EvalRow label="Loop Detection" value="Low" color="#059669" />
        <EvalRow label="Hallucination Detection" value="None" color="#6b7280" />
        <EvalRow label="Intent Detection" value="High" color="#059669" />
        <EvalRow label="Variable Extraction" value="High" color="#059669" />
        <div style={{ fontWeight: 600, fontSize: 14, margin: "18px 0 4px" }}>Goal Results</div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #f4f5f7", fontSize: 13.5 }}>
          <span>Refuse the unsafe request</span><span style={{ color: "#059669", fontWeight: 600 }}>Achieved</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #f4f5f7", fontSize: 13.5 }}>
          <span>Escalate to a human</span><span style={{ color: "#059669", fontWeight: 600 }}>Achieved</span>
        </div>
        <div style={{ fontSize: 12.5, color: "#6b7280", marginTop: 18 }}>Ended normally · 9 turns</div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>Flow Run UUID: 7c41a9e2-3b88-4f1d-9a02-6db7f0c1e5aa</div>
      </div>
    </div>
  );
};
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
              { name: "Router restart resolves issue", quality: "High", passAtFrame: 16 },
              { name: "Warranty basics are resolved", quality: "Medium", passAtFrame: 28 },
              { name: "Caller shares login secrets", quality: "High", passAtFrame: 40 },
              { name: "Do not contact request", quality: "High", passAtFrame: 52 },
              { name: "Frustrated caller accepts transfer", quality: "High", passAtFrame: 68 },
              { name: "Unsafe server repair escalates", quality: "High", passAtFrame: 86 },
            ]}
          />
        </div>
      }
    />
    {/* Focus the results table; gray the rest of the page out. */}
    <Spotlight left={70} top={166} width={874} height={470} radius={14} appearAtFrame={10} />
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

// ---- Split V2 Beat — Buy a phone number (Phone Numbers section) -----------
// Standalone console page (not the agent builder): search → results → Buy.
const NumCaps: React.FC = () => (
  <div style={{ display: "flex", gap: 6, color: "#6b7280", fontSize: 12 }}>
    <span style={{ background: "#eef2ff", color: "#4f46e5", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>Voice</span>
    <span style={{ background: "#f0fdf4", color: "#059669", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>SMS</span>
  </div>
);
const NumberRow: React.FC<{ number: string; place: string; buy?: boolean }> = ({ number, place, buy }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderTop: "1px solid #f1f2f4" }}>
    <PhoneIcon />
    <div style={{ minWidth: 210 }}>
      <div style={{ fontSize: 17, fontWeight: 600, color: "#0f1117" }}>{number}</div>
      <div style={{ fontSize: 12.5, color: "#9ca3af" }}>{place}</div>
    </div>
    <NumCaps />
    <div style={{ marginLeft: "auto", fontSize: 14, color: "#6b7280" }}>$1.00<span style={{ color: "#9ca3af" }}>/mo</span></div>
    <div style={{ position: "relative", background: buy ? "#0f1117" : "#fff", color: buy ? "#fff" : "#0f1117", border: buy ? "none" : "1px solid #e5e7eb", fontWeight: 600, fontSize: 14, padding: "9px 20px", borderRadius: 9 }}>
      Buy
      {buy ? <ClickCursor clickAtFrame={70} approach="tl" offset={{ x: 30, y: 14 }} sound={false} /> : null}
    </div>
  </div>
);
const Dropdown: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#9ca3af", marginBottom: 6 }}>{label}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid #e5e7eb", borderRadius: 9, padding: "10px 14px", fontSize: 14, fontWeight: 600, color: "#0f1117", minWidth: 150 }}>
      {value}
      <span style={{ marginLeft: "auto", color: "#9ca3af" }}>▾</span>
    </div>
  </div>
);
const BuyNumberScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#f6f5f3", fontFamily: `${INTER_FAMILY}, sans-serif`, alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 1180, background: "#fff", border: "1px solid #eef0f4", borderRadius: 18, boxShadow: "0 24px 60px rgba(15,17,23,0.08)", overflow: "hidden" }}>
        <div style={{ padding: "26px 28px 20px" }}>
          <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600 }}>Phone Numbers</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#0f1117", marginTop: 4 }}>Buy a number</div>
          <div style={{ fontSize: 14.5, color: "#6b7280", marginTop: 4 }}>Pick a number in the country you want to receive calls in.</div>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-end", marginTop: 22 }}>
            <Dropdown label="Country" value="🇺🇸 United States" />
            <Dropdown label="Type" value="Local" />
            <Dropdown label="Capabilities" value="Voice" />
            <div style={{ background: "#4f46e5", color: "#fff", fontWeight: 600, fontSize: 14, padding: "11px 22px", borderRadius: 9 }}>Search</div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #eef0f4", background: "#fafbfc", padding: "10px 20px", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#9ca3af" }}>
          3 numbers available
        </div>
        <NumberRow number="+1 (415) 555-0142" place="San Francisco, CA" buy />
        <NumberRow number="+1 (415) 555-0177" place="San Francisco, CA" />
        <NumberRow number="+1 (628) 555-0198" place="Oakland, CA" />
      </div>
      {frame >= 84 ? (
        <div style={{ position: "absolute", top: 90, right: 90 }}>
          <StatusToast title="Number purchased" body="+1 (415) 555-0142 is ready to connect to your agent." variant="success" appearAtFrame={84} chime />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---- Split V2 Beat — Make a test call (in-console Test Call panel) --------
const MicIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v4" /></svg>
);
const KeypadIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#6b7280"><circle cx="6" cy="6" r="1.6" /><circle cx="12" cy="6" r="1.6" /><circle cx="18" cy="6" r="1.6" /><circle cx="6" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="18" cy="12" r="1.6" /><circle cx="6" cy="18" r="1.6" /><circle cx="12" cy="18" r="1.6" /><circle cx="18" cy="18" r="1.6" /></svg>
);
const HangupIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M12 9c-2 0-3.9.3-5.6.9-.5.2-.9.7-.9 1.2v2.1c0 .5.3.9.8 1 .9.3 1.9.5 2.9.6.5 0 .9-.3.9-.8v-1.4c0-.4.3-.8.7-.9 .4-.1.8-.1 1.2-.1s.8 0 1.2.1c.4.1.7.5.7.9v1.4c0 .5.4.9.9.8 1-.1 2-.3 2.9-.6.5-.1.8-.5.8-1v-2.1c0-.5-.4-1-.9-1.2C15.9 9.3 14 9 12 9Z" transform="rotate(135 12 12)" /></svg>
);
const TestBubble: React.FC<{ who: "agent" | "caller"; text: string; at: number }> = ({ who, text, at }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const e = interpolate(frame, [at, at + 10], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const agent = who === "agent";
  return (
    <div style={{ display: "flex", justifyContent: agent ? "flex-start" : "flex-end", opacity: e, transform: `translateY(${(1 - e) * 8}px)` }}>
      <div style={{ maxWidth: 300, background: agent ? "#f3f4f6" : "#4f46e5", color: agent ? "#0f1117" : "#fff", borderRadius: 14, padding: "10px 14px", fontSize: 14, lineHeight: 1.45 }}>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.6, marginBottom: 3 }}>{agent ? "Agent" : "Caller"}</div>
        {text}
      </div>
    </div>
  );
};
const TestCallPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [10, 24], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const secs = Math.max(0, Math.floor((frame - 24) / 30)) + 12; // call already in progress
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return (
    <div style={{ position: "absolute", left: 150, top: 150, width: 470, background: "#fff", border: "1px solid #eef0f4", borderRadius: 14, boxShadow: "0 24px 60px rgba(15,17,23,0.14)", overflow: "hidden", opacity: open, transform: `translateX(${(1 - open) * -30}px)`, fontFamily: `${INTER_FAMILY}, sans-serif` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", borderBottom: "1px solid #eef0f4", fontWeight: 700, color: "#0f1117" }}>
        <span>Test Call</span>
        <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 600, color: "#dc2626" }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: "#dc2626" }} /> Live
        </span>
      </div>
      <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: 12, minHeight: 240 }}>
        <TestBubble who="agent" text="Thanks for calling City Utility. How can I help you today?" at={30} />
        <TestBubble who="caller" text="Hi, I need to reset my account PIN." at={78} />
        <TestBubble who="agent" text="I can help with that. Can I get the phone number on the account?" at={128} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderTop: "1px solid #eef0f4", background: "#fafbfc" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <PhoneIcon />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f1117" }}>Test Call</div>
            <div style={{ fontSize: 12.5, color: "#6b7280", fontVariantNumeric: "tabular-nums" }}>{mm}:{ss}</div>
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 999, border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}><MicIcon /></div>
          <div style={{ width: 40, height: 40, borderRadius: 999, border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}><KeypadIcon /></div>
          <div style={{ width: 40, height: 40, borderRadius: 999, background: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}><HangupIcon /></div>
        </div>
      </div>
    </div>
  );
};
const TestCallScene: React.FC = () => (
  <>
    <PlivoAppShell
      agentName="General Help Desk Assistant"
      agentStatus="Published"
      activeTab="Flow"
      canvas={
        <div style={{ padding: "24px 32px 0", width: "100%" }}>
          <AgentFlowDiagram nodes={READY_NODES} edges={READY_EDGES} canvasHeight={600} />
        </div>
      }
      overlay={<TestCallPanel />}
    />
    <Spotlight left={150} top={150} width={470} height={420} radius={14} appearAtFrame={20} />
  </>
);

// ---- Beat 8 — CTA ---------------------------------------------------------
// waveform=true adds a gentle blue waveform above the headline, bookending the
// voice cold-open so the split cut closes on the same motif it opened with.
export const CtaCard: React.FC<{ accent?: string; waveform?: boolean }> = ({ accent = "#cd3ef9", waveform = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const enter = interpolate(frame, [6, 28], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exit = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { easing: Easing.in(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Gentle scale-in, then HOLD dead still — a continuous zoom shimmered the
  // text/button ("shaky"), so the catch happens on entrance only.
  const scale = interpolate(frame, [6, 30], [0.94, 1.0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Waveform breathes softly (it's a close, not a live call).
  const wlevel = 0.42 + 0.14 * Math.sin(frame * 0.16);
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(120% 95% at 50% 0%, #fbfaf8 0%, #f6f5f3 55%, #efeeea 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif`,
      }}
    >
      <div style={{ opacity: Math.min(enter, exit), transform: `scale(${scale})`, textAlign: "center" }}>
        {waveform ? (
          <div style={{ width: 360, margin: "0 auto 40px", opacity: 0.85 }}>
            <ColdWaveform level={wlevel} />
          </div>
        ) : null}
        <div style={{ fontSize: 60, fontWeight: 600, color: "#0f1117", letterSpacing: -1.4 }}>
          Build <span style={{ color: accent }}>yours</span> today
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
// Establish→focus that never shimmers OR jolts: render the scene at two LOCKED
// framings (wide, then tight) and CROSSFADE between them. Each layer is a
// constant transform (no per-frame scaling = steady), and the dissolve replaces
// both the shimmery continuous zoom and the jarring hard cut.
export const CrossfadeZoom: React.FC<{ wide: Motion; tight: Motion; atFrame: number; durFrames?: number; children: React.ReactNode }> = ({ wide, tight, atFrame, durFrames = 18, children }) => {
  const frame = useCurrentFrame();
  const tightOpacity = interpolate(frame, [atFrame, atFrame + durFrames], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <TightStageClip motion={wide}>{children}</TightStageClip>
      <AbsoluteFill style={{ opacity: tightOpacity }}>
        <TightStageClip motion={tight}>{children}</TightStageClip>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const M_DESCRIBE_WIDE: Motion = { keyframes: [{ at: 0.0, x: 0.5, y: 0.46, scale: 1.02 }] };
const M_DESCRIBE_TIGHT: Motion = { keyframes: [{ at: 0.0, x: 0.806, y: 0.52, scale: 1.46 }] };
const M_APPROVE: Motion = { keyframes: [{ at: 0.0, x: 0.806, y: 0.5, scale: 1.66 }] };
const M_BUILD: Motion = { keyframes: [{ at: 0.0, x: 0.5, y: 0.52, scale: 1.02 }] };
const M_GOALS: Motion = { keyframes: [{ at: 0.0, x: 0.33, y: 0.46, scale: 1.5 }] };
const M_BUDDY_WIDE: Motion = { keyframes: [{ at: 0.0, x: 0.5, y: 0.4, scale: 1.05 }] };
const M_BUDDY_TIGHT: Motion = { keyframes: [{ at: 0.0, x: 0.806, y: 0.45, scale: 1.85 }] };
// Pulled back so the WHOLE panel (messages + composer at the bottom) is visible.
const M_SIMULATE: Motion = { keyframes: [{ at: 0.0, x: 0.806, y: 0.58, scale: 1.32 }] };
const M_SIMSCREEN: Motion = { keyframes: [{ at: 0.0, x: 0.327, y: 0.46, scale: 1.55 }] };
const M_PUBLISH: Motion = { keyframes: [{ at: 0.0, x: 0.72, y: 0.26, scale: 1.34 }] };
const M_GOLIVE: Motion = { keyframes: [{ at: 0.0, x: 0.5, y: 0.58, scale: 1.58 }] };
const M_BUYNUMBER: Motion = { keyframes: [{ at: 0.0, x: 0.5, y: 0.5, scale: 1.04 }] };
const M_TESTCALL: Motion = { keyframes: [{ at: 0.0, x: 0.34, y: 0.5, scale: 1.12 }] };

export const musicVolumeAtFrame = (frame: number, total: number) => {
  const fade = MUSIC.fadeFrames;
  if (frame < fade) return (frame / fade) * MUSIC.bedVolume;
  const out = total - fade;
  if (frame > out) return ((total - frame) / fade) * MUSIC.bedVolume;
  return MUSIC.bedVolume;
};

// ---- Split cut 1 — Voice cold-open ---------------------------------------
// Opens ON the thing you're building: dark screen, an incoming call buzzes in,
// a live blue waveform pulses as the agent answers, then the scene lightens and
// pulls back to hand off to the cream title card. Dark-to-cream = the "reveal".
const CREAM_WASH = "radial-gradient(120% 95% at 50% 0%, #fbfaf8 0%, #f6f5f3 55%, #efeeea 100%)";
const ColdPhoneGlyph: React.FC<{ color: string }> = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 3.5 4 4.5C3 5 2.6 6 2.9 7A15 15 0 0 0 17 21c1 .3 2-.1 2.5-1.1l1-2.5-4-1.8-1.4 1.6A11 11 0 0 1 8.8 10l1.6-1.4z" />
  </svg>
);
// level 0..1 scales the amplitude, so the waveform can ramp up as the agent
// starts speaking and wind down gently as the line finishes (natural settle).
const ColdWaveform: React.FC<{ level: number }> = ({ level }) => {
  const frame = useCurrentFrame();
  const bars = 42;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, height: 96 }}>
      {Array.from({ length: bars }).map((_, i) => {
        const wobble = 0.5 + 0.5 * Math.sin(i * 0.55);
        const amp = 5 + 42 * wobble * level;
        const h = 6 + Math.abs(Math.sin(frame * 0.4 + i * 0.7)) * amp;
        return <div key={i} style={{ width: 5, height: h, borderRadius: 3, background: "#323dfe", opacity: 0.9 }} />;
      })}
    </div>
  );
};
const AGENT_LINE = "Thanks for calling! How can I help you today?";
const BuildColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 12], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const buzz = frame < 30 ? Math.sin(frame * 1.5) * (1 - frame / 30) * 5 : 0;
  // Agent speaks ~30-105; then a natural beat as the waveform settles + the
  // scene pulls back and lightens, and the narrator comes in (~125).
  const pull = interpolate(frame, [118, 150], [1, 0.82], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [134, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cream = interpolate(frame, [120, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const level = interpolate(frame, [30, 38, 106, 126], [0, 1, 1, 0.12], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const speaking = frame >= 30 && frame <= 106;
  const nChars = Math.floor(interpolate(frame, [36, 100], [0, AGENT_LINE.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const ringPulse = 0.5 + 0.5 * Math.sin(frame * 0.5);
  const reveal = interpolate(frame, [92, 112], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#0d0f14", fontFamily: `${INTER_FAMILY}, sans-serif` }}>
      <AbsoluteFill style={{ background: CREAM_WASH, opacity: cream }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: Math.min(enter, fadeOut) }}>
        <div style={{ transform: `translateX(${buzz}px) scale(${pull})`, width: 760, background: "rgba(22,25,33,0.96)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, padding: "34px 40px", boxShadow: "0 40px 120px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#e7e9ee" }}>
            <span style={{ width: 12, height: 12, borderRadius: 999, background: "#22c55e", opacity: 0.4 + 0.6 * ringPulse, boxShadow: `0 0 ${8 + 10 * ringPulse}px #22c55e` }} />
            <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: 0.3 }}>Incoming call</span>
            <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, color: "#8b90a0", fontSize: 14 }}>
              <ColdPhoneGlyph color="#8b90a0" /> +1 (415) 555-0142
            </span>
          </div>
          <div style={{ margin: "30px 0 26px" }}>
            <ColdWaveform level={level} />
          </div>
          <div style={{ minHeight: 58, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ width: 30, height: 30, borderRadius: 999, background: "#323dfe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15 }}>🤖</span>
            <div style={{ color: "#f4f5f7", fontSize: 21, lineHeight: 1.4, fontWeight: 500 }}>
              {AGENT_LINE.slice(0, nChars)}
              {speaking && nChars < AGENT_LINE.length ? <span style={{ opacity: 0.5 }}>▍</span> : null}
            </div>
          </div>
          <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10, opacity: reveal }}>
            <PlivoLogoSvg width={78} color="#ffffff" />
            <span style={{ color: "#8b90a0", fontSize: 14 }}>Voice AI agent</span>
            <span style={{ marginLeft: "auto", color: "#22c55e", fontSize: 13, fontWeight: 600 }}>● Live</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---- Shared timeline ------------------------------------------------------
// Renders whatever beats are present in BEAT, guarded so any subset (the full
// merged cut OR either split cut) renders from the same code. `opening` is the
// intro the caller wants (brand bumper trio, single cream card, etc.).
const PromoTimeline: React.FC<{
  BEAT: BeatMap;
  total: number;
  voiceOver: boolean;
  opening: React.ReactNode;
  // Per-cut overrides (the split cuts customise Buddy; merged passes neither).
  buddyContent?: BuddyContent;
  voOverride?: Record<string, string>;
  // Caption/CTA keyword color. Merged keeps legacy purple; split cuts pass
  // brand blue so the captions match their on-brand blue intro card.
  accent?: string;
  // Adds the closing waveform bookend on the CTA (split cut 1).
  ctaWaveform?: boolean;
}> = ({ BEAT, total, voiceOver, opening, buddyContent, voOverride, accent = "#cd3ef9", ctaWaveform }) => {
  const VO = buildVO(BEAT, voOverride);
  const CAPTIONS = buildCaptions(BEAT, Object.keys(BEAT));
  return (
    <AbsoluteFill style={{ backgroundColor: "#f6f5f3" }}>
      {/* VO cut uses the original calm bed (cinno-loop) the user prefers; the
          music-only cut uses the preppier Vimeo track since there's no VO. */}
      <Audio
        src={staticFile(voiceOver ? MUSIC.src : "vibe-music.mp3")}
        volume={voiceOver ? (f) => musicVolumeAtFrame(f, total) * 0.3 : (f) => musicVolumeAtFrame(f, total) * 0.4}
      />

      {opening}
      {BEAT.describe && (
        <Sequence from={BEAT.describe.from} durationInFrames={BEAT.describe.dur} layout="none">
          <CrossfadeZoom wide={M_DESCRIBE_WIDE} tight={M_DESCRIBE_TIGHT} atFrame={42}>
            <DescribeScene />
          </CrossfadeZoom>
        </Sequence>
      )}
      {BEAT.approve && (
        <Sequence from={BEAT.approve.from} durationInFrames={BEAT.approve.dur} layout="none">
          <TightStageClip motion={M_APPROVE}>
            <ApproveScene />
          </TightStageClip>
        </Sequence>
      )}
      {BEAT.build && (
        <Sequence from={BEAT.build.from} durationInFrames={BEAT.build.dur} layout="none">
          <TightStageClip motion={M_BUILD}>
            <BuildScene />
          </TightStageClip>
        </Sequence>
      )}
      {BEAT.buddy && (
        <Sequence from={BEAT.buddy.from} durationInFrames={BEAT.buddy.dur} layout="none">
          <CrossfadeZoom wide={M_BUDDY_WIDE} tight={M_BUDDY_TIGHT} atFrame={44}>
            <BuddyScene content={buddyContent} />
          </CrossfadeZoom>
        </Sequence>
      )}
      {BEAT.simulate && (
        <Sequence from={BEAT.simulate.from} durationInFrames={BEAT.simulate.dur} layout="none">
          <TightStageClip motion={M_SIMULATE}>
            <SimulationScene />
          </TightStageClip>
        </Sequence>
      )}
      {BEAT.simscreen && (
        <Sequence from={BEAT.simscreen.from} durationInFrames={BEAT.simscreen.dur} layout="none">
          <TightStageClip motion={M_SIMSCREEN}>
            <SimScreenScene />
          </TightStageClip>
        </Sequence>
      )}
      {BEAT.publish && (
        <Sequence from={BEAT.publish.from} durationInFrames={BEAT.publish.dur} layout="none">
          <TightStageClip motion={M_PUBLISH}>
            <PublishScene />
          </TightStageClip>
        </Sequence>
      )}
      {BEAT.golive && (
        <Sequence from={BEAT.golive.from} durationInFrames={BEAT.golive.dur} layout="none">
          <TightStageClip motion={M_GOLIVE}>
            <GoLiveScene />
          </TightStageClip>
        </Sequence>
      )}
      {BEAT.buynumber && (
        <Sequence from={BEAT.buynumber.from} durationInFrames={BEAT.buynumber.dur} layout="none">
          <TightStageClip motion={M_BUYNUMBER}>
            <BuyNumberScene />
          </TightStageClip>
        </Sequence>
      )}
      {BEAT.connect && (
        <Sequence from={BEAT.connect.from} durationInFrames={BEAT.connect.dur} layout="none">
          <TightStageClip motion={M_GOLIVE}>
            <GoLiveScene />
          </TightStageClip>
        </Sequence>
      )}
      {BEAT.testcall && (
        <Sequence from={BEAT.testcall.from} durationInFrames={BEAT.testcall.dur} layout="none">
          <TightStageClip motion={M_TESTCALL}>
            <TestCallScene />
          </TightStageClip>
        </Sequence>
      )}
      {BEAT.cta && (
        <Sequence from={BEAT.cta.from} durationInFrames={BEAT.cta.dur} layout="none">
          <CtaCard accent={accent} waveform={ctaWaveform} />
        </Sequence>
      )}

      {/* Muted-friendly captions over the product beats. */}
      <TightCaptions captions={CAPTIONS} accent={accent} />

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

export const VibePromoMerged: React.FC<{ voiceOver?: boolean; introV2?: boolean }> = ({ voiceOver = false, introV2 = false }) => {
  const { BEAT, total } = introV2 ? LAYOUT_V2 : LAYOUT_V1;
  const opening = introV2 ? (
    <Sequence from={BEAT.intro2.from} durationInFrames={BEAT.intro2.dur} layout="none">
      <VibeIntroCard />
    </Sequence>
  ) : (
    <>
      <Sequence from={BEAT.brand.from} durationInFrames={BEAT.brand.dur} layout="none">
        <BrandBeat />
      </Sequence>
      <Sequence from={BEAT.hook.from} durationInFrames={BEAT.hook.dur} layout="none">
        <HookCard />
      </Sequence>
      <Sequence from={BEAT.intro.from} durationInFrames={BEAT.intro.dur} layout="none">
        <IntroGlow />
      </Sequence>
    </>
  );
  return <PromoTimeline BEAT={BEAT} total={total} voiceOver={voiceOver} opening={opening} />;
};

// ---- Split cut 1 — Build & publish your Vibe Agent -----------------------
// Presentation-style intro copy: a "with Vibe Agent" lede (brand blue) over two
// bullet points, instead of one run-on subtitle sentence.
const IntroBullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
    <span style={{ width: 11, height: 11, borderRadius: 999, background: "#323dfe", flexShrink: 0 }} />
    <span>{children}</span>
  </div>
);
const BUILD_INTRO_SUBTITLE = (
  <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
    <div style={{ fontSize: 34, color: "#67686f" }}>
      with <span style={{ color: "#323dfe", fontWeight: 700 }}>Vibe Agent</span>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 18, fontSize: 29, fontWeight: 500, color: "#3a3b42" }}>
      <IntroBullet>No code. No dev team.</IntroBullet>
      <IntroBullet>Build, test, and publish in minutes.</IntroBullet>
    </div>
  </div>
);
export const VibePromoBuild: React.FC<{ voiceOver?: boolean }> = ({ voiceOver = false }) => {
  const { BEAT, total } = LAYOUT_BUILD;
  const opening = (
    <>
      <Sequence from={BEAT.coldopen.from} durationInFrames={BEAT.coldopen.dur} layout="none">
        <BuildColdOpen />
      </Sequence>
      <Sequence from={BEAT.buildtitle.from} durationInFrames={BEAT.buildtitle.dur} layout="none">
        <VibeIntroCard
          title={<>Build a <span style={{ color: "#323dfe" }}>voice AI agent</span></>}
          subtitle={BUILD_INTRO_SUBTITLE}
        />
      </Sequence>
    </>
  );
  return <PromoTimeline BEAT={BEAT} total={total} voiceOver={voiceOver} opening={opening} buddyContent={BUILD_BUDDY} voOverride={BUILD_VO_OVERRIDE} accent="#323dfe" ctaWaveform />;
};

// ---- Split cut 2 — Give your agent a phone number ------------------------
export const VibePromoGoLive: React.FC<{ voiceOver?: boolean }> = ({ voiceOver = false }) => {
  const { BEAT, total } = LAYOUT_GOLIVE;
  const opening = (
    <Sequence from={BEAT.golivetitle.from} durationInFrames={BEAT.golivetitle.dur} layout="none">
      <VibeIntroCard
        title={<>Give your agent a <span style={{ color: "#323dfe" }}>phone number</span></>}
        subtitle="Buy a number, connect it to your published workflow, and make a test call."
      />
    </Sequence>
  );
  return <PromoTimeline BEAT={BEAT} total={total} voiceOver={voiceOver} opening={opening} accent="#323dfe" />;
};
