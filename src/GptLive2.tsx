import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { MONO, SORA, INTER } from "./StyleFrames";
import { ease, pop } from "./XaiBoard";
import { GL_REAL_CALL_ENV } from "./glRealCallEnv";
import { OaiWebhooksPage } from "./cards/OpenAiKit";
import { GlListBeat, GlPlatformBeat, GlUriBeat, GlLinkBeat, GlDoneBeat, GL_NUMBER, GL_PROJ } from "./cards/GlBeats";

// ---- "Paper & dot": white paper, black outline cards with a hard offset shadow, one blue dot that is the call ----
const S = 30; const PAPER = "#ffffff"; const INK = "#0f1117"; const BLUE = "#323dfe"; const GRAY = "#6b7280"; const LINE = "#e5e7eb";
const CARD: React.CSSProperties = { border: `2.5px solid ${INK}`, boxShadow: `12px 12px 0 ${INK}`, borderRadius: 18, background: PAPER };
const Tag: React.FC = () => <div style={{ position: "absolute", left: 110, top: 26, fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: GRAY }}>OPENAI × PLIVO · GPT-LIVE-1 ON A PHONE NUMBER</div>;
const Dot: React.FC<{ x: number; y: number; r: number; at?: number; pulse?: number; color?: string }> = ({ x, y, r, at = 0, pulse = 0, color = BLUE }) => { const f = useCurrentFrame(); const s = ease(f, at, at + 10) * (1 + pulse * 0.12 * Math.sin(f / 3)); return <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: color, transform: `scale(${s})` }} />; };
const Pill: React.FC<{ kicker: string; children: React.ReactNode; at?: number; cont?: boolean }> = ({ kicker, children, at = 0, cont }) => { const f = useCurrentFrame(); return <div style={{ position: "absolute", left: 110, top: 990, display: "inline-flex", alignItems: "center", gap: 18, background: INK, color: "#fff", borderRadius: 999, padding: "16px 30px 16px 24px", fontFamily: SORA, ...(cont ? {} : pop(f, at)) }}><span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: "#8f96ff" }}>{kicker}</span><span style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.6, whiteSpace: "nowrap" }}>{children}</span></div>; };
const hi = (t: string) => <span style={{ color: "#8f96ff" }}>{t}</span>;

type Ring = { at: number; x: number; y: number };
type Shot = { node: React.ReactNode; kicker: string; cap: React.ReactNode; cont?: boolean; rings?: Ring[] };
const PaperShot: React.FC<Shot> = ({ node, kicker, cap, cont, rings = [] }) => {
  const f = useCurrentFrame(); const k = 1700 / 1920;
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Tag />
      <div style={{ position: "absolute", left: 110, top: 46, width: 1700, height: 1080 * k, overflow: "hidden", ...CARD, ...(cont ? {} : { opacity: ease(f, 0, 6) }) }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: "top left" }}>
          {node}
          {rings.map((r, i) => { const t = f - r.at; if (t < -6 || t > 40) return null; const rad = 20 + Math.max(0, t) * 3.4; return <React.Fragment key={i}><div style={{ position: "absolute", left: r.x - rad, top: r.y - rad, width: rad * 2, height: rad * 2, borderRadius: "50%", border: `4px solid ${BLUE}`, opacity: Math.max(0, 1 - Math.max(0, t) / 40) }} /><div style={{ position: "absolute", left: r.x - 9, top: r.y - 9, width: 18, height: 18, borderRadius: 9, background: BLUE, opacity: ease(f, r.at - 6, r.at) * (1 - Math.max(0, t - 26) / 14) }} /></React.Fragment>; })}
        </div>
      </div>
      <Pill kicker={kicker} cont={cont}>{cap}</Pill>
    </AbsoluteFill>
  );
};

// ---- timeline -------------------------------------------------------------------------------
const TA = 27; const na = (t: number) => TA + Math.round(t * S);
const T_NEEDS = na(13.48); const T_S1 = na(22.9); const T_SIP = na(25.76); const T_WEB = na(33.72); const T_HAND = na(37.32); const T_S2 = na(47.16); const T_PL = na(48.92); const T_LETS = na(76.9); const T_CALL = na(78.0);
const CALL_LEN = GL_REAL_CALL_ENV.length; const T_CALL_END = T_CALL + CALL_LEN;
const TB = T_CALL_END + 15; const nb = (t: number) => TB + Math.round(t * S); const T_ACCEPT = nb(4.06); const T_CLOSE = nb(12.2);
export const GL2_FRAMES = nb(15.94) + 80;

