import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "./fonts";
import { MUSIC } from "./promoConfig";
import type { Motion } from "./StageClip";
import { TightStageClip } from "./TightStageClip";
import { TightCaptions, type Caption } from "./TightCaption";
import { NewConsoleShell, PageHeader, DarkButton, PURPLE } from "./cards/NewConsoleShell";
import { Ico } from "./cards/consoleIcons";
import {
  FadeIn,
  SubScreens,
  ClickPulse,
  AskBuddyScreen,
  OutroCard,
  BuyNumberDrawer,
  PhoneNumbersScreen,
} from "./OnboardingVoiceAgents";

// ============================================================================
// OnboardingVoiceApi — "what next" onboarding for the Voice API (+ audio
// streaming). Same recipe: exact code recreations of the real console screens,
// cream stage tour, Sarah VO + captions + click pulses. Setup only, ~55s.
// ============================================================================

const INK = "#1f2430";
const SUB = "#6b7280";
const HAIR = "#ececef";
const EB = "#e6e7ea";
const FONT = `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif`;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const LEAD = 10;
const DUR = {
  intro: 165, //  4.2s VO
  create: 640, // 19.9s VO — Create Application (Answer/Hangup URLs)
  streaming: 610, // 19.0s VO — how real-time audio streaming works (diagram)
  number: 285, //  8.1s VO — point a number at the app
  buddy: 405, // 12.1s VO — Ask Buddy (XML / streaming)
  close: 150, //  3.7s VO
} as const;
const ORDER = ["intro", "create", "streaming", "number", "buddy", "close"] as const;
const BEAT = (() => {
  const out = {} as Record<(typeof ORDER)[number], { from: number; dur: number }>;
  let acc = 0;
  for (const k of ORDER) { out[k] = { from: acc, dur: DUR[k] }; acc += DUR[k]; }
  return out;
})();
export const ONBOARDING_VOICEAPI_FRAMES = Object.values(DUR).reduce((a, b) => a + b, 0);
const M_STATIC: Motion = { keyframes: [{ at: 0, x: 0.5, y: 0.5, scale: 1.0 }] };

const VO: { beat: keyof typeof DUR; src: string }[] = [
  { beat: "intro", src: "vo/onboarding-voice-api/01-intro.mp3" },
  { beat: "create", src: "vo/onboarding-voice-api/02-create.mp3" },
  { beat: "streaming", src: "vo/onboarding-voice-api/06-streaming.mp3" },
  { beat: "number", src: "vo/onboarding-voice-api/03-number.mp3" },
  { beat: "buddy", src: "vo/onboarding-voice-api/04-buddy.mp3" },
  { beat: "close", src: "vo/onboarding-voice-api/05-close.mp3" },
];
const musicVol = (frame: number) => {
  const fade = MUSIC.fadeFrames;
  if (frame < fade) return (frame / fade) * MUSIC.bedVolume;
  const out = ONBOARDING_VOICEAPI_FRAMES - fade;
  if (frame > out) return ((ONBOARDING_VOICEAPI_FRAMES - frame) / fade) * MUSIC.bedVolume;
  return MUSIC.bedVolume;
};
const Beat: React.FC<{ k: keyof typeof DUR; stage?: boolean; children: React.ReactNode }> = ({ k, stage = true, children }) => (
  <Sequence from={BEAT[k].from} durationInFrames={BEAT[k].dur} layout="none">
    {stage ? <TightStageClip motion={M_STATIC}>{children}</TightStageClip> : children}
  </Sequence>
);

