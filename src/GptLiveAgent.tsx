import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { MUSIC } from "./promoConfig";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { BLUE, INK, CREAM, MONO, SORA, INTER, Grid, Chip, Logo } from "./StyleFrames";
import { Opener, Hi, RecapCards, LogoOutro, FrameLayout, musicVol, easeIn } from "./CallSchedulingAgent";
import { Term } from "./PipecatAgent";
import { punch, Rings, Dial, Wave } from "./Hooks";
import { NewConsoleShell } from "./cards/NewConsoleShell";
import { SipTrunkingScreen } from "./OnboardingSipTrunking";
import { CALL_ENV } from "./gptliveCallEnv";

// ============================================================================
// GptLiveAgent — "I put GPT-Live-1 on a real phone line" (see VIDEO-IDEA.md).
// Everything on screen is recreated (no recordings). Narration public/vo/gptlive/narr.mp3
// is one take split around the demo call (public/vo/gptlive/call-*.mp3, two TTS voices).
// Never shown: API key, webhook secret (masked), the OpenAI project id (masked).
// ============================================================================
const T = { duplex: 79, listens: 146, interrupt: 216, novad: 275, put: 370, callit: 448, plan: 512, wire: 556, test: 637, settings: 683, need: 842, need1: 896, need2: 1007, need3: 1078, hundred: 1151, openai: 1280, models: 1368, webhook: 1508, secret: 1694, sip: 1813, dial: 1904, backend: 1964, pings: 2048, accepts: 2146, delegation: 2342, sideband: 2405, run: 2552, plivo: 2662, story: 2710, trunk: 2791, uri: 2876, srtp: 3026, requires: 3153, link: 3232, thatsit: 3293, nobridge: 3319, callnow: 3498, talkover: 3542, fullduplex: 3638, meanwhile: 3688, knobs: 3791, voice: 3869, instr: 4003, brain: 4123, payload: 4217, restart: 4303, wrap: 4410, repo: 4531, grab: 4627, end: 4670 };
const CALL0 = T.talkover + 6;
const L = (k: string) => CALL_ENV[k].length;
const C = { greet: CALL0, q1: CALL0 + L("greet") + 14, a1: CALL0 + L("greet") + 14 + L("q1") + 10 };
const A1_CUT = 150; // the caller interrupts 5s into the first answer
const C2 = { q2: C.a1 + A1_CUT, a2: C.a1 + A1_CUT + L("q2") + 8 };
const CALL_END = C2.a2 + L("a2") + 18;
const SHIFT = CALL_END - T.talkover; const A = (k: keyof typeof T) => T[k] + SHIFT;
export const GL_TOTAL_FRAMES = A("end") + 110;

const NUMBER = "+1 806 209 0453";
const SIP = "sip:proj_••••••••••@sip.api.openai.com;transport=tls";