// ---- opener: the hook -----------------------------------------------------------------------
const Opener: React.FC = () => {
  const f = useCurrentFrame(); const t = (s: number) => na(s);
  const talk = f >= t(5.38) && f < t(10.04); const inter = f >= t(8.36);
  return (
    <AbsoluteFill style={{ background: PAPER, fontFamily: SORA, color: INK }}>
      <Tag />
      <div style={{ position: "absolute", left: 110, top: 300, fontSize: 132, fontWeight: 700, letterSpacing: -5, lineHeight: 0.98 }}>
        <div style={{ ...pop(f, t(1.52)), opacity: f >= t(10.04) ? 0.18 : undefined }}>GPT-Live-1.</div>
        {f < t(10.04) ? <div style={{ ...pop(f, t(3.4)), fontSize: 64, fontWeight: 600, letterSpacing: -2, marginTop: 24, color: GRAY }}>Full duplex. It talks and listens at once.</div> : null}
        {f >= t(10.04) ? <div style={{ ...pop(f, t(10.62)) }}>On a real<br />phone number.</div> : null}
      </div>
      {talk ? <>
        <Dot x={1380} y={640} r={inter ? 70 : 120} at={t(5.56)} pulse={1} />
        <Dot x={1620} y={640} r={inter ? 130 : 80} at={t(6.28)} pulse={1} color={INK} />
        <div style={{ position: "absolute", left: 1300, top: 820, fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: GRAY, ...pop(f, t(5.56)) }}>{inter ? "YOU INTERRUPT · IT STOPS AND LISTENS" : "MODEL · YOU · BOTH LIVE"}</div>
      </> : null}
      {f >= t(11.92) ? <div style={{ position: "absolute", left: 110, top: 760, display: "flex", alignItems: "center", gap: 22, ...pop(f, t(11.92)) }}><span style={{ fontSize: 40, fontWeight: 600, color: GRAY }}>with</span><PlivoLogoSvg width={230} color={INK} /></div> : null}
    </AbsoluteFill>
  );
};

