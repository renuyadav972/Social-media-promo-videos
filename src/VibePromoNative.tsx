import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { BrandIntro } from "./BrandIntro";
import { TaglineIntro } from "./TaglineIntro";
import { FinaleCard } from "./FinaleCard";
import { NativeStageClip } from "./NativeStageClip";
import {
  BRAND_INTRO_FRAMES,
  FINALE_FRAMES,
  MUSIC,
  STAGES,
  TAGLINE_FRAMES,
  TOTAL_FRAMES,
  TRANSITION_HEAVY_FRAMES,
  TRANSITION_LIGHT_FRAMES,
  type SceneKey,
} from "./promoConfig";
import { PlivoAppShell } from "./cards/PlivoAppShell";
import { VibeChatPanel, type ChatMessage } from "./cards/VibeChatPanel";
import { VibeQuestionCard } from "./cards/VibeQuestionCard";
import { ClickCursor } from "./cards/ClickCursor";
import { ProgressTracker } from "./cards/ProgressTracker";
import { TestScenariosTable } from "./cards/TestScenariosTable";
import { StatusToast } from "./cards/StatusToast";
import {
  AgentFlowDiagram,
  type FlowNode,
  type FlowEdge,
} from "./cards/AgentFlowDiagram";
import { SelfImprovementPanel } from "./cards/SelfImprovementPanel";

// VibePromoNative (code-only) — same config, no Loom. Useful for fast
// iteration: change a label / retime / re-order in promoConfig.ts and
// see it in seconds, without re-recording.

// ---------- Reusable bits ----------
const TriggerPlaceholder: React.FC = () => (
  <div
    style={{
      width: 220,
      padding: "12px 20px",
      borderRadius: 12,
      border: "1px dashed #d1d5db",
      color: "#9ca3af",
      fontSize: 14,
      textAlign: "center",
    }}
  >
    ⊕ Select Trigger
  </div>
);

// The prompt, split into segments so the "what you're building" phrase can be
// highlighted as it types in. Keeping it as parts (instead of one string) lets
// us render a purple highlight on the key phrase mid-type.
const PROMPT_PARTS: { text: string; hl?: boolean }[] = [
  { text: "Build an " },
  { text: "inbound help desk agent", hl: true },
  {
    text:
      ". Greet the caller, sort their issue, and hand off to a human when needed.",
  },
];
const PROMPT_LEN = PROMPT_PARTS.reduce((n, p) => n + p.text.length, 0);

