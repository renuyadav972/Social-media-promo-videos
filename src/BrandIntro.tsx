import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";

// 4.5s brand bumper:
// (1) Opens framed on just the "P" symbol — wordmark is hidden, scale is way in.
// (2) Camera pulls back: scale 4 → 1 and the translation that kept the P
//     centered eases back to 0, so the P slides into its natural place.
// (3) As the camera settles, "livo" wordmark fades in alongside the P.
// (4) Full logo holds calmly, then fades out.

const LOGO_WIDTH = 470;
// The P symbol sits ~0.366 of the logo width left of the logo's own center
// (263.5px at width 720). Keep it proportional so the open-on-the-P framing
// stays correct at any LOGO_WIDTH.
const P_OFFSET_FROM_LOGO_CENTER_PX = -263.5 * (LOGO_WIDTH / 720);
const START_SCALE = 4;

export const BrandIntro: React.FC = () => {
  const frame = useCurrentFrame();

  // Animation timeline (135 frames = 4.5s @ 30fps):
  //   0–9     fade in (already framed on the P)
  //   9–66    camera pulls back: scale 4 → 1, x translate eases to 0
  //   42–78   wordmark fades in alongside the pullback
  //   66–108  full logo holds
  //   108–135 fade out
  const fadeInEnd = 9;
  const pullBackStart = 9;
  const pullBackEnd = 66;
  const wordmarkInStart = 42;
  const wordmarkInEnd = 78;
  const holdEnd = 108;
  const total = 135;

  const opacity = interpolate(
    frame,
    [0, fadeInEnd, holdEnd, total],
    [0, 1, 1, 0],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const scale = interpolate(
    frame,
    [pullBackStart, pullBackEnd],
    [START_SCALE, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const translateX = interpolate(
    frame,
    [pullBackStart, pullBackEnd],
    [-P_OFFSET_FROM_LOGO_CENTER_PX * START_SCALE, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const wordmarkOpacity = interpolate(
    frame,
    [wordmarkInStart, wordmarkInEnd],
    [0, 1],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#f6f5f3",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateX(${translateX}px) scale(${scale})`,
          transformOrigin: "center center",
          willChange: "transform, opacity",
        }}
      >
        <PlivoLogoSvg width={LOGO_WIDTH} wordmarkOpacity={wordmarkOpacity} />
      </div>
    </AbsoluteFill>
  );
};
