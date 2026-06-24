import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "./fonts";
import { motionToKeyframes, type Motion, type MotionKeyframe } from "./StageClip";
import { CameraScaleContext } from "./cards/cameraContext";

// Cream-desk stage wrapper for the TIGHT cut. Same inset "screen" + parametric
// camera as NativeStageClip (so the crop never slices the UI chrome and the
// lens can push into the panel that matters), but on the off-white brand
// background instead of the purple gradient — matching the feedback doc's
// "black-and-white / cream cut".

export type TightStageClipProps = {
  motion: Motion;
  children: React.ReactNode;
  // Gentle content fade-in over the first N frames of the beat (soft cut).
  fadeInFrames?: number;
};

const resolveEasing = (easing: MotionKeyframe["ease"]) => {
  switch (easing) {
    case "linear":
      return Easing.linear;
    case "easeOut":
      return Easing.out(Easing.cubic);
    case "easeInOut":
      return Easing.inOut(Easing.cubic);
    case "hold":
      return Easing.linear;
    default:
      return Easing.inOut(Easing.cubic);
  }
};

const sampleKeyframes = (keyframes: MotionKeyframe[], p: number) => {
  if (keyframes.length === 0) return { x: 0.5, y: 0.5, scale: 1 };
  if (keyframes.length === 1)
    return { x: keyframes[0].x, y: keyframes[0].y, scale: keyframes[0].scale };
  if (p <= keyframes[0].at)
    return { x: keyframes[0].x, y: keyframes[0].y, scale: keyframes[0].scale };
  const last = keyframes[keyframes.length - 1];
  if (p >= last.at) return { x: last.x, y: last.y, scale: last.scale };
  let i = 1;
  while (i < keyframes.length && keyframes[i].at < p) i++;
  const prev = keyframes[i - 1];
  const next = keyframes[i];
  if (next.ease === "hold") {
    return { x: prev.x, y: prev.y, scale: prev.scale };
  }
  const span = Math.max(0.0001, next.at - prev.at);
  const t = (p - prev.at) / span;
  const eased = resolveEasing(next.ease ?? "easeInOut")(t);
  return {
    x: prev.x + (next.x - prev.x) * eased,
    y: prev.y + (next.y - prev.y) * eased,
    scale: prev.scale + (next.scale - prev.scale) * eased,
  };
};

export const TightStageClip: React.FC<TightStageClipProps> = ({
  motion,
  children,
  fadeInFrames = 8,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const keyframes = motionToKeyframes(motion);

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const { x: fx, y: fy, scale } = sampleKeyframes(keyframes, progress);
  // Center the focal point in frame (then zoom around it). This lets a beat
  // frame ANY component — even one at the screen edge — dead-center and fill
  // the frame, which the old "pin the focal point in place" model couldn't.
  const tx = -(fx - 0.5) * width * scale;
  const ty = -(fy - 0.5) * height * scale;

  // Soft cut: the inset screen content fades + lifts in over the first frames.
  const fadeIn = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        // Warm off-white "desk" the product window floats on (cream cut).
        background:
          "radial-gradient(120% 95% at 50% 0%, #fbfaf8 0%, #f6f5f3 55%, #efeeea 100%)",
        fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif`,
        overflow: "hidden",
      }}
    >
      {/* Whisper-faint warm grid so the cream reads as a designed surface. */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,17,23,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,17,23,0.025) 1px, transparent 1px)",
          backgroundSize: "76px 76px",
        }}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          transformOrigin: "center center",
          willChange: "transform",
          opacity: fadeIn,
        }}
      >
        {/* Inset "screen" with a safe-area margin, so the camera can push in
            for emphasis without slicing the product UI's own chrome. */}
        <div
          style={{
            position: "absolute",
            top: 58,
            bottom: 58,
            left: 132,
            right: 132,
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor: "#ffffff",
            border: "1px solid #e7e4dd",
            boxShadow:
              "0 26px 64px rgba(40, 33, 20, 0.16), 0 3px 10px rgba(40, 33, 20, 0.06)",
          }}
        >
          <CameraScaleContext.Provider value={scale}>
            {children}
          </CameraScaleContext.Provider>
        </div>
      </div>
    </AbsoluteFill>
  );
};
