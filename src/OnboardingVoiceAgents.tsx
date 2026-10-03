import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "./fonts";
import { MUSIC } from "./promoConfig";
import type { Motion } from "./StageClip";
import { TightStageClip } from "./TightStageClip";
import { TightCaptions, type Caption } from "./TightCaption";
import { NewConsoleShell, PageHeader, DarkButton, TabRow, PURPLE } from "./cards/NewConsoleShell";
import { Ico, USFlag } from "./cards/consoleIcons";
import { ClickCursor } from "./cards/ClickCursor";
import { PlivoLogoSvg } from "./PlivoLogoSvg";

// ============================================================================
// OnboardingVoiceAgents — post-signup "what next" onboarding for Voice Agents.
// Composited from REAL console screen recordings (name-masked, record-bubble
// patched), framed on the cream desk, matched to the Console Comparison style:
// brand-intro bump, thorough screen-by-screen walkthrough, purple-keyword
// captions, warm female VO (Sarah), CTA close. No personal names anywhere.
// ============================================================================

const INK = "#1f2430";
const SUB = "#6b7280";
const HAIR = "#ececef";
const FONT = `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif`;
const BODY = `${INTER_FAMILY}, ${SORA_FAMILY}, sans-serif`;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---- Beat layout (sized to Sarah VO clips + real footage lengths) ---------
const LEAD = 10;
const DUR = {
  intro: 165, //  3.7s VO — Agents (start here)
  create: 460, // 14.1s VO — Create Agent -> Vibe agent builds the flow
  number: 390, // 11.5s VO — Phone Numbers -> Buy Number -> AI Agents
  buddy: 350, // 10.5s VO — Ask Buddy -> answer
  close: 165, //  4.0s VO — CTA card
} as const;
const ORDER = ["intro", "create", "number", "buddy", "close"] as const;
const BEAT = (() => {
  const out = {} as Record<(typeof ORDER)[number], { from: number; dur: number }>;
  let acc = 0;
  for (const k of ORDER) {
    out[k] = { from: acc, dur: DUR[k] };
    acc += DUR[k];
  }
  return out;
})();
export const ONBOARDING_VA_FRAMES = Object.values(DUR).reduce((a, b) => a + b, 0);

const M_STATIC: Motion = { keyframes: [{ at: 0, x: 0.5, y: 0.5, scale: 1.0 }] };

// ---- VO (warm female, Sarah) + music -------------------------------------
const VO: { beat: keyof typeof DUR; src: string }[] = [
  { beat: "intro", src: "vo/onboarding-voice-agents/01-intro.mp3" },
  { beat: "create", src: "vo/onboarding-voice-agents/02-create.mp3" },
  { beat: "number", src: "vo/onboarding-voice-agents/03-number.mp3" },
  { beat: "buddy", src: "vo/onboarding-voice-agents/04-buddy.mp3" },
  { beat: "close", src: "vo/onboarding-voice-agents/05-close.mp3" },
];
const musicVol = (frame: number) => {
  const fade = MUSIC.fadeFrames;
  if (frame < fade) return (frame / fade) * MUSIC.bedVolume;
  const out = ONBOARDING_VA_FRAMES - fade;
  if (frame > out) return ((ONBOARDING_VA_FRAMES - frame) / fade) * MUSIC.bedVolume;
  return MUSIC.bedVolume;
};

// ---- helpers -------------------------------------------------------------
export const FadeIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [4, 20], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ height: "100%", opacity: op }}>{children}</div>;
};

// Crossfade between full-screen sub-screens at given beat-local frame offsets.
export const SubScreens: React.FC<{ screens: { at: number; node: React.ReactNode }[] }> = ({ screens }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "relative", height: "100%" }}>
      {screens.map((s, i) => {
        const start = s.at;
        const end = i + 1 < screens.length ? screens[i + 1].at : 1e9;
        const inOp = i === 0 ? 1 : interpolate(f, [start - 10, start], [0, 1], clamp);
        const outOp = i === screens.length - 1 ? 1 : interpolate(f, [end - 10, end], [1, 0], clamp);
        const op = Math.min(inOp, outOp);
        if (op <= 0.001) return null;
        return <div key={i} style={{ position: "absolute", inset: 0, opacity: op }}>{s.node}</div>;
      })}
    </div>
  );
};

// A click indicator centered on its position:relative parent — always aligned.
export const ClickPulse: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  if (frame < at - 16) return null;
  const press = interpolate(frame, [at - 3, at, at + 7], [1, 0.82, 1], clamp);
  const ripple = interpolate(frame, [at, at + 26], [0.3, 1.5], clamp);
  const rop = interpolate(frame, [at, at + 26], [0.55, 0], clamp);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 40 }}>
      {/* anchor sits at the parent's center; the pointer TIP and ripple center land here */}
      <div style={{ position: "absolute", left: "50%", top: "50%" }}>
        {frame >= at ? <div style={{ position: "absolute", left: -21, top: -21, width: 42, height: 42, borderRadius: "50%", border: `2.5px solid ${PURPLE}`, transform: `scale(${ripple})`, opacity: rop }} /> : null}
        <div style={{ position: "absolute", left: -3, top: -3, transform: `scale(${press})`, transformOrigin: "top left", filter: "drop-shadow(0 5px 8px rgba(76,29,149,0.35))" }}>
          <svg width="30" height="38" viewBox="0 0 24 30" fill="none"><path d="M2 2 L2 21 L7.5 15.8 L11 24 L14.2 22.4 L10.6 14.6 L18 14.6 Z" fill="#7c3aed" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </div>
  );
};

const Beat: React.FC<{ k: keyof typeof DUR; stage?: boolean; children: React.ReactNode }> = ({ k, stage = true, children }) => (
  <Sequence from={BEAT[k].from} durationInFrames={BEAT[k].dur} layout="none">
    {stage ? <TightStageClip motion={M_STATIC}>{children}</TightStageClip> : children}
  </Sequence>
);

// ---- Close / CTA card ----------------------------------------------------
export const OutroCard: React.FC<{ sub?: string }> = ({ sub = "Give your agent a call to hear it live." }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 110 }, durationInFrames: 24 });
  const exit = interpolate(frame, [durationInFrames - 12, durationInFrames], [0, 1], clamp);
  const opacity = enter * (1 - exit);
  const scale = 0.92 + enter * 0.08;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 95% at 50% 0%, #fbfaf8 0%, #f6f5f3 55%, #efeeea 100%)", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ opacity, transform: `scale(${scale})`, textAlign: "center" }}>
        <div style={{ fontSize: 56, fontWeight: 700, color: INK, letterSpacing: -1.4, lineHeight: 1.08 }}>
          You're <span style={{ color: PURPLE }}>all set</span>.
        </div>
        <div style={{ fontSize: 22, color: SUB, marginTop: 20, fontFamily: BODY }}>
          {sub}
        </div>
        <div style={{ marginTop: 34 }}>
          <PlivoLogoSvg width={120} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- Captions (one purple keyword each; no em-dashes) --------------------
