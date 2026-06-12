import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { PlivoAppShell } from "./cards/PlivoAppShell";
import { VibeChatPanel, type ChatMessage } from "./cards/VibeChatPanel";
import { ProgressTracker } from "./cards/ProgressTracker";
import { TestScenariosTable } from "./cards/TestScenariosTable";
import { StatusToast } from "./cards/StatusToast";

// CardsShowcase — a working demo of the native Remotion cards. Each "stage"
// below is a fully code-controlled scene that replicates one of the Loom
// moments WITHOUT any video footage. Change copy, retime checkmarks, swap
// agent name, etc — no re-recording required.

// ---- Stage 1: prompt being typed into the Vibe Agent composer ----
const Stage1: React.FC = () => {
  const messages: ChatMessage[] = []; // no chat history yet — fresh start
  return (
    <PlivoAppShell
      agentName="Customer Support Executive"
      activeTab="Flow"
      canvas={<EmptyCanvas />}
      chatPanel={
        <VibeChatPanel
          messages={messages}
          composerText={
            "Build me an inbound help desk flow. Greet the caller, classify their intent, route to billing / technical / general support, and transfer to a specialist when needed."
          }
          composerStartFrame={6}
          composerEndFrame={120}
        />
      }
    />
  );
};

// ---- Stage 2: agent thinking, ticking off planning checks ----
const Stage2: React.FC = () => {
  const messages: ChatMessage[] = [
    {
      kind: "user",
      revealAtFrame: 0,
      text: "Build me an inbound help desk flow. Greet, classify, route, transfer.",
    },
    { kind: "thinking", revealAtFrame: 20, durationLabel: "Thought for 1 second" },
    { kind: "check", revealAtFrame: 30, text: "Finding voice components", done: false },
    { kind: "check", revealAtFrame: 60, text: "Finding voice components", done: true },
    { kind: "check", revealAtFrame: 60, text: "Checking current setup", done: false },
    { kind: "check", revealAtFrame: 90, text: "Checking current setup", done: true },
    { kind: "status", revealAtFrame: 100, text: "Generating..." },
  ];
  return (
    <PlivoAppShell
      agentName="Customer Support Executive"
      activeTab="Flow"
      canvas={<EmptyCanvas />}
      chatPanel={<VibeChatPanel messages={messages} />}
    />
  );
};

// ---- Stage 4: build progress tracker ticking off step by step ----
const Stage4: React.FC = () => {
  const buildSteps = [
    { label: "Confirm approved flow logic", completeAtFrame: 0 },
    { label: "Discover required voice components", completeAtFrame: 35 },
    { label: "Create and connect flow structure", completeAtFrame: 75 },
    { label: "Configure help desk conversation details", completeAtFrame: 115 },
    { label: "Set identity, voice, and speech guidance", completeAtFrame: 155 },
    { label: "Review, save, and test the flow", completeAtFrame: 195 },
  ];

  const chatMessages: ChatMessage[] = [
    { kind: "agent", revealAtFrame: 0, text: "Starting to build your flow now." },
    { kind: "check", revealAtFrame: 5, text: "Finding transfer component", done: true },
    { kind: "check", revealAtFrame: 5, text: "Checking component details", done: true },
  ];

  return (
    <PlivoAppShell
      agentName="General Help Desk Assistant"
      agentStatus="Draft"
      activeTab="Flow"
      canvas={<EmptyCanvas />}
      chatPanel={
        <div
          style={{
            padding: "20px 20px 0",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            overflow: "hidden",
            flex: 1,
          }}
        >
          <ProgressTracker
            title="Progress tracker"
            subtitle="Building the approved inbound help desk flow."
            steps={buildSteps}
          />
          <VibeChatPanel messages={chatMessages} />
        </div>
      }
    />
  );
};

// ---- Stage 5: simulation results table ----
const Stage5: React.FC = () => {
  const rows = [
    { name: "Router restart resolves issue", passAtFrame: 20 },
    { name: "Caller shares login secrets", passAtFrame: 90 },
    { name: "Frustrated caller accepts transfer", passAtFrame: 40 },
    { name: "Unsafe server repair escalates", passAtFrame: 60 },
    { name: "Warranty basics are resolved", passAtFrame: 30 },
    { name: "Threatening caller gets closed", passAtFrame: 70 },
    { name: "Do not contact request", passAtFrame: 50 },
    { name: "Vague return question clarified", passAtFrame: 80 },
  ];
  return (
    <PlivoAppShell
      agentName="General Help Desk Assistant"
      agentStatus="Draft"
      activeTab="Simulations"
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
        <div style={{ padding: 24, width: "100%", display: "flex", justifyContent: "center" }}>
          <TestScenariosTable rows={rows} />
        </div>
      }
    />
  );
};

// ---- Stage 7: success toast appears, build is done ----
const Stage7: React.FC = () => {
  return (
    <PlivoAppShell
      agentName="General Help Desk Assistant"
      agentStatus="Draft"
      activeTab="Simulations"
      canvas={
        <div style={{ padding: 24, width: "100%" }}>
          <TestScenariosTable
            rows={[
              { name: "Router restart resolves issue", passAtFrame: 0 },
              { name: "Caller shares login secrets", passAtFrame: 0 },
              { name: "Frustrated caller accepts transfer", passAtFrame: 0 },
              { name: "Unsafe server repair escalates", passAtFrame: 0 },
            ]}
          />
        </div>
      }
      overlay={
        <StatusToast
          title="Success"
          body="Agent Flow saved as draft successfully."
          variant="success"
          appearAtFrame={15}
        />
      }
    />
  );
};

const EmptyCanvas: React.FC = () => (
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

export const CardsShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#ffffff" }}>
      <Series>
        <Series.Sequence durationInFrames={150} name="Prompt typing">
          <Stage1 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={150} name="Vibe planning">
          <Stage2 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={210} name="Building (progress tracker)">
          <Stage4 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={120} name="Simulations">
          <Stage5 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={120} name="Success toast">
          <Stage7 />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
