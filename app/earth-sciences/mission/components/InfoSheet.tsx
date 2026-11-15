"use client";

import React, { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import type { InfoSheet as Sheet } from "@/lib/data/mission-info-sheets";
import InfoDiagram from "./InfoDiagrams";
import type { MissionTheme } from "./theme";

// A collapsible, low-text info sheet shown under each stage title.
export default function InfoSheet({ sheet, theme: t }: { sheet: Sheet | undefined; theme: MissionTheme }) {
  const [open, setOpen] = useState(false);
  if (!sheet) return null;

  return (
    <div className={`rounded-xl border ${t.soft}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`w-full flex items-center gap-2 px-3.5 py-2.5 text-sm font-bold cursor-pointer ${t.accentText}`}
      >
        <BookOpen className="w-4 h-4" />
        דף מידע
        <ChevronDown className={`w-4 h-4 mr-auto transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-3.5 pb-4 space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {sheet.cards.map((c) => (
              <div key={c.term} className={`rounded-lg border p-2.5 flex items-start gap-2 ${t.border} ${t.isLight ? "bg-white" : "bg-white/[0.03]"}`}>
                <span className="text-xl leading-none">{c.icon}</span>
                <div className="min-w-0">
                  <p className={`text-sm font-bold leading-tight ${t.title}`}>{c.term}</p>
                  <p className={`text-xs leading-snug mt-0.5 ${t.muted}`}>{c.line}</p>
                </div>
              </div>
            ))}
          </div>

          {sheet.diagrams.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {sheet.diagrams.map((d) => (
                <figure key={d.id} className={`w-full sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)] rounded-lg border p-3 space-y-2 ${t.border} ${t.title}`}>
                  <InfoDiagram id={d.id} />
                  <figcaption className={`text-xs text-center ${t.muted}`}>{d.caption}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
