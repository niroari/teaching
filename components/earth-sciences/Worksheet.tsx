"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Printer, RotateCcw, X } from "lucide-react";
import { btn } from "@/components/site/ui";
import { useStoredValue } from "@/lib/hooks/useStoredValue";
import {
  questionNumbers,
  sortKey,
  tableKey,
  type ChoiceItem,
  type SortItem,
  type TableItem,
  type TextItem,
  type Worksheet as WorksheetData,
  type WorksheetAnswers,
  type WorksheetItem,
} from "@/lib/data/earth-sciences-worksheet";

const HEBREW_LETTERS = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח"];

/* ───────────────────────── Digital worksheet ───────────────────────── */

/**
 * The lesson's task, filled in on the site. Answers are kept in this browser only
 * (a draft per lesson), so a student can close the tab and come back to it.
 */
export function DigitalWorksheet({ worksheet, lessonId, printHref }: { worksheet: WorksheetData; lessonId: string; printHref: string }) {
  const [stored, setStored] = useStoredValue(`earth-worksheet:${lessonId}`);
  const answers: WorksheetAnswers = useMemo(() => {
    try {
      return stored ? (JSON.parse(stored) as WorksheetAnswers) : {};
    } catch {
      return {};
    }
  }, [stored]);
  const [checked, setChecked] = useState(false);

  const set = (key: string, value: string) =>
    setStored((prev) => {
      let current: WorksheetAnswers = {};
      try {
        current = prev ? (JSON.parse(prev) as WorksheetAnswers) : {};
      } catch {
        // a broken draft is replaced
      }
      return JSON.stringify({ ...current, [key]: value });
    });
  const reset = () => {
    setStored(null);
    setChecked(false);
  };

  const numbers = questionNumbers(worksheet);
  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
        <div>
          <h3 className="text-lg font-semibold text-fg">{worksheet.title}</h3>
          {worksheet.instructions && <p className="mt-1 text-sm text-fg-muted">{worksheet.instructions}</p>}
          <p className="mt-1 text-xs text-fg-subtle">התשובות נשמרות בדפדפן הזה בלבד.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={printHref} target="_blank" className={btn.secondary}>
            <Printer className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            <span>דף להדפסה</span>
          </Link>
        </div>
      </div>

      {worksheet.sections.map((section, sIdx) => (
        <section key={sIdx} className="space-y-4 rounded-lg border border-line bg-card p-5">
          <SectionHeader index={sIdx} section={section} />
          {section.items.map((item) => {
            const number = numbers.get(item.id);
            return (
              <div key={item.id} className="space-y-2 border-t border-line pt-4 first:border-t-0 first:pt-0">
                <p className="text-sm font-semibold leading-relaxed text-fg">
                  {number}. {item.prompt}
                </p>
                <DigitalItem item={item} answers={answers} set={set} checked={checked} />
              </div>
            );
          })}
        </section>
      ))}

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setChecked(true)} className={btn.primary}>
          <Check className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          <span>בדיקה</span>
        </button>
        {checked && (
          <button type="button" onClick={() => setChecked(false)} className={btn.secondary}>
            הסתרת התשובות
          </button>
        )}
        <button type="button" onClick={reset} className={btn.ghost}>
          <RotateCcw className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          <span>ניקוי הדף</span>
        </button>
      </div>
    </div>
  );
}

