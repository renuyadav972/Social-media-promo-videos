import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { BLUE, INK, CREAM, MONO, SORA, INTER, Grid, Chip, Logo } from "./StyleFrames";
import { NewConsoleShell } from "./cards/NewConsoleShell";
import { LkAgentBeat, LkTrunkBeat, LkTrunkFormBeat, LkTrunkLinkBeat, LkCallBeat } from "./cards/LkBeats";
import { HookLiveKit } from "./Hooks";
import { Step, StepScene, LogoOutro, easeIn } from "./CallSchedulingAgent";
import { DarkStage, DarkFrame, DarkSplit, DarkOpener, NeedDark, PhoneDark, RecapDark, Grad, DK_INK, DK_DIM, DK_LINE, GRAD } from "./LiveKitDark";

// ============================================================================
// LiveKitAgent — "Give your LiveKit agent a phone number", re-cut in the brand
// system of the Call Scheduling Agent video. Narration: public/vo/livekit-narr.mp3
// (one continuous take); section starts = first-word timestamps (faster-whisper).
// Footage: public/livekit-demo.mp4 (LiveKit + Plivo console, 4K) and
// public/livekit-call.mp4 (the real test call, 4K, its own audio is used).
// The demo recording's 14–16s shows the Plivo Home page with the user's name and
// Auth ID; 20.3–23.5s and 28.5–31.5s are recorder auto-zooms: none of these windows are used.
// ============================================================================
const DEMO = { file: "livekit-demo.mp4", geom: { w: 3456, h: 2160, cropTop: 284 } };
const CALL = { file: "livekit-call.mp4", geom: { w: 3456, h: 2160, cropTop: 296 } };

// narration anchors (frames @30fps)
const T = { nobody: 160, fix: 223, plivo: 397, need: 447, need1: 496, need2: 585, need3: 647, agent: 713, agentName: 1000, trunkOpen: 1110, trunkInbound: 1159, trunkForm: 1254, trunkMade: 1381, trunkLink: 1441, wrong: 1606, dispatch: 1705, cli: 1942, cliOne: 2038, cliTwo: 2122, twocmd: 2275, cliDone: 2303, goon: 2409, close: 2455, build: 2635, end: 2658 };
const CALL_SRC: [number, number] = [0.0, 15.3]; /* one exchange: greeting → question → answer ("…or WhatsApp messages.") */ const CALL_DUR = Math.round((CALL_SRC[1] - CALL_SRC[0]) * 30);
const CALL_FROM = T.close + 8; // the narration is split here: the real call plays between "Go on, call it." and "And that's it."
const SHIFT = 8 + CALL_DUR + 10; const A = (k: keyof typeof T) => T[k] + SHIFT;
export const LK_TOTAL_FRAMES = A("end") + 110;