const Needs: React.FC = () => {
  const f = useCurrentFrame(); const t = (sec: number) => na(sec) - T_NEEDS;
  const items: [string, string, string, number][] = [["01", "An OpenAI project", "with GPT-Live-1", 15.0], ["02", "A backend", "that accepts the call", 18.16], ["03", "A Plivo account", "with a phone number", 20.6]];
  const xs = [110, 684, 1258]; const on = (sec: number) => f >= t(sec);
  // the blue dot walks from card to card as each one is named
  const k = on(20.6) ? 2 : on(18.16) ? 1 : 0; const prevX = xs[Math.max(0, k - 1)] + 265; const toX = xs[k] + 265; const dotX = prevX + (toX - prevX) * ease(f, t(items[k][3]) - 8, t(items[k][3]) + 4);
  const Wave: React.FC = () => <div style={{ display: "flex", gap: 5, alignItems: "center", height: 40 }}>{Array.from({ length: 22 }, (_, i) => <span key={i} style={{ width: 6, height: 8 + 28 * Math.abs(Math.sin(i * 0.8 + f * 0.25)), borderRadius: 3, background: BLUE }} />)}</div>;
  const Ping: React.FC = () => { const p = (f / 36) % 2; const x = p < 1 ? p * 300 : (2 - p) * 300; return <div style={{ position: "relative", height: 44, width: 400 }}><div style={{ position: "absolute", left: 40, right: 40, top: 20, height: 3, background: LINE }} /><span style={{ position: "absolute", left: 20, top: 8, fontFamily: MONO, fontSize: 12, color: GRAY }}>OPENAI</span><span style={{ position: "absolute", right: 0, top: 8, fontFamily: MONO, fontSize: 12, color: GRAY }}>BACKEND</span><div style={{ position: "absolute", left: 60 + x, top: 13, width: 16, height: 16, borderRadius: 8, background: p < 1 ? BLUE : INK }} /><span style={{ position: "absolute", left: 120, top: 30, fontFamily: MONO, fontSize: 12, color: p < 1 ? BLUE : INK }}>{p < 1 ? "live.transport.incoming →" : "← accept"}</span></div>; };
  const Ring: React.FC = () => <div style={{ position: "relative", height: 44, display: "flex", alignItems: "center", gap: 16 }}><span style={{ position: "relative", width: 32, height: 32, borderRadius: 16, background: BLUE, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16 }}>☎{[0, 1].map((r) => { const q = ((f / 30 + r * 0.5) % 1); return <span key={r} style={{ position: "absolute", left: 16 - 16 - q * 22, top: 16 - 16 - q * 22, width: 32 + q * 44, height: 32 + q * 44, borderRadius: "50%", border: `2px solid ${BLUE}`, opacity: 1 - q }} />; })}</span><span style={{ fontFamily: MONO, fontSize: 22, color: INK }}>{GL_NUMBER}</span></div>;
  const illos = [<><div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: GRAY, marginBottom: 10 }}>MODEL</div><div style={{ display: "inline-block", fontFamily: MONO, fontSize: 20, padding: "8px 14px", border: `2px solid ${INK}`, borderRadius: 10, marginBottom: 14 }}>gpt-live-1</div><Wave /></>, <><div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: GRAY, marginBottom: 10 }}>ONE WEBHOOK, ONE POST</div><Ping /></>, <><div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: GRAY, marginBottom: 10 }}>YOUR NUMBER</div><Ring /></>];
  return (
    <AbsoluteFill style={{ background: PAPER, fontFamily: SORA, color: INK }}>
      <Tag />
      <div style={{ position: "absolute", left: 110, top: 150, fontSize: 84, fontWeight: 700, letterSpacing: -3, ...pop(f, na(13.54) - T_NEEDS) }}>You need three things.</div>
      <div style={{ position: "absolute", left: 110 + 265, top: 330, width: 1146, height: 4, background: LINE }} />
      {f >= t(15.0) ? <div style={{ position: "absolute", left: dotX - 16, top: 316, width: 32, height: 32, borderRadius: 16, background: BLUE, boxShadow: `0 0 0 ${6 + 6 * Math.abs(Math.sin(f / 6))}px rgba(50,61,254,0.18)` }} /> : null}
      {items.map(([n, a, b, at], i) => <div key={n} style={{ position: "absolute", left: xs[i], top: 380, width: 530, height: 520, padding: "34px 36px", ...CARD, ...pop(f, t(at)) }}><div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: BLUE }}>{n}</div><div style={{ marginTop: 24, fontSize: 40, fontWeight: 700, letterSpacing: -1.2 }}>{a}</div><div style={{ marginTop: 8, fontSize: 26, color: GRAY }}>{b}</div><div style={{ position: "absolute", left: 36, right: 36, bottom: 34, opacity: ease(f, t(at) + 10, t(at) + 22) }}>{illos[i]}</div></div>)}
    </AbsoluteFill>
  );
};

const SectionIntro: React.FC<{ n: string; name: string; sub: string }> = ({ n, name, sub }) => { const f = useCurrentFrame(); return (
  <AbsoluteFill style={{ background: PAPER, fontFamily: SORA, color: INK }}>
    <Tag />
    <div style={{ position: "absolute", left: 96, top: 250, fontSize: 420, fontWeight: 700, letterSpacing: -20, lineHeight: 1, color: "transparent", WebkitTextStroke: `3px ${INK}`, ...pop(f, 0) }}>{n}</div>
    <div style={{ position: "absolute", left: 760, top: 420, ...pop(f, 6) }}><div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -4 }}>{name}</div><div style={{ marginTop: 10, fontSize: 30, color: GRAY }}>{sub}</div></div>
    <Dot x={1740} y={470} r={44} at={10} pulse={1} />
  </AbsoluteFill>); };