// ---- hook -------------------------------------------------------------------------
const Hook: React.FC = () => {
  const f = useCurrentFrame(); const dark = f < T.put; const blue = f >= T.put;
  const botWave = (i: number) => { const on = f >= T.listens && !(f >= T.interrupt && f < T.interrupt + 40); return on ? 8 + 46 * Math.abs(Math.sin(i * 0.7 + f * 0.3)) : 6; };
  const youWave = (i: number) => (f >= T.interrupt ? 8 + 46 * Math.abs(Math.sin(i * 0.9 + f * 0.36)) : 6);
  return (
    <AbsoluteFill style={{ background: dark ? "#0b0d14" : BLUE, fontFamily: SORA, overflow: "hidden" }}>
      <Grid dark /><Logo white />
      {dark ? (
        <>
          <div style={{ position: "absolute", left: 140, top: 200, width: 1100 }}>
            <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 4, color: "#8ea2ff", ...punch(f, 4) }}>OPENAI JUST LAUNCHED</div>
            <div style={{ marginTop: 14, fontSize: 150, fontWeight: 700, color: "#fff", letterSpacing: -6, lineHeight: 1, ...punch(f, 16) }}>GPT-Live-1</div>
            <div style={{ marginTop: 26, display: "inline-flex", alignItems: "center", gap: 12, border: "2px solid rgba(255,255,255,0.35)", borderRadius: 999, padding: "12px 24px", color: "#fff", fontSize: 30, fontWeight: 600, ...punch(f, T.duplex) }}><span style={{ width: 12, height: 12, borderRadius: 6, background: "#4ade80" }} />full-duplex voice model</div>
            <div style={{ marginTop: 34, display: "flex", gap: 16 }}>
              {[["no turn-taking", T.novad], ["no VAD threshold to tune", T.novad + 14]].map(([t, at]) => <span key={String(t)} style={{ background: "rgba(255,255,255,0.1)", color: "#fff", fontFamily: MONO, fontSize: 20, padding: "10px 18px", borderRadius: 10, ...punch(f, at as number) }}>{t as string}</span>)}
            </div>
          </div>
          {/* listens and talks at the same time: two waves; the caller cuts in and the bot yields */}
          <div style={{ position: "absolute", right: 120, top: 260, width: 560, background: "#141826", borderRadius: 24, padding: "26px 28px", boxShadow: "0 40px 90px rgba(0,0,0,0.5)", ...punch(f, T.listens - 8) }}>
            <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: "#8ea2ff" }}>● GPT-LIVE-1 · TALKING</div>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 4, height: 60 }}>{Array.from({ length: 48 }, (_, i) => <span key={i} style={{ width: 7, height: botWave(i), borderRadius: 3, background: "#8ea2ff", opacity: 0.9 }} />)}</div>
            <div style={{ marginTop: 22, fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: f >= T.interrupt ? "#4ade80" : "rgba(255,255,255,0.4)" }}>● YOU · {f >= T.interrupt ? "INTERRUPTING" : "LISTENING"}</div>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 4, height: 60 }}>{Array.from({ length: 48 }, (_, i) => <span key={i} style={{ width: 7, height: youWave(i), borderRadius: 3, background: "#4ade80", opacity: 0.9 }} />)}</div>
            {f >= T.interrupt + 6 ? <div style={{ marginTop: 16, fontFamily: MONO, fontSize: 15, color: "#fff", ...punch(f, T.interrupt + 6) }}>→ it stops, and listens</div> : null}
          </div>
        </>
      ) : null}
      {blue ? (
        <AbsoluteFill style={{ opacity: easeIn(f, T.put, T.put + 12) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontSize: 92, fontWeight: 600, color: "#fff", letterSpacing: -3, ...punch(f, T.put) }}>I put it on a real phone number.</div>
          {f >= T.put + 70 ? <Rings f={f} at={T.put + 70} cx={960} cy={560} /> : null}
          <div style={{ position: "absolute", left: 0, right: 0, top: 460, display: "flex", justifyContent: "center" }}><Dial f={f} at={T.put + 20} number={NUMBER} step={4} /></div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 720, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, color: "#fff", fontSize: 40, fontWeight: 600, ...punch(f, T.callit) }}>Call it. Talk to it. <span style={{ background: "#fff", borderRadius: 14, padding: "8px 18px", display: "inline-flex" }}><PlivoLogoSvg width={150} color={INK} /></span></div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ---- plan strip / cards ---------------------------------------------------------------
const Plan: React.FC = () => {
  const f = useCurrentFrame(); const steps = [["Wire a number to the model", "over SIP", T.wire], ["Make a test call", "connect, talk, interrupt", T.test], ["Change the settings", "voice · instructions · brain", T.settings]] as const;
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: SORA }}>
      <Grid /><Chip n="00" label="The plan" /><Logo />
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", fontSize: 64, fontWeight: 600, color: INK, letterSpacing: -2, ...punch(f, 0) }}>Here's <span style={{ color: BLUE }}>the plan.</span></div>
      <div style={{ position: "absolute", top: 380, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 34 }}>
        {steps.map(([t, s, at], i) => <div key={t} style={{ width: 480, background: "#fff", borderRadius: 24, padding: "34px 34px", boxShadow: "0 30px 70px rgba(15,17,23,0.14), 0 0 0 1px rgba(15,17,23,0.05)", ...punch(f, at - T.plan) }}><div style={{ width: 54, height: 54, borderRadius: 27, background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700 }}>{i + 1}</div><div style={{ marginTop: 22, fontSize: 32, fontWeight: 600, color: INK, lineHeight: 1.15 }}>{t}</div><div style={{ marginTop: 10, fontFamily: MONO, fontSize: 17, color: "#7a7f8c" }}>{s}</div></div>)}
      </div>
    </AbsoluteFill>
  );
};
const Needs: React.FC = () => {
  const f = useCurrentFrame(); const cards = [["◉", "An OpenAI project", "with GPT-Live-1 access", T.need1], ["☎", "A Plivo account", "with a phone number", T.need2], [">_", "A small backend", "to accept calls · ~100 lines of Python", T.need3]] as const;
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: SORA }}>
      <Grid /><Chip n="01" label="Before you start" /><Logo />
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", fontSize: 64, fontWeight: 600, color: INK, letterSpacing: -2, ...punch(f, 0) }}>You'll need <span style={{ color: BLUE }}>three things.</span></div>
      <div style={{ position: "absolute", top: 360, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 34 }}>
        {cards.map(([ic, t, s, at]) => <div key={t} style={{ width: 480, background: "#fff", borderRadius: 24, padding: "36px 34px", boxShadow: "0 30px 70px rgba(15,17,23,0.14), 0 0 0 1px rgba(15,17,23,0.05)", ...punch(f, at - T.need) }}><span style={{ width: 60, height: 60, borderRadius: 18, background: "#eef0ff", color: BLUE, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontFamily: MONO, fontWeight: 700 }}>{ic}</span><div style={{ marginTop: 22, fontSize: 32, fontWeight: 600, color: INK }}>{t}</div><div style={{ marginTop: 8, fontSize: 21, color: "#55586a", fontFamily: INTER }}>{s}</div></div>)}
      </div>
      <div style={{ position: "absolute", bottom: 84, left: 0, right: 0, textAlign: "center", fontFamily: MONO, fontSize: 22, color: BLUE, ...punch(f, T.hundred - T.need + 40) }}>↓ repo link in the description</div>
    </AbsoluteFill>
  );
};

