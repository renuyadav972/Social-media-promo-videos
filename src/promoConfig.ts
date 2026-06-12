import type { Motion } from "./StageClip";

// The single source of truth for the Vibe Agent promo.
// Both VibePromo (Loom-backed) and VibePromoNative (code-only) read from
// this file. To change copy, retime a stage, swap a clip, or reorder the
// promo, you edit ONE thing here — both versions stay in sync.

// ---- Scene keys ----
// Each stage points to a `sceneKey`. VibePromoNative looks the key up in
// a map of React components (see VibePromoNative.tsx). VibePromo ignores
// the key and uses the `videoSrc` instead. Add a new stage by adding an
// entry below + a matching scene in VibePromoNative if you want native.
export type SceneKey =
  | "prompt"
  | "plan"
  | "confirm"
  | "build"
  | "tests"
  | "improve"
  | "ready"
  | "deploy"
  | "askbuddy";

export type StageConfig = {
  step: number;
  // Caption label shown in the lower-third overlay.
  label: string;
  // Sub-line under the label.
  detail: string;
  // How long this stage is on screen, in frames at PROMO_FPS.
  duration: number;
  // Per-stage camera move (push-in, pan, pull-back, dolly, etc).
  motion: Motion;
  // Loom-backed source file (relative to /public).
  videoSrc: string;
  // Native scene component key (mapped in VibePromoNative).
  sceneKey: SceneKey;
};

export const PROMO_FPS = 30;
export const PROMO_WIDTH = 1920;
export const PROMO_HEIGHT = 1080;

// Brand bumpers and finale.
export const BRAND_INTRO_FRAMES = 135; // 4.5s
// The opening hook beat (voice-led). Sized to fit the "open" narration line.
export const TAGLINE_FRAMES = 235; // fits the open line + tail
export const FINALE_FRAMES = 195; // hold the end card so it lands

// Transition durations. The composition length is reduced by these because
// adjacent sequences in <TransitionSeries> overlap by the transition's frames.
export const TRANSITION_HEAVY_FRAMES = 18; // around brand bumpers + finale
export const TRANSITION_LIGHT_FRAMES = 9; // between stages

// Background music settings.
export const MUSIC = {
  src: "cinno-loop.mp3",
  bedVolume: 0.32,
  fadeFrames: 30,
};