// A prompt that types in left-to-right with the key phrase highlighted.
// Shown top-aligned and large so the viewer reads the WHOLE prompt (and
// instantly grasps what's being built) rather than catching only the tail.
const TypedPrompt: React.FC<{ startFrame: number; endFrame: number }> = ({
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();
  const shown = Math.floor(
    interpolate(frame, [startFrame, endFrame], [0, PROMPT_LEN], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const done = shown >= PROMPT_LEN;
  const caretOn = Math.floor(frame / 15) % 2 === 0;
  let consumed = 0;
  // Render the WHOLE prompt always (so wrapping/layout never changes), and just
  // recolor: typed text is visible, the rest is transparent. This kills the
  // reflow "shake" that came from slicing the string as it typed.
  return (
    <div style={{ fontSize: 19, lineHeight: 1.65, color: "#0f1117" }}>
      {PROMPT_PARTS.map((part, i) => {
        const start = consumed;
        consumed += part.text.length;
        const n = Math.max(0, Math.min(part.text.length, shown - start));
        const shownText = part.text.slice(0, n);
        const hiddenText = part.text.slice(n);
        const showCaret = !done && shown > start && shown <= start + part.text.length;
        return (
          <span key={i}>
            <span style={{ color: part.hl ? "#a21caf" : "#0f1117", fontWeight: part.hl ? 600 : 400 }}>
              {shownText}
            </span>
            {showCaret ? (
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: 19,
                  background: "#0f1117",
                  verticalAlign: "text-bottom",
                  opacity: caretOn ? 1 : 0,
                  // zero-width so it never nudges the surrounding text
                  marginLeft: -1,
                  marginRight: -1,
                }}
              />
            ) : null}
            <span style={{ color: "transparent" }}>{hiddenText}</span>
          </span>
        );
      })}
    </div>
  );
};

// ---------- Native scene components ----------
const PromptScene: React.FC = () => {
  const frame = useCurrentFrame();
  const sent = frame >= 150;
  return (
    <PlivoAppShell
      agentName="General Help Desk Assistant"
      activeTab="Flow"
      canvasToolbar
      // The canvas is intentionally empty at this point in the real product;
      // dim it so it doesn't pull focus from the prompt on the right.
      canvas={
        <div style={{ opacity: 0.45 }}>
          <TriggerPlaceholder />
        </div>
      }
      chatPanel={
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "16px 22px 18px",
            color: "#0f1117",
          }}
        >
          {/* header dots */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              color: "#9ca3af",
              fontSize: 16,
            }}
          >
            <span>⋯</span>
            <span>✕</span>
          </div>

          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "#9ca3af",
              marginTop: 6,
              marginBottom: 12,
            }}
          >
            New Vibe Agent · your prompt
          </div>

          {/* The prompt, large and top-aligned. */}
          <TypedPrompt startFrame={8} endFrame={132} />

          <div style={{ flex: 1 }} />

          {/* Composer — the send button fills once the prompt is complete. */}
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "12px 14px",
              color: "#9ca3af",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              minHeight: 52,
              position: "relative",
            }}
          >
            <span>Describe the agentic flow you want to build...</span>
            <div
              style={{
                position: "absolute",
                right: 10,
                bottom: 8,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: sent ? "#cd3ef9" : "#0f1117",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                transform: sent ? "scale(1.08)" : "scale(1)",
              }}
            >
              ↑
            </div>
            {/* Cursor travels to the send button and clicks to submit. */}
            <ClickCursor clickAtFrame={150} approach="br" offset={{ x: 8, y: 6 }} />
          </div>
        </div>
      }
    />
  );
};

const PlanScene: React.FC = () => {
  const messages: ChatMessage[] = [
    {
      kind: "user",
      revealAtFrame: 0,
      text: "Build an inbound help desk agent. Greet the caller, sort their issue, and hand off to a human when needed.",
    },
    { kind: "thinking", revealAtFrame: 18, durationLabel: "Thought for 1 second" },
    { kind: "check", revealAtFrame: 30, text: "Finding voice components", done: false },
    { kind: "check", revealAtFrame: 60, text: "Finding voice components", done: true },
    { kind: "check", revealAtFrame: 60, text: "Checking current setup", done: false },
    { kind: "check", revealAtFrame: 95, text: "Checking current setup", done: true },
    { kind: "thinking", revealAtFrame: 100, durationLabel: "Thought for 13 seconds" },
    { kind: "status", revealAtFrame: 110, text: "Generating..." },
  ];
  return (
    <PlivoAppShell
      agentName="General Help Desk Assistant"
      activeTab="Flow"
      canvasToolbar
      canvas={<TriggerPlaceholder />}
      chatPanel={<VibeChatPanel messages={messages} />}
    />
  );
};

const ConfirmScene: React.FC = () => {
  return (
    <PlivoAppShell
      agentName="General Help Desk Assistant"
      activeTab="Flow"
      canvasToolbar
      canvas={<TriggerPlaceholder />}
      chatPanel={
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "16px 20px",
            gap: 14,
            overflow: "hidden",
            color: "#0f1117",
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              color: "#9ca3af",
              fontSize: 16,
              gap: 12,
            }}
          >
            <span>⋯</span>
            <span>✕</span>
          </div>

          {/* Agent-written rules preamble, so it reads as Vibe's plan. */}
          <div style={{ color: "#0f1117" }}>
            · Greet the caller, identify the issue, and classify intent.
            <br />· Route to billing, technical, or general support.
            <br />· Transfer to a human specialist when the issue needs one.
          </div>

          {/* The question card — cursor travels to Approve and clicks it. */}
          <VibeQuestionCard
            header="Vibe Agent needs your input"
            question="Should I build this inbound help desk flow using the plan above?"
            options={[
              {
                title: "Approve",
                description:
                  "Build the flow as planned with the default routing and transfer logic.",
                emphasized: true,
              },
              {
                title: "Revise",
                description:
                  "I want to change the flow, routing, or call handling before you build.",
              },
            ]}
            appearAtFrame={16}
            cursorOnOptionIndex={0}
            clickAtFrame={110}
          />
        </div>
      }
    />
  );
};