// ==========================================================================
// Applications list (reference: real Applications frame)
// ==========================================================================
const APP_ROWS: [string, string, string, string, string][] = [
  ["Default", "Default Number App", "sip:10249802582335433@app.plivo.com", "3 Numbers", "1 Endpoint"],
  ["voice-app", "", "sip:97207683568978235@app.plivo.com", "1 Number", "0 Endpoints"],
];
export const ApplicationsScreen: React.FC<{ behind?: boolean; cursorAt?: number }> = ({ behind, cursorAt }) => (
  <div style={{ height: "100%", overflow: "hidden", filter: behind ? "blur(0.3px)" : undefined }}>
    <PageHeader title="Applications" subtitle="Manage your applications for call routing and messaging" action={
      <div style={{ position: "relative", display: "inline-block" }}>
        <DarkButton><span style={{ display: "inline-flex", marginRight: 6 }}><Ico name="plus" size={14} /></span>Create Application</DarkButton>
        {cursorAt != null ? <ClickPulse at={cursorAt} /> : null}
      </div>
    } />
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 26px 0" }}>
      <div style={{ height: 36, width: 320, display: "inline-flex", alignItems: "center", gap: 7, padding: "0 12px", borderRadius: 8, border: `1px solid ${HAIR}`, fontSize: 13, color: "#9aa0ac" }}><Ico name="search" size={14} />Search applications...</div>
      <div style={{ height: 36, width: 40, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: `1px solid ${HAIR}`, color: "#9aa0ac" }}><Ico name="filter" size={15} /></div>
    </div>
    <div style={{ padding: "16px 26px 0" }}>
      <div style={{ display: "flex", padding: "0 6px 12px", fontSize: 12, color: "#9aa0ac", fontWeight: 600, borderBottom: `1px solid ${HAIR}` }}>
        <span style={{ flex: 1.4 }}>Application Name</span><span style={{ flex: 1.6 }}>SIP URI</span><span style={{ width: 140 }}>Linked Numbers</span><span style={{ width: 140 }}>Linked Endpoints</span>
      </div>
      {APP_ROWS.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", padding: "16px 6px", borderBottom: `1px solid ${HAIR}`, fontSize: 13.5 }}>
          <div style={{ flex: 1.4, display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontWeight: 600, color: INK }}>{r[0]}</span>{r[1] ? <span style={{ fontSize: 11.5, color: SUB, background: "#f1f2f4", borderRadius: 6, padding: "3px 9px" }}>{r[1]}</span> : null}</div>
          <div style={{ flex: 1.6, color: SUB, fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12.5 }}>{r[2]}</div>
          <div style={{ width: 140, color: SUB }}>{r[3]}</div>
          <div style={{ width: 140, color: SUB }}>{r[4]}</div>
        </div>
      ))}
    </div>
  </div>
);

// ==========================================================================
// Create Application drawer (reference: real Create Application frame)
// ==========================================================================
const UrlRow: React.FC<{ label: string; value?: string; ph: string }> = ({ label, value, ph }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 12.5, color: SUB, marginBottom: 6, fontWeight: 500 }}>{label}</div>
    <div style={{ display: "flex", gap: 8 }}>
      <div style={{ width: 92, height: 40, border: `1px solid ${HAIR}`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 11px", fontSize: 13.5, color: INK }}>POST <span style={{ color: "#b8bcc6" }}><Ico name="chevron" size={13} /></span></div>
      <div style={{ flex: 1, height: 40, border: `1px solid ${HAIR}`, borderRadius: 9, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 13.5, color: value ? INK : "#b0b4bd" }}>{value || ph}</div>
    </div>
  </div>
);
const Check: React.FC<{ label: string; on?: boolean }> = ({ label, on }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: INK }}>
    <span style={{ width: 17, height: 17, borderRadius: 5, border: `1.5px solid ${on ? PURPLE : "#c2c6cf"}`, background: on ? PURPLE : "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11 }}>{on ? "✓" : ""}</span>{label}
  </div>
);
const Section: React.FC<{ title: string; open?: boolean }> = ({ title, open }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 700, color: INK, margin: "6px 0 14px" }}>{title}<span style={{ color: "#b8bcc6", transform: open ? "rotate(180deg)" : "none", display: "inline-flex" }}><Ico name="chevron" size={14} /></span></div>
);
const CreateApplicationDrawer: React.FC<{ filled?: boolean; cursorAt?: number }> = ({ filled, cursorAt }) => (
  <div style={{ height: "100%", position: "relative" }}>
    <ApplicationsScreen behind />
    <div style={{ position: "absolute", inset: 0, background: "rgba(22,20,34,0.18)" }} />
    <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 600, background: "#fff", boxShadow: "-24px 0 60px rgba(20,18,40,0.20)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "18px 24px", borderBottom: `1px solid ${HAIR}` }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: INK, fontFamily: FONT }}>Create Application</div><span style={{ flex: 1 }} /><span style={{ color: "#9aa0ac" }}>✕</span>
      </div>
      <div style={{ flex: 1, overflow: "hidden", padding: "18px 24px" }}>
        <div style={{ fontSize: 12.5, color: SUB, marginBottom: 6, fontWeight: 500 }}>Application Name</div>
        <div style={{ height: 40, border: `1px solid ${HAIR}`, borderRadius: 9, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 14, color: INK, marginBottom: 14 }}>{filled ? "voice-app" : "Application-3b48a7"}</div>
        <div style={{ marginBottom: 16 }}><Check label="Default Number Application" /></div>
        <Section title="Voice" open />
        <UrlRow label="Answer URL" value={filled ? "https://your-server.com/answer" : undefined} ph="https://example.com/answer" />
        <UrlRow label="Hangup URL" value={filled ? "https://your-server.com/hangup" : undefined} ph="https://example.com/hangup" />
        <UrlRow label="Fallback Answer URL" ph="https://example.com/fallback" />
        <div style={{ display: "flex", gap: 40, marginTop: 4 }}><Check label="Public URI" /><Check label="Default Endpoint Application" /></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "14px 24px", borderTop: `1px solid ${HAIR}` }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <DarkButton purple={!!filled}>Create Application</DarkButton>
          {cursorAt != null ? <ClickPulse at={cursorAt} /> : null}
        </div>
      </div>
    </div>
  </div>
);

