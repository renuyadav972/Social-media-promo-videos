import React from "react";
import { AbsoluteFill } from "remotion";
import { BuilderPage, VibeEmpty, VibePanel, SimulationsPage, FULL_TABS } from "./AgentBuilder";

const NAME = "Call Scheduling Agent";
export const PROMPT = "Elise is a receptionist for Redbud Studio. Answer every call warmly, find out what the caller needs, and take a message with their name and callback number for Sarah. Warm and quick. Like a good front desk person, not a phone tree. Short sentences. One question at a time, then stop talking.";
// 1 — the prompt is being typed into the empty Vibe Agent panel
export const CS_Builder: React.FC = () => (
  <AbsoluteFill><BuilderPage name={NAME} status="Unsaved" panel={<VibeEmpty typing={PROMPT} typedFrom={0} typedUntil={150} />} /></AbsoluteFill>
);
// 2 — Vibe Agent thinks, checks the pieces it needs, and presents the plan
export const CS_Plan: React.FC = () => (
  <AbsoluteFill><BuilderPage name={NAME} status="Unsaved" panel={<VibePanel items={[
    { at: 0, kind: "user", text: PROMPT },
    { at: 10, kind: "text", text: "I'm mapping the receptionist flow and checking the available scheduling and handoff components before I present the build plan." },
    { at: 24, kind: "checks", items: ["Finding flow components", "Checking current flow", "Checking available actions", "Checking voice node settings", "Checking calendar availability", "Checking calendar booking"], done: 3 },
  ]} status="generating" />} /></AbsoluteFill>
);
export const CS_PlanText: React.FC = () => (
  <AbsoluteFill><BuilderPage name={NAME} status="Unsaved" panel={<VibePanel items={[
    { at: 0, kind: "heading", text: "Voice setup" },
    { at: 0, kind: "bullets", items: ["Agent name: Elise", "Persona: warm, quick, concise front-desk receptionist", "Language: English", "Suggested voice: Elise, a warm and approachable voice suited to customer support"] },
    { at: 6, kind: "text", text: "Please connect the Cal account and either provide Sarah's transfer number or confirm that transfers should be replaced with urgent message-taking. Then I'll proceed with the build." },
    { at: 30, kind: "user", text: "I'll connect the Cal account later. It should take the message and have Sarah call back" },
    { at: 50, kind: "thinking" },
  ]} status="generating" />} /></AbsoluteFill>
);
// 3 — the built flow
export const CS_Flow: React.FC = () => (
  <AbsoluteFill><BuilderPage name={NAME} status="Unsaved" tabs={FULL_TABS} built zoom="92%" panel={<VibePanel items={[
    { at: 0, kind: "text", text: "Flow structure is in place. Configuring the details now and connecting the message and call-closed outcomes." },
    { at: 0, kind: "checks", items: ["Verifying receptionist exits", "Verifying message closure", "Verifying closed-call closure", "Connecting receptionist outcomes"], done: 4 },
  ]} status="generating" />} /></AbsoluteFill>
);
// 4 — simulations with the transcript drawer open
export const CS_Sims: React.FC = () => (
  <AbsoluteFill><SimulationsPage name={NAME} drawer highlight="Deflect Pricing Question" /></AbsoluteFill>
);
import { VoiceConfigPage, ConfigureNumberModal, BuddyPanel, PublishFx, BuilderPage as BP, VibePanel as VP } from "./AgentBuilder";
import { PhoneNumbersScreen } from "../OnboardingVoiceAgents";
export const CS_Voice: React.FC = () => <AbsoluteFill><VoiceConfigPage name={NAME} voice="" speed={1.0} listOpen hover="Elise" /></AbsoluteFill>;
export const CS_VoicePicked: React.FC = () => <AbsoluteFill><VoiceConfigPage name={NAME} voice="Elise" speed={0.85} /></AbsoluteFill>;
export const CS_Number: React.FC = () => <AbsoluteFill><PhoneNumbersScreen rows={[["+1 806 209 0453", "", "Texas, United States", "1 agent"]]} /><div style={{ position: "absolute", inset: 0, background: "rgba(15,17,23,0.32)" }} /><ConfigureNumberModal dropdownOpen /></AbsoluteFill>;
export const CS_Buddy: React.FC = () => <AbsoluteFill><VoiceConfigPage name={NAME} voice="Elise" speed={0.85}><BuddyPanel typing="How can I connect a phone number to my agent?" typedFrom={0} typedUntil={60} sentAt={70} answerAt={100} /></VoiceConfigPage></AbsoluteFill>;
export const CS_Publish: React.FC = () => <AbsoluteFill><BP name={NAME} status="Draft" tabs={FULL_TABS} built zoom="73%" panel={<VP items={[{ at: 0, kind: "text", text: "Running a quality check before saving. This may take a moment." }, { at: 0, kind: "checks", items: ["Reviewing receptionist flow", "Fixing receptionist instruction issues", "Saving final receptionist flow", "Loading skill: test-flow", "Checking flow goals"], done: 5 }]} status="idle" />} /><PublishFx at={20} /></AbsoluteFill>;
