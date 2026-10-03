import { staticFile, delayRender, continueRender } from "remotion";
// JetBrains Mono from the Plivo product-videos skill bundle (OFL), loaded for the technical text.
export const JBM = "JetBrains Mono";
if (typeof document !== "undefined" && !(window as unknown as { __jbm?: boolean }).__jbm) {
  (window as unknown as { __jbm?: boolean }).__jbm = true;
  const h = delayRender("JetBrains Mono");
  new FontFace(JBM, `url(${staticFile("fonts/JetBrainsMono-400.woff2")}) format("woff2")`).load().then((f) => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
}
