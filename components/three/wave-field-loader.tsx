"use client";

import dynamic from "next/dynamic";

const WaveFieldInner = dynamic(
  () => import("@/components/three/wave-field").then((m) => m.WaveField),
  { ssr: false },
);

export function WaveFieldLoader() {
  return <WaveFieldInner />;
}
