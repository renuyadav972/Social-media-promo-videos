# Vibe Agent Promo — video template

A code-driven product promo for Plivo's **Vibe Agent**, built with
[Remotion](https://remotion.dev) (React → MP4). Every screen is drawn in code,
so the camera moves, kinetic text, timing, and narration sync are all fully
editable — no screen re-recording needed.

Use this as a **base template**: edit copy, retime beats, swap scenes, or change
the voice/music, then re-render.

## Prerequisites

- **Node.js 18+** (the project was built/tested on Node 20).
- macOS for the helper scripts (they use `say` / `afconvert` / `swift`); the
  Remotion render itself is cross-platform.

## Install & render

```bash
npm install            # first time only

# Render a composition to out/<name>.mp4
npx remotion render src/index.ts VibePromoNativeVO out/promo-voiceover.mp4

# or use the helper (handles a standalone Node download + binary perms on macOS):
./render.sh VibePromoNativeVO out/promo-voiceover.mp4
```

Preview/scrub interactively in Remotion Studio:

```bash
npm run dev            # opens http://localhost:3000
```

## Compositions (see `src/Root.tsx`)

| id | what it is |
|----|------------|
| **`VibePromoNativeVO`** | The main promo, **voiceover + music** (code-drawn screens). |
| **`VibePromoNative`** | Same promo, **music only**. |
| `VibePromo` | Alternate cut that composites real Loom screen-recordings (`public/clips/`). |
| `CardsShowcase`, `PlivoLogo` | Component/logo showcases. |

## Project structure

```
src/
  Root.tsx              # registers the compositions
  promoConfig.ts        # SINGLE SOURCE OF TRUTH: stage order, durations,
                        # camera moves, music, brand timings
  VibePromoNative.tsx   # the native cut: scenes + scene→key map + audio wiring
  NativeStageClip.tsx   # per-stage wrapper: gradient backdrop, inset "screen",
                        # camera, kinetic caption, voiceover
  TaglineIntro.tsx      # opening hook   FinaleCard.tsx  # end card   BrandIntro.tsx
  cards/                # the reusable UI mock: PlivoAppShell, AgentFlowDiagram,
                        # TestScenariosTable, VibeChatPanel, ClickCursor, etc.
public/
  cinno-loop.mp3        # music bed (MUSIC.src in promoConfig.ts)
  vo/                   # narration clips (00-open … 09-close, ab-askbuddy)
  sfx/                  # UI sounds
  clips/                # real Loom footage used by the `VibePromo` cut
```

## Editing on top of this

- **Copy / timing / camera:** almost everything lives in `src/promoConfig.ts`
  (stage `label`/`detail`, `duration`, `motion` keyframes) — edit there and the
  promo retimes itself (`TOTAL_FRAMES` is derived).
- **A screen's content:** the scene components are in `src/VibePromoNative.tsx`
  (`PromptScene`, `BuildScene`, `TestsScene`, `AskBuddyScene`, …).
- **The UI chrome:** `src/cards/PlivoAppShell.tsx` (tabs, top bar, nav rail,
  flow toolbar).

## Voiceover (ElevenLabs)

Narration clips in `public/vo/` are generated with the ElevenLabs API. To
regenerate with your own voice:

1. Put your API key in `~/.elevenlabs_key` (it is **gitignored**; never commit it).
2. POST each line to `https://api.elevenlabs.io/v1/text-to-speech/<voice_id>`
   (model `eleven_multilingual_v2`) and save the mp3 into `public/vo/`.
3. Re-render.

Pacing follows punctuation (comma = short pause, period = medium, `...` = long).
For a reliable hard pause, generate the two halves separately and stitch a
silence between them (see `public/vo/09-close.wav`).

## Notes

- `out/` and `node_modules/` are gitignored — clone, `npm install`, render.
- Large source recordings live under `assets/` and are **not** committed (they're
  reference material only; the native cut doesn't need them).
