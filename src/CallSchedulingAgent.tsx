import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "./fonts";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { VibeIntroCard } from "./VibeIntroCard";
import { MUSIC } from "./promoConfig";
import { HomePage, AgentsPage } from "./cards/ConsolePages";
import { NewConsoleShell } from "./cards/NewConsoleShell";
import { PhoneNumbersScreen } from "./OnboardingVoiceAgents";
import { ClickCursor } from "./cards/ClickCursor";
import { StatusToast } from "./cards/StatusToast";
import { Grid, Chip, Logo, CREAM, MONO, SORA, INTER, INK } from "./StyleFrames";
import { PromptBeat, PlanBeat, ApproveBeat, BuildBeat, SimulateBeat, SimDetailBeat, VoiceTabBeat, VoicePickBeat, VoicePickedBeat, PublishBeat, ConnectModalBeat, BuddyBeat } from "./cards/CSBeats";

// ============================================================================
// CallSchedulingAgent — a HYBRID YouTube tutorial. The real Loom screen capture
// (public/call-scheduling.mp4) plays as sped-up b-roll inside a cropped browser
// frame on the cream brand backdrop, under a Remotion intro/outro + captions +
// scripted voiceover. The crop hides the browser chrome (tabs/bookmarks/URL) so
// no personal/account details show.
// ============================================================================

const FPS = 30;
const BLUE = "#323dfe";
const CREAM_BG = "radial-gradient(120% 95% at 50% 0%, #fbfaf8 0%, #f6f5f3 55%, #efeeea 100%)";
const VIDEO = "call-scheduling.mp4"; // build steps (muted b-roll)
const VIDEO_CALL = "call-scheduling-testcall.mp4"; // the real test call (un-muted, real-time)

// Footage window geometry (source is 1728x1080). Crop the browser chrome off the
// top; crop the bottom only as much as each clip needs (the build recording has
// no Loom bar, so it shows the full app page; the test-call clip hides the bar).
const WIN_W = 1500;
const SCALE0 = WIN_W / 1728; // scale when the full app width fills the window
const CROP_TOP = 150; // trim browser chrome only → show the app's own top bar downward
const DEFAULT_CROP_BOTTOM = 0; // build footage has no Loom bar → show the full viewport
const CHROME_H = 34;
const WIN_LEFT = Math.round((1920 - WIN_W) / 2);
// ONE fixed window for EVERY beat (footage, test call, recreated screens) so cuts
// never shift the frame. Per-clip bottom cropping is done by zooming the video
// INSIDE this fixed window, not by resizing the window.
const FIXED_FOOT_H = Math.round((1080 - CROP_TOP) * SCALE0);
const FIXED_WIN_TOP = Math.round((1080 - (CHROME_H + FIXED_FOOT_H)) / 2) - 44;

export type Cap = { pre: string; kw: string; post?: string };
// Motivated SPOTLIGHT: `spot` is the UI element's rect in final-frame screen coords (0..1920 / 0..1080).
// The footage zooms toward it by up to `z` (capped so the WHOLE rect always stays in frame, never cropped)
// and everything outside the rect dims. Ramps 1→z over [t0,t1], holds [t1,t2], releases z→1 over [t2,t3].
export type Focus = { spot: { x: number; y: number; w: number; h: number }; z: number; t0: number; t1: number; t2: number; t3: number };
export type Step = {
  key: string;
  dur: number; // frames in the final cut
  src?: [number, number]; // source seconds [start, end] to show (single window)
  clips?: { src?: [number, number]; node?: React.ReactNode; dur: number }[]; // OR several beats back-to-back under one caption (footage window OR a recreated screen)
  cap: Cap;
  focus?: Focus; // motivated zoom toward a UI element (screen coords), or omit for a steady full-width shot
  focusSeq?: Focus[];
  mixed?: boolean; // first clip is a full-frame Opener card, the rest sit in the browser frame // several spotlights in turn within one step (the one whose [t0,t3] contains the frame wins)
  file?: string; // source video (defaults to the build recording)
  sound?: boolean; // play the footage's own audio (the real test call), muted otherwise
  cropBottom?: number; // extra bottom crop (px) — used to hide the test-call clip's Loom bar
  geom?: { w: number; h: number; cropTop: number }; // source geometry override (default: 1728x1080, CROP_TOP)
  overlay?: React.ReactNode; // composited inside the zoom wrapper (patches, badges), scales with the footage
  bg?: string; // colour behind the footage (the letterbox bands where chrome was cropped); default white
  // Brand layouts: "frame" = console in a floating rounded frame under a headline (default);
  // "float" = the `extract` rect of the scene is cut out and floated large beside an `aside` text block.
  layout?: "frame" | "float";
  chip?: { n: string; label: string };
  headline?: React.ReactNode; // frame layout: headline above the frame (replaces the caption pill)
  extract?: { x: number; y: number; w: number; h: number }; // float layout: scene rect to cut out (screen px)
  aside?: { title: React.ReactNode; sub?: string; tag?: string }; // float layout: text block on the left
};

// ONE continuous narration (narr-v7.mp3) plays under everything so the cadence never
// breaks. Section starts = first-word timestamps of each line (faster-whisper), so each
// screen is on-frame while its line is spoken. No test call (removed). src windows avoid the
// Home page + raw Agents list (recording t0-18 → "Welcome Renu" + Auth ID + "Renu Yadav").