const SipAddress: React.FC = () => { const f = useCurrentFrame(); const t = (s: number) => na(s) - T_SIP; const on1 = f >= t(28.28), on2 = f >= t(29.5); return (
  <AbsoluteFill style={{ background: PAPER, fontFamily: SORA, color: INK }}>
    <Tag />
    <div style={{ position: "absolute", left: 110, top: 250, fontSize: 84, fontWeight: 700, letterSpacing: -3, ...pop(f, 0) }}>Your project's SIP address.</div>
    <div style={{ position: "absolute", left: 110, top: 470, width: 1700, padding: "44px 48px", fontFamily: MONO, fontSize: 42, letterSpacing: -0.5, ...CARD, ...pop(f, 8) }}>sip:<span style={{ color: on1 ? BLUE : INK, background: on1 ? "rgba(50,61,254,0.08)" : "transparent", borderRadius: 8, padding: "0 4px" }}>{GL_PROJ}</span>@<span style={{ borderBottom: on2 ? `6px solid ${BLUE}` : "6px solid transparent" }}>sip.api.openai.com</span>;transport=tls</div>
    <div style={{ position: "absolute", left: 110, top: 720, display: "flex", gap: 60 }}>
      <div style={{ ...pop(f, t(28.28)) }}><div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: BLUE }}>YOUR PROJECT ID</div><div style={{ marginTop: 8, fontSize: 30, color: GRAY }}>from your OpenAI project settings</div></div>
      <div style={{ ...pop(f, t(29.5)) }}><div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: BLUE }}>OPENAI'S SIP HOST</div><div style={{ marginTop: 8, fontSize: 30, color: GRAY }}>the same for every project, TLS</div></div>
    </div>
  </AbsoluteFill>); };

const Handshake: React.FC = () => { const f = useCurrentFrame(); const t = (s: number) => na(s) - T_HAND; const Box: React.FC<{ x: number; y: number; w: number; k: string; title: string; at: number; children?: React.ReactNode }> = ({ x, y, w, k, title, at, children }) => <div style={{ position: "absolute", left: x, top: y, width: w, padding: "26px 30px", ...CARD, ...pop(f, at) }}><div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: BLUE }}>{k}</div><div style={{ marginTop: 8, fontSize: 40, fontWeight: 700, letterSpacing: -1.2 }}>{title}</div>{children}</div>;
  const Arrow: React.FC<{ y: number; at: number; label: string; back?: boolean }> = ({ y, at, label, back }) => { const p = ease(f, at, at + 16); return <><div style={{ position: "absolute", left: back ? 1130 - 330 * p : 800, top: y, width: 330 * p, height: 4, background: back ? INK : BLUE }} /><div style={{ position: "absolute", left: 800, top: y - 40, width: 330, textAlign: "center", fontFamily: MONO, fontSize: 14, letterSpacing: 2, color: back ? INK : BLUE, opacity: ease(f, at + 6, at + 14) }}>{label}</div></>; };
  const chips = [["MODEL", "gpt-live-1", 42.3], ["VOICE", "marin", 43.0], ["INSTRUCTIONS", "how it speaks, what it does", 43.76]] as [string, string, number][];
  return (
    <AbsoluteFill style={{ background: PAPER, fontFamily: SORA, color: INK }}>
      <Tag />
      <div style={{ position: "absolute", left: 110, top: 150, fontSize: 72, fontWeight: 700, letterSpacing: -2.5, ...pop(f, 0) }}>{f >= t(45.06) ? "That's all the backend does." : "When a call arrives."}</div>
      <Box x={110} y={420} w={640} k="OPENAI" title="Incoming call" at={t(37.66)}><div style={{ marginTop: 10, fontSize: 24, color: GRAY }}>{GL_NUMBER} → sip.api.openai.com</div></Box>
      <Arrow y={520} at={t(38.96)} label="PINGS  live.transport.incoming" />
      <Arrow y={600} at={t(40.72)} label="ACCEPTS THE SESSION" back />
      <Box x={1180} y={420} w={640} k="YOUR BACKEND" title="Accept" at={t(38.64)}><div style={{ marginTop: 10, fontSize: 24, color: GRAY }}>one webhook, one POST</div></Box>
      <div style={{ position: "absolute", left: 1180, top: 690, display: "flex", flexDirection: "column", gap: 14 }}>{chips.map(([k, v, at]) => <div key={k} style={{ display: "flex", alignItems: "center", gap: 18, ...pop(f, t(at)) }}><span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: BLUE, width: 150 }}>{k}</span><span style={{ fontSize: 28, fontWeight: 600, padding: "10px 18px", ...CARD, boxShadow: `6px 6px 0 ${INK}`, borderRadius: 12 }}>{v}</span></div>)}</div>
    </AbsoluteFill>); };

