import React from "react";
import { AbsoluteFill } from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { SORA_FAMILY, INTER_FAMILY } from "./fonts";

// YouTube thumbnail for the LiveKit video. LiveKit wordmark: the official SVG from livekit.io (viewBox 0 0 210 49).
export const LiveKitWordmark: React.FC<{ width: number; color?: string }> = ({ width, color = "#fff" }) => (
  <svg width={width} height={width * 49 / 210} viewBox="0 0 210 49" xmlns="http://www.w3.org/2000/svg" fill={color}><path d="M8.42129 0.5H0.365692V47.7521H29.5892V40.8509H8.42129V0.5Z" /><path d="M42.8865 22.0111H35.0809V47.7498H42.8865V22.0111Z" /><path d="M65.8647 46.8174L55.9365 14.2383H48.1309L58.5593 47.7506H73.1702L83.5986 14.2383H75.73L65.8647 46.8174Z" /><path d="M102.963 13.4957C92.8455 13.4957 86.4143 20.7087 86.4143 30.9665C86.4143 41.1635 92.6584 48.5 102.963 48.5C110.829 48.5 116.512 45.0181 118.635 37.8678H110.698C109.512 41.1008 107.325 43.0318 103.016 43.0318C98.2708 43.0318 94.9626 39.7361 94.3384 33.2719H119.191C119.309 32.4478 119.371 31.6165 119.376 30.784C119.378 20.3343 112.884 13.4957 102.963 13.4957ZM94.3995 27.8571C95.2127 21.8282 98.3968 18.9677 102.963 18.9677C107.769 18.9677 111.016 22.5105 111.392 27.8571H94.3995Z" /><path d="M165.02 0.5H154.904L135.298 22.137V0.5H127.242V47.7521H135.298V23.878L156.903 47.7521H167.205L144.602 22.8821L165.02 0.5Z" /><path d="M178.504 14.2383H170.698V39.977H178.504V14.2383Z" /><path d="M35.0818 14.2383H27.2763V22.0101H35.0818V14.2383Z" /><path d="M186.311 39.9799H178.506V47.7516H186.311V39.9799Z" /><path d="M209.634 39.9799H201.829V47.7516H209.634V39.9799Z" /><path d="M209.633 22.0116V14.2398H201.828V0.5H194.022V14.2398H186.217V22.0116H194.022V39.9804H201.828V22.0116H209.633Z" /></svg>
);
const BLUE = "#323dfe"; const CYAN = "#1fd5f9"; const BG = "#0b0d10";
export const LkThumb: React.FC = () => (
  <AbsoluteFill style={{ background: BG, fontFamily: `${SORA_FAMILY}, sans-serif`, overflow: "hidden" }}>
    <AbsoluteFill style={{ background: "radial-gradient(70% 60% at 30% 40%, rgba(50,61,254,0.35) 0%, rgba(11,13,16,0) 70%), radial-gradient(50% 50% at 85% 80%, rgba(31,213,249,0.25) 0%, rgba(11,13,16,0) 70%)" }} />
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
    {/* the two brands stacked on the left, joined by the phone line */}
    <div style={{ position: "absolute", left: 110, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 34 }}>
      <LiveKitWordmark width={560} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginLeft: 50 }}><span style={{ width: 4, height: 54, background: CYAN, borderRadius: 2 }} /><span style={{ width: 54, height: 54, borderRadius: 27, background: "#fff", color: BG, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>☎</span><span style={{ width: 4, height: 54, background: BLUE, borderRadius: 2 }} /></div>
      <PlivoLogoSvg width={420} color="#fff" />
    </div>
    <div style={{ position: "absolute", left: 790, top: 0, bottom: 0, width: 1100, display: "flex", flexDirection: "column", justifyContent: "center", fontSize: 140, fontWeight: 700, color: "#fff", letterSpacing: -6, lineHeight: 0.98 }}>Give your<br />agent a<br /><span style={{ color: CYAN }}>phone number.</span></div>
  </AbsoluteFill>
);

export const LkThumbLight: React.FC = () => (
  <AbsoluteFill style={{ background: "#f9fafb", fontFamily: `${SORA_FAMILY}, sans-serif`, overflow: "hidden" }}>
    <AbsoluteFill style={{ background: "radial-gradient(70% 60% at 30% 40%, rgba(50,61,254,0.12) 0%, rgba(249,250,251,0) 70%), radial-gradient(50% 50% at 85% 80%, rgba(205,62,249,0.10) 0%, rgba(249,250,251,0) 70%)" }} />
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(15,17,23,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,17,23,0.05) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
    {/* the two brands stacked on the left, joined by the phone line */}
    <div style={{ position: "absolute", left: 110, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 34 }}>
      <LiveKitWordmark width={560} color="#0f1117" />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginLeft: 50 }}><span style={{ width: 4, height: 54, background: "#cd3ef9", borderRadius: 2 }} /><span style={{ width: 54, height: 54, borderRadius: 27, background: "#0f1117", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>☎</span><span style={{ width: 4, height: 54, background: BLUE, borderRadius: 2 }} /></div>
      <PlivoLogoSvg width={420} color="#0f1117" />
    </div>
    <div style={{ position: "absolute", left: 790, top: 0, bottom: 0, width: 1100, display: "flex", flexDirection: "column", justifyContent: "center", fontSize: 140, fontWeight: 700, color: "#0f1117", letterSpacing: -6, lineHeight: 0.98 }}>Give your<br />agent a<br /><span style={{ color: BLUE }}>phone number.</span></div>
  </AbsoluteFill>
);

// Variant C: both logos in the centre joined by a phone-call illustration, headline at the bottom, brand palette.
export const LkThumbC: React.FC = () => {
  const INK = "#0f1117"; const PURPLE = "#cd3ef9";
  return (
    <AbsoluteFill style={{ background: "#f9fafb", fontFamily: `${SORA_FAMILY}, sans-serif`, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(55% 55% at 22% 45%, rgba(50,61,254,0.14) 0%, rgba(249,250,251,0) 70%), radial-gradient(45% 50% at 80% 40%, rgba(205,62,249,0.12) 0%, rgba(249,250,251,0) 70%)" }} />
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(15,17,23,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,17,23,0.05) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      {/* the call route: LiveKit ⟵ phone ⟶ Plivo */}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080} fill="none">
        <path d="M 690 430 H 870" stroke={BLUE} strokeWidth="7" strokeDasharray="20 16" strokeLinecap="round" />
        <path d="M 1050 430 H 1230" stroke={PURPLE} strokeWidth="7" strokeDasharray="20 16" strokeLinecap="round" />
        <circle cx={690} cy={430} r={10} fill={BLUE} /><circle cx={1230} cy={430} r={10} fill={PURPLE} />
        {[0, 1, 2].map((i) => <circle key={i} cx={960} cy={430} r={110 + i * 60} stroke={BLUE} strokeWidth="3" opacity={0.28 - i * 0.08} />)}
      </svg>
      <div style={{ position: "absolute", left: 960 - 90, top: 430 - 90, width: 180, height: 180, borderRadius: 90, background: INK, boxShadow: "0 30px 70px rgba(15,17,23,0.35), 0 0 0 14px rgba(50,61,254,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="92" height="92" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
      </div>
      <div style={{ position: "absolute", left: 110, top: 430 - 66, width: 560, display: "flex", alignItems: "center", justifyContent: "flex-start" }}><LiveKitWordmark width={560} color={INK} /></div>
      <div style={{ position: "absolute", left: 1270, top: 430 - 74, width: 540, display: "flex", alignItems: "center", justifyContent: "flex-end" }}><PlivoLogoSvg width={480} color={INK} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 730, textAlign: "center", fontSize: 118, fontWeight: 700, color: INK, letterSpacing: -5, lineHeight: 1 }}>Give your agent<br /><span style={{ color: BLUE }}>a phone number.</span></div>
    </AbsoluteFill>
  );
};
