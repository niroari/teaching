import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";

/** Small label: kind of content, level, status. */
export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
  className?: string;
}) {
  const tones = {
    neutral: "border-line text-fg-muted",
    accent: "border-transparent bg-accent-soft text-accent",
    success: "border-transparent bg-success-soft text-success",
    warning: "border-transparent bg-warning-soft text-warning",
    danger: "border-transparent bg-danger-soft text-danger",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

/** One photo treatment for the whole site: fixed ratio, no overlays. */
export function Photo({ src, alt = "", ratio = "aspect-[16/10]", priority = false }: { src: string; alt?: string; ratio?: string; priority?: boolean }) {
  return (
    <div className={`relative w-full overflow-hidden bg-subtle ${ratio}`}>
      {src.startsWith("/") ? (
        <Image src={src} alt={alt} fill priority={priority} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      )}
    </div>
  );
}

interface LinkCardProps {
  href: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Small line under the title. */
  subtitle?: React.ReactNode;
  /** Badges / meta shown above the title. */
  meta?: React.ReactNode;
  /** Call to action at the bottom. */
  cta?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  priority?: boolean;
  /** Gives this card its own accent color (home page, mixed lists). */
  subject?: string;
  className?: string;
}

/** The site's card: optional photo, title, description, call to action. The whole card is the link. */
export function LinkCard({ href, title, description, subtitle, meta, cta, image, imageAlt, priority, subject, className = "" }: LinkCardProps) {
  return (
    <Link
      href={href}
      data-subject={subject}
      className={`group flex flex-col overflow-hidden rounded-lg border border-line bg-card transition-colors hover:border-line-strong ${className}`}
    >
      {image && <Photo src={image} alt={imageAlt} priority={priority} />}
      <div className="flex flex-1 flex-col p-5">
        {meta && <div className="mb-2.5 flex flex-wrap items-center gap-1.5">{meta}</div>}
        <h3 className="text-lg font-semibold leading-snug text-fg">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm font-medium text-accent">{subtitle}</p>}
        {description && <p className="mt-2 text-sm leading-relaxed text-fg-muted">{description}</p>}
        {cta && (
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-fg">
            <span className="underline-offset-4 group-hover:underline">{cta}</span>
            <ArrowRight className="h-4 w-4 text-accent rtl:-scale-x-100" strokeWidth={1.75} aria-hidden />
          </span>
        )}
      </div>
    </Link>
  );
}

/** Pill-less segmented control for filters and tabs. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: React.ReactNode }[];
  label?: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-lg border border-line bg-subtle p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`min-h-9 rounded-md px-3 text-sm font-medium transition-colors cursor-pointer ${
              active ? "bg-card text-fg shadow-sm" : "text-fg-muted hover:text-fg"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function EmptyState({ icon, title, children }: { icon?: React.ReactNode; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-line bg-card p-8 text-center">
      {icon && <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-subtle text-fg-muted">{icon}</div>}
      <h2 className="text-lg font-semibold text-fg">{title}</h2>
      {children && <div className="mt-2 text-sm leading-relaxed text-fg-muted">{children}</div>}
    </div>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return <Loader2 className={`h-5 w-5 animate-spin text-fg-subtle ${className}`} strokeWidth={1.75} aria-label="טוען" />;
}

/** Shared button looks, for <button> and <Link> alike. */
export const btn = {
  primary:
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
  secondary:
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-line-strong bg-card px-4 text-sm font-medium text-fg transition-colors hover:bg-subtle disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
  ghost:
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-fg-muted transition-colors hover:bg-subtle hover:text-fg disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
};