// ---- the real call --------------------------------------------------------------------------
const LINES: [number, number, "GPT-LIVE-1" | "YOU", string][] = [
  [0.0, 3.6, "GPT-LIVE-1", "Hi, thanks for calling Plivo. What can I help you with today?"],
  [4.15, 11.15, "YOU", "Hi, I'm building a voice agent and I want to put it on a real phone number. Does Plivo support SIP trunking for that?"],
  [11.7, 22.7, "GPT-LIVE-1", "I'll check that for you. Yes, Plivo supports SIP trunking through Zentrunk, so you can connect your voice agent to the public phone network for inbound and outbound calls."],
];
const CallCard: React.FC<{ live: boolean; dim?: boolean; final?: boolean; top?: number; height?: number }> = ({ live, dim, final, top = 180, height = 700 }) => {
  const f = useCurrentFrame(); const t = f / S; const lvl = live ? (GL_REAL_CALL_ENV[Math.min(f, CALL_LEN - 1)] ?? 0) : 0; const cur = live ? LINES.findIndex(([a, b]) => t >= a && t < b + 0.3) : -1; const who = cur >= 0 ? LINES[cur][2] : null;
  return (
    <div style={{ position: "absolute", left: 250, top, width: 1420, height, padding: "34px 44px", fontFamily: SORA, color: INK, ...CARD, opacity: dim ? 0.45 : 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: GRAY }}><span style={{ width: 12, height: 12, borderRadius: 6, background: live ? BLUE : GRAY, transform: `scale(${1 + lvl * 0.6})` }} /><span style={{ color: INK }}>{live ? "LIVE" : final ? "ENDED" : "DIALLING"}</span><span>·</span><span>{GL_NUMBER}</span><span>·</span><span>GPT-LIVE-1 VIA PLIVO</span><span style={{ marginLeft: "auto" }}>{live ? `00:${String(Math.floor(t)).padStart(2, "0")}` : final ? "00:22" : "00:00"}</span><span style={{ border: `1.5px solid ${INK}`, borderRadius: 999, padding: "4px 10px", color: INK }}>REAL CALL · RECORDED ON PLIVO</span></div>
      <div style={{ marginTop: 40 }}>{final ? LINES.map(([, , w, txt], i) => <div key={i} style={{ display: "flex", gap: 26, marginBottom: 18 }}><span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: w === "YOU" ? INK : BLUE, width: 110, paddingTop: 8, flex: "none" }}>{w}</span><span style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.6, lineHeight: 1.3 }}>{txt}</span></div>) : live ? LINES.map(([a, b, w, txt], i) => { if (t < a - 0.1) return null; const on = i === cur; const n = Math.floor(Math.max(0, (t - a) / (b - a)) * txt.length); return <div key={i} style={{ display: "flex", gap: 26, marginBottom: 26, opacity: on || t >= b ? 1 : 0.5 }}><span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: w === "YOU" ? INK : BLUE, width: 110, paddingTop: 10, flex: "none" }}>{w}</span><span style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.8, lineHeight: 1.3, color: on ? INK : GRAY }}>{txt.slice(0, Math.min(txt.length, n))}{on ? <span style={{ opacity: Math.round(f / 6) % 2 }}>▏</span> : null}</span></div>; }) : <div style={{ fontSize: 34, color: GRAY }}>Calling the Plivo number…</div>}</div>
      <div style={{ position: "absolute", left: 44, bottom: 34, display: "flex", gap: 6, alignItems: "center", height: 44 }}>{Array.from({ length: 40 }, (_, i) => <span key={i} style={{ width: 7, height: 6 + 38 * lvl * (0.4 + 0.6 * Math.abs(Math.sin(i * 0.7 + f * 0.3))), borderRadius: 3, background: who === "YOU" ? INK : BLUE }} />)}</div>
    </div>
  );
};
const RealCall: React.FC = () => (
  <AbsoluteFill style={{ background: PAPER }}>
    <Tag />
    <CallCard live />
    <Audio src={staticFile("vo/gptlive2/real-call-1-tight.mp3")} volume={(fr) => 1.1 * Math.min(1, (CALL_LEN - fr) / 12)} />
    <div style={{ position: "absolute", left: 250, top: 930, fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: GRAY }}>CALLER → PLIVO NUMBER → INBOUND TRUNK (OPENAI REALTIME PRESET) → GPT-LIVE-1</div>
  </AbsoluteFill>
);
const LetsCall: React.FC = () => { const f = useCurrentFrame(); return <AbsoluteFill style={{ background: PAPER, fontFamily: SORA, color: INK }}><Tag /><div style={{ position: "absolute", left: 110, top: 300, fontSize: 132, fontWeight: 700, letterSpacing: -5, ...pop(f, 0) }}>Let's call it.</div><div style={{ position: "absolute", left: 110, top: 480, fontSize: 36, color: GRAY, ...pop(f, 8) }}>Dial the Plivo number from any phone.</div><Dot x={1640} y={420} r={90} at={4} pulse={1} /></AbsoluteFill>; };
const After: React.FC = () => { const f = useCurrentFrame(); return <AbsoluteFill style={{ background: PAPER, fontFamily: SORA, color: INK }}><Tag /><div style={{ position: "absolute", left: 110, top: 110, fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.04, ...pop(f, 0) }}>That's GPT-Live-1, <span style={{ color: BLUE }}>on a real phone line.</span></div><CallCard live={false} final top={330} height={560} /></AbsoluteFill>; };

const AcceptBeat: React.FC = () => { const f = useCurrentFrame(); const t = (s: number) => nb(s) - T_ACCEPT; const changed = f >= t(9.74); const rows: [string, string, string][] = [["model", "gpt-live-1", "gpt-live-1"], ["voice", "marin", "cedar"], ["instructions", "Calm, friendly. One or two short sentences.", "Upbeat and quick. Jokes allowed."]];
  return (
    <AbsoluteFill style={{ background: PAPER, fontFamily: SORA, color: INK }}>
      <Tag />
      <div style={{ position: "absolute", left: 110, top: 170, fontSize: 84, fontWeight: 700, letterSpacing: -3, ...pop(f, 0) }}>{changed ? "Change it. The next call picks it up." : "Want it different?"}</div>
      <div style={{ position: "absolute", left: 110, top: 400, width: 1700, padding: "36px 44px", ...CARD, ...pop(f, t(6.74)) }}>
        <div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: BLUE }}>YOUR BACKEND · ACCEPT THE SESSION</div>
        {rows.map(([k, a, b]) => <div key={k} style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 24, fontSize: 40 }}><span style={{ fontFamily: MONO, fontSize: 26, color: GRAY, width: 260 }}>{k}</span><span style={{ fontWeight: 600, letterSpacing: -1, color: changed && a !== b ? BLUE : INK }}>{changed ? b : a}</span>{changed && a !== b ? <span style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: BLUE, ...pop(f, t(9.74)) }}>CHANGED</span> : null}</div>)}
      </div>
      {f >= t(10.48) ? <Dot x={1640} y={890} r={40} at={t(10.48)} pulse={1} /> : null}
    </AbsoluteFill>); };