// ==========================================================================
// Audio streaming diagram (no console screen exists — it's a protocol flow)
// ==========================================================================
const rise = (frame: number, at: number) => ({
  opacity: interpolate(frame, [at, at + 12], [0, 1], clamp),
  transform: `translateY(${interpolate(frame, [at, at + 12], [10, 0], clamp)}px)`,
});
const StreamBox: React.FC<{ title: string; sub?: string; accent?: boolean; at: number; frame: number }> = ({ title, sub, accent, at, frame }) => (
  <div style={{ minWidth: 150, padding: "16px 20px", borderRadius: 14, border: `1.5px solid ${accent ? PURPLE : "#e6e7ea"}`, background: accent ? "#fdf3ff" : "#fff", textAlign: "center", boxShadow: "0 2px 6px rgba(16,24,40,0.05)", ...rise(frame, at) }}>
    <div style={{ fontSize: 18, fontWeight: 700, color: INK, fontFamily: FONT }}>{title}</div>
    {sub ? <div style={{ fontSize: 12.5, color: SUB, marginTop: 4 }}>{sub}</div> : null}
  </div>
);
const Conn: React.FC<{ frame: number; label?: string; bi?: boolean; at: number }> = ({ frame, label, bi, at }) => (
  <div style={{ position: "relative", flex: "0 0 96px", alignSelf: "center", margin: "0 6px", ...rise(frame, at) }}>
    {label ? <div style={{ position: "absolute", top: -26, left: "50%", transform: "translateX(-50%)", fontSize: 11.5, color: SUB, whiteSpace: "nowrap", background: "#fff", padding: "0 4px" }}>{label}</div> : null}
    <div style={{ position: "relative", height: 2, background: "#d6d8de" }}>
      <div style={{ position: "absolute", top: -3, left: `${(((frame % 42) / 42)) * 100}%`, width: 7, height: 7, borderRadius: "50%", background: PURPLE, boxShadow: `0 0 8px ${PURPLE}`, transform: "translateX(-50%)" }} />
      {bi ? <div style={{ position: "absolute", top: -3, left: `${(1 - ((frame % 42) / 42)) * 100}%`, width: 7, height: 7, borderRadius: "50%", background: "#16a34a", boxShadow: "0 0 8px #16a34a", transform: "translateX(-50%)" }} /> : null}
    </div>
  </div>
);
const StreamingDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: "100%", height: "100%", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, padding: "0 60px" }}>
      <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: PURPLE, ...rise(frame, 8) }}>Real-time audio streaming</div>
      <div style={{ fontSize: 34, fontWeight: 700, color: INK, letterSpacing: -0.8, marginTop: 14, marginBottom: 44, fontFamily: FONT, ...rise(frame, 16) }}>No extra screen. Your Answer URL opens a WebSocket.</div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <StreamBox title="Incoming Call" sub="to your number" at={26} frame={frame} />
        <Conn frame={frame} label="Answer URL" at={40} />
        <StreamBox title="Plivo" sub="streams live audio" at={52} frame={frame} />
        <Conn frame={frame} label="WebSocket" bi at={66} />
        <StreamBox title="Your Server" sub="Speech to Text · LLM · Text to Speech" accent at={80} frame={frame} />
      </div>
      <div style={{ fontSize: 16, color: SUB, marginTop: 44, maxWidth: 900, textAlign: "center", lineHeight: 1.5, ...rise(frame, 100) }}>
        Plivo streams the call to your server. Your AI stack, or a realtime model like OpenAI Realtime, processes the audio and streams it back to the caller, instantly.
      </div>
    </div>
  );
};

