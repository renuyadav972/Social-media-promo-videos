import React from "react";

// The current camera zoom (NativeStageClip provides this). On-screen overlays
// that live inside the zoomed layer — e.g. the ClickCursor — read it to
// counter-scale themselves so they stay a constant size no matter how far the
// camera has pushed in.
export const CameraScaleContext = React.createContext<number>(1);
