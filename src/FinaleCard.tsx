import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { SORA_FAMILY, INTER_FAMILY } from "./fonts";

// Closing card: brings the brand back so the promo bookends on Plivo.
export const FinaleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110 },
    durationInFrames: 24,
  });

  const exitStart = durationInFrames - 12;
  const exit = interpolate(frame, [exitStart, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = enter * (1 - exit);
  const scale = 0.85 + enter * 0.15;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#f6f5f3",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif`,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: "center",
          fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif`,
        }}
      >
        <div
          style={{
            fontSize: 74,
            fontWeight: 600,
            letterSpacing: -2.4,
            lineHeight: 1.0,
            // Brand gradient (purple) on the wordmark.
            backgroundImage: "linear-gradient(95deg, #cd3ef9 0%, #9333ea 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Vibe Agent
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 17,
            marginTop: 26,
          }}
        >
          {/* "by" in soft gray; Plivo wordmark in its actual black. */}
          <span style={{ fontSize: 30, fontWeight: 400, color: "#0f1117", opacity: 0.55 }}>by</span>
          <PlivoLogoSvg width={170} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