// ---- Stages ----
// Order in this array is the order they appear in the promo. Edit freely.
export const STAGES: StageConfig[] = [
  {
    // ACTION: the prompt materializes in the right chat panel.
    // CAMERA: open wide so the viewer reads the whole app, push smoothly
    // into the panel as the text appears, then hold so the prompt can be
    // read.
    step: 1,
    label: "Describe your agent",
    detail: "Plain English. No flow charts. No code.",
    duration: 175,
    videoSrc: "clips/01-prompt.mp4",
    sceneKey: "prompt",
    motion: {
      // Settle on the chat panel almost immediately, then HOLD dead still so
      // the long typing happens on a rock-steady frame (no drift/shake).
      keyframes: [
        { at: 0.0, x: 0.77, y: 0.48, scale: 1.28 },
        { at: 0.06, x: 0.79, y: 0.48, scale: 1.34, ease: "easeOut" },
        { at: 1.0, x: 0.79, y: 0.48, scale: 1.34, ease: "linear" },
      ],
    },
  },
  {
    // ACTION: the chat panel streams a numbered plan — "1. HTTP-triggered
    // outbound call / 2. Lead qualification conversation / 3. BANT scoring
    // rubric / 4. Send lead data to API". The panel itself scrolls, so the
    // natural motion is already in the source.
    // CAMERA: stay tight on the chat panel and let the scroll do the work.
    // A whisper-quiet push-in (1.28 → 1.36) adds life without fighting the
    // scroll. No drift — anything more competes with the text moving.
    step: 2,
    label: "Vibe plans the flow",
    detail: "Maps every step before writing a line.",
    duration: 177,
    videoSrc: "clips/02-plan.mp4",
    sceneKey: "plan",
    motion: {
      keyframes: [
        { at: 0.0, x: 0.78, y: 0.5, scale: 1.28 },
        { at: 1.0, x: 0.78, y: 0.5, scale: 1.36, ease: "easeInOut" },
      ],
    },
  },
  {
    // ACTION: rendered NATIVELY (see NATIVE_OVERRIDES in VibePromo).
    // Agent rules paragraph sits at the top of the chat panel, then the
    // "Vibe Agent needs your input" card with Approve / Revise appears
    // beneath it.
    // CAMERA: frame the chat panel on the right (~78% of screen width).
    // Open showing the rules + question card together, then push in
    // slightly toward the Approve option as emphasis. Native scene has
    // no scrolling so the camera can stay calm.
    step: 3,
    label: "Vibe asks, you approve/revise",
    detail: "You stay in control. Vibe takes it from there.",
    duration: 175,
    videoSrc: "clips/03-confirm.mp4",
    sceneKey: "confirm",
    motion: {
      keyframes: [
        // Open framing the chat panel so the WHOLE question card fits
        // (right side of screen but pulled back enough that nothing crops).
        { at: 0.0, x: 0.74, y: 0.55, scale: 1.04 },
        // Hold so the viewer reads the question + Approve / Revise.
        { at: 0.6, x: 0.74, y: 0.55, scale: 1.04, ease: "linear" },
        // Subtle push toward the Approve option as emphasis.
        { at: 1.0, x: 0.75, y: 0.5, scale: 1.14, ease: "easeInOut" },
      ],
    },
  },
  {
    // ACTION: the HERO of this stage is the flow diagram on the left.
    // CAMERA: start zoomed in on the trigger node at the top, then slowly
    // pull back to reveal the whole tree — give the viewer the "wow,
    // Vibe built ALL this" beat. Right-side tracker stays out of frame.
    step: 4,
    label: "Building your agent",
    detail: "Flow, voices, scoring, API, wired for you.",
    duration: 185,
    videoSrc: "clips/04-build.mp4",
    sceneKey: "build",
    motion: {
      // Gentle pull-back that reveals the tree — no aggressive zoom-in "pop".
      keyframes: [
        { at: 0.0, x: 0.36, y: 0.42, scale: 1.16 },
        { at: 1.0, x: 0.34, y: 0.56, scale: 1.04, ease: "easeInOut" },
      ],
    },
  },
  {
    // ACTION: the Ask Buddy helper. A question is typed (with key clicks) and
    // the Vibe agent answers in context, right inside the flow.
    // CAMERA: settle on the chat panel where the answer lands.
    step: 5,
    label: "Ask Buddy",
    detail: "Stuck? Ask. The agent answers in context.",
    duration: 200,
    videoSrc: "clips/04-build.mp4",
    sceneKey: "askbuddy",
    motion: {
      // Open on the top-bar "Ask Buddy" button (cursor clicks it), then move
      // down to the panel as it opens and hold steady for the Q&A.
      keyframes: [
        { at: 0.0, x: 0.83, y: 0.1, scale: 1.7 },
        { at: 0.14, x: 0.83, y: 0.1, scale: 1.7, ease: "linear" },
        { at: 0.28, x: 0.83, y: 0.46, scale: 1.85, ease: "easeInOut" },
        { at: 1.0, x: 0.83, y: 0.46, scale: 1.85, ease: "linear" },
      ],
    },
  },
  {
    // ACTION: the simulation rows fill the canvas — eight scenarios.
    // CAMERA: settle on the table, slow vertical scan top → bottom so the
    // viewer can actually read the row names.
    step: 5,
    label: "Running simulations",
    detail: "Every edge case, pressure-tested before launch.",
    duration: 130,
    videoSrc: "clips/05-tests.mp4",
    sceneKey: "tests",
    motion: {
      keyframes: [
        { at: 0.0, x: 0.32, y: 0.3, scale: 1.28 },
        { at: 0.15, x: 0.32, y: 0.3, scale: 1.28, ease: "linear" },
        { at: 1.0, x: 0.32, y: 0.75, scale: 1.28, ease: "linear" },
      ],
    },
  },
  {
    // ACTION: the right panel shows "Tightening / Updating / Updating ✓
    // / Rerunning..." — those are the verbs of self-improvement.
    // CAMERA: tight push-in on that checklist, no drift.
    step: 6,
    label: "Self-improvement",
    detail: "Spots gaps. Fixes them. Re-tests.",
    duration: 150,
    videoSrc: "clips/06-improve.mp4",
    sceneKey: "improve",
    motion: {
      // Settle fast, then HOLD still while the self-improvement updates play
      // out (no slow zoom that reads as shake).
      keyframes: [
        { at: 0.0, x: 0.78, y: 0.3, scale: 1.36 },
        { at: 0.08, x: 0.78, y: 0.3, scale: 1.4, ease: "easeOut" },
        { at: 1.0, x: 0.78, y: 0.3, scale: 1.4, ease: "linear" },
      ],
    },
  },
  {
    // ACTION: two moments — the green Success toast slides in top-right,
    // and the agent badge flips to Active top-left.
    // CAMERA: HOLD on the toast position while it arrives (snap-to), then
    // pull back wide so both the toast AND the Active badge are in frame
    // — the "we shipped" reveal.
    step: 7,
    label: "Your agent is live",
    detail: "Published, tested, ready to take calls.",
    duration: 115,
    videoSrc: "clips/07-ready.mp4",
    sceneKey: "ready",
    motion: {
      // Gentle settle to the full view — no hard zoom-in on the toast.
      keyframes: [
        { at: 0.0, x: 0.6, y: 0.32, scale: 1.12 },
        { at: 1.0, x: 0.5, y: 0.5, scale: 1.0, ease: "easeInOut" },
      ],
    },
  },
  {
    // ACTION: the deploy beat — a phone number is connected to the agent in
    // Voice Configuration, a cursor hits "Save", and the "Phone Number
    // settings updated" toast confirms it (mirrors the end of the Loom).
    // CAMERA: gentle settle to the full screen, no zoom pop.
    step: 8,
    label: "Connect a phone number",
    detail: "Point a number at your agent. Real calls start flowing.",
    duration: 140,
    // No Loom clip for this stage; the native cut ignores videoSrc and the
    // Loom cut isn't rendered. Placeholder keeps that composition valid.
    videoSrc: "clips/07-ready.mp4",
    sceneKey: "deploy",
    motion: {
      keyframes: [
        { at: 0.0, x: 0.48, y: 0.44, scale: 1.12 },
        { at: 1.0, x: 0.5, y: 0.5, scale: 1.02, ease: "easeInOut" },
      ],
    },
  },
];

// ---- Derived totals ----
// Sum of every sequence's duration before applying transition overlap.
const SEQUENCE_SUM =
  BRAND_INTRO_FRAMES +
  TAGLINE_FRAMES +
  STAGES.reduce((acc, s) => acc + s.duration, 0) +
  FINALE_FRAMES;

// Each transition shortens the timeline by its `durationInFrames`. We have
// 3 heavy transitions (brand→tagline, tagline→first stage, last stage→finale)
// and (STAGES.length − 1) light transitions between stages.
const TRANSITION_SUM =
  3 * TRANSITION_HEAVY_FRAMES +
  Math.max(0, STAGES.length - 1) * TRANSITION_LIGHT_FRAMES;

export const TOTAL_FRAMES = SEQUENCE_SUM - TRANSITION_SUM;
export const TOTAL_SECONDS = TOTAL_FRAMES / PROMO_FPS;