// Composited onto a clean finished-flow frame (the recording's real Publish happens with the
// Buddy panel open, which must not appear before the Buddy beat): a cursor clicks the header
// Publish button, a "Published" toast slides in, and the Draft badge flips to Active.
const PublishOverlay: React.FC<{ clickAt: number }> = ({ clickAt }) => {
  const frame = useCurrentFrame();
  const on = interpolate(frame, [clickAt + 8, clickAt + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      {/* anchored by the pointer TIP (approach "tl", zero offset) so it lands on the Publish label */}
      <div style={{ position: "absolute", left: 1850, top: 136 }}>
        <ClickCursor clickAtFrame={clickAt} approach="tl" offset={{ x: 0, y: 0 }} sound />
      </div>
      <div style={{ position: "absolute", top: 200, right: 40 }}>
        <StatusToast title="Published" body="Your agent is live and ready to take calls." variant="success" appearAtFrame={clickAt + 14} chime />
      </div>
      <ActiveBadge on={on} />
    </AbsoluteFill>
  );
};

// Covers the footage's "Draft" pill in the agent header with a green "Active" pill.
export const ActiveBadge: React.FC<{ on: number }> = ({ on }) => (
  <>
    <div style={{ position: "absolute", left: 360, top: 122, width: 76, height: 37, borderRadius: 8, background: "#f4f5f7", opacity: on }} />
    <div style={{ position: "absolute", left: 360, top: 122, width: 76, height: 37, borderRadius: 8, background: "#e7f8ee", color: "#15a34a", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: `${INTER_FAMILY}, sans-serif`, opacity: on, transform: `scale(${0.9 + 0.1 * on})` }}>
      Active
    </div>
  </>
);

// The recording's agent is called "Agent Flow 11"; the video calls it "Call Scheduling Agent" everywhere,
// so the page header is repainted (name + status pill) in every footage beat that shows it.
export const AGENT_NAME = "Call Scheduling Agent";
const HeaderNamePatch: React.FC<{ status: "Unsaved" | "Draft" }> = ({ status }) => (
  <>
    <div style={{ position: "absolute", left: 140, top: 122, width: 380, height: 36, background: "#ffffff" }} />
    <div style={{ position: "absolute", left: 144, top: 122, height: 36, display: "flex", alignItems: "center", gap: 20, fontFamily: `${INTER_FAMILY}, sans-serif` }}>
      <span style={{ fontSize: 21, fontWeight: 600, color: "#1f2430", letterSpacing: -0.2 }}>{AGENT_NAME}</span>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: "#3a3d46", background: "#f1f2f4", borderRadius: 7, padding: "5px 10px" }}>{status}</span>
    </div>
  </>
);
// The Configure Number modal shows the number's old alias ("Pipecat Demo"); blank it.
const AliasPatch: React.FC = () => <div style={{ position: "absolute", left: 1216, top: 410, width: 140, height: 32, background: "#ffffff" }} />;
// The recording's Voice field briefly shows a stale "Career Cat" value with a red "Selected value
// not found" note before the new voice is picked. Patch it to read "Elise" (the voice Vibe Agent
// suggested in its plan) and hide the note, from `from` until `until` (section frames).
const VoiceFieldPatch: React.FC<{ from: number; until?: number }> = ({ from, until }) => {
  const frame = useCurrentFrame();
  if (frame < from || (until != null && frame > until)) return null;
  return (
    <>
      <div style={{ position: "absolute", left: 176, top: 634, width: 130, height: 34, background: "#ffffff" }} />
      <div style={{ position: "absolute", left: 181, top: 634, height: 34, display: "flex", alignItems: "center", fontSize: 16.5, color: "#1f2430", fontFamily: `${INTER_FAMILY}, sans-serif` }}>Elise</div>
      <div style={{ position: "absolute", left: 118, top: 680, width: 500, height: 26, background: "#ffffff" }} />
    </>
  );
};

// Recreated Phone Numbers list (the recording's list has the Buddy panel open beside it): the
// same single number as the real Configure Number modal that follows, cursor clicks the row.
const NumbersListBeat: React.FC = () => (
  <NewConsoleShell activeNav="Phone Numbers" topBar="live">
    <PhoneNumbersScreen rows={[["+1 806 209 0453", "", "Texas, United States", "1 agent"]]} rowClickAt={36} />
  </NewConsoleShell>
);


// ---------------------------------------------------------------------------
// Brand beats (from the approved style frames): openers, scenario list, recap
// cards, incoming-call phone, logo outro, and the two layouts (frame / float).
// ---------------------------------------------------------------------------
export const easeIn = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// A — typographic opener on brand blue
export const Opener: React.FC<{ chip: { n: string; label: string }; title: React.ReactNode; sub?: string }> = ({ chip, title, sub }) => {
  const f = useCurrentFrame(); const e = easeIn(f, 0, 22); const e2 = easeIn(f, 10, 32);
  return (
    <AbsoluteFill style={{ background: BLUE, fontFamily: SORA }}>
      <Grid dark /><Chip n={chip.n} label={chip.label} dark /><Logo white />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 1500, textAlign: "center" }}>
          <div style={{ fontSize: 104, fontWeight: 600, color: "#fff", letterSpacing: -3, lineHeight: 1.04, opacity: e, transform: `translateY(${(1 - e) * 26}px)` }}>{title}</div>
          {sub ? <div style={{ marginTop: 30, fontSize: 30, color: "rgba(255,255,255,0.82)", fontFamily: INTER, fontWeight: 500, opacity: e2, transform: `translateY(${(1 - e2) * 16}px)` }}>{sub}</div> : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const Hi: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ background: "#fff", color: BLUE, padding: "0 22px", borderRadius: 20 }}>{children}</span>;

// D — kinetic scenario list (rolls through the simulated callers)
export const ScenarioList: React.FC<{ chip: { n: string; label: string }; foot: string }> = ({ chip, foot }) => {
  const f = useCurrentFrame();
  const items = ["Do-not-contact request", "Cold sales pitch", "Angry caller", "Pricing question", "Vague inquiry", "Bot question"];
  const step = 34; const active = Math.min(items.length - 1, Math.floor(f / step)); const frac = Math.min(1, (f % step) / 14);
  const shift = interpolate(frac, [0, 1], [82, 0], { easing: Easing.out(Easing.cubic) });
  const e = easeIn(f, 0, 18);
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: SORA }}>
      <Grid /><Chip n={chip.n} label={chip.label} /><Logo />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 1400, opacity: e }}>
        <div style={{ transform: `rotateX(14deg) translateY(${-active * 82 + shift + 82 * 1.5}px)`, transformStyle: "preserve-3d", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, marginLeft: -140 }}>
          {items.map((t, i) => { const dd = Math.abs(i - active); return (
            <div key={t} style={{ height: 82, display: "flex", alignItems: "center", gap: 26, fontSize: dd === 0 ? 92 : 72, fontWeight: 600, color: INK, opacity: dd === 0 ? 1 : Math.max(0.08, 0.3 - dd * 0.07), filter: dd === 0 ? "none" : `blur(${dd * 1.6}px)`, letterSpacing: -2.5, whiteSpace: "nowrap" }}>
              <span style={{ width: 70, color: BLUE, opacity: dd === 0 ? 1 : 0 }}>→</span>{t}
              {dd === 0 && f > 6 ? <span style={{ marginLeft: 26, fontFamily: MONO, fontSize: 22, background: "#eef0ff", color: BLUE, padding: "9px 16px", borderRadius: 12 }}>simulating…</span> : null}
            </div>); })}
        </div>
      </AbsoluteFill>
      {foot ? <div style={{ position: "absolute", bottom: 84, left: 0, right: 0, textAlign: "center", fontSize: 30, fontFamily: INTER, fontWeight: 500, color: "#55586a", opacity: easeIn(f, 12, 30) }}>{foot}</div> : null}
    </AbsoluteFill>
  );
};

