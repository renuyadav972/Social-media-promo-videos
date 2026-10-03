import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { BuilderPage, LiveFlow, VibeEmpty, VibePanel, VibeItem, SimulationsPage, VoiceConfigPage, ConfigureNumberModal, BuddyPanel, PublishFx, FULL_TABS } from "./AgentBuilder";
import { NewConsoleShell } from "./NewConsoleShell";
import { PhoneNumbersScreen } from "../OnboardingVoiceAgents";

// ============================================================================
// The Call Scheduling video's beats, each a self-contained 1920x1080 scene on the
// recreated console kit. Frame numbers are relative to the beat's own Sequence.
// ============================================================================
export const NAME = "Call Scheduling Agent";
export const PROMPT = "Elise is a receptionist for Redbud Studio. Answer every call warmly, find out what the caller needs, and take a message with their name and callback number for Sarah. Warm and quick. Like a good front desk person, not a phone tree. Short sentences. One question at a time, then stop talking.";
const steps = (f: number, from: number, every: number, n: number) => Math.max(0, Math.min(n, Math.floor((f - from) / every) + 1));

// 01 — type the prompt, send it, Vibe Agent starts thinking
export const PromptBeat: React.FC = () => {
  const f = useCurrentFrame(); const sent = f >= 172;
  return <AbsoluteFill><BuilderPage name={NAME} status="Unsaved" zoom="92%" flow={<LiveFlow g={f} />} panel={sent ? <VibePanel items={[{ at: 172, kind: "user", text: PROMPT }, { at: 186, kind: "thinking" }]} status="generating" /> : <VibeEmpty typing={PROMPT} typedFrom={8} typedUntil={150} />} /></AbsoluteFill>;
};
// 02 — Vibe Agent maps the flow, checks what it needs, presents the plan
export const PlanBeat: React.FC = () => {
  const f = useCurrentFrame();
  const items: VibeItem[] = [
    { at: 0, kind: "user", text: PROMPT },
    { at: 12, kind: "text", text: "I'm mapping the receptionist flow and checking the available scheduling and handoff components before I present the build plan." },
    { at: 30, kind: "checks", items: ["Finding flow components", "Checking current flow", "Checking available actions", "Checking voice node settings", "Checking calendar availability", "Checking calendar booking"], done: steps(f, 44, 14, 6) },
    { at: 150, kind: "heading", text: "Voice setup" },
    { at: 150, kind: "bullets", items: ["Agent name: Elise", "Persona: warm, quick, concise front-desk receptionist", "Language: English", "Suggested voice: Elise, a warm and approachable voice suited to customer support"] },
    { at: 205, kind: "text", text: "Please connect the Cal account and either provide Sarah's transfer number or confirm that transfers should be replaced with urgent message-taking. Then I'll proceed with the build." },
  ];
  return <AbsoluteFill><BuilderPage name={NAME} status="Unsaved" zoom={f >= 200 ? "84%" : "92%"} flow={<LiveFlow g={253 + f} />} panel={<VibePanel items={items} status={f < 225 ? "generating" : "idle"} />} /></AbsoluteFill>; // the flow is drafted on the canvas while the plan is written (LiveFlow global clock)
};
// 03 — refine and approve
export const ApproveBeat: React.FC = () => {
  const f = useCurrentFrame();
  const items: VibeItem[] = [
    { at: 0, kind: "bullets", items: ["Language: English", "Suggested voice: Elise, a warm and approachable voice suited to customer support"] },
    { at: 0, kind: "text", text: "Please connect the Cal account and either provide Sarah's transfer number or confirm that transfers should be replaced with urgent message-taking. Then I'll proceed with the build." },
    { at: 18, kind: "user", text: "I'll connect the Cal account later. It should take the message and have Sarah call back." },
    { at: 58, kind: "thinking" },
    { at: 108, kind: "text", text: "Got it. Elise will take a message with the caller's name and number, and Sarah will call back. No calendar actions for now. Building the flow." },
    { at: 128, kind: "checks", items: ["Creating the voice node", "Wiring the message and call-closed outcomes"], done: steps(f, 140, 22, 2) },
  ];
  return <AbsoluteFill><BuilderPage name={NAME} status="Unsaved" zoom="84%" flow={<LiveFlow g={600 + f} />} panel={<VibePanel items={items} status="generating" />} /></AbsoluteFill>;
};
// 04 — the flow builds node by node
export const BuildBeat: React.FC = () => {
  const f = useCurrentFrame();
  const items: VibeItem[] = [
    { at: 0, kind: "text", text: "I'll use flow-only capture: Elise will collect and summarize the callback request in the call record. Creating the conversation structure now." },
    { at: 10, kind: "checks", items: ["Checking voice node schemas", "Finding an English voice", "Refreshing flow settings"], done: steps(f, 14, 16, 3) },
    { at: 70, kind: "text", text: "Flow structure is in place. Configuring the details now and connecting the message and call-closed outcomes." },
    { at: 86, kind: "checks", items: ["Verifying receptionist exits", "Verifying message closure", "Verifying closed-call closure", "Connecting receptionist outcomes"], done: steps(f, 96, 18, 4) },
  ];
  return <AbsoluteFill><BuilderPage name={NAME} status="Unsaved" tabs={FULL_TABS} zoom="84%" flow={<LiveFlow g={791 + f} />} panel={<VibePanel items={items} status="generating" />} /></AbsoluteFill>;
};
// 05 — simulations run against the goals
export const SimulateBeat: React.FC = () => {
  const f = useCurrentFrame();
  const items: VibeItem[] = [
    { at: 0, kind: "text", text: "Running the scenario set against the receptionist flow and its goals." },
    { at: 8, kind: "checks", items: ["Generating smoke scenarios", "Running receptionist smoke test", "Inspecting failed receptionist node", "Inspecting silence test failure", "Inspecting urgent call behavior", "Checking message closure"], done: steps(f, 14, 20, 6) },
  ];
  return <AbsoluteFill><SimulationsPage name={NAME} revealFrom={24} panel={<VibePanel items={items} status="generating" />} /></AbsoluteFill>;
};
// 05b — open one simulation
export const SimDetailBeat: React.FC = () => <AbsoluteFill><SimulationsPage name={NAME} drawer highlight="Deflect Pricing Question" linesFrom={6} /></AbsoluteFill>;
// 06 — voice configuration
export const VoiceTabBeat: React.FC = () => <AbsoluteFill><VoiceConfigPage name={NAME} voice="" speed={1.0} /></AbsoluteFill>;
export const VoicePickBeat: React.FC = () => { const f = useCurrentFrame(); return <AbsoluteFill><VoiceConfigPage name={NAME} voice="" speed={1.0} listOpen hover={f >= 14 ? "Elise" : ""} /></AbsoluteFill>; };
export const VoicePickedBeat: React.FC = () => { const f = useCurrentFrame(); const speed = interpolate(f, [12, 34], [1.0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return <AbsoluteFill><VoiceConfigPage name={NAME} voice="Elise" speed={Math.round(speed * 100) / 100} /></AbsoluteFill>; };
// 07 — publish
export const PublishBeat: React.FC<{ clickAt: number }> = ({ clickAt }) => {
  const f = useCurrentFrame();
  const items: VibeItem[] = [
    { at: 0, kind: "text", text: "Running a quality check before saving. This may take a moment." },
    { at: 0, kind: "checks", items: ["Reviewing receptionist flow", "Fixing receptionist instruction issues", "Saving final receptionist flow", "Loading skill: test-flow", "Checking flow goals"], done: 5 },
  ];
  return <AbsoluteFill><BuilderPage name={NAME} status={f >= clickAt + 18 ? "Active" : "Draft"} tabs={FULL_TABS} built zoom="73%" panel={<VibePanel items={items} status="idle" />}><PublishFx at={clickAt} /></BuilderPage></AbsoluteFill>;
};
// 08 — attach the agent to the number
export const ConnectModalBeat: React.FC<{ pickAt: number }> = ({ pickAt }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill><NewConsoleShell activeNav="Phone Numbers" topBar="live"><PhoneNumbersScreen rows={[["+1 806 209 0453", "", "Texas, United States", "1 agent"]]} /></NewConsoleShell><div style={{ position: "absolute", inset: 0, background: "rgba(15,17,23,0.32)" }} /><ConfigureNumberModal dropdownOpen={f < pickAt} picked={f >= pickAt ? NAME : undefined} /></AbsoluteFill>;
};
// 09 — Buddy
export const BuddyBeat: React.FC<{ sentAt: number; answerAt: number }> = ({ sentAt, answerAt }) => (
  <AbsoluteFill><VoiceConfigPage name={NAME} voice="Elise" speed={0.85}><BuddyPanel typing="How can I connect a phone number to my agent?" typedFrom={10} typedUntil={sentAt - 20} sentAt={sentAt} answerAt={answerAt} /></VoiceConfigPage></AbsoluteFill>
);