const Closer: React.FC = () => { const f = useCurrentFrame(); return <AbsoluteFill style={{ background: PAPER, fontFamily: SORA, color: INK }}><div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontSize: 92, fontWeight: 700, letterSpacing: -3.5, lineHeight: 1.05, ...pop(f, 0) }}>Need your OpenAI voice agent<br />on a telephone?</div><div style={{ position: "absolute", left: 0, right: 0, top: 600, display: "flex", justifyContent: "center", alignItems: "center", gap: 24, ...pop(f, nb(15.1) - T_CLOSE) }}><span style={{ fontSize: 56, fontWeight: 600, color: GRAY }}>Connect it with</span><PlivoLogoSvg width={300} color={INK} /></div><Dot x={960} y={820} r={22} at={nb(15.1) - T_CLOSE + 6} pulse={1} /></AbsoluteFill>; };

// ---- Plivo shots on the kit (narration seconds) ----------------------------------------------
const PL: [number, number, Shot][] = [
  [48.92, 52.32, { node: <GlListBeat clickAt={41} />, kicker: "02 · PLIVO", cap: <>Open SIP Trunking, and {hi("create an inbound trunk.")}</> }],
  [52.32, 57.84, { node: <GlPlatformBeat openAt={22} hoverAt={40} pickAt={50} />, kicker: "SIP PLATFORM", cap: <>Pick {hi("OpenAI Realtime.")} This is the part that matters.</> }],
  [57.84, 60.8, { node: <GlUriBeat modalAt={43} />, kicker: "PRIMARY URI", cap: <>For the primary URI, {hi("create a new one.")}</> }],
  [60.8, 66.22, { node: <GlUriBeat modalAt={0} />, cont: true, rings: [{ at: 61, x: 1180, y: 503 }, { at: 102, x: 660, y: 562 }], kicker: "PRE-FILLED", cap: <>Plivo already knows {hi("OpenAI's SIP address,")} and TLS is on.</> }],
  [66.22, 68.72, { node: <GlUriBeat modalAt={0} projFrom={6} projUntil={44} />, kicker: "PROJECT ID", cap: <>All you type is {hi("your project ID.")}</> }],
  [68.72, 70.52, { node: <GlUriBeat modalAt={0} projFrom={0} projUntil={0} nameFrom={3} nameUntil={22} createdAt={36} />, kicker: "PROJECT ID", cap: <>Name it, {hi("and create it.")}</> }],
  [70.52, 73.2, { node: <GlLinkBeat openAt={8} pickAt={26} createAt={44} />, kicker: "LINK YOUR NUMBER", cap: <>{hi("Link your phone number,")} and create the trunk.</> }],
  [73.2, 76.9, { node: <GlDoneBeat />, kicker: "DONE ON PLIVO", cap: <>Your number now {hi("rings straight into OpenAI.")}</> }],
];

