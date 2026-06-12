import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "./fonts";
import { motionToKeyframes, type Motion, type MotionKeyframe } from "./StageClip";
import { CameraScaleContext } from "./cards/cameraContext";
import { KineticCaption } from "./cards/KineticCaption";

// Native scene wrapper: gradient backdrop + inset app window + a parametric
// camera move, plus an optional voiceover clip and a kinetic caption that
// pops/dissolves on the beat (no fixed "Step N" card).
export type NativeStageClipProps = {
  motion: Motion;
  children: React.ReactNode;
  // Optional per-stage voiceover clip (relative to /public).
  voiceoverSrc?: string;
  // A short phrase that pops in and dissolves on the beat.
  kinetic?: { text: string; at: number; hold?: number };
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

export const NativeStageClip: React.FC<NativeStageClipProps> = ({
  motion,
  children,
  voiceoverSrc,
  kinetic,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const keyframes = motionToKeyframes(motion);

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const { x: fx, y: fy, scale } = sampleKeyframes(keyframes, progress);
  const tx = -(fx - 0.5) * width * (scale - 1);
  const ty = -(fy - 0.5) * height * (scale - 1);

  return (
    <AbsoluteFill
      style={{
        // Brand-tinted gradient "desk" the app window floats on (Bolna-style),
        // so the frame reads as a designed scene rather than a raw screenshot.
        background:
          "radial-gradient(120% 95% at 80% 8%, #f4ebfc 0%, #eef0f7 46%, #e7e9f1 100%)",
        fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif`,
        overflow: "hidden",
      }}
    >
      {/* Faint brand grid on the backdrop. */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(124,58,237,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,58,237,0.06) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      {voiceoverSrc ? (
        <Sequence from={8} layout="none">
          <Audio src={staticFile(voiceoverSrc)} />
        </Sequence>
      ) : null}
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        {/* The app is inset from the frame edges (a "screen" with a safe-area
            margin) instead of bleeding to all four sides, so the camera can
            push in for emphasis without slicing the UI's own chrome. */}
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
            border: "1px solid #e2e5ea",
            boxShadow:
              "0 26px 64px rgba(15, 17, 23, 0.18), 0 3px 10px rgba(15, 17, 23, 0.08)",
          }}
        >
          <CameraScaleContext.Provider value={scale}>
            {children}
          </CameraScaleContext.Provider>
        </div>
      </div>

      {/* Voice-led kinetic caption: a short phrase that pops and dissolves on
          the beat, instead of a parked lower-third card. */}
      {kinetic ? (
        <KineticCaption
          text={kinetic.text}
          appearAtFrame={kinetic.at}
          holdFrames={kinetic.hold}
        />
      ) : null}
    </AbsoluteFill>
  );
};
