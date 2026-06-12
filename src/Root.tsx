import { Composition } from "remotion";
import { PlivoLogo } from "./PlivoLogo";
import { VibePromo } from "./VibePromo";
import { CardsShowcase } from "./CardsShowcase";
import { VibePromoNative } from "./VibePromoNative";
import {
  PROMO_FPS,
  PROMO_HEIGHT,
  PROMO_WIDTH,
  TOTAL_FRAMES,
} from "./promoConfig";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PlivoLogo"
        component={PlivoLogo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CardsShowcase"
        component={CardsShowcase}
        // 150 + 150 + 210 + 120 + 120 = 750 frames @ 30fps = 25s
        durationInFrames={750}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="VibePromoNative"
        component={VibePromoNative}
        durationInFrames={TOTAL_FRAMES}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
        defaultProps={{ voiceOver: false }}
      />
      <Composition
        id="VibePromoNativeVO"
        component={VibePromoNative}
        durationInFrames={TOTAL_FRAMES}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
        defaultProps={{ voiceOver: true }}
      />
      <Composition
        id="VibePromo"
        component={VibePromo}
        durationInFrames={TOTAL_FRAMES}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
      />
    </>
  );
};
