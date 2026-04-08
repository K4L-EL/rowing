import Link from "next/link";

const footerLinks = {
  Product: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy policy" },
    { href: "/terms", label: "Terms of service" },
  ],
  Club: [
    { href: "/register", label: "Create account" },
    { href: "/login", label: "Sign in" },
    { href: "/dashboard/welfare", label: "Dashboard" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="clay-sm inline-flex size-8 items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
              R
            </span>
            <span className="font-bold tracking-tight">RowSafe</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Safe, simple club management — starting with welfare, growing with your club.
          </p>
        </div>
        {Object.entries(footerLinks).map(([heading, items]) => (
          <div key={heading}>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {heading}
            </h3>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-foreground/70 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-5 py-5 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} RowSafe. All rights reserved.
      </div>
    </footer>
  );
}
