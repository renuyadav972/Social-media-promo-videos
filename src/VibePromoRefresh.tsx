import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { TightStageClip } from "./TightStageClip";
import { TightCaptions } from "./TightCaption";
import type { Motion } from "./StageClip";
import { MUSIC } from "./promoConfig";
import { BrandBeat, HookCard, CtaCard, CrossfadeZoom, musicVolumeAtFrame, COMMON_ORDER, buildBeats, buildVO, buildCaptions } from "./VibePromoMerged";
import { IntroGlow } from "./IntroVariants";
import { PromptBeat, PlanBeat, ApproveBeat, BuildBeat, SimulateBeat, PublishBeat, ConnectModalBeat, BuddyBeat, NAME } from "./cards/CSBeats";
import { SimulationsPage, VibePanel, type VibeItem, SIM_ROWS } from "./cards/AgentBuilder";
const ACHIEVED: typeof SIM_ROWS = SIM_ROWS.map(([n, , p]) => [n, "Achieved", p]);

// ============================================================================
// Vibe Agent promo, REFRESHED (2026-09-29): the original merged cut's design and format, untouched
// (brand bumper → "one prompt?" hook → "Introducing Vibe Agent" glow → nine product beats with the
// same narration clips, cream camera, corner captions and music bed), with the nine mocked screens
// replaced by the current console kit built from the 8 Sept 2026 Agent Builder recording
// (src/cards/AgentBuilder.tsx + CSBeats.tsx, the Call Scheduling Agent story).
// ============================================================================
const Fit: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scale(0.8625)", transformOrigin: "top left" }}>{children}</div>;
const LAYOUT = buildBeats({ brand: 110, hook: 150, intro: 100 }, ["brand", "hook", "intro", ...COMMON_ORDER]);
export const REFRESH_TOTAL_FRAMES = LAYOUT.total;

// camera framings for the kit layout (right panel at x 1180–1908, canvas at left, header top-right)
const M_WIDE: Motion = { keyframes: [{ at: 0, x: 0.5, y: 0.5, scale: 1.02 }] };
const M_PANEL: Motion = { keyframes: [{ at: 0, x: 0.7, y: 0.56, scale: 1.4 }] };
const M_PANEL_TOP: Motion = { keyframes: [{ at: 0, x: 0.7, y: 0.42, scale: 1.4 }] };
const M_CANVAS: Motion = { keyframes: [{ at: 0, x: 0.36, y: 0.5, scale: 1.25 }] };
const M_TABLE: Motion = { keyframes: [{ at: 0, x: 0.44, y: 0.5, scale: 1.2 }] };
const M_BUDDY_WIDE: Motion = { keyframes: [{ at: 0, x: 0.5, y: 0.5, scale: 1.02 }] };
const M_BUDDY: Motion = { keyframes: [{ at: 0, x: 0.72, y: 0.5, scale: 1.4 }] };
const M_PUBLISH: Motion = { keyframes: [{ at: 0, x: 0.62, y: 0.2, scale: 1.3 }] };
const M_MODAL: Motion = { keyframes: [{ at: 0, x: 0.7, y: 0.44, scale: 1.35 }] };

// "Every scenario, achieved": the simulations table filling in while Vibe Agent reports the fixes
const AchievedBeat: React.FC = () => {
  const f = useCurrentFrame();
  const items: VibeItem[] = [
    { at: 0, kind: "text", text: "Two scenarios missed their goal. Tightening the receptionist instructions and re-running them." },
    { at: 10, kind: "checks", items: ["Fixing hostile-caller handling", "Fixing vague-inquiry clarification", "Re-running the scenario set"], done: Math.min(3, Math.max(0, Math.floor((f - 24) / 26))) },
    { at: 110, kind: "text", text: "All scenarios achieved. The flow is ready to publish." },
  ];
  return <AbsoluteFill><SimulationsPage name={NAME} rows={ACHIEVED} revealFrom={6} panel={<VibePanel items={items} status={f < 110 ? "generating" : "idle"} />} /></AbsoluteFill>;
};

