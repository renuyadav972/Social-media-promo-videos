import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "../fonts";

// A short phrase that pops in and dissolves on the beat (replaces the old
// fixed lower-third "Step N" card). It's never parked on screen: it appears
// for ~`holdFrames`, then fades up and out, so the piece reads as voice-led
// and fluid rather than a labeled slideshow.
export type KineticCaptionProps = {
  text: string;
  appearAtFrame: number;
  holdFrames?: number;
};

export const KineticCaption: React.FC<KineticCaptionProps> = ({
  text,
  appearAtFrame,
  holdFrames = 42,
}) => {
  const frame = useCurrentFrame();
  const inEnd = appearAtFrame + 9;
  const outStart = inEnd + holdFrames;
  const outEnd = outStart + 13;
  if (frame < appearAtFrame || frame > outEnd) return null;

  const opacity = interpolate(
    frame,
    [appearAtFrame, inEnd, outStart, outEnd],
    [0, 1, 1, 0],
    { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const scale = interpolate(frame, [appearAtFrame, inEnd], [0.88, 1], {
    easing: Easing.out(Easing.back(1.4)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ty = interpolate(frame, [outStart, outEnd], [0, -16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 92,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${ty}px) scale(${scale})`,
          fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif`,
          fontSize: 74,
          fontWeight: 700,
          letterSpacing: -2,
          color: "#0f1117",
          // Strong white glow so it stays legible over the UI without a box.
          textShadow:
            "0 2px 28px rgba(255,255,255,0.95), 0 1px 6px rgba(255,255,255,0.95), 0 0 2px rgba(255,255,255,0.95)",
        }}
      >
        {text}
      </div>
    </div>
  );
};
