interface Props {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Small line above the title (subject, kind…). */
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

/** Page title block: quiet eyebrow, title, one-line description. */
export default function PageHeader({ title, description, eyebrow, actions, className = "" }: Props) {
  return (
    <header className={`mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div className="min-w-0 space-y-2">
        {eyebrow && (
          <div className="flex items-center gap-2 text-sm font-medium text-fg-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            {eyebrow}
          </div>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{title}</h1>
        {description && <p className="max-w-2xl text-base leading-relaxed text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