// E — recap cards (facts from the demo only)
export type RecapCard = { icon: string; title: string; rows: [string, string][] };
export const RecapCards: React.FC<{ title?: React.ReactNode; chip?: { n: string; label: string }; cards?: RecapCard[] }> = ({ title, chip, cards: cardsIn }) => {
  const f = useCurrentFrame();
  const cards: RecapCard[] = cardsIn ?? [
    { icon: "☎", title: "Answers every call", rows: [["Greeting", "Your own"], ["Availability", "24 / 7"], ["Cold sales calls", "Declined"]] },
    { icon: "✎", title: "Takes a message", rows: [["Name + number", "Captured"], ["Urgent callers", "Flagged"], ["You call back", "When it suits"]] },
    { icon: "▲", title: "Built with Vibe Agent", rows: [["Design + build", "≈ 10 minutes"], ["Simulations", "Run against goals"], ["Code written", "None"]] },
  ];
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: SORA }}>
      <Grid /><Chip n={chip?.n ?? "09"} label={chip?.label ?? "What you built"} /><Logo />
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", fontSize: 64, fontWeight: 600, color: INK, letterSpacing: -2, opacity: easeIn(f, 0, 20) }}>{title ?? <>Your AI receptionist, <span style={{ color: BLUE }}>live.</span></>}</div>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 34 }}>
        {cards.map((c, i) => { const e = easeIn(f, 8 + i * 9, 30 + i * 9); return (
          <div key={c.title} style={{ width: 480, background: "#fff", borderRadius: 24, padding: "34px 34px 26px", boxShadow: "0 30px 70px rgba(15,17,23,0.14), 0 0 0 1px rgba(15,17,23,0.05)", opacity: e, transform: `translateY(${(1 - e) * 30}px) scale(${0.96 + 0.04 * e})` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}><span style={{ width: 54, height: 54, borderRadius: 16, background: "#eef0ff", color: BLUE, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{c.icon}</span><span style={{ fontSize: 30, fontWeight: 600, color: INK }}>{c.title}</span></div>
            <div style={{ marginTop: 26, background: "#f7f8fa", borderRadius: 14, padding: "6px 18px" }}>
              {c.rows.map(([k, v]) => <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 18, padding: "12px 0", borderBottom: "1px solid #ebedf1", color: "#7a7f8c" }}><span>{k}</span><span style={{ color: "#15a34a", fontWeight: 600 }}>{v}</span></div>)}
            </div>
          </div>); })}
      </div>
    </AbsoluteFill>
  );
};

// F — incoming call from the receptionist
export const PhoneBeat: React.FC<{ chip?: { n: string; label: string }; title?: React.ReactNode; sub?: string; caller?: string; initial?: string; status?: string }> = ({ chip, title, sub, caller = "Redbud Studio", initial = "R", status = "INCOMING VOICE CALL" }) => {
  const f = useCurrentFrame(); const e = easeIn(f, 0, 26); const bob = Math.sin(f / 9) * 6; const pulse = 1 + 0.06 * Math.abs(Math.sin(f / 5));
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: SORA }}>
      <Grid /><Chip n={chip?.n ?? "10"} label={chip?.label ?? "Live"} /><Logo />
      <div style={{ position: "absolute", left: 150, top: 340, width: 760, opacity: easeIn(f, 6, 28) }}>
        <div style={{ fontSize: 84, fontWeight: 600, color: INK, letterSpacing: -2.6, lineHeight: 1.02 }}>{title ?? <>One that <span style={{ color: BLUE }}>never</span><br />misses a call.</>}</div>
        <div style={{ marginTop: 26, fontSize: 28, color: "#55586a", fontFamily: INTER }}>{sub ?? "Every caller is attended to. Every message reaches you."}</div>
      </div>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 1600 }}>
        <div style={{ marginLeft: 700, width: 400, height: 820, borderRadius: 56, background: "linear-gradient(180deg,#141a33,#0b0f24)", boxShadow: "0 60px 120px rgba(15,17,23,0.35), inset 0 0 0 10px #05070f", transform: `rotateY(${-18 - (1 - e) * 30}deg) rotateX(8deg) rotateZ(6deg) translateY(${bob + (1 - e) * 80}px)`, opacity: e, color: "#fff", fontFamily: INTER, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 120 }}>
          <div style={{ width: 120, height: 120, borderRadius: 60, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, fontWeight: 700, fontFamily: SORA, boxShadow: `0 0 0 ${10 * (pulse - 1) * 10}px rgba(50,61,254,0.25)` }}>{initial}</div>
          <div style={{ marginTop: 30, fontSize: 32, fontWeight: 600 }}>{caller}</div>
          <div style={{ marginTop: 10, fontFamily: MONO, fontSize: 16, letterSpacing: 2, color: "#8ea2ff" }}>{status}</div>
          <div style={{ marginTop: "auto", marginBottom: 90, display: "flex", gap: 90 }}>
            <span style={{ width: 84, height: 84, borderRadius: 42, background: "#e5484d", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>✕</span>
            <span style={{ width: 84, height: 84, borderRadius: 42, background: "#30a46c", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 34, transform: `scale(${pulse})` }}>☎</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// G — logo + waveform + CTA
export const LogoOutro: React.FC<{ cta?: React.ReactNode }> = ({ cta }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig(); const e = easeIn(f, 0, 24); const out = interpolate(f, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bars = Array.from({ length: 64 }, (_, i) => 18 + 70 * Math.abs(Math.sin(i * 0.55 + f * 0.09)) * (0.35 + 0.65 * Math.abs(Math.sin(i * 0.21 + 1.3))));
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: SORA, alignItems: "center", justifyContent: "center", opacity: Math.min(e, out) }}>
      <Grid />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 4, height: 160 }}>
        {bars.map((h, i) => <span key={i} style={{ width: 8, height: h * e, borderRadius: 4, background: BLUE, opacity: 0.35 + 0.65 * Math.abs(Math.sin(i * 0.3)) }} />)}
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", background: "#f6f5f3", padding: "0 34px" }}><PlivoLogoSvg width={330} color={INK} /></div>
      </div>
      <div style={{ marginTop: 44, fontSize: 40, fontWeight: 600, color: INK, letterSpacing: -1, opacity: easeIn(f, 10, 30) }}>{cta ?? <>Build <span style={{ color: BLUE }}>yours</span> today</>}</div>
      <div style={{ marginTop: 22, background: BLUE, color: "#fff", fontFamily: INTER, fontWeight: 600, fontSize: 24, padding: "14px 30px", borderRadius: 999, opacity: easeIn(f, 18, 38) }}>cx.plivo.com</div>
    </AbsoluteFill>
  );
};