// ---- Hook beats -----------------------------------------------------------
const Hook1: React.FC<{ nobodyAt: number }> = ({ nobodyAt }) => {
  const f = useCurrentFrame(); const e = easeIn(f, 0, 22); const e2 = easeIn(f, 14, 36); const e3 = easeIn(f, nobodyAt, nobodyAt + 16);
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: SORA }}>
      <Grid /><Logo />
      <div style={{ position: "absolute", left: 150, top: 0, bottom: 0, width: 880, display: "flex", flexDirection: "column", justifyContent: "center", opacity: e, transform: `translateY(${(1 - e) * 20}px)` }}>
        <div style={{ fontSize: 84, fontWeight: 600, color: INK, letterSpacing: -3, lineHeight: 1.02 }}>So you built a voice agent<br /><span style={{ color: BLUE }}>on LiveKit.</span></div>
        <div style={{ marginTop: 24, fontSize: 30, color: "#55586a", fontFamily: INTER, opacity: e3, transform: `translateY(${(1 - e3) * 10}px)` }}>Smart. Fast. And right now, <b style={{ color: INK }}>exactly nobody can call it.</b></div>
      </div>
      <div style={{ position: "absolute", left: 1090, top: 300, width: 700, background: "#0f1117", borderRadius: 22, padding: "30px 34px", boxShadow: "0 40px 90px rgba(15,17,23,0.3)", color: "#fff", fontFamily: INTER, opacity: e2, transform: `translateY(${(1 - e2) * 30}px)` }}>
        <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: "#8ea2ff" }}>LIVEKIT CLOUD · AGENTS</div>
        <div style={{ marginTop: 18, fontSize: 30, fontWeight: 600 }}>plivo-livekit-agent</div>
        <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>CA_V3J8ujWdrv5t</div>
        <div style={{ marginTop: 22, display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(48,164,108,0.18)", color: "#4ade80", fontFamily: MONO, fontSize: 14, padding: "8px 14px", borderRadius: 999 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: "#4ade80" }} />RUNNING</span>
          <span style={{ fontFamily: MONO, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>deployed 4 minutes ago</span>
          <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(229,72,77,0.16)", color: "#ff6b6b", fontFamily: MONO, fontSize: 14, padding: "8px 14px", borderRadius: 999, opacity: e3 }}>☎ no phone number</span>
        </div>
        <div style={{ marginTop: 26, display: "flex", gap: 3, alignItems: "flex-end", height: 40 }}>{Array.from({ length: 56 }, (_, i) => <span key={i} style={{ width: 7, height: 6 + 32 * Math.abs(Math.sin(i * 0.6 + f * 0.12)), borderRadius: 3, background: BLUE, opacity: 0.5 + 0.5 * Math.abs(Math.sin(i * 0.3)) }} />)}</div>
      </div>
    </AbsoluteFill>
  );
};
const Hook3: React.FC = () => {
  const f = useCurrentFrame(); const e = easeIn(f, 0, 22);
  const bars = Array.from({ length: 48 }, (_, i) => 12 + 52 * Math.abs(Math.sin(i * 0.55 + f * 0.1)) * (0.35 + 0.65 * Math.abs(Math.sin(i * 0.21 + 1.3))));
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: SORA, alignItems: "center", justifyContent: "center" }}>
      <Grid /><Logo />
      <div style={{ textAlign: "center", opacity: e, transform: `translateY(${(1 - e) * 20}px)` }}>
        <div style={{ fontSize: 40, color: "#55586a", fontFamily: INTER, fontWeight: 500 }}>All through Plivo</div>
        <div style={{ marginTop: 6, fontSize: 124, fontWeight: 600, color: BLUE, letterSpacing: -4, lineHeight: 1 }}>SIP Trunking</div>
        <div style={{ marginTop: 34, display: "flex", alignItems: "center", justifyContent: "center", gap: 3, height: 70 }}>{bars.map((h, i) => <span key={i} style={{ width: 7, height: h * e, borderRadius: 4, background: BLUE, opacity: 0.35 + 0.65 * Math.abs(Math.sin(i * 0.3)) }} />)}</div>
        <div style={{ marginTop: 30, display: "inline-flex", alignItems: "center", gap: 14, fontSize: 30, color: INK, fontFamily: INTER, fontWeight: 500, opacity: easeIn(f, 14, 34) }}>by <PlivoLogoSvg width={120} color={INK} /></div>
      </div>
    </AbsoluteFill>
  );
};

