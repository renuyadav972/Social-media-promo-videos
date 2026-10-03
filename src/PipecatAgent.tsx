import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { MONO, INTER, BLUE, INK, CREAM, SORA, Grid, Chip, Logo } from "./StyleFrames";
import { Step, StepScene, LogoOutro, easeIn } from "./CallSchedulingAgent";
import { NewConsoleShell } from "./cards/NewConsoleShell";
import { PhoneNumbersScreen } from "./OnboardingVoiceAgents";
import { LogsPage } from "./ConsoleComparison";
import { CALL_ENV } from "./pipecatCallEnv";
import { HookPipecat } from "./Hooks";
import { PipeStage, PipeFrame, PipeSplit, PipeOpener, PipeTerm, PipePhone, PipeRecap, Pk, PP, PP_INK, PP_DIM, PP_LINE } from "./PipecatLight";
import { ApplicationsPage, CreateApplicationDrawer, ConfigureNumberApp, PipecatDashboard, CallInsightsPage } from "./cards/PipecatKit";

// ============================================================================
// PipecatAgent — "Give your Pipecat bot a phone number", on the light PIPELINE stage
// (PipecatLight.tsx). Every product screen is recreated (cards/PipecatKit.tsx).
// Narration public/vo/pipecat-narr-v3f.mp3 (voice tnSpp4vdxKPjI9w0GnoV, one take) is
// split around the real test call (public/vo/pipecat-call.mp3). No music.
// Anchors: scratchpad/pc_T_v3.json (faster-whisper word matching on the take).
// ============================================================================
const T = { hook2: 117, scaffold: 283, pick: 368, shape: 574, deploy: 647, ws: 787, keep: 927, stream: 973, neat: 1037, answer: 1077, thatsit: 1268, wire: 1299, app: 1452, name: 1544, get: 1698, create: 1750, number: 1855, type: 1928, routes: 2060, handoff: 2132, goon: 2170, watch: 2204, session: 2243, logs: 2383, openc: 2445, there: 2498, close: 2656, how: 2761, build: 2834, end: 2857 };
const CALL_DUR = CALL_ENV.length; // 635f = 21.2s
const SHIFT = 0; // no test call in this cut (the LiveKit video carries the real call)
const A = (k: keyof typeof T) => T[k] + SHIFT;
export const PC_TOTAL_FRAMES = A("end") + 110;
const NUMBER = "+1 806 209 0453";

// ---- generic terminal beat ---------------------------------------------------
export type TLine = { at: number; text: React.ReactNode; typed?: string; color?: string; pad?: number };
type TLine2 = { at: number; text?: React.ReactNode; typed?: string; color?: string };
export const Term: React.FC<{ chip: { n: string; label: string }; headline: React.ReactNode; title: string; lines: TLine[] }> = ({ chip, headline, title, lines }) => {
  const f = useCurrentFrame();
  const type = (s: string, from: number, cps = 1.5) => s.slice(0, Math.max(0, Math.floor((f - from) * cps)));
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: SORA }}>
      <Grid /><Chip n={chip.n} label={chip.label} /><Logo />
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontSize: 54, fontWeight: 600, color: INK, letterSpacing: -1.6, opacity: easeIn(f, 0, 20) }}>{headline}</div>
      <div style={{ position: "absolute", top: 250, left: 260, width: 1400, background: "#0f1117", borderRadius: 22, boxShadow: "0 40px 90px rgba(15,17,23,0.3)", overflow: "hidden", opacity: easeIn(f, 6, 26) }}>
        <div style={{ height: 44, display: "flex", alignItems: "center", gap: 8, padding: "0 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />)}
          <span style={{ marginLeft: 14, fontFamily: MONO, fontSize: 14, color: "rgba(255,255,255,0.45)" }}>{title}</span>
        </div>
        <div style={{ padding: "30px 34px 34px", fontFamily: MONO, fontSize: 24, lineHeight: 1.75, minHeight: 300 }}>
          {lines.map((l, i) => (f >= l.at ? (
            <div key={i} style={{ color: l.color ?? "#e6e8f0", paddingLeft: l.pad ?? 0, whiteSpace: "pre", opacity: l.typed ? 1 : easeIn(f, l.at, l.at + 8) }}>
              {l.typed ? <><span style={{ color: "#8ea2ff" }}>$ </span>{type(l.typed, l.at)}</> : l.text}
            </div>) : null))}
        </div>
      </div>
    </AbsoluteFill>
  );
};