// B — console in a floating frame under a headline
const FRAME_SCALE = 0.76; const FRAME_W = Math.round(1920 * FRAME_SCALE); const FRAME_H = Math.round(1080 * FRAME_SCALE); const CHROME = 36;
export const FrameLayout: React.FC<{ chip?: { n: string; label: string }; headline?: React.ReactNode; url?: string; children: React.ReactNode }> = ({ chip, headline, url = "cx.plivo.com", children }) => {
  const f = useCurrentFrame(); const e = easeIn(f, 0, 22);
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: SORA }}>
      <Grid />{chip ? <Chip n={chip.n} label={chip.label} /> : null}<Logo />
      <div style={{ position: "absolute", top: 96, left: 0, right: 0, textAlign: "center", fontSize: 46, fontWeight: 600, color: INK, letterSpacing: -1.4, opacity: e, transform: `translateY(${(1 - e) * 14}px)` }}>{headline}</div>
      <div style={{ position: "absolute", top: 182, left: Math.round((1920 - FRAME_W) / 2), width: FRAME_W, height: FRAME_H + CHROME, borderRadius: 22, overflow: "hidden", boxShadow: "0 40px 90px rgba(15,17,23,0.22), 0 0 0 1px rgba(15,17,23,0.06)", background: "#fff", transform: `scale(${0.985 + 0.015 * e})`, transformOrigin: "50% 40%" }}>
        <div style={{ height: CHROME, background: "#fafafa", borderBottom: "1px solid #ececef", display: "flex", alignItems: "center", gap: 8, padding: "0 16px" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 11, height: 11, borderRadius: 6, background: c }} />)}
          <span style={{ marginLeft: 16, fontFamily: INTER, fontSize: 13, color: "#8a8f9c" }}>{url}</span>
        </div>
        <div style={{ position: "relative", width: FRAME_W, height: FRAME_H, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${FRAME_SCALE})`, transformOrigin: "0 0" }}>{children}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// C — extract-and-float: cut the `rect` out of the 1920x1080 scene and float it large on the right
export const FloatLayout: React.FC<{ chip?: { n: string; label: string }; rect: { x: number; y: number; w: number; h: number }; aside?: { title: React.ReactNode; sub?: string; tag?: string }; wide?: boolean; headline?: React.ReactNode; still?: boolean; children: React.ReactNode }> = ({ chip, rect, aside, wide, headline, still, children }) => {
  const f = useCurrentFrame(); const e = still ? 1 : easeIn(f, 0, 24); const e2 = still ? 1 : easeIn(f, 8, 30);
  // floated panels stay clear of the chip/logo row: at most 860 tall, never above y=130
  const Z = wide ? Math.min(820 / rect.h, 1700 / rect.w, 1.4) : Math.min(860 / rect.h, 980 / rect.w, 1.25); const w = rect.w * Z, h = rect.h * Z;
  const left = wide ? Math.round((1920 - w) / 2) : 1920 - w - 110, top = wide ? Math.round((1080 - h) / 2) + 60 : Math.max(130, Math.round((1080 - h) / 2) + 20);
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: SORA }}>
      <Grid />{chip ? <Chip n={chip.n} label={chip.label} /> : null}<Logo />
      {headline ? <div style={{ position: "absolute", top: 96, left: 0, right: 0, textAlign: "center", fontSize: 46, fontWeight: 600, color: INK, letterSpacing: -1.4, opacity: e2 }}>{headline}</div> : null}
      {aside && !wide ? (
        <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: Math.max(560, left - 200), display: "flex", flexDirection: "column", justifyContent: "center", opacity: e2, transform: `translateY(${(1 - e2) * 16}px)` }}>
          <div style={{ fontSize: 66, fontWeight: 600, color: INK, letterSpacing: -2, lineHeight: 1.05 }}>{aside.title}</div>
          {aside.sub ? <div style={{ marginTop: 24, fontSize: 26, color: "#55586a", fontFamily: INTER, lineHeight: 1.45 }}>{aside.sub}</div> : null}
          {aside.tag ? <div style={{ marginTop: 30, display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 10, background: "#e7f8ee", color: "#15a34a", fontFamily: MONO, fontSize: 18, padding: "10px 16px", borderRadius: 10 }}>{aside.tag}</div> : null}
        </div>
      ) : null}
      <div style={{ position: "absolute", left, top, width: w, height: h, borderRadius: 18, overflow: "hidden", boxShadow: "0 40px 90px rgba(15,17,23,0.24), 0 0 0 1px rgba(15,17,23,0.06)", background: "#fff", opacity: e, transform: `translateX(${(1 - e) * 40}px)` }}>
        <div style={{ position: "absolute", left: -rect.x * Z, top: -rect.y * Z, width: 1920, height: 1080, transform: `scale(${Z})`, transformOrigin: "0 0" }}>{children}</div>
      </div>
    </AbsoluteFill>
  );
};

// A step that starts with a full-frame node clip (e.g. a blue Opener) and continues with footage
// inside the frame layout. The footage clips are re-based so the spotlight timing still lines up.
export const MixedClips: React.FC<{ step: Step }> = ({ step }) => {
  const clips = step.clips!; const lead = clips[0].dur; const rest = { ...step, clips: clips.slice(1), dur: step.dur - lead, focus: step.focus ? { ...step.focus, t0: step.focus.t0 - lead, t1: step.focus.t1 - lead, t2: step.focus.t2 - lead, t3: step.focus.t3 - lead } : undefined };
  return (
    <>
      <Sequence from={0} durationInFrames={lead} layout="none"><AbsoluteFill>{clips[0].node}</AbsoluteFill></Sequence>
      <Sequence from={lead} durationInFrames={step.dur - lead} layout="none"><FrameLayout chip={step.chip} headline={step.headline}><StepScene step={rest} noCaption dimOnly /></FrameLayout></Sequence>
    </>
  );
};


// ---- Hook: three beats instead of one static card ------------------------
// 1 "Missed calls mean missed customers."  2 "Build an AI receptionist / answers every call / takes a message"  3 "with Vibe Agent, by Plivo"
export const IntroMissed: React.FC = () => {
  const f = useCurrentFrame(); const e = easeIn(f, 0, 22);
  const calls = [["Missed call", "2:14 PM"], ["Missed call", "2:31 PM"], ["Missed call", "3:05 PM"]];
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: SORA }}>
      <Grid /><Logo />
      <div style={{ position: "absolute", left: 150, top: 0, bottom: 0, width: 900, display: "flex", flexDirection: "column", justifyContent: "center", opacity: e, transform: `translateY(${(1 - e) * 20}px)` }}>
        <div style={{ fontSize: 92, fontWeight: 600, color: INK, letterSpacing: -3, lineHeight: 1.02 }}>Missed calls mean<br /><span style={{ color: BLUE }}>missed customers.</span></div>
      </div>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 1600 }}>
        <div style={{ marginLeft: 900, width: 400, height: 820, borderRadius: 56, background: "linear-gradient(180deg,#141a33,#0b0f24)", boxShadow: "0 60px 120px rgba(15,17,23,0.35), inset 0 0 0 10px #05070f", transform: `rotateY(${-16 - (1 - e) * 24}deg) rotateX(8deg) rotateZ(5deg) translateY(${(1 - e) * 60}px)`, opacity: e, color: "#fff", fontFamily: INTER, padding: "110px 30px 0" }}>
          <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: 2, color: "#8ea2ff", marginBottom: 18 }}>RECENTS</div>
          {calls.map(([a, b], i) => { const ce = easeIn(f, 10 + i * 12, 26 + i * 12); return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", opacity: ce, transform: `translateX(${(1 - ce) * 30}px)` }}>
              <span style={{ width: 44, height: 44, borderRadius: 22, background: "rgba(229,72,77,0.18)", color: "#ff6b6b", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>↙</span>
              <div style={{ flex: 1 }}><div style={{ fontSize: 22, fontWeight: 600, color: "#ff6b6b" }}>{a}</div><div style={{ fontSize: 15, color: "rgba(255,255,255,0.55)" }}>Unknown caller</div></div>
              <span style={{ fontFamily: MONO, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{b}</span>
            </div>); })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const IntroBuild: React.FC<{ answersAt: number; takesAt: number }> = ({ answersAt, takesAt }) => {
  const f = useCurrentFrame(); const e = easeIn(f, 0, 24);
  const Pill: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => { const pe = easeIn(f, at, at + 16); return <div style={{ display: "inline-flex", alignItems: "center", gap: 14, border: "2px solid rgba(255,255,255,0.55)", color: "#fff", borderRadius: 999, padding: "16px 34px", fontSize: 34, fontWeight: 600, opacity: pe, transform: `translateY(${(1 - pe) * 18}px) scale(${0.94 + 0.06 * pe})` }}>{children}</div>; };
  return (
    <AbsoluteFill style={{ background: BLUE, fontFamily: SORA }}>
      <Grid dark /><Logo white />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", opacity: e, transform: `translateY(${(1 - e) * 26}px)` }}>
                    <div style={{ fontSize: 112, fontWeight: 600, color: "#fff", letterSpacing: -3.5, lineHeight: 1.06, whiteSpace: "nowrap" }}>Build an <Hi>AI Receptionist</Hi></div>
          <div style={{ marginTop: 54, display: "flex", gap: 24, justifyContent: "center" }}>
            <Pill at={answersAt}>Answers every call</Pill><Pill at={takesAt}>Takes a message</Pill>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const IntroVibe: React.FC = () => {
  const f = useCurrentFrame(); const e = easeIn(f, 0, 22);
  const bars = Array.from({ length: 48 }, (_, i) => 12 + 52 * Math.abs(Math.sin(i * 0.55 + f * 0.1)) * (0.35 + 0.65 * Math.abs(Math.sin(i * 0.21 + 1.3))));
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: SORA, alignItems: "center", justifyContent: "center" }}>
      <Grid /><Logo />
      <div style={{ textAlign: "center", opacity: e, transform: `translateY(${(1 - e) * 20}px)` }}>
                <div style={{ marginTop: 6, fontSize: 132, fontWeight: 600, color: BLUE, letterSpacing: -4, lineHeight: 1 }}>Vibe Agent</div>
        <div style={{ marginTop: 34, display: "flex", alignItems: "center", justifyContent: "center", gap: 3, height: 70 }}>{bars.map((h, i) => <span key={i} style={{ width: 7, height: h * e, borderRadius: 4, background: BLUE, opacity: 0.35 + 0.65 * Math.abs(Math.sin(i * 0.3)) }} />)}</div>
        <div style={{ marginTop: 30, display: "inline-flex", alignItems: "center", gap: 14, fontSize: 30, color: INK, fontFamily: INTER, fontWeight: 500, opacity: easeIn(f, 14, 34) }}>by <PlivoLogoSvg width={120} color={INK} /></div>
      </div>
    </AbsoluteFill>
  );
};

const STEPS: Step[] = [
  // Every product beat is a scene on the recreated console kit (src/cards/AgentBuilder.tsx + CSBeats.tsx):
  // consistent naming and state, crisp at any zoom. Durations are unchanged (narration-timed).
  { key: "prompt", dur: 202, cap: { pre: "Enter your ", kw: "prompt" }, chip: { n: "01", label: "Prompt" }, headline: <>Your prompt. <span style={{ color: BLUE }}>Vibe Agent takes it from there.</span></>, clips: [ { node: <PromptBeat />, dur: 202 } ], focus: { spot: { x: 92, y: 214, w: 1816, h: 812 }, z: 1.04, t0: 12, t1: 46, t2: 166, t3: 200 } },
  { key: "plan", mixed: true, dur: 398, cap: { pre: "Vibe Agent designs the ", kw: "call flow" }, chip: { n: "02", label: "Plan" }, headline: <>Vibe Agent designs the <span style={{ color: BLUE }}>call flow.</span></>,
    clips: [ { node: <Opener chip={{ n: "02", label: "Plan" }} title={<>Watch it <Hi>work.</Hi></>} />, dur: 51 }, { node: <PlanBeat />, dur: 347 } ],
    focus: { spot: { x: 92, y: 214, w: 1816, h: 812 }, z: 1.04, t0: 59, t1: 95, t2: 358, t3: 396 } },
  { key: "approve", dur: 191, cap: { pre: "Edit anytime, then ", kw: "approve" }, chip: { n: "03", label: "Refine & approve" }, headline: <>Want to change something? <span style={{ color: BLUE }}>Just say so.</span></>, clips: [ { node: <ApproveBeat />, dur: 191 } ], focus: { spot: { x: 92, y: 214, w: 1816, h: 812 }, z: 1.04, t0: 12, t1: 46, t2: 155, t3: 189 } },
  { key: "build", dur: 236, cap: { pre: "This one took ", kw: "about ten minutes" }, chip: { n: "04", label: "Build" }, headline: <><span style={{ color: BLUE }}>About ten minutes.</span> Node by node.</>,
    clips: [ { node: <BuildBeat />, dur: 236 } ],
    focus: { spot: { x: 92, y: 214, w: 1816, h: 812 }, z: 1.04, t0: 8, t1: 40, t2: 200, t3: 234 } },
  { key: "simulate", mixed: true, dur: 203, cap: { pre: "Runs ", kw: "simulations", post: " against goals" }, chip: { n: "05", label: "Simulations" }, headline: <>Runs simulations <span style={{ color: BLUE }}>against goals.</span></>,
    clips: [ { node: <Opener chip={{ n: "05", label: "Simulations" }} title={<>The <Hi>best part.</Hi></>} />, dur: 52 }, { node: <SimulateBeat />, dur: 151 } ],
    focus: { spot: { x: 100, y: 292, w: 1800, h: 690 }, z: 1.1, t0: 62, t1: 96, t2: 190, t3: 203 } },
  { key: "simdetail", dur: 290, cap: { pre: "Review a ", kw: "simulation" }, chip: { n: "05", label: "Simulations" }, layout: "float", extract: { x: 1348, y: 214, w: 560, h: 812 }, clips: [ { node: <SimDetailBeat />, dur: 290 } ],
    aside: { title: <>Simulation review.<br /><span style={{ color: BLUE }}>Caller pushes for pricing.</span></>, sub: "The full conversation, and how the agent handled it.", tag: "✓ Goal passed · Message ready for Sarah" } },
  { key: "voicetab", dur: 128, cap: { pre: "Open ", kw: "Voice Configuration" }, chip: { n: "06", label: "Voice" }, headline: <>Voice Configuration. <span style={{ color: BLUE }}>Any voice, any pace.</span></>, clips: [ { node: <VoiceTabBeat />, dur: 128 } ], focus: { spot: { x: 1186, y: 144, w: 190, h: 50 }, z: 1.12, t0: 25, t1: 59, t2: 98, t3: 126 } },
  { key: "voicepick", dur: 44, cap: { pre: "Pick a ", kw: "voice", post: " and pace" }, chip: { n: "06", label: "Voice" }, layout: "float", extract: { x: 92, y: 214, w: 1080, h: 824 }, clips: [ { node: <VoicePickBeat />, dur: 44 } ],
    aside: { title: <>Voice Configuration.<br /><span style={{ color: BLUE }}>Any voice, any pace.</span></>, sub: "Applies to every call." } },
  { key: "voicepicked", dur: 44, cap: { pre: "Pick a ", kw: "voice", post: " and pace" }, chip: { n: "06", label: "Voice" }, layout: "float", extract: { x: 92, y: 214, w: 1080, h: 800 }, clips: [ { node: <VoicePickedBeat />, dur: 44 } ],
    aside: { title: <>Voice Configuration.<br /><span style={{ color: BLUE }}>Any voice, any pace.</span></>, sub: "Applies to every call." } },
  { key: "publish", dur: 134, cap: { kw: "Publish", pre: "", post: " it" }, chip: { n: "07", label: "Publish" }, headline: <>Hit Publish. <span style={{ color: BLUE }}>It's live.</span></>, clips: [ { node: <PublishBeat clickAt={57} />, dur: 134 } ], focus: { spot: { x: 90, y: 60, w: 1820, h: 132 }, z: 1.04, t0: 8, t1: 40, t2: 104, t3: 132 } },
  { key: "connect", dur: 104, cap: { pre: "Connect a ", kw: "phone number" }, chip: { n: "08", label: "Phone number" }, headline: <>Connect a <span style={{ color: BLUE }}>phone number.</span></>,
    clips: [ { node: <NumbersListBeat />, dur: 104 } ] },
  { key: "connectmodal", dur: 83, cap: { pre: "Connect a ", kw: "phone number" }, chip: { n: "08", label: "Phone number" }, layout: "float", extract: { x: 1170, y: 16, w: 730, h: 1048 }, clips: [ { node: <ConnectModalBeat pickAt={48} />, dur: 83 } ],
    aside: { title: <>Attach your agent<br />to the <span style={{ color: BLUE }}>number.</span></>, sub: "Choose the agent, save. Calls ring through.", tag: "+1 806 209 0453 → Call Scheduling Agent" } },
  { key: "buddy", dur: 243, cap: { pre: "Ask ", kw: "Buddy" }, chip: { n: "09", label: "Buddy" }, layout: "float", extract: { x: 1360, y: 0, w: 560, h: 1080 }, clips: [ { node: <BuddyBeat sentAt={150} answerAt={186} />, dur: 243 } ],
    aside: { title: <>Stuck? <span style={{ color: BLUE }}>Ask Buddy.</span></>, sub: "Your AI copilot, inside the console." } },
];
const INTRO_DUR = 325; // hook; "From your Plivo home" starts 10.83s (whisper word timestamps on narr-v7.mp3)
const HOME_DUR = 70;
const AGENTS_DUR = 60;
const OUTRO_DUR = 317; // "And that's it…" at 91.83s; narration ends ~97.4s, card holds a beat

export const CSA_TOTAL_FRAMES =
  INTRO_DUR + HOME_DUR + AGENTS_DUR + STEPS.reduce((a, s) => a + s.dur, 0) + OUTRO_DUR;

// ---- Shared cream backdrop (grid + bracket corners + logo) ---------------
const Bracket: React.FC<{ pos: "tl" | "tr" | "bl" | "br" }> = ({ pos }) => {
  const s: React.CSSProperties = { position: "absolute", width: 34, height: 34, borderColor: "rgba(15,17,23,0.16)", borderStyle: "solid", borderWidth: 0 };
  if (pos === "tl") Object.assign(s, { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2 });
  if (pos === "tr") Object.assign(s, { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2 });
  if (pos === "bl") Object.assign(s, { bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2 });
  if (pos === "br") Object.assign(s, { bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2 });
  return <div style={s} />;
};
const Backdrop: React.FC<{ children?: React.ReactNode; logo?: boolean }> = ({ children, logo = false }) => (
  <AbsoluteFill style={{ background: CREAM_BG, fontFamily: `${INTER_FAMILY}, sans-serif` }}>
    <AbsoluteFill
      style={{
        backgroundImage: "radial-gradient(circle, rgba(15,17,23,0.05) 1px, transparent 1.4px)",
        backgroundSize: "30px 30px",
        WebkitMaskImage: "radial-gradient(120% 120% at 50% 30%, #000 60%, transparent 100%)",
        maskImage: "radial-gradient(120% 120% at 50% 30%, #000 60%, transparent 100%)",
      }}
    />
    <div style={{ position: "absolute", inset: 40, pointerEvents: "none" }}>
      <Bracket pos="tl" /><Bracket pos="tr" /><Bracket pos="bl" /><Bracket pos="br" />
    </div>
    {logo ? (
      <div style={{ position: "absolute", top: 52, left: 72 }}>
        <PlivoLogoSvg width={116} />
      </div>
    ) : null}
    {children}
  </AbsoluteFill>
);

// ---- Footage, fit to WIDTH so the WHOLE app is always visible ------------
// The app is wider than 16:9, so we fit it to the frame width (nothing cropped
// left/right — the full flow, the full Vibe panel, the whole screen show) with a
// thin margin top/bottom. Browser chrome is trimmed off the top; NO zoom.
export const FullVideo: React.FC<{ src: [number, number]; dur: number; file?: string; sound?: boolean; cropBottom?: number; geom?: { w: number; h: number; cropTop: number }; bg?: string }> = ({ src, dur, file = VIDEO, sound = false, cropBottom = DEFAULT_CROP_BOTTOM, geom, bg = "#ffffff" }) => {
  const [a, b] = src;
  const rate = ((b - a) * FPS) / dur;
  const SW = geom?.w ?? 1728, SH = geom?.h ?? 1080, CT = geom?.cropTop ?? CROP_TOP;
  const scale = 1920 / SW; // fit width — entire app width visible
  const visH = SH - CT - cropBottom; // source rows shown
  const dispVisH = Math.round(visH * scale);
  const containerTop = Math.round((1080 - dispVisH) / 2);
  const vidH = Math.round(SH * scale);
  const vTop = -Math.round(CT * scale);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: bg }}>
      <div style={{ position: "absolute", top: containerTop, left: 0, width: 1920, height: dispVisH, overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile(file)}
          trimBefore={Math.round(a * FPS)}
          // no trimAfter: the enclosing Sequence bounds the clip. With playbackRate < 1, trimAfter
          // cut the clip at the SOURCE length (not the stretched length) and left a blank tail.
          playbackRate={rate}
          muted={!sound}
          volume={sound ? 1 : 0}
          style={{ width: 1920, height: vidH, marginTop: vTop, display: "block" }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ---- Caption pill (bottom-centre, one blue keyword) ----------------------
export const StepCaption: React.FC<{ cap: Cap }> = ({ cap }) => {
  const frame = useCurrentFrame();
  const e = interpolate(frame, [8, 20], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", bottom: 54, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: e, transform: `translateY(${(1 - e) * 10}px)`, pointerEvents: "none" }}>
      <div style={{ background: "rgba(255,255,255,0.96)", border: "1px solid #e7e4dd", borderRadius: 14, padding: "14px 28px", boxShadow: "0 12px 34px rgba(20,20,30,0.22)", fontSize: 33, fontWeight: 700, letterSpacing: -0.5, color: "#111", fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif` }}>
        {cap.pre}
        <span style={{ color: BLUE }}>{cap.kw}</span>
        {cap.post}
      </div>
    </div>
  );
};