function SectionHeader({ index, section }: { index: number; section: WorksheetData["sections"][number] }) {
  return (
    <div className="space-y-3">
      <h4 className="text-base font-semibold text-fg">
        חלק {HEBREW_LETTERS[index]}: {section.title}
      </h4>
      {section.image && (
        <figure className="space-y-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={section.image.src} alt={section.image.alt} className={section.image.diagram ? "mx-auto max-h-[32rem] w-full rounded-md border border-line bg-white object-contain" : "max-h-72 w-full rounded-md border border-line object-cover"} />
          {section.image.caption && <figcaption className="text-xs text-fg-subtle">{section.image.caption}</figcaption>}
        </figure>
      )}
      {section.text && (
        <div className="space-y-2 rounded-md bg-subtle p-4 text-sm leading-relaxed text-fg">
          {section.text.split(/\n\s*\n/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function DigitalItem({ item, answers, set, checked }: { item: WorksheetItem; answers: WorksheetAnswers; set: (k: string, v: string) => void; checked: boolean }) {
  switch (item.kind) {
    case "choice":
      return <DigitalChoice item={item} answers={answers} set={set} checked={checked} />;
    case "text":
      return <DigitalText item={item} answers={answers} set={set} checked={checked} />;
    case "table":
      return <DigitalTable item={item} answers={answers} set={set} checked={checked} />;
    case "sort":
      return <DigitalSort item={item} answers={answers} set={set} checked={checked} />;
  }
}

function Verdict({ ok }: { ok: boolean }) {
  return ok ? (
    <Check className="h-4 w-4 shrink-0 text-success" strokeWidth={1.75} aria-label="נכון" />
  ) : (
    <X className="h-4 w-4 shrink-0 text-danger" strokeWidth={1.75} aria-label="לא נכון" />
  );
}

function ModelAnswer({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-line bg-accent-soft p-3 text-sm leading-relaxed text-fg">
      <span className="font-semibold text-accent">תשובה לדוגמה: </span>
      {children}
    </div>
  );
}

function DigitalChoice({ item, answers, set, checked }: { item: ChoiceItem; answers: WorksheetAnswers; set: (k: string, v: string) => void; checked: boolean }) {
  const chosen = answers[item.id];
  return (
    <div className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-2">
        {item.options.map((option, i) => {
          const selected = chosen === String(i);
          const showOk = checked && i === item.answer;
          const showWrong = checked && selected && i !== item.answer;
          return (
            <label
              key={i}
              className={`flex cursor-pointer items-start gap-2 rounded-md border p-3 text-sm transition-colors ${
                selected ? "border-line-strong bg-subtle" : "border-line hover:bg-subtle"
              } ${showOk ? "border-success" : ""} ${showWrong ? "border-danger" : ""}`}
            >
              <input type="radio" name={item.id} checked={selected} onChange={() => set(item.id, String(i))} className="mt-1 accent-current" />
              <span className="flex-1 text-fg">{option}</span>
              {showOk && <Verdict ok />}
              {showWrong && <Verdict ok={false} />}
            </label>
          );
        })}
      </div>
      {checked && item.explanation && <ModelAnswer>{item.explanation}</ModelAnswer>}
    </div>
  );
}

function DigitalText({ item, answers, set, checked }: { item: TextItem; answers: WorksheetAnswers; set: (k: string, v: string) => void; checked: boolean }) {
  return (
    <div className="space-y-2">
      <textarea
        value={answers[item.id] ?? ""}
        onChange={(e) => set(item.id, e.target.value)}
        rows={Math.max(2, item.lines ?? 3)}
        className="w-full rounded-md border border-line-strong bg-card p-3 text-sm leading-relaxed text-fg placeholder:text-fg-subtle"
        placeholder="כתבו כאן את התשובה"
      />
      {checked && <ModelAnswer>{item.answer}</ModelAnswer>}
    </div>
  );
}

function DigitalTable({ item, answers, set, checked }: { item: TableItem; answers: WorksheetAnswers; set: (k: string, v: string) => void; checked: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-line bg-subtle p-2 text-right font-semibold text-fg">{item.rowHeader}</th>
            {item.columns.map((c) => (
              <th key={c} className="border border-line bg-subtle p-2 text-right font-semibold text-fg">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {item.rows.map((row, r) => (
            <tr key={r}>
              <th className="w-1/4 border border-line p-2 text-right align-top font-medium text-fg">{row.label}</th>
              {item.columns.map((_, c) => (
                <td key={c} className="border border-line p-1.5 align-top">
                  <textarea
                    value={answers[tableKey(item.id, r, c)] ?? ""}
                    onChange={(e) => set(tableKey(item.id, r, c), e.target.value)}
                    rows={2}
                    className="w-full resize-y rounded border-0 bg-transparent p-1 text-sm text-fg"
                    aria-label={`${row.label}: ${item.columns[c]}`}
                  />
                  {checked && <p className="mt-1 rounded bg-accent-soft p-1.5 text-xs leading-relaxed text-fg">{row.answers[c]}</p>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DigitalSort({ item, answers, set, checked }: { item: SortItem; answers: WorksheetAnswers; set: (k: string, v: string) => void; checked: boolean }) {
  const correct = item.cards.filter((card, i) => answers[sortKey(item.id, i)] === String(card.answer)).length;
  return (
    <div className="space-y-2">
      <ul className="space-y-2">
        {item.cards.map((card, i) => {
          const value = answers[sortKey(item.id, i)];
          return (
            <li key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-line p-2.5">
              <span className="flex items-center gap-2 text-sm text-fg">
                {checked && value !== undefined && <Verdict ok={value === String(card.answer)} />}
                {card.text}
              </span>
              <div className="inline-flex gap-1 rounded-md border border-line bg-subtle p-0.5" role="radiogroup" aria-label={card.text}>
                {item.categories.map((cat, c) => {
                  const active = value === String(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => set(sortKey(item.id, i), String(c))}
                      className={`min-h-8 rounded px-2.5 text-xs font-medium transition-colors cursor-pointer ${
                        active ? "bg-card text-fg shadow-sm" : "text-fg-muted hover:text-fg"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
      {checked && (
        <p className="text-sm font-medium text-fg">
          {correct} מתוך {item.cards.length} נכונות.
        </p>
      )}
    </div>
  );
}

/* ───────────────────────── Printable worksheet ───────────────────────── */

/** The same worksheet as a sheet to print. With `showAnswers` it is the teacher's answer key. */
export function PrintWorksheet({ worksheet, lessonTitle, unitTitle, showAnswers = false }: { worksheet: WorksheetData; lessonTitle: string; unitTitle: string; showAnswers?: boolean }) {
  const numbers = questionNumbers(worksheet);
  return (
    <article className="worksheet-print mx-auto max-w-[800px] space-y-6 bg-card p-8 text-right text-fg print:max-w-none print:p-0">
      <header className="space-y-3 border-b-2 border-fg pb-4">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-xs text-fg-muted">מדעי כדור הארץ, כיתה ח׳ · {unitTitle}</p>
          {showAnswers && <p className="text-xs font-semibold text-accent">מחוון למורה</p>}
        </div>
        <h1 className="text-2xl font-bold">{worksheet.title}</h1>
        <p className="text-sm text-fg-muted">{lessonTitle}</p>
        {!showAnswers && (
          <div className="grid grid-cols-3 gap-4 pt-2 text-sm">
            <span>שם: ____________________</span>
            <span>כיתה: ________</span>
            <span>תאריך: ________</span>
          </div>
        )}
        {worksheet.instructions && <p className="text-sm">{worksheet.instructions}</p>}
      </header>

      {worksheet.sections.map((section, sIdx) => (
        <section key={sIdx} className="space-y-4 break-inside-avoid-page">
          <h2 className="text-lg font-semibold">
            חלק {HEBREW_LETTERS[sIdx]}: {section.title}
          </h2>
          {section.image && (
            <figure className="space-y-1 break-inside-avoid">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={section.image.src} alt={section.image.alt} className={section.image.diagram ? "mx-auto max-h-[26rem] w-full border border-line object-contain" : "max-h-64 w-full border border-line object-cover"} />
              {section.image.caption && <figcaption className="text-xs text-fg-muted">{section.image.caption}</figcaption>}
            </figure>
          )}
          {section.text && (
            <div className="space-y-2 border border-line p-4 text-sm leading-relaxed">
              {section.text.split(/\n\s*\n/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
          {section.items.map((item) => {
            const number = numbers.get(item.id);
            return (
              <div key={item.id} className="space-y-2 break-inside-avoid">
                <p className="text-sm font-semibold leading-relaxed">
                  {number}. {item.prompt}
                </p>
                <PrintItem item={item} showAnswers={showAnswers} />
              </div>
            );
          })}
        </section>
      ))}
    </article>
  );
}

function KeyText({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-accent">{children}</span>;
}

function PrintItem({ item, showAnswers }: { item: WorksheetItem; showAnswers: boolean }) {
  switch (item.kind) {
    case "choice":
      return (
        <div className="space-y-1.5">
          <ol className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            {item.options.map((o, i) => (
              <li key={i} className="flex gap-2">
                <span className="inline-block h-4 w-4 shrink-0 translate-y-0.5 rounded-full border border-fg text-center text-[10px] leading-[14px]">
                  {showAnswers && i === item.answer ? "✓" : ""}
                </span>
                <span className={showAnswers && i === item.answer ? "font-semibold text-accent" : ""}>{o}</span>
              </li>
            ))}
          </ol>
          {showAnswers && item.explanation && (
            <p className="text-sm">
              <KeyText>הסבר: </KeyText>
              {item.explanation}
            </p>
          )}
        </div>
      );
    case "text":
      return showAnswers ? (
        <p className="text-sm leading-relaxed">
          <KeyText>תשובה לדוגמה: </KeyText>
          {item.answer}
        </p>
      ) : (
        <div>
          {Array.from({ length: item.lines ?? 3 }).map((_, i) => (
            <div key={i} className="h-8 border-b border-fg-subtle" />
          ))}
        </div>
      );
    case "table":
      return (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-1/4 border border-fg p-2 text-right">{item.rowHeader}</th>
              {item.columns.map((c) => (
                <th key={c} className="border border-fg p-2 text-right">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {item.rows.map((row, r) => (
              <tr key={r}>
                <th className="border border-fg p-2 text-right align-top font-medium">{row.label}</th>
                {row.answers.map((a, c) => (
                  <td key={c} className={`border border-fg p-2 align-top ${showAnswers ? "" : "h-16"}`}>
                    {showAnswers && <KeyText>{a}</KeyText>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "sort":
      return (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-fg p-2 text-right">תופעה</th>
              {item.categories.map((c) => (
                <th key={c} className="w-28 border border-fg p-2 text-center">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {item.cards.map((card, i) => (
              <tr key={i}>
                <td className="border border-fg p-2">{card.text}</td>
                {item.categories.map((_, c) => (
                  <td key={c} className="border border-fg p-2 text-center">
                    {showAnswers && card.answer === c ? <KeyText>✓</KeyText> : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
  }
}

/** Teacher view of the key, compact, for the lesson plan tab. */
export function AnswerKey({ worksheet }: { worksheet: WorksheetData }) {
  const numbers = questionNumbers(worksheet);
  return (
    <ol className="space-y-3 text-sm">
      {worksheet.sections.flatMap((s) =>
        s.items.map((item) => {
          const number = numbers.get(item.id);
          return (
            <li key={item.id} className="space-y-1">
              <p className="font-medium text-fg">
                {number}. {item.prompt}
              </p>
              <p className="leading-relaxed text-fg-muted">{keySummary(item)}</p>
            </li>
          );
        })
      )}
    </ol>
  );
}

function keySummary(item: WorksheetItem): string {
  switch (item.kind) {
    case "choice":
      return `${item.options[item.answer]}${item.explanation ? `. ${item.explanation}` : ""}`;
    case "text":
      return item.answer;
    case "table":
      return item.rows.map((r) => `${r.label}: ${r.answers.map((a, i) => `${item.columns[i]}: ${a}`).join(" | ")}`).join(" · ");
    case "sort":
      return item.categories
        .map((cat, c) => `${cat}: ${item.cards.filter((k) => k.answer === c).map((k) => k.text).join(", ")}`)
        .join(" · ");
  }
}