// (kept for GptLiveAgent.tsx, which imports Term/TLine from here)

// ---- code/terminal lines -----------------------------------------------------
const Lines: React.FC<{ lines: TLine2[]; size?: number }> = ({ lines, size = 27 }) => {
  const f = useCurrentFrame(); const type = (s: string, from: number, cps = 1.5) => s.slice(0, Math.max(0, Math.floor((f - from) * cps)));
  return <div style={{ padding: "28px 34px 32px", fontFamily: MONO, fontSize: size, lineHeight: 1.8, minHeight: 360 }}>{lines.map((l, i) => (f >= l.at ? <div key={i} style={{ color: l.color ?? "#e6e8f0", whiteSpace: "pre", opacity: l.typed ? 1 : easeIn(f, l.at, l.at + 8) }}>{l.typed ? <><span style={{ color: PP }}>$ </span>{type(l.typed, l.at)}</> : l.text}</div> : null))}</div>;
};
const K = (t: string) => <span style={{ color: "#e2a6ff" }}>{t}</span>; const V = (t: string) => <span style={{ color: "#4ade80" }}>{t}</span>;

// ---- the call: real audio under a clean transcript card --------------------------
const CALL_LINES: [number, number, "AGENT" | "YOU", string][] = [[0.14, 4.24, "AGENT", "Hello, I am the Plivo voice assistant. How can I help you with Plivo today?"], [5.98, 11.32, "YOU", "Hi, I wanted to understand how I can send messages to the US?"], [11.32, 17.26, "AGENT", "Plivo's messaging API supports sending SMS to the US and Canada, using a ten-digit long code or a toll-free number."], [17.92, 19.44, "AGENT", "What kind of messages are you looking to send?"]];
const PipeCall: React.FC<{ startAt: number }> = ({ startAt }) => {
  const f = useCurrentFrame(); const t0 = f - startAt; const t = t0 / 30; const e = easeIn(f, 0, 22); const lvl = t0 >= 0 && t0 < CALL_DUR ? CALL_ENV[t0] : 0;
  const cur = CALL_LINES.findIndex(([a, b]) => t >= a && t < b + 0.4); const who = cur >= 0 ? CALL_LINES[cur][2] : null;
  const secs = Math.max(0, Math.floor(t)); const Wave: React.FC<{ on: boolean }> = ({ on }) => <div style={{ display: "flex", alignItems: "center", gap: 4, height: 44 }}>{Array.from({ length: 34 }, (_, i) => <span key={i} style={{ width: 5, height: on ? 4 + 36 * lvl * (0.35 + 0.65 * Math.abs(Math.sin(i * 0.8 + f * 0.3))) : 4, borderRadius: 3, background: on ? PP : "#2a2f3a" }} />)}</div>;
  return (
    <PipeStage chip="06 · TEST CALL" active={-1} done={4}>
      <div style={{ position: "absolute", top: 196, left: 120, fontSize: 42, fontWeight: 600, letterSpacing: -1.3, opacity: e }}>Let's <Pk>listen in.</Pk></div>
      <div style={{ position: "absolute", top: 280, left: 120, width: 1680, height: 720, borderRadius: 18, background: PP_INK, color: "#fff", padding: "34px 40px", fontFamily: INTER, opacity: e, transform: `translateY(${(1 - e) * 20}px)`, boxShadow: "0 30px 70px rgba(15,17,23,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ width: 62, height: 62, borderRadius: 31, background: "#22c55e", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>☎</span>
          <div><div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 18, fontWeight: 600 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: t0 >= 0 ? "#4ade80" : "#666" }} />{t0 >= 0 ? "Live" : "Connecting"}</div><div style={{ fontFamily: MONO, fontSize: 15, color: "rgba(255,255,255,0.6)" }}>00:{String(secs).padStart(2, "0")}</div></div>
          <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{NUMBER} → plivo-demo-bot · audio over WebSocket</span>
        </div>
        <div style={{ marginTop: 26, display: "flex", gap: 18 }}>{[["YOU", who === "YOU"], ["PIPECAT BOT", who === "AGENT"]].map(([k, on]) => <div key={String(k)} style={{ flex: 1, background: "#151923", border: "1px solid #232837", borderRadius: 14, padding: "16px 22px" }}><div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 3, color: on ? "#fff" : "#9aa3b8" }}>■ {k}</div><div style={{ marginTop: 12 }}><Wave on={Boolean(on)} /></div></div>)}</div>
        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 14 }}>
          {CALL_LINES.map(([a, b, w, txt], i) => { if (t < a - 0.1) return null; const n = Math.floor(Math.max(0, Math.min(1, (t - a) / (b - a))) * txt.length); return <div key={i} style={{ display: "flex", gap: 20, opacity: i < cur ? 0.6 : 1 }}><span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 2, color: w === "YOU" ? "#e6e8f0" : "#e2a6ff", width: 130, paddingTop: 6 }}>{w === "YOU" ? "YOU" : "PIPECAT BOT"}</span><span style={{ fontSize: 24, lineHeight: 1.4, color: w === "YOU" ? "#c9cdd8" : "#fff", maxWidth: 1400 }}>{txt.slice(0, n)}</span></div>; })}
        </div>
      </div>
    </PipeStage>
  );
};

