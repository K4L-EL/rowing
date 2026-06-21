import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-5">
      <img
        src="/illustrations/oar-crossed.svg"
        alt=""
        className="h-24 w-24 opacity-20"
      />
      <h1 className="text-6xl font-black text-foreground">404</h1>
      <p className="max-w-md text-center text-muted-foreground">
        That page has drifted off course. The current may have carried it somewhere else.
      </p>
      <Link
        href="/"
        className="clay-button inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground"
      >
        Back to shore
      </Link>
    </div>
  );
}
