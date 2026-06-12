import { loadFont as loadSora } from "@remotion/google-fonts/Sora";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// Plivo brand stack per https://www.plivo.com/brand/:
//   Sora — display / headlines (Light, Regular, Semibold, Bold)
//   Inter — body / UI
// Loading both at render time gives us Plivo's actual brand typography
// instead of falling back to system fonts.
const sora = loadSora("normal", { weights: ["400", "600", "700"] });
const inter = loadInter("normal", { weights: ["400", "600"] });

export const SORA_FAMILY = sora.fontFamily;
export const INTER_FAMILY = inter.fontFamily;
