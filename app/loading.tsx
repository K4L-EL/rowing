export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <img
        src="/illustrations/oar-crossed.svg"
        alt="Loading..."
        className="h-16 w-16 animate-pulse opacity-30"
      />
    </div>
  );
}