const FLOW_NODES: FlowNode[] = [
  {
    id: "trigger",
    label: "Voice Call",
    sublabel: "Triggers when an incoming call is received",
    variant: "trigger",
    x: 360,
    y: 0,
    appearAtFrame: 10,
  },
  {
    id: "hub",
    label: "Help Desk Assistant",
    sublabel: "Greets, classifies and routes the caller.",
    variant: "purple",
    x: 360,
    y: 110,
    width: 220,
    appearAtFrame: 30,
  },
  {
    id: "specialist",
    label: "Specialist Transfer",
    sublabel: "Hands off to a human specialist.",
    variant: "purple",
    x: 30,
    y: 280,
    appearAtFrame: 75,
  },
  {
    id: "resolved",
    label: "Resolved Close",
    sublabel: "Ends after issue is resolved.",
    variant: "red",
    x: 230,
    y: 280,
    appearAtFrame: 90,
  },
  {
    id: "oos",
    label: "Out of Scope Close",
    sublabel: "Ends when out of scope.",
    variant: "red",
    x: 430,
    y: 280,
    appearAtFrame: 105,
  },
  {
    id: "dnc",
    label: "Handle DNC Close",
    sublabel: "Closes do-not-contact requests.",
    variant: "red",
    x: 640,
    y: 280,
    appearAtFrame: 120,
  },
  {
    id: "sp-failed",
    label: "Transfer Failed Close",
    variant: "red",
    x: -30,
    y: 440,
    appearAtFrame: 150,
  },
  {
    id: "sp-done",
    label: "Transfer Done Close",
    variant: "red",
    x: 150,
    y: 440,
    appearAtFrame: 165,
  },
];

const FLOW_EDGES: FlowEdge[] = [
  { from: "trigger", to: "hub", appearAtFrame: 20 },
  { from: "hub", to: "specialist", label: "Transfer To Specialist", appearAtFrame: 60 },
  { from: "hub", to: "resolved", label: "Issue Resolved", appearAtFrame: 78 },
  { from: "hub", to: "oos", label: "Out Of Scope", appearAtFrame: 95 },
  { from: "hub", to: "dnc", label: "Handle DNC", appearAtFrame: 110 },
  { from: "specialist", to: "sp-failed", appearAtFrame: 140 },
  { from: "specialist", to: "sp-done", appearAtFrame: 155 },
];

const BuildScene: React.FC = () => {
  const buildSteps = [
    { label: "Confirm approved flow logic", completeAtFrame: 0 },
    { label: "Discover required voice components", completeAtFrame: 30 },
    { label: "Create and connect flow structure", completeAtFrame: 90 },
    { label: "Configure help desk conversation details", completeAtFrame: 130 },
    { label: "Set identity, voice, and speech guidance", completeAtFrame: 170 },
    { label: "Review, save, and test the flow", completeAtFrame: 230 },
  ];
  return (
    <PlivoAppShell
      agentName="General Help Desk Assistant"
      agentStatus="Draft"
      activeTab="Flow"
      canvasToolbar
      canvas={
        <div style={{ padding: "24px 32px 0", width: "100%" }}>
          <AgentFlowDiagram nodes={FLOW_NODES} edges={FLOW_EDGES} canvasHeight={620} />
        </div>
      }
      chatPanel={
        <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column" }}>
          <ProgressTracker
            title="Progress tracker"
            subtitle="Building the approved inbound help desk flow."
            steps={buildSteps}
          />
        </div>
      }
    />
  );
};

