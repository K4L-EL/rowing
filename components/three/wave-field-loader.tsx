"use client";

import dynamic from "next/dynamic";

const WaveFieldInner = dynamic(
  () => import("@/components/three/wave-field").then((m) => m.WaveField),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <img
          src="/illustrations/oar-crossed.svg"
          alt="Loading..."
          className="h-16 w-16 animate-pulse opacity-40"
        />
      </div>
    ),
  },
);

export function WaveFieldLoader() {
  return <WaveFieldInner />;
}
