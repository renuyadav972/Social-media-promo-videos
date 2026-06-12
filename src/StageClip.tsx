import React from "react";
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "./fonts";

// A camera keyframe positions the lens at a normalized time t in [0, 1] of
// the stage. Coordinates are normalized 0..1 in the SOURCE video.
export type MotionKeyframe = {
  at: number; // 0..1, when within the stage this keyframe is reached
  x: number; // focus point x (0..1)
  y: number; // focus point y (0..1)
  scale: number; // zoom (1.0 = none, >1 = in)
  // Easing used to REACH this keyframe from the previous one.
  // "hold" means the camera stays exactly where the previous keyframe was
  // until `at`, then snaps to this keyframe's values (useful for "wait,
  // then react" beats).
  ease?: "linear" | "easeOut" | "easeInOut" | "hold";
};

// A motion is either a list of keyframes (modern, action-driven) or the
// legacy two-point shape. The legacy shape is normalized into a 2-keyframe
// sequence so the renderer only has to handle keyframes.
export type Motion =
  | { keyframes: MotionKeyframe[] }
  | {
      startX: number;
      startY: number;
      startScale: number;
      endX: number;
      endY: number;
      endScale: number;
      easing?: "linear" | "easeOut" | "easeInOut";
    };

export const motionToKeyframes = (m: Motion): MotionKeyframe[] => {
  if ("keyframes" in m) return m.keyframes;
  return [
    { at: 0, x: m.startX, y: m.startY, scale: m.startScale },
    {
      at: 1,
      x: m.endX,
      y: m.endY,
      scale: m.endScale,
      ease: m.easing ?? "easeInOut",
    },
  ];
};

export type StageClipProps = {
  step: number;
  total: number;
  label: string;
  videoSrc: string;
  detail?: string;
  motion: Motion;
};

type SegmentEase = MotionKeyframe["ease"];

const resolveEasing = (easing: SegmentEase) => {
  switch (easing) {
    case "linear":
      return Easing.linear;
    case "easeOut":
      return Easing.out(Easing.cubic);
    case "easeInOut":
      return Easing.inOut(Easing.cubic);
    case "hold":
      // For "hold" segments we pin to the previous keyframe and snap at end;
      // the renderer handles that path specially.
      return Easing.linear;
    default:
      return Easing.inOut(Easing.cubic);
  }
};

// Walks the keyframe list to find the current camera position at progress p.
// Each segment runs from keyframes[i-1] to keyframes[i]; we pick the active
// segment, normalize p within it, apply the per-segment easing, and lerp.
const sampleKeyframes = (
  keyframes: MotionKeyframe[],
  p: number,
): { x: number; y: number; scale: number } => {
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
    // Stay on prev until next.at, then snap to next.
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

// Full-bleed Loom clip with a parametric camera move. Caption sits in a
// stronger, more compact lower-third card so it's clearly readable without
// covering as much of the footage as the previous gradient overlay did.
export const StageClip: React.FC<StageClipProps> = ({
  step,
  total,
  label,
  videoSrc,
  detail,
  motion,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  const keyframes = motionToKeyframes(motion);

  const captionOpacity = interpolate(
    frame,
    [0, 12, durationInFrames - 12, durationInFrames],
    [0, 1, 1, 0],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const captionTranslate = interpolate(
    frame,
    [0, 12, durationInFrames - 12, durationInFrames],
    [16, 0, 0, 8],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

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
        backgroundColor: "#ffffff",
        fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        <OffthreadVideo
          src={staticFile(videoSrc)}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>

      {/* Lower-third caption card. Mostly-opaque white card hovering inside
          the bottom of the frame so the type is unambiguously readable, but
          the card itself is narrower than the full width so the footage is
          still visible on either side. */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 64,
          opacity: captionOpacity,
          transform: `translateY(${captionTranslate}px)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "flex-start",
            backgroundColor: "rgba(255, 255, 255, 0.92)",
            padding: "26px 36px",
            borderRadius: 16,
            boxShadow:
              "0 18px 40px rgba(15, 17, 23, 0.16), 0 2px 8px rgba(15, 17, 23, 0.08)",
            maxWidth: 1180,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#cd3ef9",
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Step {step}
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#0f1117",
              lineHeight: 1.05,
              letterSpacing: -1.1,
            }}
          >
            {label}
          </div>
          {detail ? (
            <div
              style={{
                fontSize: 26,
                fontWeight: 400,
                color: "#0f1117",
                opacity: 0.78,
                marginTop: 10,
                letterSpacing: -0.2,
              }}
            >
              {detail}
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