// ---- kit beats (frames relative to each beat) ------------------------------------
const AppsBeat: React.FC<{ pulseAt: number }> = ({ pulseAt }) => <AbsoluteFill><ApplicationsPage pulseAt={pulseAt} /></AbsoluteFill>;
const AppFormBeat: React.FC<{ nameUntil: number; urlFrom: number; urlUntil: number; methodAt: number }> = ({ nameUntil, urlFrom, urlUntil, methodAt }) => {
  const f = useCurrentFrame(); const name = "Pipecat_Demo"; const url = "https://plivo-answer.example.com/answer.xml"; const n = Math.floor(easeIn(f, 6, nameUntil) * name.length); const u = Math.floor(easeIn(f, urlFrom, urlUntil) * url.length);
  return <AbsoluteFill><ApplicationsPage dim drawer={<CreateApplicationDrawer name={name.slice(0, n)} typingName={f < urlFrom} url={url.slice(0, u)} typingUrl={f >= urlFrom && f < methodAt} method={f >= methodAt + 20 ? "GET" : "POST"} methodOpen={f >= methodAt && f < methodAt + 20} />} /></AbsoluteFill>;
};
const AppCreatedBeat: React.FC = () => <AbsoluteFill><ApplicationsPage rows={[["Default", "sip:10249802582335433@app.plivo.com"], ["Pipecat_Demo", "sip:27789118063254460@app.plivo.com"]]} toast="Application created successfully" /></AbsoluteFill>;
const NumbersBeat: React.FC = () => <AbsoluteFill><NewConsoleShell activeNav="Phone Numbers" topBar="live"><PhoneNumbersScreen rows={[[NUMBER, "", "Texas, United States", "Application"]]} rowClickAt={36} /></NewConsoleShell></AbsoluteFill>;
const NumberModalBeat: React.FC<{ openAt: number; pickAt: number; saveAt: number }> = ({ openAt, pickAt, saveAt }) => { const f = useCurrentFrame(); return <AbsoluteFill><NewConsoleShell activeNav="Phone Numbers" topBar="live"><PhoneNumbersScreen rows={[[NUMBER, "", "Texas, United States", "Application"]]} /></NewConsoleShell><div style={{ position: "absolute", inset: 0, background: "rgba(15,17,23,0.32)" }} /><ConfigureNumberApp appOpen={f >= openAt && f < pickAt} picked={f >= pickAt ? "Pipecat_Demo" : undefined} saving={f >= saveAt} /></AbsoluteFill>; };
const SessionBeat: React.FC<{ liveAt: number }> = ({ liveAt }) => { const f = useCurrentFrame(); return <AbsoluteFill><PipecatDashboard sessions={f >= liveAt ? 1 : 0} /></AbsoluteFill>; };
const LogsBeat: React.FC = () => <AbsoluteFill><NewConsoleShell activeNav="Logs" topBar="live"><LogsPage /></NewConsoleShell></AbsoluteFill>;
const InsightsBeat: React.FC<{ revealFrom: number }> = ({ revealFrom }) => <AbsoluteFill><CallInsightsPage revealFrom={revealFrom} /></AbsoluteFill>;