// ---- Dispatch rule explained (flow of a call) — dark stage ----------------------
const FlowBeat: React.FC = () => {
  const f = useCurrentFrame();
  const nodes = [{ t: "Phone number", s: "+1 775 239 8525", icon: "☎" }, { t: "Plivo SIP trunk", s: "inbound", icon: "⇄" }, { t: "LiveKit", s: "SIP ingress", icon: "◉" }, { t: "Your agent", s: "plivo-livekit-agent", icon: "✦" }];
  const ruleAt = 165;
  return (
    <DarkStage chip="03 · DISPATCH RULE" active={3} done={3}>
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", fontSize: 56, fontWeight: 600, letterSpacing: -1.8, opacity: easeIn(f, 0, 20) }}>The trunk brings calls in. <Grad>The dispatch rule picks the agent.</Grad></div>
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {nodes.map((n, i) => { const e = easeIn(f, 10 + i * 22, 30 + i * 22); const last = i === 3; return (
          <React.Fragment key={n.t}>
            <div style={{ width: 330, background: last ? "#323dfe" : "#fff", border: `1px solid ${last ? "transparent" : DK_LINE}`, color: last ? "#fff" : DK_INK, boxShadow: "0 24px 60px rgba(15,17,23,0.10)", borderRadius: 22, padding: "28px 28px", opacity: e, transform: `translateY(${(1 - e) * 24}px)` }}>
              <span style={{ width: 50, height: 50, borderRadius: 15, background: last ? "rgba(255,255,255,0.2)" : "#eef0ff", color: last ? "#fff" : "#323dfe", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{n.icon}</span>
              <div style={{ marginTop: 18, fontSize: 27, fontWeight: 600 }}>{n.t}</div>
              <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 15, opacity: 0.7 }}>{n.s}</div>
            </div>
            {i < 3 ? (
              <div style={{ width: 120, textAlign: "center", position: "relative", opacity: easeIn(f, 24 + i * 22, 44 + i * 22) }}>
                <div style={{ height: 3, background: i === 2 ? "#323dfe" : "rgba(15,17,23,0.15)", margin: "0 10px", borderRadius: 2 }} />
                {i === 2 ? <div style={{ position: "absolute", top: -46, left: -40, right: -40, fontFamily: MONO, fontSize: 14, color: "#fff", background: "#323dfe", borderRadius: 8, padding: "6px 8px", opacity: easeIn(f, ruleAt, ruleAt + 16) }}>dispatch rule</div> : null}
              </div>) : null}
          </React.Fragment>); })}
      </div>
    </DarkStage>
  );
};

