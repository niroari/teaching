import PageShell from "@/components/site/PageShell";
import PageHeader from "@/components/site/PageHeader";
import { PHOTO_CREDITS } from "@/lib/data/photo-credits";

export const metadata = { title: "קרדיטים לתמונות" };

export default function CreditsPage() {
  return (
    <PageShell width="reading" crumbs={[{ label: "קרדיטים לתמונות" }]}>
      <PageHeader
        title="קרדיטים לתמונות"
        description="התמונות באתר הן צילומים ברישיון חופשי. תודה לצלמים ולגופים ששיתפו אותן."
      />
      <ul className="divide-y divide-line rounded-lg border border-line bg-card">
        {PHOTO_CREDITS.map((c) => (
          <li key={c.file} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <span className="text-sm font-medium text-fg">{c.label}</span>
            <span className="text-sm text-fg-muted" dir="ltr">
              <a href={c.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-fg">
                {c.author}
              </a>
              {" · "}
              {c.licenseUrl ? (
                <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-fg">
                  {c.license}
                </a>
              ) : (
                c.license
              )}
            </span>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
