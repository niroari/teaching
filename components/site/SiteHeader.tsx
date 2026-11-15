import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import NavbarUser from "@/components/NavbarUser";
import ThemeToggle from "@/components/site/ThemeToggle";

export interface Crumb {
  label: string;
  href?: string;
}

/** The one header every regular page shares: brand, where-am-I trail, theme toggle, account. */
export default function SiteHeader({ crumbs = [] }: { crumbs?: Crumb[] }) {
  return (
    <header dir="rtl" className="sticky top-0 z-40 border-b border-line bg-canvas/95 supports-[backdrop-filter]:bg-canvas/85 supports-[backdrop-filter]:backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 rounded-md" aria-label="דף הבית">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
            נ
          </span>
          <span className={`text-sm font-semibold text-fg ${crumbs.length ? "hidden sm:inline" : ""}`}>ניר עוז-ארי</span>
        </Link>

        {crumbs.length > 0 && (
          <nav aria-label="מיקום באתר" className="flex min-w-0 items-center gap-1 text-sm">
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <span key={i} className={`flex min-w-0 items-center gap-1 ${!last ? "hidden sm:flex" : ""}`}>
                  <ChevronLeft className="h-3.5 w-3.5 shrink-0 text-fg-subtle" strokeWidth={1.75} aria-hidden />
                  {c.href && !last ? (
                    <Link href={c.href} className="truncate rounded px-1 text-fg-muted transition-colors hover:text-fg">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="truncate px-1 font-medium text-fg" aria-current={last ? "page" : undefined}>
                      {c.label}
                    </span>
                  )}
                </span>
              );
            })}
          </nav>
        )}

        <div className="ms-auto flex items-center gap-2">
          <NavbarUser />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
