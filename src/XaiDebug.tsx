import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { PlListBeat, PlNameBeat, PlPlatformBeat, PlUriFilledBeat, PlLinkBeat, PlDoneBeat, XaAgentBeat, XaDeploymentBeat, XaNumberModalBeat } from "./cards/XaiBeats";
import { VoiceAgentsPage, BuildModal } from "./cards/XaiKit";

// Measurement harness: renders one kit screen at a chosen local frame with a 100 px grid so crop
// rectangles can be read off in node coordinates. remotion still XaiDebug --props='{"i":N,"f":F}'
const PROMPT = "A support agent for a pottery studio. Take a message with the caller's name and callback number.";
const NODES: React.ReactNode[] = [
  <VoiceAgentsPage hover="Customer Support" />,
  <VoiceAgentsPage modal={<BuildModal chat={[]} typing={PROMPT} typedFrom={0} typedUntil={30} />} />,
  <VoiceAgentsPage modal={<BuildModal chat={[{ at: 0, who: "you", text: PROMPT }, { at: 0, who: "thinking" }, { at: 0, who: "bot", text: "Athena Pottery customer support agent that collects name and callback number. Writing it now." }]} card cardAt={0} />} />,
  <XaAgentBeat voice />,
  <PlListBeat clickAt={20} />,
  <PlNameBeat typeFrom={0} typeUntil={20} />,
  <PlPlatformBeat openAt={0} hoverAt={10} pickAt={9999} />,
  <PlUriFilledBeat filledAt={0} />,
  <PlLinkBeat openAt={0} pickAt={40} createAt={9999} />,
  <PlLinkBeat openAt={0} pickAt={10} createAt={9999} />,
  <PlDoneBeat />,
  <XaDeploymentBeat />,
  <XaNumberModalBeat tabAt={0} nameFrom={9999} nameUntil={9999} numFrom={0} numUntil={20} ipsFrom={30} />,
];
export const XaiDebug: React.FC<{ i: number; f: number }> = ({ i, f }) => (
  <AbsoluteFill style={{ background: "#fff" }}>
    <Sequence from={-f} layout="none">{NODES[i]}</Sequence>
    <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,0,0,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.35) 1px, transparent 1px)", backgroundSize: "100px 100px" }} />
    {Array.from({ length: 19 }, (_, k) => <span key={"x" + k} style={{ position: "absolute", left: k * 100 + 2, top: 2, fontSize: 14, color: "red", fontFamily: "monospace" }}>{k * 100}</span>)}
    {Array.from({ length: 11 }, (_, k) => <span key={"y" + k} style={{ position: "absolute", left: 2, top: k * 100 + 2, fontSize: 14, color: "red", fontFamily: "monospace" }}>{k * 100}</span>)}
  </AbsoluteFill>
);