// ---- OpenAI mocks (stylised, dark) -----------------------------------------------------
const Panel: React.FC<{ title: string; children: React.ReactNode; at?: number; width?: number }> = ({ title, children, at = 6, width = 1300 }) => { const f = useCurrentFrame(); return (
  <div style={{ position: "absolute", top: 250, left: (1920 - width) / 2, width, background: "#0f1117", borderRadius: 22, boxShadow: "0 40px 90px rgba(15,17,23,0.3)", overflow: "hidden", color: "#e6e8f0", fontFamily: INTER, ...punch(f, at) }}>
    <div style={{ height: 46, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontFamily: MONO, fontSize: 14, color: "rgba(255,255,255,0.5)" }}><span style={{ width: 10, height: 10, borderRadius: 5, background: "#4ade80" }} />{title}</div>
    <div style={{ padding: "26px 30px 30px" }}>{children}</div>
  </div>); };
const Headline: React.FC<{ children: React.ReactNode }> = ({ children }) => { const f = useCurrentFrame(); return <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontSize: 54, fontWeight: 600, color: INK, letterSpacing: -1.6, fontFamily: SORA, ...punch(f, 0) }}>{children}</div>; };
const Cream: React.FC<{ chip: { n: string; label: string }; children: React.ReactNode }> = ({ chip, children }) => (<AbsoluteFill style={{ background: CREAM, fontFamily: SORA }}><Grid /><Chip n={chip.n} label={chip.label} /><Logo />{children}</AbsoluteFill>);

