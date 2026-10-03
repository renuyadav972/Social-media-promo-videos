import React from "react";
import { AbsoluteFill } from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { SORA_FAMILY } from "./fonts";
import { XaiMark } from "./XaiAgent";

// YouTube thumbnail: the connection. xAI agent on the left, Plivo on the right, joined by a phone-number
// node on a SIP trunk line; calls flow from the number to the agent. Headline centred underneath.
const INK = "#0f1117"; const BLUE = "#323dfe"; const PURPLE = "#cd3ef9"; const MONO = "ui-monospace, Menlo, monospace";
const AX = 430; // the connector axis; both marks are centred on it (measured)
export const XaiThumb: React.FC = () => (
  <AbsoluteFill style={{ background: "#f9fafb", fontFamily: `${SORA_FAMILY}, sans-serif`, overflow: "hidden" }}>
    <AbsoluteFill style={{ background: "radial-gradient(55% 55% at 22% 45%, rgba(50,61,254,0.12) 0%, rgba(249,250,251,0) 70%), radial-gradient(45% 50% at 80% 40%, rgba(205,62,249,0.10) 0%, rgba(249,250,251,0) 70%)" }} />
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(15,17,23,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,17,23,0.05) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
    {/* one connecting line, the handset node on it; the whole group is centred on the page */}
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080} fill="none">
      <path d={`M 459 ${AX} H 639`} stroke={BLUE} strokeWidth="6" strokeLinecap="round" />
      <path d={`M 979 ${AX} H 1159`} stroke={BLUE} strokeWidth="6" strokeLinecap="round" />
    </svg>
    <div style={{ position: "absolute", left: 809 - 70, top: AX - 70, width: 140, height: 140, borderRadius: 70, background: INK, boxShadow: "0 24px 60px rgba(15,17,23,0.30)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
    </div>
    <div style={{ position: "absolute", left: 259, top: AX - 83, width: 150, display: "flex", alignItems: "center", justifyContent: "flex-start" }}><XaiMark width={150} color={INK} /></div>
    <div style={{ position: "absolute", left: 1202, top: AX - 84, width: 540, display: "flex", alignItems: "center", justifyContent: "flex-start" }}><PlivoLogoSvg width={460} color={INK} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", fontSize: 108, fontWeight: 600, color: INK, letterSpacing: -4, lineHeight: 1.06 }}>Your Grok voice agent<br /><span style={{ color: BLUE }}>on a real phone number.</span></div>
  </AbsoluteFill>
);
