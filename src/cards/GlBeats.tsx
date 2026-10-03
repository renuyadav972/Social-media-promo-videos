import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { SipTrunkingPage, CreateTrunkDrawer, CreateProjectUriModal } from "./TrunkKit";

// Plivo trunk beats for the OpenAI Realtime preset (GPT-Live video). Frames relative to each shot.
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const GL_NUMBER = "+1 806 209 0453"; const PLAT = "OpenAI Realtime"; const NAME = "OpenAI"; export const GL_PROJ = "proj_••••••••••••"; const ADDR = `sip:${GL_PROJ}@sip.api.openai.com;transport=tls`;
const type = (f: number, s: string, from: number, until: number) => (until <= from ? (f >= from ? s : "") : s.slice(0, Math.floor(ease(f, from, until) * s.length)));

export const GlListBeat: React.FC<{ clickAt: number }> = ({ clickAt }) => { const f = useCurrentFrame(); const slide = ease(f, clickAt + 6, clickAt + 26); return <AbsoluteFill><SipTrunkingPage pulseAt={clickAt} dim={slide > 0.05} drawer={slide > 0 ? <CreateTrunkDrawer showPlatform v2 right={-760 * (1 - slide)} /> : null} /></AbsoluteFill>; };
export const GlPlatformBeat: React.FC<{ openAt: number; hoverAt: number; pickAt: number }> = ({ openAt, hoverAt, pickAt }) => { const f = useCurrentFrame(); return <AbsoluteFill><SipTrunkingPage dim drawer={<CreateTrunkDrawer showPlatform v2 platformOpen={f >= openAt && f < pickAt} platformHover={f >= hoverAt ? PLAT : ""} platform={f >= pickAt ? PLAT : ""} />} /></AbsoluteFill>; };
export const GlUriBeat: React.FC<{ modalAt: number; projFrom?: number; projUntil?: number; nameFrom?: number; nameUntil?: number; createdAt?: number }> = ({ modalAt, projFrom = 9999, projUntil = 9999, nameFrom = 9999, nameUntil = 9999, createdAt = 9999 }) => {
  const f = useCurrentFrame(); const created = f >= createdAt;
  return <AbsoluteFill><SipTrunkingPage dim toast={created ? "Origination URI created successfully" : undefined} drawer={<><CreateTrunkDrawer showPlatform v2 platform={PLAT} name={NAME} uri={created ? NAME : ""} uriAddress={ADDR} />{f >= modalAt && !created ? <CreateProjectUriModal name={type(f, NAME, nameFrom, nameUntil)} typing={f >= nameFrom && f < nameUntil + 10} projectId={type(f, GL_PROJ, projFrom, projUntil)} projectTyping={f >= projFrom && f < projUntil + 10} /> : null}</>} /></AbsoluteFill>;
};
export const GlLinkBeat: React.FC<{ openAt: number; pickAt: number; createAt?: number }> = ({ openAt, pickAt, createAt = 9999 }) => { const f = useCurrentFrame(); return <AbsoluteFill><SipTrunkingPage dim toast={f >= createAt ? "Inbound trunk created successfully" : undefined} drawer={<CreateTrunkDrawer showPlatform v2 platform={PLAT} name={NAME} uri={NAME} uriAddress={ADDR} numbers={[[GL_NUMBER, ""]]} numbersOpen={f >= openAt && f < pickAt + 16} numbersHover={f >= openAt + 10 ? GL_NUMBER : ""} linked={f >= pickAt ? [GL_NUMBER] : []} />} /></AbsoluteFill>; };
export const GlDoneBeat: React.FC = () => <AbsoluteFill><SipTrunkingPage rows={[{ name: NAME, uri: NAME, numbers: 1 }]} toast="Inbound trunk created successfully" /></AbsoluteFill>;