const TestsScene: React.FC = () => {
  const rows = [
    { name: "Router restart resolves issue", passAtFrame: 20 },
    { name: "Caller shares login secrets", passAtFrame: 110 },
    { name: "Frustrated caller accepts transfer", passAtFrame: 45 },
    { name: "Unsafe server repair escalates", passAtFrame: 70 },
    { name: "Warranty basics are resolved", passAtFrame: 35 },
    { name: "Threatening caller gets closed", passAtFrame: 85 },
    { name: "Do not contact request", passAtFrame: 55 },
    { name: "Vague return question clarified", passAtFrame: 100 },
  ];
  return (
    <PlivoAppShell
      agentName="General Help Desk Assistant"
      agentStatus="Draft"
      activeTab="Simulations"
      highlightActiveTab
      tabCursor={{ label: "Simulations", clickAtFrame: 26 }}
      tabs={[
        "Flow",
        "Conversation Goal",
        "Agent Runs",
        "Simulations",
        "Event Callbacks",
        "Settings",
        "Knowledge Base",
        "Secrets",
        "Tools",
      ]}
      canvas={
        <div style={{ padding: 32, width: "100%", display: "flex", justifyContent: "center" }}>
          <TestScenariosTable rows={rows} />
        </div>
      }
    />
  );
};

const ImproveScene: React.FC = () => {
  const messages: ChatMessage[] = [
    {
      kind: "agent",
      revealAtFrame: 0,
      text: "2 scenarios scored low. Fixing the agent and re-running them now.",
    },
  ];
  const items = [
    { label: "Tightening support boundaries", appearAtFrame: 20, doneAtFrame: 60 },
    { label: "Improving transfer capture", appearAtFrame: 50, doneAtFrame: 95 },
    { label: "Saving test fixes", appearAtFrame: 85, doneAtFrame: 130 },
    { label: "Rerunning failed tests…", appearAtFrame: 120 },
  ];
  return (
    <PlivoAppShell
      agentName="General Help Desk Assistant"
      agentStatus="Draft"
      activeTab="Simulations"
      canvas={
        <div style={{ padding: 32, width: "100%" }}>
          {/* Two rows start "Low" (red) and flip to "High" as Vibe's fixes
              land — the visible proof that the agent improved itself. */}
          <TestScenariosTable
            rows={[
              { name: "Router restart resolves issue", passAtFrame: 0 },
              { name: "Caller shares login secrets", passAtFrame: 0 },
              {
                name: "Frustrated caller accepts transfer",
                passAtFrame: 100,
                startsFailed: true,
              },
              {
                name: "Unsafe server repair escalates",
                passAtFrame: 135,
                startsFailed: true,
              },
            ]}
          />
        </div>
      }
      chatPanel={
        <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 18 }}>
          <SelfImprovementPanel
            title="Vibe is improving your agent"
            items={items}
          />
          <VibeChatPanel messages={messages} />
        </div>
      }
    />
  );
};

// The finished flow, fully revealed (every node/edge present from frame 0).
const READY_NODES: FlowNode[] = FLOW_NODES.map((n) => ({ ...n, appearAtFrame: 0 }));
const READY_EDGES: FlowEdge[] = FLOW_EDGES.map((e) => ({ ...e, appearAtFrame: 0 }));

// "Your agent is live" — show the built WORKFLOW (not the Simulations table),
// flip the status pill to a green "Live", and confirm with a Published toast.
const ReadyScene: React.FC = () => (
  <PlivoAppShell
    agentName="General Help Desk Assistant"
    agentStatus="Published"
    activeTab="Flow"
    canvas={
      <div style={{ padding: "24px 32px 0", width: "100%" }}>
        <AgentFlowDiagram nodes={READY_NODES} edges={READY_EDGES} canvasHeight={620} />
      </div>
    }
    overlay={
      <StatusToast
        title="Published"
        body="Your agent is live and ready to take calls."
        variant="success"
        appearAtFrame={20}
        chime
      />
    }
  />
);

