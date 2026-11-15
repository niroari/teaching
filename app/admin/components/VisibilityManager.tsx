"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Eye, EyeOff, ExternalLink, ChevronDown, Loader2, CheckCircle, AlertTriangle, UserRound } from "lucide-react";
import { useVisibility } from "@/lib/context/VisibilityContext";
import { CONTENT_ITEMS, ContentItem, KIND_LABELS, SUBJECTS, Subject } from "@/lib/content-registry";

interface Props {
  isLight: boolean;
  cardStyle: string;
  borderStyle: string;
  textTitle: string;
  textMuted: string;
  inputStyle: string;
}

const SUBJECT_ORDER: Subject[] = ["earth", "english", "shelach", "enrichment", "other"];

export default function VisibilityManager({ isLight, cardStyle, borderStyle, textTitle, textMuted, inputStyle }: Props) {
  const { visibleIds, setVisible, saving, error, loading, previewAsStudent, setPreviewAsStudent } = useVisibility();
  const [query, setQuery] = useState("");
  const [onlyVisible, setOnlyVisible] = useState(false);
  const [closed, setClosed] = useState<Set<Subject>>(new Set());

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      CONTENT_ITEMS.filter(
        (i) =>
          (!onlyVisible || visibleIds.has(i.id)) &&
          (!q || i.title.toLowerCase().includes(q) || (i.group ?? "").toLowerCase().includes(q))
      ),
    [q, onlyVisible, visibleIds]
  );

  const visibleCount = CONTENT_ITEMS.filter((i) => visibleIds.has(i.id)).length;

  const toggle = (ids: string[], on: boolean) => {
    setVisible(ids, on).catch(() => {
      // surfaced via `error`
    });
  };

  const hideAll = () => {
    if (!window.confirm("להסתיר את כל התכנים מהתלמידים? הם יראו רק את דף הבית הריק.")) return;
    toggle(Array.from(visibleIds), false);
  };

  const softBg = isLight ? "bg-zinc-50" : "bg-white/[0.03]";

  return (
    <div className="space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold ${textTitle} flex items-center gap-2`}>
            <Eye className="w-5 h-5 text-purple-400" />
            <span>מה התלמידים רואים</span>
          </h2>
          <p className={`text-xs ${textMuted} mt-1 leading-relaxed max-w-2xl`}>
            תלמידים ומבקרים שלא התחברו רואים רק את מה שמסומן כאן כגלוי. כל שינוי נשמר מיד ומתעדכן אצל התלמידים בזמן אמת.
            אפשר גם לפרסם או להסתיר ישירות מתוך כל עמוד, בעזרת הכפתור הצף בפינה.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
              isLight ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            }`}
          >
            {visibleCount} פריטים גלויים
          </span>
          <span className={`text-[11px] flex items-center gap-1 ${textMuted}`}>
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> שומר…
              </>
            ) : (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> נשמר
              </>
            )}
          </span>
        </div>
      </div>

      {error && (
        <div
          className={`flex items-start gap-2 p-4 rounded-xl border text-xs leading-relaxed ${
            isLight ? "bg-red-50 border-red-200 text-red-700" : "bg-red-950/30 border-red-500/30 text-red-300"
          }`}
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {error === "permission-denied"
              ? "אין הרשאה לקרוא או לשמור את הגדרות הנראות. צריך לפרסם את חוקי Firestore המעודכנים (firebase deploy --only firestore:rules)."
              : `שגיאה בשמירה: ${error}`}
          </span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className={`w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חיפוש שיעור, מצגת או משימה…"
            className={`w-full py-2.5 pr-10 pl-3 rounded-xl border text-xs font-semibold focus:outline-none ${inputStyle}`}
          />
        </div>
        <button
          type="button"
          onClick={() => setOnlyVisible((v) => !v)}
          className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
            onlyVisible ? "border-purple-500 text-purple-400 bg-purple-500/10" : `${borderStyle} ${textMuted}`
          }`}
        >
          {onlyVisible ? "מציג רק גלויים" : "הצג רק גלויים"}
        </button>
        <button
          type="button"
          onClick={() => setPreviewAsStudent(!previewAsStudent)}
          className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            previewAsStudent ? "border-amber-500 text-amber-400 bg-amber-500/10" : `${borderStyle} ${textMuted}`
          }`}
          title="לגלוש באתר בדיוק כמו תלמיד (רק בלשונית הזו)"
        >
          <UserRound className="w-3.5 h-3.5" />
          {previewAsStudent ? "תצוגת תלמיד פעילה" : "תצוגת תלמיד"}
        </button>
        <button
          type="button"
          onClick={hideAll}
          disabled={visibleCount === 0}
          className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            isLight ? "border-red-200 text-red-600 hover:bg-red-50" : "border-red-500/30 text-red-400 hover:bg-red-950/30"
          }`}
        >
          הסתר הכל
        </button>
      </div>

      {loading ? (
        <div className={`py-16 flex justify-center ${textMuted}`}>
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {SUBJECT_ORDER.map((subject) => {
            const items = filtered.filter((i) => i.subject === subject);
            if (items.length === 0) return null;
            const allInSubject = CONTENT_ITEMS.filter((i) => i.subject === subject);
            const visibleInSubject = allInSubject.filter((i) => visibleIds.has(i.id)).length;
            const isOpen = !closed.has(subject) || q.length > 0;

            // Group items (Earth Sciences units); ungrouped items go first.
            const groups: { name: string | null; items: ContentItem[] }[] = [];
            for (const item of items) {
              const name = item.group ?? null;
              let g = groups.find((x) => x.name === name);
              if (!g) groups.push((g = { name, items: [] }));
              g.items.push(item);
            }

            return (
              <section key={subject} className={`rounded-2xl border ${borderStyle} ${cardStyle} overflow-hidden`}>
                <button
                  type="button"
                  onClick={() =>
                    setClosed((prev) => {
                      const next = new Set(prev);
                      if (next.has(subject)) next.delete(subject);
                      else next.add(subject);
                      return next;
                    })
                  }
                  className="w-full flex items-center justify-between gap-3 p-4 cursor-pointer"
                >
                  <span className={`text-sm font-black ${textTitle}`}>{SUBJECTS[subject].title}</span>
                  <span className="flex items-center gap-3">
                    <span className={`text-[11px] font-bold ${visibleInSubject ? "text-emerald-400" : textMuted}`}>
                      {visibleInSubject}/{allInSubject.length} גלויים
                    </span>
                    <ChevronDown className={`w-4 h-4 ${textMuted} transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </span>
                </button>

                {isOpen && (
                  <div className={`border-t ${borderStyle} divide-y ${isLight ? "divide-zinc-100" : "divide-white/5"}`}>
                    {groups.map((group) => {
                      const ids = group.items.map((i) => i.id);
                      const allOn = ids.every((id) => visibleIds.has(id));
                      return (
                        <div key={group.name ?? "_"}>
                          {group.name && (
                            <div className={`flex items-center justify-between gap-3 px-4 py-2 ${softBg}`}>
                              <span className={`text-xs font-bold ${textTitle}`}>{group.name}</span>
                              <button
                                type="button"
                                onClick={() => toggle(ids, !allOn)}
                                className="text-[11px] font-bold text-purple-400 hover:text-purple-300 cursor-pointer"
                              >
                                {allOn ? "הסתר את כולם" : "פתח את כולם"}
                              </button>
                            </div>
                          )}
                          {group.items.map((item) => (
                            <ItemRow
                              key={item.id}
                              item={item}
                              on={visibleIds.has(item.id)}
                              onToggle={() => toggle([item.id], !visibleIds.has(item.id))}
                              isLight={isLight}
                              textTitle={textTitle}
                              textMuted={textMuted}
                            />
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
          {filtered.length === 0 && <p className={`text-center text-xs py-10 ${textMuted}`}>לא נמצאו פריטים.</p>}
        </div>
      )}
    </div>
  );
}

function ItemRow({
  item,
  on,
  onToggle,
  isLight,
  textTitle,
  textMuted,
}: {
  item: ContentItem;
  on: boolean;
  onToggle: () => void;
  isLight: boolean;
  textTitle: string;
  textMuted: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={`${on ? "הסתרת" : "פרסום"} ${item.title}`}
        onClick={onToggle}
        className={`relative shrink-0 w-11 h-6 rounded-full border transition-colors cursor-pointer ${
          on ? "bg-emerald-500 border-emerald-400" : isLight ? "bg-zinc-200 border-zinc-300" : "bg-zinc-700 border-zinc-600"
        }`}
      >
        <span
          className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-all ${on ? "right-[22px]" : "right-0.5"}`}
        />
      </button>

      <div className="flex-1 min-w-0">
        <div className={`text-xs font-bold truncate ${on ? textTitle : textMuted}`}>{item.title}</div>
      </div>

      <span
        className={`hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          isLight ? "border-zinc-200 text-zinc-500" : "border-white/10 text-zinc-400"
        }`}
      >
        {KIND_LABELS[item.kind]}
      </span>

      <span className={`w-5 flex justify-center ${on ? "text-emerald-400" : textMuted}`} title={on ? "גלוי לתלמידים" : "מוסתר"}>
        {on ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </span>

      {item.path ? (
        <Link
          href={item.path}
          target="_blank"
          className={`p-1.5 rounded-lg ${textMuted} hover:text-purple-400 transition-colors`}
          title="פתיחה בלשונית חדשה"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      ) : (
        <span className="w-7" />
      )}
    </div>
  );
}
