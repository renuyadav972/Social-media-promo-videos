import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { SipTrunkingPage, CreateTrunkDrawer, CreateUriModal } from "./TrunkKit";
import { VapiNumberPage, VapiImportDialog, VapiLogsPage, NUMBERS } from "./VapiKit";

// Scenes of the Vapi video on the kit. Frames are relative to each shot's Sequence (30 fps).
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const NUMBER = "+1 701 719 8695"; const PLAT = "Vapi"; const ADDR = "sip:sip.vapi.ai;transport=udp";
const type = (f: number, s: string, from: number, until: number) => (until <= from ? (f >= from ? s : "") : s.slice(0, Math.floor(ease(f, from, until) * s.length)));

// ---- Plivo ----
export const VpListBeat: React.FC<{ clickAt: number }> = ({ clickAt }) => { const f = useCurrentFrame(); const slide = ease(f, clickAt + 6, clickAt + 26); return <AbsoluteFill><SipTrunkingPage pulseAt={clickAt} dim={slide > 0.05} drawer={slide > 0 ? <CreateTrunkDrawer showPlatform right={-760 * (1 - slide)} /> : null} /></AbsoluteFill>; };
export const VpPlatformBeat: React.FC<{ openAt: number; hoverAt: number; pickAt: number; typeFrom?: number; typeUntil?: number }> = ({ openAt, hoverAt, pickAt, typeFrom = 9999, typeUntil = 9999 }) => { const f = useCurrentFrame(); return <AbsoluteFill><SipTrunkingPage dim drawer={<CreateTrunkDrawer showPlatform name={type(f, "Vapi", typeFrom, typeUntil)} typing={f >= typeFrom && f < typeUntil + 8} platformOpen={f >= openAt && f < pickAt} platformHover={f >= hoverAt ? PLAT : ""} platform={f >= pickAt ? PLAT : ""} uriAddress={ADDR} />} /></AbsoluteFill>; };
export const VpUriBeat: React.FC<{ modalAt: number; nameFrom?: number; nameUntil?: number; createdAt?: number }> = ({ modalAt, nameFrom = 9999, nameUntil = 9999, createdAt = 9999 }) => {
  const f = useCurrentFrame(); const created = f >= createdAt;
  return <AbsoluteFill><SipTrunkingPage dim toast={created ? "Origination URI created successfully" : undefined} drawer={<><CreateTrunkDrawer showPlatform platform={PLAT} name="Vapi" uri={created ? "Vapi" : ""} uriAddress={ADDR} />{f >= modalAt && !created ? <CreateUriModal platform="Vapi" address={ADDR} name={type(f, "Vapi", nameFrom, nameUntil)} typing={f >= nameFrom && f < nameUntil + 10} /> : null}</>} /></AbsoluteFill>;
};
export const VpLinkBeat: React.FC<{ openAt: number; pickAt: number; createAt?: number }> = ({ openAt, pickAt, createAt = 9999 }) => { const f = useCurrentFrame(); return <AbsoluteFill><SipTrunkingPage dim toast={f >= createAt ? "Inbound trunk created successfully" : undefined} drawer={<CreateTrunkDrawer showPlatform platform={PLAT} name="Vapi" uri="Vapi" uriAddress={ADDR} numbers={[[NUMBER, ""]]} numbersOpen={f >= openAt && f < pickAt + 16} numbersHover={f >= openAt + 10 ? NUMBER : ""} linked={f >= pickAt ? [NUMBER] : []} />} /></AbsoluteFill>; };
export const VpDoneBeat: React.FC = () => <AbsoluteFill><SipTrunkingPage rows={[{ name: "Vapi", uri: "Vapi", numbers: 1 }]} toast="Inbound trunk created successfully" /></AbsoluteFill>;

// ---- Vapi ----
const ONE: [string, string][] = [NUMBERS[0]];
export const VaImportBeat: React.FC<{ dialogAt: number; typeFrom: number; typeUntil: number; credOpenAt: number; credPickAt: number; importAt: number }> = ({ dialogAt, typeFrom, typeUntil, credOpenAt, credPickAt, importAt }) => {
  const f = useCurrentFrame(); const imported = f >= importAt + 20;
  return <AbsoluteFill><VapiNumberPage numbers={imported ? NUMBERS : ONE} selected={imported ? 1 : 0} saved />{f >= dialogAt && !imported ? <VapiImportDialog number={type(f, "+17017198695", typeFrom, typeUntil)} typing={f >= typeFrom && f < typeUntil + 8} credentialOpen={f >= credOpenAt && f < credPickAt} credential={f >= credPickAt ? "PLIVO Trunk" : ""} label={f >= credPickAt + 10 ? "Plivo SIP Number" : ""} busy={f >= importAt} /> : null}</AbsoluteFill>;
};
export const VaAssistantBeat: React.FC<{ openAt: number; hoverAt: number; pickAt: number; saveAt: number }> = ({ openAt, hoverAt, pickAt, saveAt }) => { const f = useCurrentFrame(); return <AbsoluteFill><VapiNumberPage scrolled assistant={f >= pickAt ? "Plivo Voice Assistant" : ""} assistantOpen={f >= openAt && f < pickAt} assistantHover={f >= hoverAt} saved={f < pickAt || f >= saveAt} /></AbsoluteFill>; };
export const VaLogsBeat: React.FC = () => <AbsoluteFill><VapiLogsPage rows={1} /></AbsoluteFill>;