type PStep = Step & { pchip: string; active: number; done: number; ptitle?: React.ReactNode; psub?: string; pbullets?: string[]; ptag?: string };
const STEPS: PStep[] = [
  { key: "app", pchip: "04 · APPLICATION", active: 2, done: 2, dur: T.name - T.app, cap: { pre: "", kw: "" }, headline: <>Applications: <Pk>create one.</Pk></>, clips: [ { node: <AppsBeat pulseAt={T.name - T.app - 24} />, dur: T.name - T.app } ] },
  { key: "appform", pchip: "04 · APPLICATION", active: 2, done: 2, dur: T.create - T.name, cap: { pre: "", kw: "" }, layout: "float", extract: { x: 1180, y: 0, w: 740, h: 1080 },
    clips: [ { node: <AppFormBeat nameUntil={40} urlFrom={60} urlUntil={T.get - T.name - 10} methodAt={T.get - T.name + 6} />, dur: T.create - T.name } ],
    ptitle: <>Create the <Pk>application.</Pk></>, pbullets: ["Name it", "Answer URL: the address serving your Stream XML", "Method: GET"], ptag: "GET → the address serving answer.xml" },
  { key: "appcreate", pchip: "04 · APPLICATION", active: 2, done: 2, dur: T.number - T.create, cap: { pre: "", kw: "" }, headline: <>Application <Pk>created.</Pk></>, clips: [ { node: <AppCreatedBeat />, dur: T.number - T.create } ], focus: { spot: { x: 1430, y: 84, w: 470, h: 92 }, z: 1.08, t0: 6, t1: 30, t2: T.number - T.create - 26, t3: T.number - T.create - 2 } },
  { key: "number", pchip: "05 · PHONE NUMBER", active: 3, done: 3, dur: T.type - T.number, cap: { pre: "", kw: "" }, headline: <>Phone Numbers: <Pk>pick your number.</Pk></>, clips: [ { node: <NumbersBeat />, dur: T.type - T.number } ] },
  { key: "numbermodal", pchip: "05 · PHONE NUMBER", active: 3, done: 3, dur: T.handoff - T.type, cap: { pre: "", kw: "" }, layout: "float", extract: { x: 1170, y: 16, w: 730, h: 1048 },
    clips: [ { node: <NumberModalBeat openAt={30} pickAt={80} saveAt={T.routes - T.type} />, dur: T.handoff - T.type } ],
    ptitle: <>Attach the application<br /><Pk>to the number.</Pk></>, pbullets: ["Type: Application", "Application: Pipecat_Demo", "Save. Every call now routes to the bot"], ptag: `${NUMBER} → Pipecat_Demo` },
];