const ModelsBeat: React.FC = () => {
  const f = useCurrentFrame(); const rows = [["gpt-5.6-luna", "text · reasoning"], ["gpt-live-1", "audio · full duplex · SIP"], ["gpt-realtime", "audio · websocket"], ["whisper-2", "speech to text"]];
  return (<Cream chip={{ n: "02", label: "OpenAI" }}><Headline>On OpenAI: <span style={{ color: BLUE }}>three quick things.</span></Headline>
    <Panel title="platform · project gpt-live-plivo · models">
      <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: "rgba(255,255,255,0.45)", marginBottom: 14 }}>1 · MODELS AVAILABLE TO THIS PROJECT</div>
      {rows.map(([m, d], i) => { const hi = m === "gpt-live-1" && f >= T.models - T.openai + 20; return <div key={m} style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 18px", borderRadius: 12, background: hi ? "rgba(50,61,254,0.22)" : "transparent", outline: hi ? "2px solid #8ea2ff" : "none", marginBottom: 6, ...punch(f, 20 + i * 8) }}><span style={{ fontFamily: MONO, fontSize: 24, color: "#fff", width: 300 }}>{m}</span><span style={{ fontFamily: MONO, fontSize: 16, color: "rgba(255,255,255,0.5)" }}>{d}</span>{hi ? <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 14, color: "#4ade80" }}>✓ enabled</span> : null}</div>; })}
    </Panel></Cream>);
};
const WebhookBeat: React.FC = () => {
  const f = useCurrentFrame(); const url = "https://xxxx.ngrok.app/openai/webhook"; const typed = url.slice(0, Math.max(0, Math.floor((f - 24) * 1.6)));
  return (<Cream chip={{ n: "02", label: "OpenAI" }}><Headline>Add the <span style={{ color: BLUE }}>webhook.</span></Headline>
    <Panel title="platform · settings · webhooks · add endpoint">
      <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: "rgba(255,255,255,0.45)" }}>2 · ENDPOINT URL</div>
      <div style={{ marginTop: 10, height: 58, border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, display: "flex", alignItems: "center", padding: "0 18px", fontFamily: MONO, fontSize: 22, color: "#fff" }}>{typed}<span style={{ opacity: typed.length < url.length ? Math.round(f / 6) % 2 : 0 }}>▍</span></div>
      <div style={{ marginTop: 22, fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: "rgba(255,255,255,0.45)" }}>EVENTS</div>
      <div style={{ marginTop: 10, display: "flex", gap: 12 }}><span style={{ background: "rgba(50,61,254,0.25)", border: "1px solid #8ea2ff", color: "#fff", fontFamily: MONO, fontSize: 20, padding: "10px 16px", borderRadius: 10, ...punch(f, 70) }}>live.transport.incoming ✓</span></div>
      <div style={{ marginTop: 22, fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: "rgba(255,255,255,0.45)" }}>SIGNING SECRET · shown once</div>
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 14, ...punch(f, T.secret - T.webhook) }}><span style={{ fontFamily: MONO, fontSize: 22, color: "#fff", background: "rgba(255,255,255,0.06)", padding: "10px 16px", borderRadius: 10 }}>whsec_••••••••••••••••••••</span><span style={{ fontFamily: MONO, fontSize: 16, color: "#4ade80" }}>→ .env  OPENAI_WEBHOOK_SECRET</span></div>
    </Panel></Cream>);
};
const SipBeat: React.FC = () => {
  const f = useCurrentFrame();
  return (<Cream chip={{ n: "02", label: "OpenAI" }}><Headline>Note the project's <span style={{ color: BLUE }}>SIP address.</span></Headline>
    <Panel title="platform · project · SIP" width={1400}>
      <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: "rgba(255,255,255,0.45)" }}>3 · YOUR PROJECT'S SIP ADDRESS</div>
      <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 30, color: "#fff", background: "rgba(255,255,255,0.06)", padding: "20px 22px", borderRadius: 12, ...punch(f, 20) }}>{SIP}</div>
      <div style={{ marginTop: 22, display: "flex", gap: 14, flexWrap: "wrap" }}>{["TLS signaling", "SRTP media", "inbound only"].map((t, i) => <span key={t} style={{ fontFamily: MONO, fontSize: 18, color: "#fff", border: "1px solid rgba(255,255,255,0.25)", padding: "8px 14px", borderRadius: 999, ...punch(f, 50 + i * 10) }}>{t}</span>)}</div>
      <div style={{ marginTop: 26, fontFamily: INTER, fontSize: 24, color: "rgba(255,255,255,0.75)", ...punch(f, T.dial - T.sip) }}>That's what Plivo will dial.</div>
    </Panel></Cream>);
};

// ---- backend: code card ----------------------------------------------------------------
const CodeBeat: React.FC = () => {
  const f = useCurrentFrame(); const at = (k: keyof typeof T) => T[k] - T.backend;
  const K = (t: string) => <span style={{ color: "#c792ea" }}>{t}</span>; const S = (t: string) => <span style={{ color: "#4ade80" }}>{t}</span>; const Ln: React.FC<{ hi?: boolean; children: React.ReactNode }> = ({ hi, children }) => <div style={{ background: hi ? "rgba(50,61,254,0.25)" : "transparent", margin: "0 -30px", padding: "0 30px", whiteSpace: "pre" }}>{children}</div>;
  return (<Cream chip={{ n: "03", label: "Backend" }}><Headline>The backend does <span style={{ color: BLUE }}>call control.</span> Nothing else.</Headline>
    <Panel title="main.py · accept the session" width={1400}>
      <div style={{ fontFamily: MONO, fontSize: 21, lineHeight: 1.6, color: "#c9ced9" }}>
        <Ln hi={f >= at("pings") && f < at("accepts")}>{"@app.post(\"/openai/webhook\")"}   <span style={{ color: "#8ea2ff" }}># OpenAI pings · verify signature</span></Ln>
        <Ln>{"if event.type == "}{S('"live.transport.incoming"')}{":  accept_call(session_id)"}</Ln>
        <Ln>{" "}</Ln>
        <Ln hi={f >= at("accepts") && f < at("delegation")}>{"POST /v1/live/sessions/{id}/accept"}</Ln>
        <Ln hi={f >= at("accepts") && f < at("delegation")}>{"  session: { model: "}{S('"gpt-live-1"')}{", audio.output.voice: "}{S('"marin"')}{","}</Ln>
        <Ln hi={f >= at("accepts") && f < at("delegation")}>{"             instructions: "}{S('"You are the Plivo voice assistant…"')}{","}</Ln>
        <Ln hi={f >= at("delegation") && f < at("sideband")}>{"             delegation: { type: "}{S('"responses"')}{", model: "}{S('"gpt-5.6-luna"')}{" } }"}   <span style={{ color: "#8ea2ff" }}># the brain</span></Ln>
        <Ln>{" "}</Ln>
        <Ln hi={f >= at("sideband")}>{"attach  wss://…/sessions/{id}/attach"}   <span style={{ color: "#8ea2ff" }}># sideband: greet + log transcript</span></Ln>
        <Ln hi={f >= at("sideband")}>{"session.instructions.append  → "}{S('"Hi, thanks for calling Plivo…"')}</Ln>
      </div>
    </Panel></Cream>);
};