const cap = (beat: keyof typeof DUR, start: number, end: number, pre: string, keyword: string, post = ""): Caption => ({ start: BEAT[beat].from + start, end: BEAT[beat].from + end, pre, keyword, post });
const CAPTIONS: Caption[] = [
  cap("intro", 14, 158, "Here are the ", "first steps", "."),
  // Create
  cap("create", 14, 94, "In Agents, click ", "Create Agent", "."),
  cap("create", 104, 184, "Choose a ", "Conversational Agent", "."),
  cap("create", 194, 278, "Describe it to ", "Vibe", ", in plain English."),
  cap("create", 288, 452, "The ", "Vibe agent", " builds the flow, then Publish."),
  // Number
  cap("number", 14, 114, "Open ", "Phone Numbers", "."),
  cap("number", 124, 244, "Buy a number in ", "your region", "."),
  cap("number", 254, 384, "Set the type to ", "AI Agents", ", then Finish."),
  // Ask Buddy
  cap("buddy", 14, 148, "Stuck? Open ", "Ask Buddy", "."),
  cap("buddy", 158, 304, "It answers with ", "steps and docs", "."),
  // Close
  cap("close", 12, 160, "Give your agent a call. ", "You're live", "."),
];

// ==========================================================================
// Exact recreation of the real Vibe Agent flow editor (reference: Loom frames)
// ==========================================================================
const EB = "#e6e7ea";
const GREEN = "#16a34a";
const RED = "#ef4444";
const CANVAS = "#ffffff";

const Pill: React.FC<{ children: React.ReactNode; accent?: boolean; dark?: boolean; outline?: boolean }> = ({ children, accent, dark, outline }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 30, padding: "0 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", border: dark ? "none" : `1px solid ${accent ? PURPLE : EB}`, background: dark ? "#1f2430" : accent ? "#fdf3ff" : "#fff", color: dark ? "#fff" : accent ? PURPLE : INK }}>{children}</div>
);
const RailIco: React.FC<{ name: React.ComponentProps<typeof Ico>["name"]; on?: boolean }> = ({ name, on }) => (
  <div style={{ width: 40, height: 40, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: on ? INK : "#9aa0ac", background: on ? "#f1f1f6" : "transparent" }}><Ico name={name} size={18} /></div>
);

const FNode: React.FC<{ x: number; y: number; w?: number; tone: "trigger" | "agent" | "end"; title: string; sub: string; tag?: string; badge?: string; sel?: boolean }> = ({ x, y, w = 176, tone, title, sub, tag, badge, sel }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, background: "#fff", border: `1.4px solid ${sel ? PURPLE : EB}`, borderRadius: 11, padding: "9px 11px", boxShadow: sel ? "0 0 0 3px rgba(205,62,249,0.12)" : "0 1px 2px rgba(16,24,40,0.07)" }}>
    {badge ? <div style={{ display: "inline-block", fontSize: 8.5, fontWeight: 700, letterSpacing: 0.6, color: PURPLE, background: "#fdf4ff", borderRadius: 4, padding: "2px 6px", marginBottom: 6 }}>{badge}</div> : null}
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <span style={{ width: 16, height: 16, borderRadius: 5, background: tone === "end" ? "#fef2f2" : "#eafaf0", color: tone === "end" ? RED : GREEN, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>{tone === "end" ? "✕" : "☏"}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: INK, letterSpacing: -0.2 }}>{title}</span>
      <span style={{ flex: 1 }} />
      <span style={{ color: "#c2c6cf", fontSize: 11 }}>⋮</span>
    </div>
    <div style={{ fontSize: 9.5, color: SUB, marginTop: 4, lineHeight: 1.3 }}>{sub}</div>
    {tag ? <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: 0.5, color: "#9aa0ac", marginTop: 5 }}>{tag}</div> : null}
  </div>
);

const BranchLabel: React.FC<{ x: number; y: number; label: string }> = ({ x, y, label }) => (
  <div style={{ position: "absolute", left: x, top: y, fontSize: 10, color: SUB, background: "#fff", border: `1px solid ${EB}`, borderRadius: 6, padding: "2px 8px", display: "inline-flex", alignItems: "center", gap: 4 }}>{label} <span style={{ color: "#c2c6cf" }}>✎</span></div>
);

const TrackItem: React.FC<{ done?: boolean; children: React.ReactNode }> = ({ done, children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14.5, marginTop: 12 }}>
    {done ? <span style={{ color: GREEN, display: "inline-flex" }}><svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="8" opacity="0.3" /><path d="M6.5 10.2 9 12.7 13.7 7.5" /></svg></span>
      : <span style={{ color: INK, display: "inline-flex" }}><svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h9M9 6l4 4-4 4" /></svg></span>}
    <span style={{ color: done ? "#9aa0ac" : INK, textDecoration: done ? "line-through" : "none", fontWeight: done ? 500 : 600 }}>{children}</span>
  </div>
);

