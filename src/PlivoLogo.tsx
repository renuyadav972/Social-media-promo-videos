import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";

// White screen with the Plivo logo fading + scaling in, holding, then out.
// Brand colors per https://www.plivo.com/brand/ — background is Plivo White (#ffffff).
export const PlivoLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Spring-driven entrance (first ~1s).
  const enter = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 110, mass: 0.9 },
    durationInFrames: 30,
  });

  // Exit kicks off in the final ~1s, easing the logo back out.
  const exitStart = durationInFrames - 30;
  const exitProgress = interpolate(frame, [exitStart, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = enter * (1 - exitProgress);
  const scale = 0.85 + enter * 0.15 - exitProgress * 0.1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <PlivoLogoSvg width={660} />
      </div>
    </AbsoluteFill>
  );
};