// ---- Plivo: trunk drawer over the recreated SIP Trunking page ----------------------------
const TrunkDrawer: React.FC = () => {
  const f = useCurrentFrame(); const at = (k: keyof typeof T) => T[k] - T.trunk;
  const Field: React.FC<{ label: string; value?: React.ReactNode; at: number }> = ({ label, value, at: a }) => <div style={{ marginBottom: 18 }}><div style={{ fontSize: 15, color: "#6b7280", fontWeight: 600, marginBottom: 8 }}>{label}</div><div style={{ minHeight: 48, border: "1px solid #e5e7eb", borderRadius: 10, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 17, color: INK, fontFamily: MONO, ...punch(f, a) }}>{value}</div></div>;
  const uri = "sip:proj_••••••••••@sip.api.openai.com;transport=tls"; const typed = uri.slice(0, Math.max(0, Math.floor((f - at("uri")) * 1.4)));
  const on = f >= at("srtp") + 10;
  return (
    <AbsoluteFill>
      <NewConsoleShell activeNav="SIP Trunking" topBar="live"><SipTrunkingScreen /></NewConsoleShell>
      <div style={{ position: "absolute", inset: 0, background: "rgba(15,17,23,0.35)" }} />
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 700, background: "#fff", boxShadow: "-30px 0 80px rgba(15,17,23,0.25)", fontFamily: INTER, padding: "30px 34px", display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: INK, fontFamily: SORA }}>Create Trunk</div>
        <div style={{ marginTop: 26 }}>
          <Field label="Trunk Name" value="gpt-live" at={4} />
          <div style={{ display: "flex", gap: 28, marginBottom: 20, fontSize: 17, color: INK }}><span>◉ Inbound</span><span style={{ color: "#9aa0ac" }}>○ Outbound</span></div>
          <Field label="Primary URI  ·  where Plivo sends the call" value={<>{typed}<span style={{ opacity: typed.length < uri.length && f >= at("uri") ? Math.round(f / 6) % 2 : 0 }}>▍</span></>} at={at("uri") - 6} />
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, ...punch(f, at("srtp")) }}><span style={{ width: 58, height: 32, borderRadius: 16, background: on ? "#15a34a" : "#d1d5db", position: "relative", transition: "none" }}><span style={{ position: "absolute", top: 4, left: on ? 30 : 4, width: 24, height: 24, borderRadius: 12, background: "#fff" }} /></span><span style={{ fontSize: 17, fontWeight: 600, color: INK }}>Secure Trunking</span><span style={{ fontFamily: MONO, fontSize: 14, color: on ? "#15a34a" : "#9aa0ac" }}>{on ? "SRTP media · TLS signaling" : "off"}</span></div>
          <Field label="Link Numbers" value={<><span style={{ background: "#eef0ff", color: BLUE, padding: "4px 10px", borderRadius: 8 }}>{NUMBER}</span></>} at={at("link")} />
        </div>
        <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 }}>
          {f >= at("thatsit") + 10 ? <span style={{ fontFamily: MONO, fontSize: 15, color: "#15a34a", ...punch(f, at("thatsit") + 10) }}>✓ Inbound trunk created</span> : null}
          <div style={{ background: INK, color: "#fff", fontSize: 16, fontWeight: 600, padding: "14px 22px", borderRadius: 10, transform: `scale(${f >= at("thatsit") && f < at("thatsit") + 6 ? 0.94 : 1})` }}>Create Trunk</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
