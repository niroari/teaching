import { ExternalLink } from "lucide-react";
import ActivityBar from "@/components/site/ActivityBar";

// The atlas itself is a self-contained static page in public/tectonics/ (its only home;
// see scripts/tectonics/README.md). This page just frames it full-height.
const ATLAS_SRC = "/tectonics/index.html";

export default function TectonicsAtlasPage() {
  return (
    <div className="flex h-dvh flex-col bg-canvas text-fg">
      <ActivityBar backHref="/earth-sciences" backLabel="חזרה למדעי כדור הארץ" title="כדור הארץ בתנועה" sticky={false}>
        <a
          href={ATLAS_SRC}
          target="_blank"
          rel="noopener"
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-2.5 text-sm font-medium text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
          title="פתיחת האטלס בלשונית נפרדת"
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          <span className="hidden sm:inline">פתיחה בלשונית נפרדת</span>
        </a>
      </ActivityBar>
      <iframe
        src={ATLAS_SRC}
        title="כדור הארץ בתנועה: אטלס אינטראקטיבי של הלוחות הטקטוניים"
        allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="w-full flex-1 border-0"
      />
    </div>
  );
}
