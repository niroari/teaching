import React from "react";
import OpeningYearPresentation from "@/components/OpeningYearPresentation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "פתיחת שנת הלימודים תשפ״ז 2026-2027 | כיתה ח׳2",
  description: "מצגת פתיחת שנת הלימודים תשפ״ז 2026-2027 לכיתה ח׳2 - נהלים, משמעת, תלמידאות וציפיות הדדיות."
};

export default function OpeningYearPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <OpeningYearPresentation />
    </main>
  );
}