const FlowBeat: React.FC = () => {
  const f = useCurrentFrame(); const nodes = [["Caller", "any phone", "☎"], ["Plivo number", NUMBER, "#"], ["Zentrunk", "TLS · SRTP", "⇄"], ["OpenAI", "GPT-Live-1", "◉"], ["Your backend", "accept · greet · log", ">_"]];
  return (<Cream chip={{ n: "04", label: "Plivo" }}><Headline>No audio bridge. No transcoding. <span style={{ color: BLUE }}>Just SIP.</span></Headline>
    <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
      {nodes.map(([t, s, ic], i) => <React.Fragment key={t}><div style={{ width: 290, background: i === 3 ? BLUE : "#fff", color: i === 3 ? "#fff" : INK, borderRadius: 22, padding: "24px 24px", boxShadow: "0 30px 70px rgba(15,17,23,0.14), 0 0 0 1px rgba(15,17,23,0.05)", ...punch(f, 8 + i * 14) }}><span style={{ width: 46, height: 46, borderRadius: 14, background: i === 3 ? "rgba(255,255,255,0.18)" : "#eef0ff", color: i === 3 ? "#fff" : BLUE, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontFamily: MONO }}>{ic}</span><div style={{ marginTop: 14, fontSize: 24, fontWeight: 600 }}>{t}</div><div style={{ marginTop: 4, fontFamily: MONO, fontSize: 13, opacity: 0.7 }}>{s}</div></div>{i < 4 ? <div style={{ width: 60, height: 3, background: i === 3 ? "#c9ccd6" : BLUE, margin: "0 8px", opacity: easeIn(f, 20 + i * 14, 36 + i * 14) }} /> : null}</React.Fragment>)}
    </div>
    <div style={{ position: "absolute", bottom: 120, left: 0, right: 0, textAlign: "center", fontFamily: MONO, fontSize: 20, color: "#55586a", ...punch(f, 90) }}>media: Plivo ⇄ OpenAI over SRTP  ·  backend: webhook → accept → sideband transcript</div>
  </Cream>);
};

// ---- the test call ---------------------------------------------------------------------
const lines: [string, "bot" | "you", number, number][] = [["greet", "bot", C.greet, L("greet")], ["q1", "you", C.q1, L("q1")], ["a1", "bot", C.a1, A1_CUT], ["q2", "you", C2.q2, L("q2")], ["a2", "bot", C2.a2, L("a2")]];
const CallScreen: React.FC = () => {
  const f = useCurrentFrame(); const g = f + T.callnow; // global frame
  const live = g >= CALL0 - 6; const secs = Math.max(0, Math.floor((g - CALL0) / 30));
  const cur = lines.find(([, , s, d]) => g >= s && g < s + d); const who = cur ? cur[1] : null; const lvl = cur ? (CALL_ENV[cur[0]][g - cur[2]] ?? 0) : 0;
  const interrupted = g >= C2.q2 && g < C2.q2 + 40;
  const Panel2: React.FC<{ label: string; me: boolean }> = ({ label, me }) => { const act = who === (me ? "you" : "bot"); return <div style={{ flex: 1, background: "#0b0d14", border: `1px solid ${act ? "#8ea2ff" : "rgba(255,255,255,0.08)"}`, borderRadius: 16, padding: "18px 22px" }}><div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 2, color: act ? "#8ea2ff" : "rgba(255,255,255,0.4)" }}>● {label}</div><div style={{ marginTop: 14, height: 70, display: "flex", alignItems: "center", gap: 4 }}>{Array.from({ length: 44 }, (_, i) => <span key={i} style={{ width: 6, height: act ? 4 + 62 * lvl * (0.35 + 0.65 * Math.abs(Math.sin(i * 0.9 + g * 0.35))) : 4, borderRadius: 3, background: act ? (me ? "#4ade80" : BLUE) : "rgba(255,255,255,0.18)" }} />)}</div></div>; };
  return (<Cream chip={{ n: "05", label: "Test call" }}>
    <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center", fontSize: 54, fontWeight: 600, color: INK, letterSpacing: -1.6, ...punch(f, 0) }}>{live ? <>On the line with <span style={{ color: BLUE }}>GPT-Live-1.</span></> : <>Time to <span style={{ color: BLUE }}>call it.</span></>}</div>
    <div style={{ position: "absolute", top: 230, left: 360, width: 1200, background: "#0f1117", borderRadius: 24, boxShadow: "0 40px 90px rgba(15,17,23,0.3)", padding: "36px 40px", color: "#fff", fontFamily: INTER, ...punch(f, 6) }}>
      <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: "#8ea2ff" }}>■ PLIVO SIP · OPENAI GPT-LIVE-1 · DEMO CALL</div>
      <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 18 }}>
        <span style={{ width: 62, height: 62, borderRadius: 31, background: live ? "#30a46c" : "rgba(255,255,255,0.12)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 26, transform: `scale(${live ? 1 : 1 + 0.06 * Math.abs(Math.sin(f / 4))})` }}>☎</span>
        <div><div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 18, fontWeight: 600 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: live ? "#4ade80" : "#fbbf24" }} />{live ? "Live" : "Connecting…"}</div><div style={{ fontFamily: MONO, fontSize: 16, color: "rgba(255,255,255,0.6)" }}>{live ? `00:${String(secs).padStart(2, "0")}` : NUMBER}</div></div>
        <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 14, color: interrupted ? "#fbbf24" : "rgba(255,255,255,0.45)" }}>{interrupted ? "⚡ interrupted · bot yields" : `${NUMBER} → sip.api.openai.com`}</span>
      </div>
      <div style={{ marginTop: 26, display: "flex", gap: 18 }}><Panel2 label="YOU" me /><Panel2 label="GPT-LIVE-1" me={false} /></div>
    </div>
  </Cream>);
};
const TranscriptBeat: React.FC = () => (
  <Term chip={{ n: "05", label: "Test call" }} headline={<>Meanwhile, the backend <span style={{ color: BLUE }}>logs everything.</span></>} title="plivo-openai-gptlive — python main.py" lines={[
    { at: 0, text: <>webhook: live.transport.incoming</>, color: "#9aa3b8" }, { at: 8, text: <>accepted sess_••••••••</>, color: "#4ade80" },
    { at: 18, text: <>agent: Hi, thanks for calling Plivo. What can I help you with today?</>, color: "#e6e8f0" },
    { at: 34, text: <>caller: Can I send text messages to the US with Plivo?</>, color: "#8ea2ff" },
    { at: 50, text: <>agent: Yes. You can send SMS to US numbers with the messaging API…</>, color: "#e6e8f0" },
    { at: 62, text: <>caller: Wait, sorry, what about WhatsApp?</>, color: "#8ea2ff" },
    { at: 76, text: <>agent: Also yes. WhatsApp works through the same messaging API…</>, color: "#e6e8f0" },
  ]} />
);

