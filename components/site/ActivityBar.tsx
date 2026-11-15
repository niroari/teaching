import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/site/ThemeToggle";

interface Props {
  backHref: string;
  backLabel: string;
  title?: React.ReactNode;
  /** Extra controls (fullscreen, account…) shown before the theme toggle. */
  children?: React.ReactNode;
  sticky?: boolean;
}

/** Slim top bar for full-screen tools, games and presentations: way back, title, controls. */
export default function ActivityBar({ backHref, backLabel, title, children, sticky = true }: Props) {
  return (
    <header
      dir="rtl"
      className={`${sticky ? "sticky top-0" : ""} z-40 border-b border-line bg-canvas/95 supports-[backdrop-filter]:bg-canvas/85 supports-[backdrop-filter]:backdrop-blur-sm`}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link
          href={backHref}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
        >
          <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          <span>{backLabel}</span>
        </Link>
        {title && (
          <>
            <span className="hidden h-4 w-px bg-line-strong sm:block" aria-hidden />
            <div className="hidden min-w-0 truncate text-sm font-semibold text-fg sm:block">{title}</div>
          </>
        )}
        <div className="ms-auto flex items-center gap-2">
          {children}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