// ---- Terminal: the two CLI commands — dark stage --------------------------------
const TerminalBeat: React.FC = () => {
  const f = useCurrentFrame(); const c1 = T.cliOne - T.cli, c2 = T.cliTwo - T.cli, done = T.twocmd - T.cli;
  const type = (s: string, from: number, cps = 1.6) => s.slice(0, Math.max(0, Math.floor((f - from) * cps)));
  const Line: React.FC<{ at: number; color?: string; children: React.ReactNode; pad?: number }> = ({ at, color = "#e6e8f0", children, pad = 0 }) => (f >= at ? <div style={{ color, paddingLeft: pad, opacity: easeIn(f, at, at + 8), whiteSpace: "pre" }}>{children}</div> : null);
  return (
    <DarkStage chip="03 · DISPATCH RULE" active={3} done={3}>
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center", fontSize: 54, fontWeight: 600, letterSpacing: -1.6, opacity: easeIn(f, 0, 20) }}>Two commands. <Grad>Done.</Grad></div>
      <div style={{ position: "absolute", top: 230, left: 120, width: 1160, background: "#0f1117", borderRadius: 22, boxShadow: "0 30px 80px rgba(15,17,23,0.28)", overflow: "hidden", opacity: easeIn(f, 6, 26) }}>
        <div style={{ height: 44, display: "flex", alignItems: "center", gap: 8, padding: "0 18px", borderBottom: `1px solid ${DK_LINE}`, background: "#13161d" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />)}
          <span style={{ marginLeft: 14, fontFamily: MONO, fontSize: 14, color: "rgba(255,255,255,0.55)" }}>plivo-livekit-agent — zsh</span>
          <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 12, color: "#4ade80" }}>● LIVE</span>
        </div>
        <div style={{ padding: "30px 34px 34px", fontFamily: MONO, fontSize: 24, lineHeight: 1.75 }}>
          <div style={{ color: "#e6e8f0", whiteSpace: "pre" }}><span style={{ color: "#8ea2ff" }}>$ </span>{type('lk sip inbound create --name "plivo-inbound" --numbers "+17752398525"', c1)}</div>
          <Line at={c1 + 46} color="#9aa3b8">  SIPTrunkID: <span style={{ color: "#4ade80" }}>ST_kONoYHqu4rBw</span></Line>
          <div style={{ height: 14 }} />
          <div style={{ color: "#e6e8f0", whiteSpace: "pre", opacity: f >= c2 ? 1 : 0 }}><span style={{ color: "#8ea2ff" }}>$ </span>{type("lk sip dispatch create dispatch.json", c2)}</div>
          <Line at={c2 + 30} color="#9aa3b8">  └ agentName: <span style={{ color: "#fff" }}>"plivo-livekit-agent"</span></Line>
          <Line at={c2 + 44} color="#9aa3b8">  SIPDispatchRuleID: <span style={{ color: "#4ade80" }}>SDR_BimjHGnd2diZ</span></Line>
          <div style={{ height: 14 }} />
          <Line at={done} color="#4ade80">✓ calls now route to plivo-livekit-agent</Line>
          <Line at={T.cliDone - T.cli} color="#9aa3b8">  two commands. that's it.</Line>
        </div>
      </div>
      {/* the file the second command reads: created by you, names the agent */}
      <div style={{ position: "absolute", top: 230, left: 1320, width: 480, background: "#fff", borderRadius: 18, border: `1px solid ${DK_LINE}`, boxShadow: "0 24px 60px rgba(15,17,23,0.12)", overflow: "hidden", opacity: easeIn(f, c2 - 34, c2 - 14), transform: `translateX(${(1 - easeIn(f, c2 - 34, c2 - 14)) * 30}px)` }}>
        <div style={{ height: 44, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", borderBottom: `1px solid ${DK_LINE}`, background: "#f3f4f6", fontFamily: MONO, fontSize: 14, color: DK_INK }}><span style={{ color: "#323dfe" }}>{"{ }"}</span> dispatch.json <span style={{ marginLeft: "auto", fontFamily: INTER, fontSize: 12, color: DK_DIM }}>you write this</span></div>
        <div style={{ padding: "18px 20px 22px", fontFamily: MONO, fontSize: 17, lineHeight: 1.65, color: DK_INK, whiteSpace: "pre" }}>{[["{", 0], ['  "dispatchRule": {', 1], ['    "name": "plivo-dispatch",', 2], ['    "rule": {', 3], ['      "dispatchRuleIndividual": {', 4], ['        "roomPrefix": "call"', 5], ["      }", 6], ["    },", 7], ['    "roomConfig": {', 8], ['      "agents": [', 9], ['        { "agentName": "plivo-livekit-agent" }', 10], ["      ]", 11], ["    }", 12], ["  }", 13], ["}", 14]].map(([ln, k]) => <div key={String(k)} style={{ opacity: easeIn(f, c2 - 30 + Number(k) * 2, c2 - 22 + Number(k) * 2), background: k === 10 && f >= c2 + 30 ? "rgba(50,61,254,0.12)" : "transparent", color: k === 10 && f >= c2 + 30 ? "#323dfe" : DK_INK, borderRadius: 6, padding: "0 6px", margin: "0 -6px" }}>{String(ln)}</div>)}</div>
        <div style={{ position: "absolute", right: 18, bottom: 16, fontFamily: INTER, fontSize: 13, color: "#323dfe", opacity: easeIn(f, c2 + 30, c2 + 44) }}>← the agent by name</div>
      </div>
    </DarkStage>
  );
};