// ---- the three knobs ---------------------------------------------------------------------
const Knobs: React.FC = () => {
  const f = useCurrentFrame(); const at = (k: keyof typeof T) => A(k) - A("knobs"); const voices = ["marin", "cedar", "sage", "marin"]; const vi = f < at("voice") ? 0 : Math.min(3, Math.floor((f - at("voice")) / 26));
  const Row: React.FC<{ n: string; label: string; value: React.ReactNode; hi: boolean; a: number }> = ({ n, label, value, hi, a }) => <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "22px 26px", borderRadius: 16, background: hi ? "rgba(50,61,254,0.22)" : "rgba(255,255,255,0.03)", outline: hi ? "2px solid #8ea2ff" : "none", marginBottom: 12, ...punch(f, a) }}><span style={{ fontFamily: MONO, fontSize: 14, color: "#8ea2ff", width: 30 }}>{n}</span><span style={{ fontSize: 26, fontWeight: 600, color: "#fff", width: 300, fontFamily: SORA }}>{label}</span><span style={{ fontFamily: MONO, fontSize: 20, color: "#e6e8f0" }}>{value}</span></div>;
  return (<Cream chip={{ n: "06", label: "Settings" }}><Headline>Want it different? <span style={{ color: BLUE }}>Three knobs.</span></Headline>
    <Panel title="main.py · session.accept payload" width={1400}>
      <Row n="01" label="The voice" value={<>audio.output.voice = <span style={{ color: "#4ade80" }}>"{voices[vi]}"</span></>} hi={f >= at("voice") && f < at("instr")} a={at("voice") - 6} />
      <Row n="02" label="The instructions" value={<>"You are the Plivo voice assistant. Calm, friendly, one or two short sentences…"</>} hi={f >= at("instr") && f < at("brain")} a={at("instr") - 6} />
      <Row n="03" label="The backend model" value={<>delegation.responses.model = <span style={{ color: "#4ade80" }}>"gpt-5.6-luna"</span></>} hi={f >= at("brain") && f < at("payload")} a={at("brain") - 6} />
      <div style={{ marginTop: 18, display: "flex", gap: 14, alignItems: "center", ...punch(f, at("restart")) }}><span style={{ fontFamily: MONO, fontSize: 16, color: "#fff", background: "rgba(255,255,255,0.08)", padding: "8px 14px", borderRadius: 999 }}>change</span><span style={{ color: "#8ea2ff" }}>→</span><span style={{ fontFamily: MONO, fontSize: 16, color: "#fff", background: "rgba(255,255,255,0.08)", padding: "8px 14px", borderRadius: 999 }}>restart</span><span style={{ color: "#8ea2ff" }}>→</span><span style={{ fontFamily: MONO, fontSize: 16, color: "#0b0d14", background: "#4ade80", padding: "8px 14px", borderRadius: 999 }}>next call picks it up</span></div>
    </Panel></Cream>);
};

