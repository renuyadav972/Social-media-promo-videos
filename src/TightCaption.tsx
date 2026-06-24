import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "./fonts";

// Muted-friendly caption layer for the tight cream cut. Most of LinkedIn / X
// watches with sound off, so these carry the message on their own. A small
// card, bottom-left, near-black bold text with ONE keyword in Plivo purple,
// sentence case, subtle ~6-frame fade/slide in. Reads the absolute composition
// frame (rendered at the composition root, not inside a per-beat Sequence).

export type Caption = {
  // Absolute composition frames this caption is on screen.
  start: number;
  end: number;
  // Text split so exactly one phrase can be highlighted in brand purple.
  pre: string;
  keyword: string;
  post?: string;
};

const FADE = 6; // ~0.2s at 30fps

const CaptionCard: React.FC<{ c: Caption; frame: number }> = ({ c, frame }) => {
  if (frame < c.start || frame >= c.end) return null;
  const opacity = interpolate(
    frame,
    [c.start, c.start + FADE, c.end - FADE, c.end],
    [0, 1, 1, 0],
    { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const slide = interpolate(frame, [c.start, c.start + FADE], [10, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        bottom: 92,
        opacity,
        transform: `translateY(${slide}px)`,
        background: "rgba(255, 255, 255, 0.92)",
        border: "1px solid #e7e4dd",
        borderRadius: 14,
        padding: "16px 22px",
        boxShadow: "0 10px 30px rgba(40, 33, 20, 0.12)",
        backdropFilter: "blur(2px)",
        maxWidth: 760,
      }}
    >
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
          lineHeight: 1.18,
          letterSpacing: -0.6,
          color: "#111111",
          fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif`,
        }}
      >
        {c.pre}
        <span style={{ color: "#cd3ef9" }}>{c.keyword}</span>
        {c.post}
      </div>
    </div>
  );
};

export const TightCaptions: React.FC<{ captions: Caption[] }> = ({ captions }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {captions.map((c, i) => (
        <CaptionCard key={i} c={c} frame={frame} />
      ))}
    </AbsoluteFill>
  );
};