const VibeFlowEditor: React.FC = () => (
  <div style={{ width: "100%", height: "100%", background: "#fff", display: "flex", fontFamily: BODY, color: INK }}>
    {/* collapsed icon rail */}
    <div style={{ width: 76, flexShrink: 0, borderRight: `1px solid ${HAIR}`, display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 0", gap: 3 }}>
      <div style={{ marginBottom: 10 }}><PlivoLogoSvg width={26} /></div>
      <div style={{ marginBottom: 10 }}><USFlag w={26} /></div>
      <RailIco name="menu" /><RailIco name="code" /><RailIco name="sip" /><RailIco name="hash" /><RailIco name="phone" /><RailIco name="chevron" /><RailIco name="whatsapp" /><RailIco name="list" /><RailIco name="bell" />
    </div>
    {/* main column */}
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      {/* top bar */}
      <div style={{ height: 52, flexShrink: 0, borderBottom: `1px solid ${HAIR}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 12 }}>
        <span style={{ color: "#9aa0ac" }}><Ico name="menu" size={17} /></span>
        <span style={{ fontSize: 13, color: SUB }}>Data Region: <b style={{ color: INK }}>US</b></span>
        <span style={{ fontSize: 12, background: "#f1f2f4", borderRadius: 7, padding: "5px 10px", fontWeight: 500 }}>Professional Plan</span>
        <span style={{ flex: 1 }} />
        <Pill><span style={{ width: 7, height: 7, borderRadius: "50%", background: GREEN }} />Available <span style={{ color: "#b8bcc6", fontSize: 9 }}>▾</span></Pill>
        <Pill><Ico name="headset" size={13} />Human Specialist <span style={{ color: "#b8bcc6", fontSize: 9 }}>▾</span></Pill>
        <Pill><span style={{ color: PURPLE, display: "inline-flex" }}><Ico name="sparkle" size={13} /></span>Ask Buddy</Pill>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#b9a06a,#8c7b4e)" }} />
      </div>
      {/* editor header */}
      <div style={{ height: 60, flexShrink: 0, display: "flex", alignItems: "center", padding: "0 22px", gap: 14 }}>
        <span style={{ color: "#9aa0ac", display: "inline-flex" }}><Ico name="chevron" size={17} /></span>
        <span style={{ fontSize: 21, fontWeight: 700, color: INK, letterSpacing: -0.4, fontFamily: FONT }}>Agent Flow 2730</span>
        <span style={{ fontSize: 12.5, color: SUB, background: "#f1f2f4", borderRadius: 7, padding: "4px 10px" }}>Unsaved</span>
        <span style={{ flex: 1 }} />
        <Pill accent><span style={{ display: "inline-flex" }}><Ico name="sparkle" size={13} /></span>Vibe Agent</Pill>
        <Pill>⋮</Pill>
        <Pill><Ico name="chevron" size={12} /> Test agent</Pill>
        <Pill>Save as draft</Pill>
        <Pill dark>Publish</Pill>
      </div>
      {/* tabs */}
      <div style={{ display: "flex", gap: 26, padding: "0 22px", borderBottom: `1px solid ${HAIR}`, flexShrink: 0 }}>
        {["Flow", "Conversation Goal", "Agent Runs", "Simulations", "Event Callbacks", "Settings", "Knowledge Base", "Secrets", "Tools", "Voice Configuration"].map((t, i) => (
          <div key={t} style={{ fontSize: 14.5, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? INK : SUB, padding: "12px 0", borderBottom: i === 0 ? `2px solid ${INK}` : "2px solid transparent" }}>{t}</div>
        ))}
      </div>
      {/* body: canvas + panel */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* canvas */}
        <div style={{ flex: 1, position: "relative", background: CANVAS, backgroundImage: "radial-gradient(rgba(15,17,23,0.08) 1px, transparent 1px)", backgroundSize: "20px 20px", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: "50%", top: 34, transform: "translateX(-50%)", width: 1000, height: 470 }}>
            {/* edges */}
            <svg width="1000" height="470" style={{ position: "absolute", inset: 0 }}>
              <path d="M500 84 L500 175" stroke="#cbd5e1" strokeWidth="1.4" fill="none" />
              {[112, 372, 632, 892].map((cx) => (
                <path key={cx} d={`M500 244 L500 300 L${cx} 300 L${cx} 360`} stroke="#cbd5e1" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              ))}
            </svg>
            <FNode x={412} y={20} tone="trigger" badge="TRIGGER" title="Voice Call" sub="Triggers when an incoming call is received on your number" />
            <FNode x={412} y={175} tone="agent" sel title="Plivo Support" sub="Understands customer queries and extracts key details" tag="PLIVO SUPPORT" />
            <BranchLabel x={150} y={288} label="Safe Closure" />
            <BranchLabel x={320} y={288} label="Emergency" />
            <BranchLabel x={565} y={288} label="Escalate" />
            <BranchLabel x={815} y={288} label="Resolved" />
            <FNode x={34} y={360} w={156} tone="end" title="End Safe Closure" sub="Ends the current conversation" tag="END SAFE CLOSURE" />
            <FNode x={294} y={360} w={156} tone="end" title="End Emergency" sub="Ends the current conversation" tag="END EMERGENCY" />
            <FNode x={554} y={360} w={156} tone="end" title="End Escalated" sub="Ends the current conversation" tag="END ESCALATED" />
            <FNode x={814} y={360} w={156} tone="end" title="End Resolved" sub="Ends the current conversation" tag="END RESOLVED" />
          </div>
          {/* zoom controls */}
          <div style={{ position: "absolute", left: 20, bottom: 16, display: "flex", alignItems: "center", gap: 14, color: SUB, fontSize: 13 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, border: `1px solid ${EB}`, borderRadius: 8, padding: "6px 10px", background: "#fff" }}>− <b style={{ color: INK }}>49%</b> +</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, border: `1px solid ${EB}`, borderRadius: 8, padding: "6px 12px", background: "#fff" }}>↶ ↷ ▦</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${EB}`, borderRadius: 8, padding: "6px 12px", background: "#fff" }}>⌖ Global Prompt</div>
          </div>
        </div>
        {/* Vibe panel */}
        <div style={{ width: 430, flexShrink: 0, borderLeft: `1px solid ${HAIR}`, display: "flex", flexDirection: "column", background: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 14, padding: "12px 18px", color: "#9aa0ac", fontSize: 15 }}>⋯ ✕</div>
          <div style={{ flex: 1, overflow: "hidden", padding: "6px 20px" }}>
            <div style={{ fontSize: 14.5, color: SUB, display: "flex", alignItems: "center", gap: 8 }}>Adjusting unclear-audio handling <span style={{ color: GREEN }}>✓</span></div>
            <div style={{ fontSize: 14.5, color: INK, marginTop: 16, lineHeight: 1.5 }}>Made a few adjustments based on the review.</div>
            <div style={{ border: `1px solid ${HAIR}`, borderRadius: 12, padding: "16px 16px", marginTop: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ color: "#4b5160", display: "inline-flex" }}><Ico name="list" size={17} /></span>
                <span style={{ fontSize: 15, fontWeight: 700, color: INK }}>Progress tracker</span>
                <span style={{ fontSize: 13.5, color: SUB }}>4/5</span>
                <span style={{ flex: 1 }} />
                <span style={{ color: "#b8bcc6" }}>▴</span>
              </div>
              <div style={{ fontSize: 13.5, color: SUB, marginTop: 10 }}>Voice and speech settings are configured.</div>
              <TrackItem done>Create inbound voice structure</TrackItem>
              <TrackItem done>Configure Plivo Support conversation</TrackItem>
              <TrackItem done>Add safe closure and escalation outcomes</TrackItem>
              <TrackItem done>Set voice, identity, and speech guidance</TrackItem>
              <TrackItem>Review, save, and test the flow</TrackItem>
            </div>
            <div style={{ display: "flex", alignItems: "center", background: "#f9fafb", border: `1px solid ${HAIR}`, borderRadius: 10, padding: "12px 14px", marginTop: 16, fontSize: 13.5, color: SUB }}>Generating... <span style={{ marginLeft: "auto", color: "#c2c6cf" }}>↻</span></div>
          </div>
          <div style={{ padding: "12px 16px" }}>
            <div style={{ position: "relative", minHeight: 84, border: `1px solid ${EB}`, borderRadius: 12, padding: "13px 14px", fontSize: 13.5, color: "#9aa0ac" }}>
              Describe the agentic flow you want to build...
              <div style={{ position: "absolute", right: 12, bottom: 12, width: 30, height: 30, borderRadius: "50%", background: "#1f2430", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>■</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// New (empty) agent editor — reference: real "Agent Flow 10" first screen
const VibeEmptyEditor: React.FC = () => (
  <div style={{ width: "100%", height: "100%", background: "#fff", display: "flex", fontFamily: BODY, color: INK }}>
    <div style={{ width: 76, flexShrink: 0, borderRight: `1px solid ${HAIR}`, display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 0", gap: 3 }}>
      <div style={{ marginBottom: 10 }}><PlivoLogoSvg width={26} /></div>
      <div style={{ marginBottom: 10 }}><USFlag w={26} /></div>
      <RailIco name="menu" /><RailIco name="code" /><RailIco name="sip" /><RailIco name="hash" /><RailIco name="phone" /><RailIco name="chevron" /><RailIco name="whatsapp" /><RailIco name="list" /><RailIco name="bell" />
    </div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <div style={{ height: 52, flexShrink: 0, borderBottom: `1px solid ${HAIR}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 12 }}>
        <span style={{ color: "#9aa0ac" }}><Ico name="menu" size={17} /></span>
        <span style={{ fontSize: 13, color: SUB }}>Data Region: <b style={{ color: INK }}>US</b></span>
        <span style={{ fontSize: 12, background: "#f1f2f4", borderRadius: 7, padding: "5px 10px", fontWeight: 500 }}>Free Trial</span>
        <span style={{ flex: 1 }} />
        <Pill><span style={{ color: PURPLE, display: "inline-flex" }}><Ico name="sparkle" size={13} /></span>Ask Buddy</Pill>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#b9a06a,#8c7b4e)" }} />
      </div>
      <div style={{ height: 60, flexShrink: 0, display: "flex", alignItems: "center", padding: "0 22px", gap: 14 }}>
        <span style={{ color: "#9aa0ac", display: "inline-flex" }}><Ico name="chevron" size={17} /></span>
        <span style={{ fontSize: 21, fontWeight: 700, color: INK, letterSpacing: -0.4, fontFamily: FONT }}>Agent Flow 10</span>
        <span style={{ fontSize: 12.5, color: SUB, background: "#f1f2f4", borderRadius: 7, padding: "4px 10px" }}>Unsaved</span>
        <span style={{ flex: 1 }} />
        <Pill accent><span style={{ display: "inline-flex" }}><Ico name="sparkle" size={13} /></span>Vibe Agent</Pill>
        <Pill>⋮</Pill><Pill><Ico name="chevron" size={12} /> Test agent</Pill><Pill>Save as draft</Pill><Pill dark>Publish</Pill>
      </div>
      <div style={{ display: "flex", gap: 26, padding: "0 22px", borderBottom: `1px solid ${HAIR}`, flexShrink: 0 }}>
        {["Flow", "Conversation Goal", "Agent Runs", "Simulations", "Settings"].map((t, i) => (
          <div key={t} style={{ fontSize: 14.5, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? INK : SUB, padding: "12px 0", borderBottom: i === 0 ? `2px solid ${INK}` : "2px solid transparent" }}>{t}</div>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <div style={{ flex: 1, position: "relative", background: CANVAS, backgroundImage: "radial-gradient(rgba(15,17,23,0.08) 1px, transparent 1px)", backgroundSize: "20px 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "20px 34px", border: `1.5px dashed #c2c6cf`, borderRadius: 12, color: SUB, fontSize: 15, fontWeight: 500 }}><Ico name="plus" size={17} /> Select Trigger</div>
        </div>
        <div style={{ width: 430, flexShrink: 0, borderLeft: `1px solid ${HAIR}`, display: "flex", flexDirection: "column", background: "#fff", position: "relative" }}>
          <div style={{ position: "absolute", top: 12, right: 18, color: "#9aa0ac" }}>✕</div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 26px" }}>
            <div style={{ fontSize: 21, fontWeight: 700, color: INK, fontFamily: FONT }}>Start a conversation with <span style={{ color: PURPLE }}>Vibe Agent</span></div>
            <div style={{ fontSize: 15, color: SUB, marginTop: 12, lineHeight: 1.5 }}>Build a new flow agent from scratch, ask questions about your flow, or request changes.</div>
          </div>
          <div style={{ display: "flex", gap: 8, padding: "0 20px 10px", flexWrap: "wrap" }}>
            {["Lead qualification", "Appointment booking", "Customer support"].map((c) => (
              <span key={c} style={{ fontSize: 12.5, color: INK, border: `1px solid ${HAIR}`, borderRadius: 999, padding: "7px 12px" }}>{c}</span>
            ))}
          </div>
          <div style={{ padding: "0 16px 14px" }}>
            <div style={{ minHeight: 80, border: `1px solid ${EB}`, borderRadius: 12, padding: "13px 14px", fontSize: 13.5, color: "#9aa0ac", position: "relative" }}>Describe the agentic flow you want to build...
              <div style={{ position: "absolute", right: 12, bottom: 12, width: 30, height: 30, borderRadius: "50%", background: "#1f2430", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>↑</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ==========================================================================
// Home dashboard (reference: real Home frame)
// ==========================================================================
const InfoCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ flex: 1, background: "#fff", border: `1px solid ${HAIR}`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>{children}</div>
);
const Info: React.FC<{ label: string; value: string; link?: string; mono?: boolean }> = ({ label, value, link, mono }) => (
  <div style={{ flex: 1, minWidth: 0 }}>
    <div style={{ fontSize: 13, color: SUB, fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: 15, color: INK, fontWeight: 600, marginTop: 4, fontFamily: mono ? "ui-monospace, Menlo, monospace" : undefined, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</div>
    {link ? <div style={{ fontSize: 12.5, color: "#3b6cf0", fontWeight: 600, marginTop: 3 }}>{link}</div> : null}
  </div>
);
const StartCard: React.FC<{ icon: React.ComponentProps<typeof Ico>["name"]; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 13, background: "#fff", border: `1px solid ${HAIR}`, borderRadius: 12, padding: "14px 15px" }}>
    <div style={{ width: 38, height: 38, borderRadius: 10, background: "#f1f2f4", color: "#4b5160", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ico name={icon} size={18} /></div>
    <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{title}</div><div style={{ fontSize: 12, color: SUB, marginTop: 2 }}>{desc}</div></div>
    <span style={{ color: "#c2c6cf", transform: "rotate(-90deg)", display: "inline-flex" }}><Ico name="chevron" size={14} /></span>
  </div>
);
const StartCol: React.FC<{ heading: string; sub: string; cards: [React.ComponentProps<typeof Ico>["name"], string, string][] }> = ({ heading, sub, cards }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 11 }}>
    <div><div style={{ fontSize: 15, fontWeight: 700, color: INK, fontFamily: FONT }}>{heading}</div><div style={{ fontSize: 12.5, color: SUB, marginTop: 3 }}>{sub}</div></div>
    {cards.map((c) => <StartCard key={c[1]} icon={c[0]} title={c[1]} desc={c[2]} />)}
  </div>
);
export const HomeBody: React.FC = () => (
  <div style={{ height: "100%", overflow: "hidden" }}>
    <div style={{ padding: "26px 30px 0" }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: INK, letterSpacing: -0.6, fontFamily: FONT }}>Welcome</div>
      <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
        <InfoCard><Info label="Auth ID" value="MAZWYXMJVKZTKTZWJLOC" mono /><span style={{ color: "#c2c6cf" }}><Ico name="copy" size={15} /></span></InfoCard>
        <InfoCard><Info label="Remaining Credits" value="$6.83" link="Add Credits" /></InfoCard>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
        <InfoCard><Info label="Auth Token" value="••••••••••••••••••••••••••" mono /><span style={{ color: "#c2c6cf" }}><Ico name="eye" size={15} /></span></InfoCard>
        <InfoCard><Info label="Monthly Usage" value="$5.17 of $1,000" link="View Details" /></InfoCard>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: INK, marginTop: 30, marginBottom: 16, fontFamily: FONT }}>Let's get you started</div>
      <div style={{ display: "flex", gap: 20 }}>
        <StartCol heading="Build your first use case" sub="Seamlessly integrate your communication logic." cards={[["sip", "SIP Trunking", "Connect your SIP infrastructure"], ["code", "Applications", "Create and manage applications"]]} />
        <StartCol heading="Deploy" sub="Launch your services globally across channels." cards={[["phone", "Buy Phone Number", "Phone numbers for Voice and SMS"], ["whatsapp", "Buy WhatsApp Number", "WABA profiles, numbers and templates"]]} />
        <StartCol heading="Monitor Performance" sub="Track performance and gain realtime insights." cards={[["list", "Logs", "View calls and messaging logs"], ["bell", "Alerting", "Configure alerts and notifications"]]} />
      </div>
    </div>
  </div>
);

// ==========================================================================
// Agents list (create-agent entry point)
// ==========================================================================
const AGENT_ROWS: [string, "Active" | "Draft", string, string, string, string][] = [
  ["Agent Flow 9", "Draft", "Voice Call", "Alex Rivera", "", "Jul 15, 2026 2:40 PM"],
  ["Plivo Support", "Active", "Voice Call", "Alex Rivera", "2 knowledge bases", "Jul 13, 2026 4:35 PM"],
  ["Agent Flow 7", "Draft", "Voice Call", "Jordan Lee", "", "Jul 10, 2026 3:06 PM"],
  ["Simple Incoming WhatsApp", "Active", "WhatsApp Message", "Plivo Account", "", "Jul 9, 2026 10:54 AM"],
  ["Simple Inbound Call", "Active", "Voice Call", "Plivo Account", "", "Jul 9, 2026 10:54 AM"],
  ["Simple Inbound SMS", "Active", "SMS", "Plivo Account", "", "Jul 9, 2026 10:54 AM"],
  ["Simple Outgoing WhatsApp", "Active", "When a WhatsApp message is sent", "Plivo Account", "", "Jul 9, 2026 10:54 AM"],
  ["Simple Outbound SMS", "Active", "When a SMS is sent", "Plivo Account", "", "Jul 9, 2026 10:54 AM"],
];
const AgentsListBody: React.FC<{ cursorAt?: number }> = ({ cursorAt }) => (
  <div style={{ height: "100%", overflow: "hidden" }}>
    <PageHeader title="Agents" subtitle="Manage agents for your organization" action={
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ height: 38, display: "inline-flex", alignItems: "center", gap: 6, padding: "0 15px", borderRadius: 8, border: `1px solid ${HAIR}`, color: INK, fontSize: 14, fontWeight: 500 }}><Ico name="download" size={14} />Import Agent</div>
        <div style={{ position: "relative", display: "inline-block" }}>
          <DarkButton><span style={{ display: "inline-flex", marginRight: 6 }}><Ico name="plus" size={14} /></span>Create Agent</DarkButton>
          {cursorAt != null ? <ClickPulse at={cursorAt} /> : null}
        </div>
      </div>
    } />
    <div style={{ display: "flex", gap: 10, padding: "14px 26px 0" }}>
      <div style={{ height: 34, flex: 1, maxWidth: 340, display: "inline-flex", alignItems: "center", gap: 7, padding: "0 12px", borderRadius: 8, border: `1px solid ${HAIR}`, background: "#fff", fontSize: 12.5, color: "#9aa0ac" }}><Ico name="search" size={14} />Search by name...</div>
      <div style={{ height: 34, display: "inline-flex", alignItems: "center", gap: 6, padding: "0 12px", borderRadius: 8, border: `1px solid ${HAIR}`, fontSize: 12.5, color: SUB }}>Status <Ico name="chevron" size={12} /></div>
      <div style={{ height: 34, display: "inline-flex", alignItems: "center", gap: 6, padding: "0 12px", borderRadius: 8, border: `1px solid ${HAIR}`, fontSize: 12.5, color: SUB }}>Trigger <Ico name="chevron" size={12} /></div>
    </div>
    <div style={{ padding: "12px 26px 0" }}>
      <div style={{ border: `1px solid ${HAIR}`, borderRadius: 12, overflow: "hidden", background: "#fff" }}>
        <div style={{ display: "flex", padding: "11px 18px", fontSize: 11.5, color: "#9aa0ac", fontWeight: 600, borderBottom: `1px solid ${HAIR}` }}>
          <span style={{ flex: 1.5 }}>Name</span><span style={{ width: 80 }}>Status</span><span style={{ flex: 1.3 }}>Trigger</span><span style={{ width: 120 }}>Created By</span><span style={{ width: 130 }}>Knowledge Bases</span><span style={{ width: 150 }}>Updated At</span>
        </div>
        {AGENT_ROWS.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", padding: "11px 18px", fontSize: 12.5, color: INK, borderBottom: i < AGENT_ROWS.length - 1 ? `1px solid ${HAIR}` : "none" }}>
            <span style={{ flex: 1.5, fontWeight: 500 }}>{r[0]}</span>
            <span style={{ width: 80 }}><span style={{ fontSize: 11, fontWeight: 600, color: r[1] === "Active" ? GREEN : "#6b7280", background: r[1] === "Active" ? "#e9f8ee" : "#f1f2f4", borderRadius: 6, padding: "3px 9px" }}>{r[1]}</span></span>
            <span style={{ flex: 1.3, color: SUB, display: "flex", alignItems: "center", gap: 6 }}><Ico name={r[2].includes("WhatsApp") ? "whatsapp" : "phone"} size={12} />{r[2]}</span>
            <span style={{ width: 120, color: SUB }}>{r[3]}</span>
            <span style={{ width: 130, color: SUB }}>{r[4] ? <span style={{ fontSize: 11, background: "#f1f2f4", borderRadius: 6, padding: "3px 8px" }}>{r[4]}</span> : ""}</span>
            <span style={{ width: 150, color: SUB }}>{r[5]}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Create Agent type-selection modal (reference: real Create Agent modal)
const AgentTypeCard: React.FC<{ icon: React.ComponentProps<typeof Ico>["name"]; title: string; desc: string; sel?: boolean; cursorAt?: number }> = ({ icon, title, desc, sel, cursorAt }) => (
  <div style={{ position: "relative", display: "flex", gap: 14, padding: "16px 18px", borderRadius: 12, border: `1.5px solid ${sel ? PURPLE : HAIR}`, background: sel ? "#faf6ff" : "#fff", marginBottom: 12 }}>
    <div style={{ width: 38, height: 38, borderRadius: 10, background: sel ? "#f3e6ff" : "#eafaf0", color: sel ? PURPLE : GREEN, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ico name={icon} size={19} /></div>
    <div><div style={{ fontSize: 15.5, fontWeight: 700, color: INK }}>{title}</div><div style={{ fontSize: 13, color: SUB, marginTop: 4, lineHeight: 1.45, maxWidth: 560 }}>{desc}</div></div>
    {cursorAt != null ? <ClickPulse at={cursorAt} /> : null}
  </div>
);
const CreateAgentModal: React.FC<{ cursorAt?: number }> = ({ cursorAt }) => (
  <div style={{ position: "relative", height: "100%" }}>
    <NewConsoleShell activeNav="Agents"><AgentsListBody /></NewConsoleShell>
    <div style={{ position: "absolute", inset: 0, background: "rgba(22,20,34,0.34)" }} />
    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 760, maxHeight: "86%", background: "#fff", borderRadius: 16, boxShadow: "0 30px 70px rgba(20,18,40,0.3)", padding: "26px 30px", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <div><div style={{ fontSize: 22, fontWeight: 700, color: INK, fontFamily: FONT }}>Create Agent</div><div style={{ fontSize: 15, color: SUB, marginTop: 6 }}>What type of agent would you like to create?</div></div>
        <span style={{ flex: 1 }} /><span style={{ color: "#9aa0ac", fontSize: 16 }}>✕</span>
      </div>
      <div style={{ marginTop: 22 }}>
        <AgentTypeCard sel icon="sparkle" title="Conversational Agent" desc="Human-like AI agents across Voice, SMS, WhatsApp, and WebChat. Configure with prompts or customize with the visual builder." cursorAt={cursorAt} />
        <AgentTypeCard icon="phone" title="Outbound Streaming Agent" desc="Initiate outbound calls with real-time audio or text streaming via WebSocket. Plug in your own LLM or use raw audio streams." />
        <AgentTypeCard icon="phone" title="Inbound Streaming Agent" desc="Handle incoming calls with real-time audio or text streaming via WebSocket. Plug in your own LLM or use raw audio streams." />
        <AgentTypeCard icon="whatsapp" title="Messaging Agent" desc="Automated alerts, reminders, and notifications across SMS and WhatsApp." />
      </div>
    </div>
  </div>
);

// ==========================================================================
// Buy Number (right drawer over Phone Numbers) — reference: real config frame
// ==========================================================================
const CapIcons: React.FC = () => {
  const box: React.CSSProperties = { width: 28, height: 28, borderRadius: 7, background: "#f4f5f7", display: "inline-flex", alignItems: "center", justifyContent: "center" };
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <span style={{ ...box, color: "#16a34a" }}><Ico name="phone" size={13} /></span>
      <span style={box}><svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="#3b6cf0" strokeWidth="1.6" strokeLinejoin="round"><path d="M4 5.5h12a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 16 13.5H9l-3.5 3v-3H4a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 4 5.5z" /></svg></span>
      <span style={box}><svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="#e0457b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4.5" width="14" height="11" rx="2" /><circle cx="7" cy="8.5" r="1.2" /><path d="M4 14l4-4 3.5 3.5" /></svg></span>
    </div>
  );
};
const ConfigPill: React.FC<{ label: string }> = ({ label }) => (
  <span style={{ fontSize: 12.5, fontWeight: 500, color: label === "1 agent" ? INK : SUB, background: label === "1 agent" ? "#f1f2f4" : "transparent", border: label === "1 agent" ? "none" : `1px solid ${HAIR}`, borderRadius: 7, padding: "5px 12px" }}>{label}</span>
);
const NUM_ROWS: [string, string, string, string][] = [
  ["+1 210 225 9794", "Test", "Texas, United States", "Application"],
  ["+1 806 209 0453", "Support Line", "Texas, United States", "Application"],
  ["+1 501 383 3510", "Sales Line", "Arkansas, United States", "1 agent"],
  ["+1 775 239 8525", "Outbound", "Nevada, United States", "SIP Trunk"],
  ["+1 737 418 2342", "Reminders", "Texas, United States", "SIP Trunk"],
];
export const PhoneNumbersScreen: React.FC<{ behind?: boolean; cursorAt?: number; rows?: [string, string, string, string][]; rowClickAt?: number }> = ({ behind, cursorAt, rows = NUM_ROWS, rowClickAt }) => (
  <div style={{ height: "100%", overflow: "hidden", filter: behind ? "blur(0.3px)" : undefined }}>
    <PageHeader title="Phone Numbers" subtitle="Everything you need to set up phone numbers." />
    <TabRow tabs={["Purchased Numbers", "Unrented Numbers", "Port-in", "Verified Caller IDs", "Sender IDs", "Rental Summary", "Lookup", "Other Settings"]} active="Purchased Numbers" />
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 26px 0" }}>
      <div style={{ height: 36, width: 300, display: "inline-flex", alignItems: "center", gap: 7, padding: "0 12px", borderRadius: 8, border: `1px solid ${HAIR}`, fontSize: 13, color: "#9aa0ac" }}><Ico name="search" size={14} />Search by number or alias...</div>
      <div style={{ height: 36, display: "inline-flex", alignItems: "center", gap: 7, padding: "0 14px", borderRadius: 8, border: `1px solid ${HAIR}`, fontSize: 13.5, color: SUB }}><Ico name="plus" size={13} />Type</div>
      <div style={{ height: 36, display: "inline-flex", alignItems: "center", gap: 7, padding: "0 14px", borderRadius: 8, border: `1px solid ${HAIR}`, fontSize: 13.5, color: SUB }}><Ico name="plus" size={13} />Capability</div>
      <span style={{ flex: 1 }} />
      <div style={{ height: 38, display: "inline-flex", alignItems: "center", gap: 7, padding: "0 15px", borderRadius: 8, border: `1px solid ${HAIR}`, fontSize: 14, color: INK, fontWeight: 500 }}><Ico name="download" size={14} />Export</div>
      <div style={{ position: "relative", display: "inline-block" }}>
        <DarkButton><span style={{ display: "inline-flex", marginRight: 6 }}><Ico name="plus" size={14} /></span>Buy Number</DarkButton>
        {cursorAt != null ? <ClickPulse at={cursorAt} /> : null}
      </div>
    </div>
    <div style={{ padding: "16px 26px 0" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "0 6px 12px", fontSize: 12, color: "#9aa0ac", fontWeight: 600, borderBottom: `1px solid ${HAIR}` }}>
        <span style={{ width: 26 }} /><span style={{ flex: 1.6 }}>Phone Number</span><span style={{ width: 80 }}>Type</span><span style={{ width: 150 }}>Capability</span><span style={{ width: 170 }}>Additional Information</span><span style={{ width: 130 }}>CNAM Lookup</span><span style={{ width: 130 }}>Backup Number</span><span style={{ width: 130 }}>Configuration</span><span style={{ width: 110 }}>Sub Account</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", padding: "14px 6px", fontSize: 13, borderBottom: `1px solid ${HAIR}` }}>
          <span style={{ width: 26 }}><span style={{ width: 15, height: 15, borderRadius: 4, border: `1.5px solid #c2c6cf`, display: "inline-block" }} /></span>
          <div style={{ flex: 1.6, display: "flex", alignItems: "center", gap: 9 }}>
            <USFlag w={20} />
            <div style={{ position: "relative" }}><div style={{ fontWeight: 500, color: INK }}>{r[0]}{r[1] ? <> <span style={{ color: SUB, fontWeight: 400 }}>({r[1]})</span></> : null}</div><div style={{ fontSize: 12, color: SUB, marginTop: 2 }}>{r[2]}</div>
              {rowClickAt != null && i === 0 ? <ClickCursor clickAtFrame={rowClickAt} approach="tl" offset={{ x: 118, y: 7 }} /> : null}</div>
          </div>
          <span style={{ width: 80, color: INK }}>Local</span>
          <span style={{ width: 150 }}><CapIcons /></span>
          <span style={{ width: 170 }} /><span style={{ width: 130 }} /><span style={{ width: 130 }} />
          <span style={{ width: 130 }}><ConfigPill label={r[3]} /></span>
          <span style={{ width: 110 }} />
        </div>
      ))}
    </div>
  </div>
);
const Fld: React.FC<{ label: string; value?: string; caret?: boolean }> = ({ label, value, caret }) => (
  <div style={{ marginBottom: 15 }}>
    <div style={{ fontSize: 13, color: SUB, marginBottom: 6, fontWeight: 500 }}>{label}</div>
    <div style={{ height: 42, border: `1px solid ${HAIR}`, borderRadius: 9, display: "flex", alignItems: "center", padding: "0 13px", fontSize: 14, color: value ? INK : "#b0b4bd", justifyContent: "space-between" }}><span>{value || ""}</span>{caret ? <span style={{ color: "#b8bcc6" }}><Ico name="chevron" size={15} /></span> : null}</div>
  </div>
);
const Rad: React.FC<{ label: string; on?: boolean }> = ({ label, on }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14, fontWeight: 500, color: INK }}>
    <span style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${on ? PURPLE : "#c2c6cf"}`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{on ? <span style={{ width: 9, height: 9, borderRadius: "50%", background: PURPLE }} /> : null}</span>{label}
  </div>
);
export const BuyNumberDrawer: React.FC<{ step: "search" | "configure"; cursorAt?: number; appType?: "AI Agents" | "Application" | "SIP Trunk" }> = ({ step, cursorAt, appType = "AI Agents" }) => (
  <div style={{ height: "100%", position: "relative" }}>
    <PhoneNumbersScreen behind />
    <div style={{ position: "absolute", inset: 0, background: "rgba(22,20,34,0.18)" }} />
    <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 560, background: "#fff", boxShadow: "-24px 0 60px rgba(20,18,40,0.20)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "18px 24px", borderBottom: `1px solid ${HAIR}` }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: INK, fontFamily: FONT }}>Buy Number</div><span style={{ flex: 1 }} /><span style={{ color: "#9aa0ac" }}>✕</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 24px", fontSize: 13.5, color: SUB }}>
        <span style={{ color: GREEN }}>✓</span> Select Number <span style={{ color: "#c2c6cf" }}>›</span>
        <span style={{ width: 20, height: 20, borderRadius: "50%", border: `1.5px solid ${step === "configure" ? INK : "#c2c6cf"}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: step === "configure" ? INK : "#c2c6cf", fontWeight: 700 }}>2</span> Configuration
      </div>
      <div style={{ flex: 1, overflow: "hidden", padding: "8px 24px" }}>
        {step === "search" ? (
          <>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}><div style={{ flex: 1 }}><Fld label="Number type" value="Local" caret /></div><div style={{ flex: 1 }}><Fld label="Capability" value="Voice" caret /></div></div>
            <div style={{ fontSize: 13, color: SUB, marginBottom: 6, fontWeight: 500 }}>Search</div>
            <div style={{ height: 42, border: `1px solid ${HAIR}`, borderRadius: 9, display: "flex", alignItems: "center", gap: 8, padding: "0 13px", fontSize: 14, marginBottom: 14 }}><Ico name="search" size={15} /> Austin, TX</div>
            {[["+1 512 555 0142", true], ["+1 512 555 0187", false], ["+1 512 555 0209", false]].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", padding: "12px 12px", border: `1px solid ${HAIR}`, borderRadius: 10, marginBottom: 8, background: r[1] ? "#fafafb" : "#fff" }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${r[1] ? PURPLE : "#d6d8de"}`, marginRight: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{r[1] ? <span style={{ width: 8, height: 8, borderRadius: "50%", background: PURPLE }} /> : null}</span>
                <span style={{ marginRight: 9 }}><USFlag w={18} /></span>
                <span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 14, fontWeight: 500 }}>{r[0]}</span><span style={{ flex: 1 }} /><span style={{ color: SUB, fontSize: 13 }}>Austin, TX · $0.50/mo</span>
              </div>
            ))}
          </>
        ) : (
          <>
            <Fld label="Number" value="+1 512 555 0142" />
            <Fld label="Alias" value={appType === "SIP Trunk" ? "SIP endpoint" : appType === "Application" ? "voice-app" : "First voice agent"} />
            <div style={{ fontSize: 13, color: SUB, marginBottom: 8, fontWeight: 500 }}>Application Type</div>
            <div style={{ display: "flex", gap: 24, marginBottom: 15 }}><Rad label="AI Agents" on={appType === "AI Agents"} /><Rad label="Application" on={appType === "Application"} /><Rad label="SIP Trunk" on={appType === "SIP Trunk"} /></div>
            {appType === "SIP Trunk" ? (
              <Fld label="Associated Trunk" value="inbound-support" caret />
            ) : appType === "Application" ? (
              <Fld label="Associated Application" value="voice-app" caret />
            ) : (
              <>
                <Fld label="Associated Call Agent Flow (Optional)" value="Lead Qualifier" caret />
                <Fld label="Associated Message Agent Flow (Optional)" caret />
              </>
            )}
          </>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, padding: "14px 24px", borderTop: `1px solid ${HAIR}` }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <DarkButton purple={step === "configure"}>{step === "search" ? "Next" : "Finish"}</DarkButton>
          {cursorAt != null ? <ClickPulse at={cursorAt} /> : null}
        </div>
      </div>
    </div>
  </div>
);

