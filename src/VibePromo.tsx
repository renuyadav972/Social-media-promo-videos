import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { BrandIntro } from "./BrandIntro";
import { TaglineIntro } from "./TaglineIntro";
import { StageClip } from "./StageClip";
import { NativeStageClip } from "./NativeStageClip";
import { FinaleCard } from "./FinaleCard";
import { ConfirmScene } from "./scenes/ConfirmScene";
import {
  BRAND_INTRO_FRAMES,
  FINALE_FRAMES,
  MUSIC,
  STAGES,
  TAGLINE_FRAMES,
  TOTAL_FRAMES,
  TRANSITION_HEAVY_FRAMES,
  TRANSITION_LIGHT_FRAMES,
  type SceneKey,
} from "./promoConfig";

// Hybrid override: stages listed here render with a native React scene
// instead of the Loom clip. Use this when the source recording has
// problems (scroll-aways, framing) that a native re-creation can fix.
const NATIVE_OVERRIDES: Partial<Record<SceneKey, React.FC>> = {
  // The original Loom for stage 3 scrolls away from the question card
  // and the camera can't compensate cleanly. Native scene gives the
  // viewer a static, well-framed Approve / Revise card.
  confirm: ConfirmScene,
};

// VibePromo (Loom-backed) — uses real screen recordings for each stage.
// Everything that's editable (copy, durations, camera moves, transitions,
// music) lives in promoConfig.ts. This file is just plumbing.

const musicVolumeAtFrame = (frame: number) => {
  if (frame < MUSIC.fadeFrames) {
    return (frame / MUSIC.fadeFrames) * MUSIC.bedVolume;
  }
  const fadeOutStart = TOTAL_FRAMES - MUSIC.fadeFrames;
  if (frame > fadeOutStart) {
    return ((TOTAL_FRAMES - frame) / MUSIC.fadeFrames) * MUSIC.bedVolume;
  }
  return MUSIC.bedVolume;
};

export const VibePromo: React.FC = () => {
  const totalStages = STAGES.length;
  return (
    <AbsoluteFill>
      <Audio src={staticFile(MUSIC.src)} volume={musicVolumeAtFrame} />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={BRAND_INTRO_FRAMES}>
          <BrandIntro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_HEAVY_FRAMES })}
        />

        <TransitionSeries.Sequence durationInFrames={TAGLINE_FRAMES}>
          <TaglineIntro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_HEAVY_FRAMES })}
        />

        {STAGES.map((s, idx) => {
          const NativeOverride = NATIVE_OVERRIDES[s.sceneKey];
          return (
            <React.Fragment key={s.sceneKey}>
              <TransitionSeries.Sequence durationInFrames={s.duration}>
                {NativeOverride ? (
                  // Native render: identical caption + motion grammar as
                  // StageClip, but the background is a React scene instead
                  // of a Loom clip. Lets us fix specific stages without
                  // re-recording.
                  <NativeStageClip motion={s.motion}>
                    <NativeOverride />
                  </NativeStageClip>
                ) : (
                  <StageClip
                    step={s.step}
                    total={totalStages}
                    label={s.label}
                    detail={s.detail}
                    videoSrc={s.videoSrc}
                    motion={s.motion}
                  />
                )}
              </TransitionSeries.Sequence>
              {idx < STAGES.length - 1 ? (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({
                    durationInFrames: TRANSITION_LIGHT_FRAMES,
                  })}
                />
              ) : null}
            </React.Fragment>
          );
        })}

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_HEAVY_FRAMES })}
        />

        <TransitionSeries.Sequence durationInFrames={FINALE_FRAMES}>
          <FinaleCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