// ---- composition ------------------------------------------------------------------------
const SipPageBeat: React.FC = () => (<NewConsoleShell activeNav="SIP Trunking" topBar="live"><SipTrunkingScreen cursorAt={60} /></NewConsoleShell>);
export const GptLiveAgent: React.FC = () => {
  const total = GL_TOTAL_FRAMES;
  return (
    <AbsoluteFill style={{ backgroundColor: "#f6f5f3" }}>
      <Audio src={staticFile(MUSIC.src)} loop volume={(f) => musicVol(f, total, { from: CALL0, to: CALL_END })} />
      <Sequence from={0} durationInFrames={T.talkover} layout="none"><Audio src={staticFile("vo/gptlive/narr.mp3")} trimAfter={T.talkover} /></Sequence>
      {lines.map(([k, , s, d]) => <Sequence key={k} from={s} durationInFrames={d} layout="none"><Audio src={staticFile(`vo/gptlive/call-${k}.mp3`)} volume={(f) => (k === "a1" ? interpolate(f, [A1_CUT - 10, A1_CUT], [0.95, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0.95)} /></Sequence>)}
      <Sequence from={A("talkover")} layout="none"><Audio src={staticFile("vo/gptlive/narr.mp3")} trimBefore={T.talkover} /></Sequence>

      <Sequence from={0} durationInFrames={T.plan} layout="none"><Hook /></Sequence>
      <Sequence from={T.plan} durationInFrames={T.need - T.plan} layout="none"><Plan /></Sequence>
      <Sequence from={T.need} durationInFrames={T.openai - T.need} layout="none"><Needs /></Sequence>
      <Sequence from={T.openai} durationInFrames={T.webhook - T.openai} layout="none"><ModelsBeat /></Sequence>
      <Sequence from={T.webhook} durationInFrames={T.sip - T.webhook} layout="none"><WebhookBeat /></Sequence>
      <Sequence from={T.sip} durationInFrames={T.backend - T.sip} layout="none"><SipBeat /></Sequence>
      <Sequence from={T.backend} durationInFrames={T.run - T.backend} layout="none"><CodeBeat /></Sequence>
      <Sequence from={T.run} durationInFrames={T.plivo - T.run} layout="none"><Term chip={{ n: "03", label: "Backend" }} headline={<>Run it. Expose it. <span style={{ color: BLUE }}>It's live.</span></>} title="plivo-openai-gptlive — zsh" lines={[{ at: 2, typed: "python main.py", text: null }, { at: 24, text: <>INFO  Uvicorn running on http://0.0.0.0:8000</>, color: "#9aa3b8" }, { at: 40, typed: "ngrok http 8000", text: null }, { at: 66, text: <>Forwarding  https://xxxx.ngrok.app → localhost:8000</>, color: "#9aa3b8" }, { at: 84, text: <>✓ webhook ready · waiting for live.transport.incoming</>, color: "#4ade80" }]} /></Sequence>
      <Sequence from={T.plivo} durationInFrames={T.trunk - T.plivo} layout="none"><FrameLayout chip={{ n: "04", label: "Plivo" }} headline={<>Now the Plivo side. <span style={{ color: BLUE }}>The whole telephony story.</span></>}><AbsoluteFill><SipPageBeat /></AbsoluteFill></FrameLayout></Sequence>
      <Sequence from={T.trunk} durationInFrames={T.nobridge - T.trunk} layout="none"><FrameLayout chip={{ n: "04", label: "Plivo" }} headline={<>An inbound trunk to OpenAI's SIP address. <span style={{ color: BLUE }}>TLS + SRTP.</span></>} url="cx.plivo.com"><TrunkDrawer /></FrameLayout></Sequence>
      <Sequence from={T.nobridge} durationInFrames={T.callnow - T.nobridge} layout="none"><FlowBeat /></Sequence>
      <Sequence from={T.callnow} durationInFrames={A("meanwhile") - T.callnow} layout="none"><CallScreen /></Sequence>
      <Sequence from={A("meanwhile")} durationInFrames={A("knobs") - A("meanwhile")} layout="none"><TranscriptBeat /></Sequence>
      <Sequence from={A("knobs")} durationInFrames={A("wrap") - A("knobs")} layout="none"><Knobs /></Sequence>
      <Sequence from={A("wrap")} durationInFrames={A("grab") - A("wrap")} layout="none"><RecapCards chip={{ n: "07", label: "What you built" }} title={<>GPT-Live-1, <span style={{ color: BLUE }}>on a real phone line.</span></>} cards={[
        { icon: "◉", title: "OpenAI project", rows: [["Model", "gpt-live-1"], ["Webhook", "live.transport.incoming"], ["SIP", "TLS + SRTP"]] },
        { icon: "⇄", title: "Plivo trunk", rows: [["Type", "Inbound · Zentrunk"], ["Primary URI", "sip.api.openai.com"], ["Number", NUMBER]] },
        { icon: ">_", title: "Backend", rows: [["Does", "accept · greet · log"], ["Audio", "never touches it"], ["Size", "~100 lines"]] },
      ]} /></Sequence>
      <Sequence from={A("grab")} durationInFrames={GL_TOTAL_FRAMES - A("grab")} layout="none"><LogoOutro /></Sequence>
    </AbsoluteFill>
  );
};