// Spotlight solver: the largest zoom (≤ f.z) that keeps the whole rect in frame, the transform origin
// that centres the rect as much as possible without ever cropping it, and the 0..1 envelope for the dim.
export const solveFocus = (frame: number, f?: Focus) => {
  if (!f) return { scale: 1, origin: "50% 50%", prog: 0 };
  const { x, y, w, h } = f.spot;
  const z = Math.max(1.001, Math.min(f.z, (0.97 * 1920) / w, (0.97 * 1080) / h));
  const up = interpolate(frame, [f.t0, f.t1], [1, z], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const down = interpolate(frame, [f.t2, f.t3], [z, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = Math.min(up, down);
  // origin o maps p → o + (p - o)·z; keep [x, x+w] inside [0, 1920] and [y, y+h] inside [0, 1080]
  const solve = (a: number, len: number, frame: number) => {
    const lo = ((a + len) * z - frame) / (z - 1); // rect's far edge stays inside the frame
    const hi = (a * z) / (z - 1); // rect's near edge stays inside the frame
    const want = ((a + len / 2) * z - frame / 2) / (z - 1); // centre the rect if possible
    // the origin must also stay within the frame, otherwise the zoomed video slides off one edge
    // and leaves a blank strip (origin in [0, frame] ⇒ the scaled frame always covers the viewport)
    return Math.max(Math.max(lo, 0), Math.min(Math.min(hi, frame), want));
  };
  const ox = solve(x, w, 1920);
  const oy = solve(y, h, 1080);
  return { scale, origin: `${ox}px ${oy}px`, prog: (scale - 1) / (z - 1) };
};

export const StepScene: React.FC<{ step: Step; noCaption?: boolean; dimOnly?: boolean }> = ({ step, noCaption, dimOnly }) => {
  const frame = useCurrentFrame();
  const fx = step.focusSeq ? step.focusSeq.find((f) => frame >= f.t0 && frame <= f.t3) : step.focus;
  const solved = solveFocus(frame, fx);
  // inside the browser frame a content zoom pushes the window edges out of view (cut headers, half a back button),
  // so frame layouts keep the window whole and use the dim + outline only
  const z = dimOnly ? 1 : solved.scale; const origin = solved.origin; const prog = solved.prog;
  return (
    <AbsoluteFill>
      {/* footage + composited interactions zoom together so overlays stay pinned to the UI; the caption does not */}
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: origin, overflow: "hidden" }}>
        {step.clips ? (
          step.clips.reduce<{ at: number; nodes: React.ReactNode[] }>((acc, c, i) => {
            acc.nodes.push(
              <Sequence key={i} from={acc.at} durationInFrames={c.dur} layout="none">
                {c.node ? <AbsoluteFill>{c.node}</AbsoluteFill> : <FullVideo src={c.src!} dur={c.dur} file={step.file} sound={step.sound} cropBottom={step.cropBottom} geom={step.geom} bg={step.bg} />}
              </Sequence>,
            );
            acc.at += c.dur;
            return acc;
          }, { at: 0, nodes: [] }).nodes
        ) : (
          <FullVideo src={step.src!} dur={step.dur} file={step.file} sound={step.sound} cropBottom={step.cropBottom} geom={step.geom} bg={step.bg} />
        )}
        {step.overlay ?? null}
        {/* spotlight: the target stays fully visible, the rest of the screen recedes */}
        {fx && prog > 0 ? (
          <div
            style={{
              position: "absolute",
              left: fx.spot.x,
              top: fx.spot.y,
              width: fx.spot.w,
              height: fx.spot.h,
              borderRadius: 14,
              boxShadow: `0 0 0 4000px rgba(15,17,23,${0.5 * prog})`,
              outline: `2px solid rgba(50,61,254,${0.55 * prog})`,
              outlineOffset: 2,
              pointerEvents: "none",
            }}
          />
        ) : null}
      </AbsoluteFill>
      {noCaption ? null : <StepCaption cap={step.cap} />}
    </AbsoluteFill>
  );
};

// ---- Outro CTA -----------------------------------------------------------
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const enter = interpolate(frame, [6, 26], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exit = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(frame, [6, 28], [0.94, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Backdrop logo>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: Math.min(enter, exit), transform: `scale(${scale})`, textAlign: "center", fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif` }}>
          <div style={{ fontSize: 40, color: "#67686f", fontWeight: 500, marginBottom: 18 }}>Your AI receptionist is live.</div>
          <div style={{ fontSize: 68, fontWeight: 600, color: "#0f1117", letterSpacing: -1.6 }}>
            Build <span style={{ color: BLUE }}>yours</span> today
          </div>
          <div style={{ marginTop: 30, display: "inline-block", background: "#0f1117", color: "#fff", fontSize: 24, fontWeight: 600, padding: "15px 38px", borderRadius: 12 }}>
            cx.plivo.com
          </div>
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};

// ---- Glide-in intro (title + points reveal as Sarah speaks) --------------
const RevealLine: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const frame = useCurrentFrame();
  const e = interpolate(frame, [at, at + 18], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ ...style, opacity: e, transform: `translateY(${(1 - e) * 22}px)` }}>{children}</div>;
};
const IntroDot: React.FC = () => <span style={{ width: 11, height: 11, borderRadius: 999, background: BLUE, flexShrink: 0 }} />;
// Reveal times aligned to the hook narration phrases (VO starts at intro frame 10):
// "Missed calls mean missed customers" (~10) · "build an AI receptionist" (~88)
// · "answers every call, takes a message" (~156) · "with Vibe Agent, by Plivo" (~252).
const KineticIntro: React.FC = () => (
  <Backdrop logo>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 1440, padding: "0 60px", fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif` }}>
        <RevealLine at={12} style={{ fontSize: 40, fontWeight: 500, color: "#67686f" }}>
          Missed calls mean <span style={{ color: "#0f1117", fontWeight: 700 }}>missed customers.</span>
        </RevealLine>
        <RevealLine at={94} style={{ marginTop: 30, fontSize: 88, fontWeight: 400, letterSpacing: "-0.035em", color: "#0f1117", lineHeight: 1.05 }}>
          Build an <span style={{ color: BLUE }}>AI Receptionist</span>
        </RevealLine>
        <RevealLine at={161} style={{ marginTop: 28, fontSize: 35, fontWeight: 500, color: "#3a3b42" }}>
          Answers every call. Takes a message.
        </RevealLine>
        <RevealLine at={249} style={{ marginTop: 18, fontSize: 33, color: "#67686f" }}>
          with <span style={{ color: BLUE, fontWeight: 700 }}>Vibe Agent</span>, by Plivo
        </RevealLine>
      </div>
    </AbsoluteFill>
  </Backdrop>
);

export const musicVol = (frame: number, total: number, duck?: { from: number; to: number }) => {
  const fade = MUSIC.fadeFrames;
  let bed = MUSIC.bedVolume * 0.28;
  if (duck) {
    // Dip the bed low under the real call audio, ramping in/out.
    bed *= interpolate(frame, [duck.from - 14, duck.from + 16, duck.to - 20, duck.to + 12], [1, 0.14, 0.14, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }
  if (frame < fade) return (frame / fade) * bed;
  if (frame > total - fade) return ((total - frame) / fade) * bed;
  return bed;
};

export const CallSchedulingAgent: React.FC = () => {
  const total = CSA_TOTAL_FRAMES;
  // Recreated opening screens sit between the intro and the footage steps.
  const homeFrom = INTRO_DUR;
  const agentsFrom = homeFrom + HOME_DUR;
  // Cumulative starts for the footage steps (after the recreated opening).
  let acc = agentsFrom + AGENTS_DUR;
  const placed = STEPS.map((s) => {
    const from = acc;
    acc += s.dur;
    return { s, from };
  });
  const outroFrom = acc;
  return (
    <AbsoluteFill style={{ backgroundColor: "#f6f5f3" }}>
      <Audio src={staticFile(MUSIC.src)} loop volume={(f) => musicVol(f, total)} />
      {/* ONE continuous narration under the whole video (smooth, gap-free cadence) */}
      <Audio src={staticFile("vo/call-scheduling/narr-v7.mp3")} />

      {/* Hook: three beats, timed to the narration */}
      <Sequence from={0} durationInFrames={68} layout="none"><IntroMissed /></Sequence>
      <Sequence from={68} durationInFrames={181} layout="none"><IntroBuild answersAt={93} takesAt={142} /></Sequence>
      <Sequence from={249} durationInFrames={76} layout="none"><IntroVibe /></Sequence>

      {/* Recreated opening in the floating frame: Home → AI Agents (one agent) */}
      <Sequence from={homeFrom} durationInFrames={HOME_DUR + AGENTS_DUR} layout="none">
        <FrameLayout chip={{ n: "01", label: "Create an agent" }} headline={<>Open AI Agents. <span style={{ color: BLUE }}>Create a new agent.</span></>}>
          <Sequence from={0} durationInFrames={HOME_DUR} layout="none"><AbsoluteFill><HomePage /></AbsoluteFill></Sequence>
          <Sequence from={HOME_DUR} durationInFrames={AGENTS_DUR} layout="none"><AbsoluteFill><AgentsPage createCursorFrame={30} /></AbsoluteFill></Sequence>
        </FrameLayout>
      </Sequence>

      {/* Steps: node-only clips (openers / scenario list / recreated pages) render raw; others go into a layout */}
      {placed.map(({ s, from }) => (
        <Sequence key={s.key} from={from} durationInFrames={s.dur} layout="none">
          {s.layout === "float" && s.extract ? (
            <FloatLayout chip={s.chip} rect={s.extract} aside={s.aside} still={s.key === "voicepicked"}><StepScene step={s} noCaption /></FloatLayout>
          ) : s.mixed ? (
            <MixedClips step={s} />
          ) : (
            <FrameLayout chip={s.chip} headline={s.headline}><StepScene step={s} noCaption dimOnly /></FrameLayout>
          )}
        </Sequence>
      ))}

      {/* Outro: recap cards → incoming call → logo + waveform */}
      <Sequence from={outroFrom} durationInFrames={89} layout="none"><RecapCards /></Sequence>
      <Sequence from={outroFrom + 89} durationInFrames={61} layout="none"><PhoneBeat /></Sequence>
      <Sequence from={outroFrom + 150} durationInFrames={OUTRO_DUR - 150} layout="none"><LogoOutro /></Sequence>
    </AbsoluteFill>
  );
};