export const GptLive2: React.FC = () => (
  <AbsoluteFill style={{ background: PAPER }}>
    <Sequence from={TA} layout="none"><Audio src={staticFile("vo/gptlive2/narr-a.mp3")} /></Sequence>
    <Sequence from={TB} layout="none"><Audio src={staticFile("vo/gptlive2/narr-b.mp3")} /></Sequence>
    <Sequence from={0} durationInFrames={T_NEEDS} layout="none"><Opener /></Sequence>
    <Sequence from={T_NEEDS} durationInFrames={T_S1 - T_NEEDS} layout="none"><Needs /></Sequence>
    <Sequence from={T_S1} durationInFrames={T_SIP - T_S1} layout="none"><SectionIntro n="01" name="OpenAI" sub="Two things to note in your project." /></Sequence>
    <Sequence from={T_SIP} durationInFrames={T_WEB - T_SIP} layout="none"><SipAddress /></Sequence>
    <Sequence from={T_WEB} durationInFrames={T_HAND - T_WEB} layout="none"><PaperShot node={<OaiWebhooksPage />} rings={[{ at: 30, x: 1420, y: 400 }, { at: 56, x: 1000, y: 400 }]} kicker="01 · OPENAI · WEBHOOKS" cap={<>A webhook for {hi("incoming calls,")} pointing at your backend.</>} /></Sequence>
    <Sequence from={T_HAND} durationInFrames={T_S2 - T_HAND} layout="none"><Handshake /></Sequence>
    <Sequence from={T_S2} durationInFrames={T_PL - T_S2} layout="none"><SectionIntro n="02" name="Plivo" sub="The whole telephony story, in one trunk." /></Sequence>
    {PL.map(([a, b, s], i) => <Sequence key={i} from={na(a)} durationInFrames={na(b) - na(a)} layout="none"><PaperShot {...s} /></Sequence>)}
    <Sequence from={T_LETS} durationInFrames={T_CALL - T_LETS} layout="none"><LetsCall /></Sequence>
    <Sequence from={T_CALL} durationInFrames={CALL_LEN} layout="none"><RealCall /></Sequence>
    <Sequence from={T_CALL_END} durationInFrames={T_ACCEPT - T_CALL_END} layout="none"><After /></Sequence>
    <Sequence from={T_ACCEPT} durationInFrames={T_CLOSE - T_ACCEPT} layout="none"><AcceptBeat /></Sequence>
    <Sequence from={T_CLOSE} durationInFrames={GL2_FRAMES - T_CLOSE} layout="none"><Closer /></Sequence>
  </AbsoluteFill>
);