// ---- Steps (footage beats) ------------------------------------------------
type DkStep = Step & { dchip: string; active: number; done: number; dtitle?: React.ReactNode; dsub?: string; dbullets?: string[]; dtag?: string; opener?: React.ReactNode; steps?: number; dstill?: boolean };
const STEPS: DkStep[] = [
  { key: "agent", dchip: "01 · YOUR AGENT", active: 0, done: 0, dur: T.trunkOpen - T.agent, cap: { pre: "", kw: "" }, headline: <>Start with your agent. <Grad>Note its name.</Grad></>,
    clips: [ { node: <LkAgentBeat switchAt={154} noteAt={T.agentName - T.agent} />, dur: T.trunkOpen - T.agent } ],
    focus: { spot: { x: 262, y: 478, w: 450, h: 46 }, z: 1.6, t0: T.agentName - T.agent - 10, t1: T.agentName - T.agent + 14, t2: T.agentName - T.agent + 72, t3: T.agentName - T.agent + 100 } },
  { key: "trunk", dchip: "02 · SIP TRUNK", active: 1, done: 1, mixed: true, dur: T.trunkForm - T.trunkOpen, cap: { pre: "", kw: "" }, headline: <>An <Grad>inbound trunk</Grad>, for receiving calls.</>, opener: <>Now, <Grad>the trunk.</Grad></>, steps: 1,
    clips: [ { node: <span />, dur: T.trunkInbound - T.trunkOpen }, { node: <LkTrunkBeat clickAt={44} />, dur: T.trunkForm - T.trunkInbound } ] },
  { key: "trunkform", dchip: "02 · SIP TRUNK", active: 1, done: 1, dur: T.trunkLink - T.trunkForm, cap: { pre: "", kw: "" }, layout: "float", extract: { x: 1160, y: 0, w: 760, h: 1080 },
    clips: [ { node: <LkTrunkFormBeat typeFrom={8} typeUntil={50} platformOpenAt={90} platformPickAt={T.trunkMade - T.trunkForm - 10} />, dur: T.trunkLink - T.trunkForm } ],
    dstill: true, dtitle: <>Create an <Grad>inbound trunk.</Grad></>, dbullets: ["Direction: inbound", "SIP platform: LiveKit", "The SIP address fills in for you"], dtag: "● Primary URI → LiveKit" },
  { key: "trunklink", dchip: "02 · SIP TRUNK", active: 2, done: 2, dur: T.wrong - T.trunkLink, cap: { pre: "", kw: "" }, layout: "float", extract: { x: 1160, y: 0, w: 760, h: 1080 },
    clips: [ { node: <LkTrunkLinkBeat openAt={16} pickAt={70} createAt={150} />, dur: T.wrong - T.trunkLink } ],
    dtitle: <>Link your number<br /><Grad>to the trunk.</Grad></>, dsub: "No number yet? Buy one under Phone Numbers.", dtag: "● +1 775 239 8525 linked" },
];

