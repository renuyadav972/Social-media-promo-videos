import { Composition } from "remotion";
import { PlivoLogo } from "./PlivoLogo";
import { VibePromo } from "./VibePromo";
import { CardsShowcase } from "./CardsShowcase";
import { VibePromoNative } from "./VibePromoNative";
import { VibePromoTight, TIGHT_TOTAL_FRAMES } from "./VibePromoTight";
import {
  VibePromoMerged,
  VibePromoBuild,
  VibePromoGoLive,
  MERGED_TOTAL_FRAMES,
  MERGED_V2_TOTAL_FRAMES,
  BUILD_TOTAL_FRAMES,
  GOLIVE_TOTAL_FRAMES,
} from "./VibePromoMerged";
import { ConsoleComparison, CONSOLE_TOTAL_FRAMES } from "./ConsoleComparison";
import { VibeIntroCard } from "./VibeIntroCard";
import { CallSchedulingAgent, CSA_TOTAL_FRAMES } from "./CallSchedulingAgent";
import { StyleA, StyleB, StyleC, StyleD, StyleE, StyleF, StyleG } from "./StyleFrames";
import { LiveKitAgent, LK_TOTAL_FRAMES } from "./LiveKitAgent";
import { PipecatAgent, PC_TOTAL_FRAMES } from "./PipecatAgent";
import { GptLiveHostTest, GPTLIVE_TEST_FRAMES } from "./GptLiveHostTest";
import { GptLiveAgent, GL_TOTAL_FRAMES } from "./GptLiveAgent";
import { XaiAgent, XAI2_FRAMES } from "./XaiAgent";
import { XaiNews, XAI_NEWS_FRAMES } from "./XaiNews";
import { StyleX1, StyleX2, StyleX3, StyleX4 } from "./StyleXai";
import { XaiBoard, XAI_BOARD_FRAMES } from "./XaiBoard";
import { XaiBoard2, XAI_BOARD2_FRAMES } from "./XaiBoard2";
import { GptLive2, GL2_FRAMES } from "./GptLive2";
import { VapiAgent, VAPI_FRAMES } from "./VapiAgent";
import { CSThumb } from "./CSThumb";
import { LkThumb, LkThumbLight, LkThumbC } from "./LkThumb";
import { VapiThumb } from "./VapiThumb";
import { XaiThumb } from "./XaiThumb";
import { GlThumb } from "./GlThumb";
import { GlThumb2 } from "./GlThumb2";
import { GlNews, GL_NEWS_FRAMES } from "./GlNews";
import { GlFilm, GL_FILM_FRAMES } from "./GlFilm";
import { VibePromoRefresh, REFRESH_TOTAL_FRAMES } from "./VibePromoRefresh";
import { CliThumb } from "./CliThumb";
import { XaiDebug } from "./XaiDebug";
import { VibeShort1, VibeShort2, SHORT1_FRAMES, SHORT2_FRAMES } from "./VibeShorts";
import { CS_Builder, CS_Plan, CS_PlanText, CS_Flow, CS_Sims, CS_Voice, CS_VoicePicked, CS_Number, CS_Buddy, CS_Publish } from "./cards/BuilderPreviews";
import { OnboardingVoiceAgents, ONBOARDING_VA_FRAMES } from "./OnboardingVoiceAgents";
import { OnboardingSipTrunking, ONBOARDING_SIP_FRAMES } from "./OnboardingSipTrunking";
import { OnboardingVoiceApi, ONBOARDING_VOICEAPI_FRAMES } from "./OnboardingVoiceApi";
import { IntroShimmer, IntroGlow } from "./IntroVariants";
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
        id="IntroOptionA"
        component={IntroShimmer}
        durationInFrames={110}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
      />
      <Composition
        id="IntroOptionB"
        component={IntroGlow}
        durationInFrames={110}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
      />
      <Composition
        id="VibePromoMergedVO"
        component={VibePromoMerged}
        durationInFrames={MERGED_TOTAL_FRAMES}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
        defaultProps={{ voiceOver: true }}
      />
      <Composition
        id="VibePromoMerged"
        component={VibePromoMerged}
        durationInFrames={MERGED_TOTAL_FRAMES}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
        defaultProps={{ voiceOver: false }}
      />
      <Composition
        id="VibeIntroCard"
        component={VibeIntroCard}
        durationInFrames={110}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
      />
      <Composition id="StyleA" component={StyleA} durationInFrames={90} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="StyleB" component={StyleB} durationInFrames={90} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="StyleC" component={StyleC} durationInFrames={90} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="StyleD" component={StyleD} durationInFrames={90} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="StyleE" component={StyleE} durationInFrames={90} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="StyleF" component={StyleF} durationInFrames={90} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="StyleG" component={StyleG} durationInFrames={90} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="StyleX1" component={StyleX1} durationInFrames={90} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="StyleX2" component={StyleX2} durationInFrames={90} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="StyleX3" component={StyleX3} durationInFrames={90} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="StyleX4" component={StyleX4} durationInFrames={90} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="XaiBoard" component={XaiBoard} durationInFrames={XAI_BOARD_FRAMES} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="XaiBoard2" component={XaiBoard2} durationInFrames={XAI_BOARD2_FRAMES} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="GptLive2" component={GptLive2} durationInFrames={GL2_FRAMES} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="VapiAgent" component={VapiAgent} durationInFrames={VAPI_FRAMES} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="CSThumb" component={CSThumb} durationInFrames={30} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="LkThumb" component={LkThumb} durationInFrames={30} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="LkThumbLight" component={LkThumbLight} durationInFrames={30} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="LkThumbC" component={LkThumbC} durationInFrames={30} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="XaiDebug" component={XaiDebug} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{ i: 0, f: 30 }} />
      <Composition id="CliThumb" component={CliThumb} durationInFrames={30} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="VibePromoRefresh" component={VibePromoRefresh} durationInFrames={REFRESH_TOTAL_FRAMES} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="GlFilm" component={GlFilm} durationInFrames={GL_FILM_FRAMES} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="GlNews" component={GlNews} durationInFrames={GL_NEWS_FRAMES} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="GlThumb2" component={GlThumb2} durationInFrames={30} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="GlThumb" component={GlThumb} durationInFrames={30} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="XaiThumb" component={XaiThumb} durationInFrames={30} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="VapiThumb" component={VapiThumb} durationInFrames={30} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="VibeShort1" component={VibeShort1} durationInFrames={SHORT1_FRAMES} fps={PROMO_FPS} width={1080} height={1920} />
      <Composition id="VibeShort2" component={VibeShort2} durationInFrames={SHORT2_FRAMES} fps={PROMO_FPS} width={1080} height={1920} />
      <Composition id="CSBuilder" component={CS_Builder} durationInFrames={200} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="CSPlan" component={CS_Plan} durationInFrames={200} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="CSPlanText" component={CS_PlanText} durationInFrames={200} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="CSFlow" component={CS_Flow} durationInFrames={200} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="CSSims" component={CS_Sims} durationInFrames={200} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="CSVoice" component={CS_Voice} durationInFrames={200} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="CSVoicePicked" component={CS_VoicePicked} durationInFrames={200} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="CSNumber" component={CS_Number} durationInFrames={200} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="CSBuddy" component={CS_Buddy} durationInFrames={200} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="CSPublish" component={CS_Publish} durationInFrames={200} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="XaiAgent" component={XaiAgent} durationInFrames={XAI2_FRAMES} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="XaiNews" component={XaiNews} durationInFrames={XAI_NEWS_FRAMES} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="GptLiveAgent" component={GptLiveAgent} durationInFrames={GL_TOTAL_FRAMES} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="GptLiveHostTest" component={GptLiveHostTest} durationInFrames={GPTLIVE_TEST_FRAMES} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="PipecatAgent" component={PipecatAgent} durationInFrames={PC_TOTAL_FRAMES} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition id="LiveKitAgent" component={LiveKitAgent} durationInFrames={LK_TOTAL_FRAMES} fps={PROMO_FPS} width={PROMO_WIDTH} height={PROMO_HEIGHT} />
      <Composition
        id="CallSchedulingAgent"
        component={CallSchedulingAgent}
        durationInFrames={CSA_TOTAL_FRAMES}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
      />
      <Composition
        id="VibePromoMergedV2VO"
        component={VibePromoMerged}
        durationInFrames={MERGED_V2_TOTAL_FRAMES}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
        defaultProps={{ voiceOver: true, introV2: true }}
      />
      <Composition
        id="VibePromoMergedV2"
        component={VibePromoMerged}
        durationInFrames={MERGED_V2_TOTAL_FRAMES}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
        defaultProps={{ voiceOver: false, introV2: true }}
      />
      {/* Split cut 1 — Build your Vibe Agent (describe → approve → build → simulate → Buddy) */}
      <Composition
        id="VibePromoBuildVO"
        component={VibePromoBuild}
        durationInFrames={BUILD_TOTAL_FRAMES}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
        defaultProps={{ voiceOver: true }}
      />
      <Composition
        id="VibePromoBuild"
        component={VibePromoBuild}
        durationInFrames={BUILD_TOTAL_FRAMES}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
        defaultProps={{ voiceOver: false }}
      />
      {/* Split cut 2 — Take your Vibe Agent live (publish → connect a number → go live) */}
      <Composition
        id="VibePromoGoLiveVO"
        component={VibePromoGoLive}
        durationInFrames={GOLIVE_TOTAL_FRAMES}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
        defaultProps={{ voiceOver: true }}
      />
      <Composition
        id="VibePromoGoLive"
        component={VibePromoGoLive}
        durationInFrames={GOLIVE_TOTAL_FRAMES}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
        defaultProps={{ voiceOver: false }}
      />
      <Composition
        id="VibePromoTight"
        component={VibePromoTight}
        durationInFrames={TIGHT_TOTAL_FRAMES}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
        defaultProps={{ voiceOver: false }}
      />
      <Composition
        id="VibePromoTightVO"
        component={VibePromoTight}
        durationInFrames={TIGHT_TOTAL_FRAMES}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
        defaultProps={{ voiceOver: true }}
      />
      <Composition
        id="ConsoleComparison"
        component={ConsoleComparison}
        durationInFrames={CONSOLE_TOTAL_FRAMES}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
        defaultProps={{ voiceOver: false }}
      />
      <Composition
        id="ConsoleComparisonVO"
        component={ConsoleComparison}
        durationInFrames={CONSOLE_TOTAL_FRAMES}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
        defaultProps={{ voiceOver: true }}
      />
      <Composition
        id="OnboardingVoiceAgents"
        component={OnboardingVoiceAgents}
        durationInFrames={ONBOARDING_VA_FRAMES}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
      />
      <Composition
        id="OnboardingSipTrunking"
        component={OnboardingSipTrunking}
        durationInFrames={ONBOARDING_SIP_FRAMES}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
      />
      <Composition
        id="OnboardingVoiceApi"
        component={OnboardingVoiceApi}
        durationInFrames={ONBOARDING_VOICEAPI_FRAMES}
        fps={PROMO_FPS}
        width={PROMO_WIDTH}
        height={PROMO_HEIGHT}
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