// ==========================================================================
// Captions + Ask Buddy answer
// ==========================================================================
const cap = (beat: keyof typeof DUR, start: number, end: number, pre: string, keyword: string, post = ""): Caption => ({ start: BEAT[beat].from + start, end: BEAT[beat].from + end, pre, keyword, post });
const CAPTIONS: Caption[] = [
  cap("intro", 14, 158, "Control your first ", "call", "."),
  cap("create", 14, 122, "In Applications, click ", "Create Application", "."),
  cap("create", 132, 372, "Add your ", "Answer URL", ", your call-control endpoint."),
  cap("create", 382, 632, "Stream audio, or return ", "Plivo XML", ", then Create."),
  cap("streaming", 14, 200, "No screen: your ", "Answer URL", " opens a WebSocket."),
  cap("streaming", 210, 400, "Plivo streams the ", "live call audio", " to your server."),
  cap("streaming", 410, 600, "Your AI stack streams ", "audio back", ", instantly."),
  cap("number", 14, 138, "Buy a number in ", "Phone Numbers", "."),
  cap("number", 148, 278, "Set the type to ", "Application", ", then Finish."),
  cap("buddy", 14, 150, "Stuck? Ask ", "Buddy", "."),
  cap("buddy", 160, 398, "From XML to ", "audio streaming", "."),
  cap("close", 12, 145, "Your voice app is ", "live", "."),
];
const VOICE_BUDDY_A = (
  <>
    <div style={{ fontSize: 13.5, color: INK, lineHeight: 1.55, marginTop: 12 }}>
      Return <b>Plivo XML</b> from your Answer URL. To stream audio, include a <b>Stream</b> element pointing to your WebSocket, and Plivo streams the call both ways in real time.
    </div>
    <div style={{ fontSize: 13.5, color: INK, lineHeight: 1.55, marginTop: 10 }}>
      Want the audio-streaming quickstart and the XML reference?
    </div>
  </>
);

// ==========================================================================
// Root composition
// ==========================================================================
export const OnboardingVoiceApi: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#f6f5f3" }}>
    <Audio src={staticFile(MUSIC.src)} loop volume={(f) => musicVol(f) * 0.62} />

    <Beat k="intro"><FadeIn><NewConsoleShell activeNav="Applications"><ApplicationsScreen /></NewConsoleShell></FadeIn></Beat>
    <Beat k="create"><FadeIn><SubScreens screens={[
      { at: 0, node: <NewConsoleShell activeNav="Applications"><ApplicationsScreen cursorAt={70} /></NewConsoleShell> },
      { at: 130, node: <NewConsoleShell activeNav="Applications"><CreateApplicationDrawer /></NewConsoleShell> },
      { at: 380, node: <NewConsoleShell activeNav="Applications"><CreateApplicationDrawer filled cursorAt={560} /></NewConsoleShell> },
    ]} /></FadeIn></Beat>
    <Beat k="streaming"><FadeIn><StreamingDiagram /></FadeIn></Beat>
    <Beat k="number"><FadeIn><SubScreens screens={[
      { at: 0, node: <NewConsoleShell activeNav="Phone Numbers"><PhoneNumbersScreen cursorAt={55} /></NewConsoleShell> },
      { at: 95, node: <NewConsoleShell activeNav="Phone Numbers"><BuyNumberDrawer step="search" cursorAt={155} /></NewConsoleShell> },
      { at: 190, node: <NewConsoleShell activeNav="Phone Numbers"><BuyNumberDrawer step="configure" appType="Application" cursorAt={250} /></NewConsoleShell> },
    ]} /></FadeIn></Beat>
    <Beat k="buddy"><FadeIn><AskBuddyScreen clickAt={55} answerAt={110} question="How do I stream call audio?" answer={VOICE_BUDDY_A} /></FadeIn></Beat>
    <Beat k="close" stage={false}><OutroCard sub="Your voice app is ready to take calls." /></Beat>

    <TightCaptions captions={CAPTIONS} />
    {VO.map((v) => (
      <Sequence key={v.beat} from={BEAT[v.beat].from + LEAD} durationInFrames={DUR[v.beat]} layout="none">
        <Audio src={staticFile(v.src)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