export const LiveKitAgent: React.FC = () => {
    let acc = T.agent; const placed = STEPS.map((s) => { const from = acc; acc += s.dur; return { s, from }; });
  return (
    <AbsoluteFill style={{ backgroundColor: "#f9fafb" }}>
      <Sequence from={0} durationInFrames={T.close} layout="none"><Audio src={staticFile("vo/livekit-narr-v7f.mp3")} trimAfter={T.close} /></Sequence>
      <Sequence from={A("close")} layout="none"><Audio src={staticFile("vo/livekit-narr-v7f.mp3")} trimBefore={T.close} /></Sequence>

      {/* Hook: a story cut to the words (see Hooks.tsx) */}
      <Sequence from={0} durationInFrames={T.need} layout="none"><HookLiveKit t={{ agent: 35, livekit: 54, card: 62, smart: 89, fast: 111, now: 133, nobody: 160, fix: 223, five: 272, number: 320, people: 356, plivo: 397, end: T.need }} /></Sequence>
      <Sequence from={T.need} durationInFrames={T.agent - T.need} layout="none"><NeedDark at={[T.need1 - T.need, T.need2 - T.need, T.need3 - T.need]} /></Sequence>

      {/* Product steps on the dark stage */}
      {placed.map(({ s, from }) => (
        <Sequence key={s.key} from={from} durationInFrames={s.dur} layout="none">
          {s.layout === "float" && s.extract ? (
            <DarkSplit chip={s.dchip} rect={s.extract} title={s.dtitle} sub={s.dsub} bullets={s.dbullets} tag={s.dtag} active={s.active} done={s.done} still={s.dstill}><StepScene step={s} noCaption /></DarkSplit>
          ) : s.mixed ? (
            <>
              <Sequence from={0} durationInFrames={s.clips![0].dur} layout="none"><DarkOpener chip={s.dchip} title={s.opener} active={s.active} done={s.done} steps={s.steps} /></Sequence>
              <Sequence from={s.clips![0].dur} durationInFrames={s.dur - s.clips![0].dur} layout="none"><DarkFrame chip={s.dchip} headline={s.headline} active={s.active} done={s.done}><StepScene step={{ ...s, clips: s.clips!.slice(1), dur: s.dur - s.clips![0].dur }} noCaption dimOnly /></DarkFrame></Sequence>
            </>
          ) : (
            <DarkFrame chip={s.dchip} headline={s.headline} url={s.key === "agent" ? "cloud.livekit.io" : "cx.plivo.com"} active={s.active} done={s.done}><StepScene step={s} noCaption dimOnly /></DarkFrame>
          )}
        </Sequence>
      ))}

      {/* Dispatch rule: "the part people get wrong" → flow → the two commands */}
      <Sequence from={T.wrong} durationInFrames={T.dispatch - T.wrong} layout="none"><DarkOpener chip="03 · DISPATCH RULE" title={<>One more thing: <Grad>the dispatch rule.</Grad></>} active={3} done={3} steps={2} /></Sequence>
      <Sequence from={T.dispatch} durationInFrames={T.cli - T.dispatch} layout="none"><FlowBeat /></Sequence>
      <Sequence from={T.cli} durationInFrames={T.cliDone - T.cli} layout="none"><TerminalBeat /></Sequence>

      {/* "Go on, call it." → the real call (its own audio) → recap → logo */}
      <Sequence from={T.cliDone} durationInFrames={CALL_FROM + 12 - T.cliDone} layout="none"><PhoneDark title={<>Every call goes straight<br />to your agent. <Grad>Go on, call it.</Grad></>} sub="Same agent. Now on a real phone line." number="+1 775 239 8525" /></Sequence>
      <Sequence from={CALL_FROM} durationInFrames={CALL_DUR} layout="none">
        <Audio src={staticFile("vo/livekit-call.mp3")} trimBefore={Math.round(CALL_SRC[0] * 30)} trimAfter={Math.round(CALL_SRC[1] * 30)} volume={(f) => 1.1 * interpolate(f, [CALL_DUR - 18, CALL_DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      </Sequence>
      <Sequence from={CALL_FROM} durationInFrames={CALL_DUR} layout="none">
        <DarkSplit chip="04 · TEST CALL" rect={{ x: 60, y: 40, w: 1800, h: 1000 }} wide title={<>Talk to <Grad>the agent.</Grad></>} active={-1} done={4}>
          <LkCallBeat />
        </DarkSplit>
      </Sequence>
      <Sequence from={CALL_FROM + CALL_DUR} durationInFrames={A("build") - CALL_FROM - CALL_DUR} layout="none">
        <RecapDark title={<>Your LiveKit agent <Grad>now has a phone number.</Grad></>} cards={[
          { icon: "◉", title: "LiveKit agent", rows: [["Built in", "UI or code"], ["Runs on", "LiveKit Cloud"], ["Name", "plivo-livekit-agent"]] },
          { icon: "⇄", title: "Plivo SIP trunk", rows: [["Direction", "Inbound"], ["Primary URI", "LiveKit SIP"], ["Number", "+1 775 239 8525"]] },
          { icon: ">_", title: "Dispatch rule", rows: [["Created with", "lk CLI"], ["Routes to", "your agent"], ["Commands", "Two"]] },
        ]} />
      </Sequence>
      <Sequence from={A("build") - 14} durationInFrames={LK_TOTAL_FRAMES - A("build") + 14} layout="none"><LogoOutro cta={<>Let your callers <span style={{ color: BLUE }}>reach your LiveKit agent.</span></>} /></Sequence>
    </AbsoluteFill>
  );
};
