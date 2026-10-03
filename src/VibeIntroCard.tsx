import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "./fonts";
import { PlivoLogoSvg } from "./PlivoLogoSvg";

// Cream topic-first title card — matches the Pipecat intro FORMAT (Plivo logo
// top-left, bracket TechFrame corners, dotted grid, big Sora title + subtitle)
// but in the Vibe promo's cream palette so the video stays consistent.

const CREAM_BG =
  "radial-gradient(120% 95% at 50% 0%, #fbfaf8 0%, #f6f5f3 55%, #efeeea 100%)";
const INK = "#0f1117";
const MUTED = "#67686f";
const BRACKET = "rgba(15,17,23,0.18)";

const Bracket: React.FC<{ pos: "tl" | "tr" | "bl" | "br" }> = ({ pos }) => {
  const arm = 34;
  const s: React.CSSProperties = {
    position: "absolute",
    width: arm,
    height: arm,
    borderColor: BRACKET,
    borderStyle: "solid",
    borderWidth: 0,
  };
  if (pos === "tl") Object.assign(s, { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2 });
  if (pos === "tr") Object.assign(s, { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2 });
  if (pos === "bl") Object.assign(s, { bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2 });
  if (pos === "br") Object.assign(s, { bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2 });
  return <div style={s} />;
};

export const VibeIntroCard: React.FC<{
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}> = ({
  title = (
    <>
      Introducing <span style={{ color: "#323dfe" }}>Vibe Agent</span>
    </>
  ),
  subtitle = "Take your idea to a workflow by describing it as a prompt.",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const ease = { easing: Easing.inOut(Easing.cubic), ...clamp } as const;
  const easeOut = { easing: Easing.out(Easing.cubic), ...clamp } as const;

  const all = interpolate(frame, [0, 10, durationInFrames - 16, durationInFrames], [0, 1, 1, 0], ease);
  const rise = (delay: number, dist = 20) => {
    const e = interpolate(frame, [delay, delay + 18], [0, 1], easeOut);
    return { opacity: e, transform: `translateY(${(1 - e) * dist}px)` };
  };
  const logo = interpolate(frame, [4, 20], [0, 1], easeOut);

  return (
    <AbsoluteFill
      style={{
        background: CREAM_BG,
        fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif`,
      }}
    >
      {/* masked dotted grid */}
      <AbsoluteFill
        style={{
          opacity: all,
          backgroundImage: "radial-gradient(circle, rgba(15,17,23,0.05) 1px, transparent 1.4px)",
          backgroundSize: "30px 30px",
          WebkitMaskImage: "radial-gradient(120% 120% at 50% 40%, #000 55%, transparent 100%)",
          maskImage: "radial-gradient(120% 120% at 50% 40%, #000 55%, transparent 100%)",
        }}
      />
      {/* TechFrame corner brackets */}
      <div style={{ position: "absolute", inset: 60, opacity: all, pointerEvents: "none" }}>
        <Bracket pos="tl" />
        <Bracket pos="tr" />
        <Bracket pos="bl" />
        <Bracket pos="br" />
      </div>
      {/* Plivo logo top-left */}
      <div style={{ position: "absolute", top: 78, left: 112, opacity: Math.min(all, logo) }}>
        <PlivoLogoSvg width={132} />
      </div>
      {/* centered wrap, left-aligned content */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 1400, padding: "0 52px", opacity: all }}>
          <h1
            style={{
              ...rise(12),
              fontFamily: SORA_FAMILY,
              fontWeight: 400,
              fontSize: 96,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              color: INK,
              margin: 0,
            }}
          >
            {title}
          </h1>
          <div
            style={{
              ...rise(24),
              fontFamily: INTER_FAMILY,
              fontSize: 33,
              lineHeight: 1.5,
              color: MUTED,
              marginTop: 36,
              maxWidth: 1040,
            }}
          >
            {subtitle}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