export const VibePromoRefresh: React.FC<{ voiceOver?: boolean }> = ({ voiceOver = true }) => {
  const { BEAT, total } = LAYOUT;
  const VO = buildVO(BEAT);
  const CAPTIONS = buildCaptions(BEAT, Object.keys(BEAT));
  const B = (k: string) => BEAT[k];
  return (
    <AbsoluteFill style={{ backgroundColor: "#f6f5f3" }}>
      <Audio src={staticFile(voiceOver ? MUSIC.src : "vibe-music.mp3")} volume={(f) => musicVolumeAtFrame(f, total) * (voiceOver ? 0.3 : 0.4)} />
      <Sequence from={B("brand").from} durationInFrames={B("brand").dur} layout="none"><BrandBeat /></Sequence>
      <Sequence from={B("hook").from} durationInFrames={B("hook").dur} layout="none"><HookCard /></Sequence>
      <Sequence from={B("intro").from} durationInFrames={B("intro").dur} layout="none"><IntroGlow /></Sequence>
      {/* describe: the prompt is typed on the home canvas, sent, and Vibe Agent starts planning */}
      <Sequence from={B("describe").from} durationInFrames={B("describe").dur} layout="none">
        <CrossfadeZoom wide={M_WIDE} tight={M_PANEL} atFrame={60}><Fit><Sequence from={-30} layout="none"><PromptBeat /></Sequence></Fit></CrossfadeZoom>
      </Sequence>
      {/* approve: the plan is on screen, then the reply that approves it */}
      <Sequence from={B("approve").from} durationInFrames={B("approve").dur} layout="none">
        <TightStageClip motion={M_PANEL_TOP}>
          <Sequence from={0} durationInFrames={50} layout="none"><Fit><Sequence from={-160} layout="none"><PlanBeat /></Sequence></Fit></Sequence>
          <Sequence from={50} layout="none"><Fit><Sequence from={-10} layout="none"><ApproveBeat /></Sequence></Fit></Sequence>
        </TightStageClip>
      </Sequence>
      {/* build: the flow assembles on the canvas */}
      <Sequence from={B("build").from} durationInFrames={B("build").dur} layout="none">
        <CrossfadeZoom wide={M_WIDE} tight={M_CANVAS} atFrame={40}><Fit><Sequence from={-20} layout="none"><BuildBeat /></Sequence></Fit></CrossfadeZoom>
      </Sequence>
      {/* simulate: the scenario set runs */}
      <Sequence from={B("simulate").from} durationInFrames={B("simulate").dur} layout="none">
        <TightStageClip motion={M_PANEL}><Fit><SimulateBeat /></Fit></TightStageClip>
      </Sequence>
      {/* simscreen: results fill in, weak spots fixed */}
      <Sequence from={B("simscreen").from} durationInFrames={B("simscreen").dur} layout="none">
        <TightStageClip motion={M_TABLE}><Fit><AchievedBeat /></Fit></TightStageClip>
      </Sequence>
      {/* buddy */}
      <Sequence from={B("buddy").from} durationInFrames={B("buddy").dur} layout="none">
        <CrossfadeZoom wide={M_BUDDY_WIDE} tight={M_BUDDY} atFrame={36}><Fit><BuddyBeat sentAt={56} answerAt={76} /></Fit></CrossfadeZoom>
      </Sequence>
      {/* publish */}
      <Sequence from={B("publish").from} durationInFrames={B("publish").dur} layout="none">
        <TightStageClip motion={M_PUBLISH}><Fit><PublishBeat clickAt={44} /></Fit></TightStageClip>
      </Sequence>
      {/* go live: connect the number to the agent */}
      <Sequence from={B("golive").from} durationInFrames={B("golive").dur} layout="none">
        <TightStageClip motion={M_MODAL}><Fit><ConnectModalBeat pickAt={70} /></Fit></TightStageClip>
      </Sequence>
      <Sequence from={B("cta").from} durationInFrames={B("cta").dur} layout="none"><CtaCard /></Sequence>
      <TightCaptions captions={CAPTIONS} />
      {voiceOver ? VO.map((v, i) => <Sequence key={i} from={v.from} layout="none"><Audio src={staticFile(v.src)} /></Sequence>) : null}
    </AbsoluteFill>
  );
};