// Stage 8 — connect a phone number in Voice Configuration, click Save, and the
// "Phone number connected" toast confirms real calls now route to the agent.
const PhoneIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path
      d="M7.5 3.5 5 4.5c-1 .4-1.5 1.4-1.2 2.4a13 13 0 0 0 8.3 8.3c1 .3 2-.2 2.4-1.2l1-2.5-3.2-1.6-1.3 1.3a9.5 9.5 0 0 1-3.4-3.4l1.3-1.3z"
      fill="#cd3ef9"
    />
  </svg>
);

const DeployScene: React.FC = () => (
  <PlivoAppShell
    agentName="General Help Desk Assistant"
    agentStatus="Published"
    activeTab="Voice Configuration"
    tabs={[
      "Flow",
      "Conversation Goal",
      "Agent Runs",
      "Simulations",
      "Settings",
      "Knowledge Base",
      "Secrets",
      "Tools",
      "Voice Configuration",
    ]}
    canvas={
      <div
        style={{
          padding: "40px 40px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: 600,
            background: "#ffffff",
            border: "1px solid #eef0f4",
            borderRadius: 14,
            padding: 28,
            boxShadow: "0 1px 0 rgba(15,17,23,0.04)",
            fontSize: 14,
            color: "#0f1117",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700 }}>Voice Configuration</div>
          <div style={{ fontSize: 14, color: "#6b7280", marginTop: 6, marginBottom: 22 }}>
            Connect a phone number so customers can call your agent.
          </div>

          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "#9ca3af",
              marginBottom: 8,
            }}
          >
            Inbound phone number
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: "14px 16px",
            }}
          >
            <PhoneIcon />
            <div style={{ fontSize: 18, fontWeight: 600 }}>+1 (415) 555‑0142</div>
            <div
              style={{
                marginLeft: "auto",
                background: "#ecfdf5",
                color: "#059669",
                fontWeight: 600,
                fontSize: 12,
                padding: "4px 10px",
                borderRadius: 8,
              }}
            >
              Purchased
            </div>
          </div>

          <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 20, margin: "8px 0" }}>
            ↓
          </div>

          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "#9ca3af",
              marginBottom: 8,
            }}
          >
            Routes to agent
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: "1px solid #cd3ef9",
              background: "#fdf4ff",
              borderRadius: 10,
              padding: "14px 16px",
            }}
          >
            <span style={{ fontSize: 18 }}>🤖</span>
            <div style={{ fontSize: 15, fontWeight: 600 }}>General Help Desk Assistant</div>
            <div
              style={{
                marginLeft: "auto",
                background: "#ecfdf5",
                color: "#059669",
                fontWeight: 600,
                fontSize: 12,
                padding: "4px 10px",
                borderRadius: 8,
              }}
            >
              ● Active
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 24,
            }}
          >
            <div
              style={{
                background: "#0f1117",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: 14,
                padding: "10px 22px",
                borderRadius: 9,
                position: "relative",
              }}
            >
              Save configuration
              {/* "tl" approach: the cursor TIP lands at this offset inside the
                  button (instead of poking above it). */}
              <ClickCursor clickAtFrame={92} approach="tl" offset={{ x: 74, y: 16 }} />
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
        appearAtFrame={112}
        chime
      />
    }
  />
);

// The Buddy mascot — a friendly blue robot with a sunglasses visor.
const BuddyAvatar: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
    <line x1="28" y1="6" x2="28" y2="14" stroke="#2f6bff" strokeWidth="2.5" />
    <circle cx="28" cy="5" r="3" fill="#2f6bff" />
    <rect x="9" y="13" width="38" height="34" rx="12" fill="#2f6bff" />
    <rect x="15" y="24" width="26" height="12" rx="6" fill="#0f1733" />
    <circle cx="23" cy="30" r="2.3" fill="#ffffff" />
    <circle cx="33" cy="30" r="2.3" fill="#ffffff" />
  </svg>
);

