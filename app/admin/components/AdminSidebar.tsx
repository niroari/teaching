"use client";

import React from "react";
import Link from "next/link";
import {
  Eye,
  Rocket,
  MessagesSquare,
  Settings,
  Sparkles,
  Sun,
  Moon,
  ArrowRight,
  CalendarClock,
  X,
  LucideIcon,
} from "lucide-react";

export type AdminTab =
  | "visibility"
  | "chat-masters"
  | "mission-new-home"
  | "future-projects"
  | "settings";

export const ADMIN_TABS: AdminTab[] = [
  "visibility",
  "chat-masters",
  "mission-new-home",
  "future-projects",
  "settings",
];

interface NavItem {
  id: AdminTab;
  label: string;
  description: string;
  icon: LucideIcon;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "ניהול",
    items: [
      {
        id: "visibility",
        label: "מה התלמידים רואים",
        description: "בחירה אילו שיעורים, מצגות ומשימות גלויים לתלמידים. כל שינוי נשמר מיד.",
        icon: Eye,
      },
    ],
  },
  {
    label: "משימות",
    items: [
      {
        id: "mission-new-home",
        label: "משימת בית חדש",
        description: "מעקב אחר צוותי המשימה, בדיקת ההגשות ומתן ציון לפי המחוון.",
        icon: Rocket,
      },
    ],
  },
  {
    label: "הגשות",
    items: [
      {
        id: "chat-masters",
        label: "Chat Masters",
        description: "קריאת תמלולי השיחה וכרטיסי היציאה, ומתן ציון ומשוב.",
        icon: MessagesSquare,
      },
    ],
  },
  {
    items: [
      {
        id: "settings",
        label: "הגדרות כיתה",
        description: "פרטי החשבון וההרשאות.",
        icon: Settings,
      },
      {
        id: "future-projects",
        label: "בקרוב",
        description: "כלי ניהול נוספים שמתוכננים לאתר.",
        icon: Sparkles,
      },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

interface Props {
  current: AdminTab;
  onSelect: (tab: AdminTab) => void;
  counts: Partial<Record<AdminTab, number>>;
  isLight: boolean;
  onToggleTheme: () => void;
  userEmail?: string | null;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  current,
  onSelect,
  counts,
  isLight,
  onToggleTheme,
  userEmail,
  mobileOpen,
  setMobileOpen,
}: Props) {
  const surface = isLight ? "bg-white border-zinc-200" : "bg-[#0e1016] border-white/[0.07]";
  const muted = isLight ? "text-zinc-500" : "text-zinc-500";
  const itemBase = isLight
    ? "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100";
  const itemActive = isLight ? "bg-zinc-100 text-zinc-900" : "bg-white/[0.07] text-zinc-50";
  const divider = isLight ? "border-zinc-200" : "border-white/[0.07]";

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-60 shrink-0 border-l flex flex-col transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${surface} ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold ${
                isLight ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-900"
              }`}
            >
              נ
            </span>
            <span className={`text-sm font-semibold ${isLight ? "text-zinc-900" : "text-zinc-100"}`}>לוח מורה</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className={`lg:hidden p-1.5 rounded-md cursor-pointer ${itemBase}`}
            aria-label="סגירת תפריט"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-5">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} className={!group.label ? `pt-4 border-t ${divider}` : undefined}>
              {group.label && (
                <div className={`px-2.5 pb-1.5 text-[11px] font-medium ${muted}`}>{group.label}</div>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = current === item.id;
                  const count = counts[item.id];
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelect(item.id);
                          setMobileOpen(false);
                        }}
                        aria-current={active ? "page" : undefined}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium cursor-pointer transition-colors ${
                          active ? itemActive : itemBase
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                        <span className="flex-1 text-right truncate">{item.label}</span>
                        {!!count && (
                          <span
                            className={`min-w-5 px-1.5 rounded text-[11px] tabular-nums text-center ${
                              isLight ? "bg-amber-100 text-amber-800" : "bg-amber-400/10 text-amber-300"
                            }`}
                            title="ממתינות לבדיקה"
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div>
            <div className={`px-2.5 pb-1.5 text-[11px] font-medium ${muted}`}>כלי מחנך</div>
            <Link
              href="/parents/meetings"
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium ${itemBase}`}
            >
              <CalendarClock className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              <span className="flex-1 text-right truncate">ימי הורים: שיבוץ</span>
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className={`border-t ${divider} p-3 space-y-2`}>
          {userEmail && (
            <div className={`px-1 text-[11px] truncate ${muted}`} dir="ltr" title={userEmail}>
              {userEmail}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className={`flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] font-medium ${itemBase}`}
            >
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              <span>חזרה לאתר</span>
            </Link>
            <button
              type="button"
              onClick={onToggleTheme}
              className={`p-2 rounded-md cursor-pointer ${itemBase}`}
              title="Comfort Reading Mode (מצב בהיר/כהה)"
              aria-label="החלפת מצב תצוגה"
            >
              {isLight ? <Moon className="w-4 h-4" strokeWidth={1.75} /> : <Sun className="w-4 h-4" strokeWidth={1.75} />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
