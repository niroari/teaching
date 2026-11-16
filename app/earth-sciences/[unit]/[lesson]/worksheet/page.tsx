"use client";

import { use } from "react";
import { Printer } from "lucide-react";
import ActivityBar from "@/components/site/ActivityBar";
import { EmptyState, btn } from "@/components/site/ui";
import { PrintWorksheet } from "@/components/earth-sciences/Worksheet";
import { EARTH_SCIENCES_UNITS } from "@/lib/data/earth-sciences-lessons";
import { useVisibility } from "@/lib/context/VisibilityContext";

/** Printable worksheet for one lesson. `?key=1` prints the teacher's answer key (teacher only). */
export default function WorksheetPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ unit: string; lesson: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { unit, lesson } = use(params);
  const { key } = use(searchParams);
  const { isTeacher } = useVisibility();

  const unitData = EARTH_SCIENCES_UNITS.find((u) => u.slug === unit);
  const lessonData = unitData?.lessons.find((l) => l.id === lesson);
  const lessonHref = `/earth-sciences/${unit}/${lesson}`;
  const showAnswers = key === "1" && isTeacher;

  return (
    <div className="site min-h-screen bg-canvas text-fg print:bg-white">
      <div className="print:hidden">
        <ActivityBar backHref={lessonHref} backLabel="חזרה לשיעור" title={showAnswers ? "מחוון למורה" : "דף עבודה להדפסה"}>
          {lessonData?.worksheet && (
            <button type="button" onClick={() => window.print()} className={btn.primary}>
              <Printer className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              <span>הדפסה</span>
            </button>
          )}
        </ActivityBar>
      </div>
      <main dir="rtl" className="px-4 py-8 print:p-0">
        {unitData && lessonData?.worksheet ? (
          <div className="mx-auto max-w-[800px] rounded-lg border border-line print:border-0">
            <PrintWorksheet worksheet={lessonData.worksheet} lessonTitle={lessonData.title} unitTitle={unitData.title} showAnswers={showAnswers} />
          </div>
        ) : (
          <EmptyState title="אין דף עבודה לשיעור הזה">לשיעור הזה עדיין לא הוכן דף עבודה.</EmptyState>
        )}
      </main>
    </div>
  );
}