export const PipecatAgent: React.FC = () => {
  let acc = T.app; const placed = STEPS.map((s) => { const from = acc; acc += s.dur; return { s, from }; });
  return (
    <AbsoluteFill style={{ backgroundColor: "#fbfbfc" }}>
      {/* narration, split around the real call */}
      <Audio src={staticFile("vo/pipecat-narr-v4.mp3")} />

      {/* hook (Hooks.tsx), cut to the words */}
      <Sequence from={0} durationInFrames={T.scaffold} layout="none"><HookPipecat t={{ bot: 17, great: 50, ready: 83, now: 117, number: 151, plivo: 167, pickup: 203, receptionist: 232, end: T.scaffold }} /></Sequence>

      {/* 01 scaffold · 02 deploy · 03 the Stream element */}
      <Sequence from={T.scaffold} durationInFrames={T.deploy - T.scaffold} layout="none">
        <PipeTerm chip="01 · SCAFFOLD" headline={<>Scaffold the bot. <Pk>Plivo as the transport.</Pk></>} title="my-plivo-bot — zsh" active={0} done={0}>
          <Lines lines={[{ at: 4, typed: "pipecat init my-plivo-bot --bot-type telephony \\" }, { at: T.pick - T.scaffold, text: <>    --transport <span style={{ color: PP }}>plivo</span> --stt deepgram_stt \</> }, { at: T.pick - T.scaffold + 26, text: <>    --llm google_gemini_llm --tts cartesia_tts</> }, { at: T.pick - T.scaffold + 70, text: <>✓ created my-plivo-bot  →  bot.py, Dockerfile, pcc-deploy.toml</>, color: "#4ade80" }, { at: T.shape - T.scaffold, text: <>edit bot.py to shape your bot  →  then deploy</>, color: "#9aa3b8" }]} />
        </PipeTerm>
      </Sequence>
      <Sequence from={T.deploy} durationInFrames={T.stream - T.deploy} layout="none">
        <PipeTerm chip="02 · DEPLOY" headline={<>Deploy to Pipecat Cloud. <Pk>One command.</Pk></>} title="plivo-demo-bot — pipecat cloud" active={0} done={0}>
          <Lines lines={[{ at: 4, typed: "pipecat cloud secrets set plivo-demo-secrets ..." }, { at: 46, typed: "pipecat cloud deploy" }, { at: 84, text: <>↳ building image  →  pushing  →  starting</>, color: "#9aa3b8" }, { at: T.ws - T.deploy - 28, text: <>✓ plivo-demo-bot is ready</>, color: "#4ade80" }, { at: T.ws - T.deploy, text: <>your bot's websocket:</>, color: "#9aa3b8" }, { at: T.ws - T.deploy + 10, text: <>wss://api.pipecat.daily.co/ws/plivo?serviceHost=plivo-demo-bot.your-workspace</>, color: "#e2a6ff" }, { at: T.keep - T.deploy + 30, text: <>keep it handy  →  Plivo streams the call here</>, color: "#9aa3b8" }]} />
        </PipeTerm>
      </Sequence>
      <Sequence from={T.stream} durationInFrames={T.wire - T.stream} layout="none">
        <PipeTerm chip="03 · AUDIO STREAMING" headline={<>Plivo Audio Streaming: your Answer URL returns <Pk>a Stream element.</Pk></>} title="answer.xml · your Answer URL returns this" active={1} done={1} top={290} width={1500} left={210}>
          <StreamLines captionAt={T.answer - T.stream + 30} doneAt={T.thatsit - T.stream} />
        </PipeTerm>
      </Sequence>
      <Sequence from={T.wire} durationInFrames={T.app - T.wire} layout="none"><PipeOpener chip="04 · CONNECT ON PLIVO" title={<>Wire it up <Pk>on Plivo.</Pk></>} steps={1} /></Sequence>

      {/* 04 application · 05 phone number, on the kit */}
      {placed.map(({ s, from }) => (
        <Sequence key={s.key} from={from} durationInFrames={s.dur} layout="none">
          {s.layout === "float" && s.extract ? (
            <PipeSplit chip={s.pchip} rect={s.extract} title={s.ptitle} sub={s.psub} bullets={s.pbullets} tag={s.ptag} active={s.active} done={s.done}><StepScene step={s} noCaption /></PipeSplit>
          ) : (
            <PipeFrame chip={s.pchip} headline={s.headline} active={s.active} done={s.done}><StepScene step={s} noCaption dimOnly /></PipeFrame>
          )}
        </Sequence>
      ))}

      {/* 06 the call */}
      <Sequence from={T.handoff} durationInFrames={T.watch - T.handoff} layout="none"><PipePhone title={<>That's the whole setup.<br /><Pk>Go on, call it.</Pk></>} sub="Ring the number from any phone." number={NUMBER} /></Sequence>
      <Sequence from={T.watch} durationInFrames={T.session - T.watch} layout="none"><PipeOpener chip="06 · TEST CALL" title={<>Watch the <Pk>counter.</Pk></>} /></Sequence>
      <Sequence from={T.session} durationInFrames={T.logs - T.session} layout="none"><PipeFrame chip="06 · TEST CALL" headline={<>One live session, <Pk>on Pipecat Cloud.</Pk></>} active={-1} done={4}><StepScene step={{ key: "session", dur: T.logs - T.session, cap: { pre: "", kw: "" }, clips: [{ node: <SessionBeat liveAt={40} />, dur: T.logs - T.session }], focus: { spot: { x: 60, y: 300, w: 900, h: 160 }, z: 1.1, t0: 30, t1: 60, t2: T.logs - T.session - 26, t3: T.logs - T.session - 2 } }} noCaption dimOnly /></PipeFrame></Sequence>

      {/* 07 logs → 08 recap → logo */}
      <Sequence from={A("logs")} durationInFrames={A("there") - A("logs")} layout="none"><PipeFrame chip="07 · LOGS" headline={<>Plivo logs: <Pk>open the call.</Pk></>} active={-1} done={4}><StepScene step={{ key: "logs", dur: A("there") - A("logs"), cap: { pre: "", kw: "" }, clips: [{ node: <LogsBeat />, dur: A("openc") - A("logs") }, { node: <InsightsBeat revealFrom={9999} />, dur: A("there") - A("openc") }] }} noCaption dimOnly /></PipeFrame></Sequence>
      <Sequence from={A("there")} durationInFrames={A("close") - A("there")} layout="none"><PipeFrame chip="07 · LOGS" headline={<>The audio stream, <Pk>alongside the call.</Pk></>} active={-1} done={4} still><StepScene step={{ key: "insights", dur: A("close") - A("there"), cap: { pre: "", kw: "" }, clips: [{ node: <InsightsBeat revealFrom={0} />, dur: A("close") - A("there") }], focus: { spot: { x: 250, y: 520, w: 1650, h: 160 }, z: 1.1, t0: 10, t1: 40, t2: A("close") - A("there") - 26, t3: A("close") - A("there") - 2 } }} noCaption dimOnly /></PipeFrame></Sequence>
      <Sequence from={A("close")} durationInFrames={A("build") - A("close") + 14} layout="none">
        <PipeRecap title={<>Your Pipecat bot <Pk>now has a phone number.</Pk></>} cards={[
          { icon: "◉", title: "Pipecat bot", rows: [["Scaffolded with", "pipecat init"], ["Transport", "plivo"], ["Runs on", "Pipecat Cloud"]] },
          { icon: "⇄", title: "Plivo Audio Streaming", rows: [["Application", "Pipecat_Demo"], ["Answer URL", "your Stream XML"], ["Audio", "WebSocket, both ways"]] },
          { icon: "☎", title: "Phone number", rows: [["Type", "Application"], ["Routes to", "Pipecat_Demo"], ["Logs show", "the audio stream"]] },
        ]} />
      </Sequence>
      <Sequence from={A("build") - 14} durationInFrames={PC_TOTAL_FRAMES - A("build") + 14} layout="none"><LogoOutro cta={<>Let real callers <span style={{ color: BLUE }}>reach your Pipecat bot.</span></>} /></Sequence>
    </AbsoluteFill>
  );
};
// the Stream XML with its two notes
const StreamLines: React.FC<{ captionAt: number; doneAt: number }> = ({ captionAt, doneAt }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ padding: "28px 40px 30px", fontFamily: MONO, fontSize: 25, lineHeight: 1.7, color: "#c9ced9", whiteSpace: "pre" }}>
      {"<"}{K("Response")}{">"}{"\n"}{"  <"}{K("Stream")} bidirectional={V('"true"')}{"\n"}{"          contentType="}{V('"audio/x-mulaw;rate=8000"')}{">"}{"\n"}{"    "}<span style={{ color: "#e2a6ff" }}>wss://api.pipecat.daily.co/ws/plivo?serviceHost=plivo-demo-bot.your-workspace</span>{"\n"}{"  </"}{K("Stream")}{">"}{"\n"}{"</"}{K("Response")}{">"}
      <div style={{ marginTop: 22, fontFamily: INTER, fontSize: 22, color: "#9aa3b8", whiteSpace: "normal", opacity: easeIn(f, captionAt, captionAt + 16) }}>That wss URL is your <b style={{ color: "#fff" }}>deployed bot</b> from the last step.</div>
      <div style={{ marginTop: 16, opacity: easeIn(f, doneAt, doneAt + 14) }}><span style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(74,222,128,0.14)", color: "#4ade80", fontFamily: MONO, fontSize: 20, padding: "10px 18px", borderRadius: 999 }}>✓ That's it.</span></div>
    </div>
  );
};
