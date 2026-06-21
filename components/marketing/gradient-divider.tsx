"use client";

export function GradientDivider() {
  return (
    <div className="flex justify-center px-5 py-16">
      <svg
        viewBox="0 0 200 24"
        className="h-8 w-48 opacity-25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
        <path
          d="M0 12 Q25 4 50 12 T100 12 T150 12 T200 12"
          stroke="url(#waveGrad)"
          strokeWidth="2"
          fill="none"
          className="animate-[waveDrift_3s_ease-in-out_infinite]"
        />
      </svg>
    </div>
  );
}