// Faithful "Ask Buddy" panel: a docs-style helper. Buddy intro, then the user
// types a question, and Buddy answers with steps, Sources, and follow-ups.
const QUESTION = "How do I route a phone number to my agent?";
const AskBuddyPanel: React.FC = () => {
  const frame = useCurrentFrame();
  // The panel opens after the "Ask Buddy" button is clicked (~f24).
  const open = interpolate(frame, [30, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const typeStart = 52;
  const typeEnd = 110;
  const answerAt = 126;
  const typedLen = Math.floor(
    interpolate(frame, [typeStart, typeEnd], [0, QUESTION.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const typed = QUESTION.slice(0, typedLen);
  const typing = frame < typeEnd;
  const caretOn = Math.floor(frame / 14) % 2 === 0;
  const caret = (
    <span
      style={{
        display: "inline-block",
        width: 2,
        height: 15,
        background: "#0f1117",
        marginLeft: 1,
        verticalAlign: "middle",
        opacity: caretOn ? 1 : 0,
      }}
    />
  );
  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    color: "#0f1117",
    marginTop: 12,
    marginBottom: 5,
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        color: "#0f1117",
        fontSize: 14,
        // Slide/fade in when the panel opens.
        opacity: open,
        transform: `translateX(${(1 - open) * 40}px)`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 18px",
          borderBottom: "1px solid #eef0f4",
          fontWeight: 600,
        }}
      >
        <span>Ask Buddy</span>
        <span style={{ color: "#9ca3af" }}>✕</span>
      </div>

      {/* Body — the conversation. Question types in here (framable), then the
          answer streams in below it. */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          padding: "16px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* compact Buddy intro */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <BuddyAvatar size={30} />
          <div>
            <div style={{ fontWeight: 700 }}>Hi, I'm Buddy!</div>
            <div style={{ fontSize: 12.5, color: "#6b7280" }}>Ask me anything about Plivo.</div>
          </div>
        </div>

        {/* question, typing in */}
        {typedLen > 0 ? (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ background: "#eff2f9", borderRadius: 12, padding: "9px 13px", maxWidth: 320, fontSize: 14 }}>
              {typed}
              {typing ? caret : null}
            </div>
          </div>
        ) : null}

        {/* Buddy thinking, then the answer */}
        {frame >= typeEnd + 4 && frame < answerAt ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6b7280", fontSize: 13 }}>
            <BuddyAvatar size={22} /> Buddy is typing…
          </div>
        ) : null}
        {frame >= answerAt ? (
          <div style={{ display: "flex", gap: 10 }}>
            <BuddyAvatar size={22} />
            <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>
              To route a number to your agent:
              <div style={{ marginTop: 5 }}>
                1. Open <b>Voice Configuration</b> and select your number.
                <br />2. Choose your <b>inbound trunk</b>, then <b>Save</b>.
              </div>
              <div style={{ marginTop: 5 }}>Calls to that number now reach your AI agent.</div>
              {frame >= answerAt + 24 ? (
                <>
                  <div style={labelStyle}>Sources:</div>
                  <div style={{ color: "#2f6bff", textDecoration: "underline", fontSize: 12.5 }}>
                    plivo.com/docs/voice-agents/routing
                  </div>
                </>
              ) : null}
              {frame >= answerAt + 42 ? (
                <>
                  <div style={labelStyle}>Follow-up questions you might ask:</div>
                  <div style={{ color: "#374151", fontSize: 12.5, lineHeight: 1.6 }}>
                    • Inbound, outbound, or both?
                    <br />• How do I add a fallback number?
                  </div>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {/* Composer (mirrors the typing). */}
      <div style={{ padding: "10px 14px" }}>
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: "10px 12px",
            minHeight: 44,
            position: "relative",
            color: typing && typedLen > 0 ? "#0f1117" : "#9ca3af",
            fontSize: 13.5,
          }}
        >
          {typing && typedLen > 0 ? typed : "What would you like to know?"}
          <div style={{ position: "absolute", right: 10, bottom: 8, fontSize: 11, color: "#9ca3af" }}>
            {typing ? typedLen : 0} / 1000
          </div>
        </div>
      </div>
    </div>
  );
};

// Ask Buddy stage — the helper panel on the right, the built flow on the left.
const AskBuddyScene: React.FC = () => (
  <PlivoAppShell
    agentName="General Help Desk Assistant"
    agentStatus="Draft"
    activeTab="Flow"
    buddyCursorFrame={24}
    canvas={
      <div style={{ padding: "24px 32px 0", width: "100%" }}>
        <AgentFlowDiagram nodes={READY_NODES} edges={READY_EDGES} canvasHeight={620} />
      </div>
    }
    chatPanel={<AskBuddyPanel />}
  />
);

// ---- sceneKey → component mapping ----
// promoConfig.ts has SceneKey as a string union; this map turns it into the
// matching React component. Adding a new stage with a new sceneKey requires
// adding it here too.
const SCENE_BY_KEY: Record<SceneKey, React.FC> = {
  prompt: PromptScene,
  plan: PlanScene,
  confirm: ConfirmScene,
  build: BuildScene,
  tests: TestsScene,
  improve: ImproveScene,
  ready: ReadyScene,
  deploy: DeployScene,
  askbuddy: AskBuddyScene,
};

// Per-stage voiceover clips (relative to /public), used only by the VO cut.
const STAGE_VO: Partial<Record<SceneKey, string>> = {
  prompt: "vo/01-prompt.mp3",
  plan: "vo/02-plan.mp3",
  confirm: "vo/03-confirm.mp3",
  build: "vo/04-build.mp3",
  tests: "vo/05-tests.mp3",
  improve: "vo/06-improve.mp3",
  ready: "vo/07-ready.mp3",
  deploy: "vo/08-deploy.mp3",
  askbuddy: "vo/ab-askbuddy.mp3",
};

const musicVolumeAtFrame = (frame: number) => {
  if (frame < MUSIC.fadeFrames) {
    return (frame / MUSIC.fadeFrames) * MUSIC.bedVolume;
  }
  const fadeOutStart = TOTAL_FRAMES - MUSIC.fadeFrames;
  if (frame > fadeOutStart) {
    return ((TOTAL_FRAMES - frame) / MUSIC.fadeFrames) * MUSIC.bedVolume;
  }
  return MUSIC.bedVolume;
};

export const VibePromoNative: React.FC<{ voiceOver?: boolean }> = ({
  voiceOver = false,
}) => {
  return (
    <AbsoluteFill>
      {/* In the VO cut, duck the music bed under the narration. */}
      <Audio
        src={staticFile(MUSIC.src)}
        volume={
          voiceOver ? (f) => musicVolumeAtFrame(f) * 0.3 : musicVolumeAtFrame
        }
      />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={BRAND_INTRO_FRAMES}>
          <BrandIntro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_HEAVY_FRAMES })}
        />

        <TransitionSeries.Sequence durationInFrames={TAGLINE_FRAMES}>
          <TaglineIntro />
          {voiceOver ? (
            <Sequence from={12} layout="none">
              <Audio src={staticFile("vo/00-open.mp3")} />
            </Sequence>
          ) : null}
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_HEAVY_FRAMES })}
        />

        {STAGES.map((s, idx) => {
          const Scene = SCENE_BY_KEY[s.sceneKey];
          return (
            <React.Fragment key={s.sceneKey}>
              <TransitionSeries.Sequence durationInFrames={s.duration}>
                <NativeStageClip
                  motion={s.motion}
                  voiceoverSrc={voiceOver ? STAGE_VO[s.sceneKey] : undefined}
                >
                  <Scene />
                </NativeStageClip>
              </TransitionSeries.Sequence>
              {idx < STAGES.length - 1 ? (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({
                    durationInFrames: TRANSITION_LIGHT_FRAMES,
                  })}
                />
              ) : null}
            </React.Fragment>
          );
        })}

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_HEAVY_FRAMES })}
        />

        <TransitionSeries.Sequence durationInFrames={FINALE_FRAMES}>
          <FinaleCard />
          {voiceOver ? (
            <Sequence from={6} layout="none">
              <Audio src={staticFile("vo/09-close.wav")} />
            </Sequence>
          ) : null}
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
