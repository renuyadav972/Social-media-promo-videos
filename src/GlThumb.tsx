import React from "react";
import { AbsoluteFill } from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { SORA_FAMILY } from "./fonts";

// YouTube thumbnail for the OpenAI GPT-Live film: the connection. OpenAI on the left, Plivo on the right, joined by
// a line with the handset node on it. Same family as the xAI thumbnail; positions measured from rendered glyphs.
const INK = "#0f1117"; const BLUE = "#323dfe";
const AX = 430;
export const GL_THUMB = { oaiLeft: 187, oaiTop: 378, lineA: [646, 846], node: 966, lineB: [1086, 1286], plivoLeft: 1329, plivoTop: 358 };
export const GlThumb: React.FC<{ g?: typeof GL_THUMB }> = ({ g = GL_THUMB }) => (
  <AbsoluteFill style={{ background: "#f9fafb", fontFamily: `${SORA_FAMILY}, sans-serif`, overflow: "hidden" }}>
    <AbsoluteFill style={{ background: "radial-gradient(55% 55% at 22% 45%, rgba(50,61,254,0.12) 0%, rgba(249,250,251,0) 70%), radial-gradient(45% 50% at 80% 40%, rgba(50,61,254,0.08) 0%, rgba(249,250,251,0) 70%)" }} />
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(15,17,23,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,17,23,0.05) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080} fill="none">
      <path d={`M ${g.lineA[0]} ${AX} H ${g.lineA[1]}`} stroke={BLUE} strokeWidth="6" strokeLinecap="round" />
      <path d={`M ${g.lineB[0]} ${AX} H ${g.lineB[1]}`} stroke={BLUE} strokeWidth="6" strokeLinecap="round" />
    </svg>
    <div style={{ position: "absolute", left: g.node - 70, top: AX - 70, width: 140, height: 140, borderRadius: 70, background: INK, boxShadow: "0 24px 60px rgba(15,17,23,0.30)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
    </div>
    <div style={{ position: "absolute", left: g.oaiLeft, top: g.oaiTop, fontSize: 112, fontWeight: 600, color: INK, letterSpacing: -4.2, lineHeight: 1, whiteSpace: "nowrap" }}>OpenAI</div>
    <div style={{ position: "absolute", left: g.plivoLeft, top: g.plivoTop, width: 540 }}><PlivoLogoSvg width={400} color={INK} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", fontSize: 108, fontWeight: 600, color: INK, letterSpacing: -4, lineHeight: 1.06 }}>Your GPT-Live voice agent<br /><span style={{ color: BLUE }}>on a real phone number.</span></div>
  </AbsoluteFill>
);
