import React from "react";
import {
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { CameraScaleContext } from "./cameraContext";

// A Screen-Studio-style pointer. Drop it INSIDE the element it should click
// (give that element `position: relative`) and it auto-aligns: it travels in
// from a corner, presses at `clickAtFrame`, and emits a click ripple. Because
// it's anchored to its parent element, it lands correctly without any global
// coordinate math — and it counter-scales against the camera zoom so it stays
// a constant on-screen size.

type Approach = "br" | "bl" | "tr" | "tl";

export type ClickCursorProps = {
  clickAtFrame: number;
  // Which corner of the parent the pointer rests on / travels in from.
  approach?: Approach;
  // Fine offset of the pointer from that corner, in px.
  offset?: { x?: number; y?: number };
  // Hide the pointer this many frames after the click (default: stays).
  hideAfter?: number;
  // Play a click sound at clickAtFrame (default true).
  sound?: boolean;
};

export const ClickCursor: React.FC<ClickCursorProps> = ({
  clickAtFrame,
  approach = "br",
  offset,
  hideAfter,
  sound = true,
}) => {
  const frame = useCurrentFrame();
  const cam = React.useContext(CameraScaleContext);

  const appearAt = clickAtFrame - 26;
  // The click sound is in its own Sequence so it fires exactly at clickAtFrame,
  // independent of the pointer's mount/visibility window.
  const clickSound = sound ? (
    <Sequence from={clickAtFrame} durationInFrames={24} layout="none">
      <Audio src={staticFile("sfx/click.m4a")} volume={0.55} />
    </Sequence>
  ) : null;

  if (frame < appearAt) return clickSound;
  if (hideAfter != null && frame > clickAtFrame + hideAfter) return null;

  const travel = interpolate(frame, [appearAt, clickAtFrame], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dirX = approach === "br" || approach === "tr" ? 1 : -1;
  const dirY = approach === "br" || approach === "bl" ? 1 : -1;
  const tx = (1 - travel) * 40 * dirX;
  const ty = (1 - travel) * 32 * dirY;

  const press = interpolate(
    frame,
    [clickAtFrame - 3, clickAtFrame, clickAtFrame + 7],
    [1, 0.84, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const ripple = interpolate(frame, [clickAtFrame, clickAtFrame + 24], [0.3, 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rippleOpacity = interpolate(
    frame,
    [clickAtFrame, clickAtFrame + 24],
    [0.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const pos: React.CSSProperties = {};
  const ox = offset?.x ?? 16;
  const oy = offset?.y ?? 12;
  if (approach === "br") {
    pos.right = ox;
    pos.bottom = oy;
  } else if (approach === "bl") {
    pos.left = ox;
    pos.bottom = oy;
  } else if (approach === "tr") {
    pos.right = ox;
    pos.top = oy;
  } else {
    pos.left = ox;
    pos.top = oy;
  }

  return (
    <>
      {clickSound}
      <div
        style={{
          position: "absolute",
          ...pos,
          // Counter the camera zoom so the cursor is always the same size.
          transform: `scale(${1 / cam})`,
          transformOrigin: `${approach.includes("r") ? "right" : "left"} ${
            approach.includes("b") ? "bottom" : "top"
          }`,
          pointerEvents: "none",
          zIndex: 8,
        }}
      >
        <div
          style={{
            position: "relative",
            transform: `translate(${tx}px, ${ty}px)`,
            filter: "drop-shadow(0 5px 8px rgba(76, 29, 149, 0.35))",
          }}
        >
          {frame >= clickAtFrame ? (
            <div
              style={{
                position: "absolute",
                right: -12,
                bottom: -12,
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "2.5px solid #cd3ef9",
                transform: `scale(${ripple})`,
                opacity: rippleOpacity,
              }}
            />
          ) : null}
          {/* Oversized, brand-purple pointer (Bolna-style). */}
          <div style={{ transform: `scale(${press})`, transformOrigin: "top left" }}>
            <svg width="34" height="42" viewBox="0 0 24 30" fill="none">
              <path
                d="M2 2 L2 21 L7.5 15.8 L11 24 L14.2 22.4 L10.6 14.6 L18 14.6 Z"
                fill="#7c3aed"
                stroke="#ffffff"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};