// ==========================================================================
// Ask Buddy (Home + docked assistant panel) — reference: real Ask Buddy frame
// ==========================================================================
const DEFAULT_BUDDY_Q = "How do I configure a phone number?";
const DEFAULT_BUDDY_A = (
  <>
    <div style={{ fontSize: 13.5, color: "#1f2430", lineHeight: 1.55, marginTop: 12 }}>
      Open <b>Phone Numbers</b>, buy a number, then in <b>Configuration</b> set the Application Type. For an agent, choose <b>AI Agents</b> and pick your flow.
    </div>
    <div style={{ fontSize: 13.5, color: "#1f2430", lineHeight: 1.55, marginTop: 10 }}>
      Tell me if it's for incoming calls, SMS, or SIP, and I'll give the exact setup path.
    </div>
  </>
);
const AskBuddyPanel: React.FC<{ answerAt: number; question?: string; answer?: React.ReactNode }> = ({ answerAt, question = DEFAULT_BUDDY_Q, answer = DEFAULT_BUDDY_A }) => {
  const frame = useCurrentFrame();
  const showA = frame >= answerAt;
  return (
    <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 430, background: "#fff", borderLeft: `1px solid ${HAIR}`, boxShadow: "-16px 0 34px rgba(20,18,40,0.06)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${HAIR}` }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: INK }}>Ask Buddy</span><span style={{ flex: 1 }} /><span style={{ color: "#b8bcc6" }}>＋ ›</span>
      </div>
      <div style={{ flex: 1, padding: "18px 20px", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
          <div style={{ background: "#f1f1f4", color: INK, borderRadius: "12px 12px 3px 12px", padding: "10px 14px", fontSize: 13.5, maxWidth: 300 }}>{question}</div>
        </div>
        {showA ? (
          <>
            {["Searched docs", "Searched docs", "Searched docs"].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, color: "#9aa0ac", fontSize: 12.5, marginBottom: 7 }}><span style={{ color: GREEN }}>✓</span> {s}</div>
            ))}
            {answer}
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#9aa0ac", fontSize: 13 }}><span style={{ color: GREEN }}>✓</span> Searched docs...</div>
        )}
      </div>
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${HAIR}` }}>
        <div style={{ minHeight: 48, border: `1px solid ${EB}`, borderRadius: 10, display: "flex", alignItems: "center", padding: "0 14px", color: "#9aa0ac", fontSize: 13.5, justifyContent: "space-between" }}>What would you like to know?<span style={{ fontSize: 11 }}>0 / 1000</span></div>
      </div>
    </div>
  );
};
export const AskBuddyScreen: React.FC<{ clickAt: number; answerAt: number; question?: string; answer?: React.ReactNode }> = ({ clickAt, answerAt, question, answer }) => {
  const frame = useCurrentFrame();
  const open = frame >= clickAt;
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <NewConsoleShell activeNav="Home"><HomeBody /></NewConsoleShell>
      {/* click pulse centered over the top-bar Ask Buddy pill */}
      {!open ? (
        <div style={{ position: "absolute", top: 12, right: 70, width: 112, height: 34 }}>
          <ClickPulse at={clickAt} />
        </div>
      ) : null}
      {open ? <AskBuddyPanel answerAt={answerAt} question={question} answer={answer} /> : null}
    </div>
  );
};

// ==========================================================================
// Root composition
// ==========================================================================
export const OnboardingVoiceAgents: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#f6f5f3" }}>
    <Audio src={staticFile(MUSIC.src)} loop volume={(f) => musicVol(f) * 0.62} />

    <Beat k="intro"><FadeIn><NewConsoleShell activeNav="Agents"><AgentsListBody /></NewConsoleShell></FadeIn></Beat>
    <Beat k="create"><FadeIn><SubScreens screens={[
      { at: 0, node: <NewConsoleShell activeNav="Agents"><AgentsListBody cursorAt={52} /></NewConsoleShell> },
      { at: 100, node: <CreateAgentModal cursorAt={138} /> },
      { at: 190, node: <VibeEmptyEditor /> },
      { at: 285, node: <VibeFlowEditor /> },
    ]} /></FadeIn></Beat>
    <Beat k="number"><FadeIn><SubScreens screens={[
      { at: 0, node: <NewConsoleShell activeNav="Phone Numbers"><PhoneNumbersScreen cursorAt={75} /></NewConsoleShell> },
      { at: 120, node: <NewConsoleShell activeNav="Phone Numbers"><BuyNumberDrawer step="search" cursorAt={200} /></NewConsoleShell> },
      { at: 250, node: <NewConsoleShell activeNav="Phone Numbers"><BuyNumberDrawer step="configure" cursorAt={340} /></NewConsoleShell> },
    ]} /></FadeIn></Beat>
    <Beat k="buddy"><FadeIn><AskBuddyScreen clickAt={55} answerAt={110} /></FadeIn></Beat>
    <Beat k="close" stage={false}><OutroCard /></Beat>

    <TightCaptions captions={CAPTIONS} />
    {VO.map((v) => (
      <Sequence key={v.beat} from={BEAT[v.beat].from + LEAD} durationInFrames={DUR[v.beat]} layout="none">
        <Audio src={staticFile(v.src)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
