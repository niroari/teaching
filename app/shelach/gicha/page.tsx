"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  Sun,
  Moon,
  Search,
  Download,
  Printer,
  Trash2,
  Users,
  CheckCircle2,
  Circle,
  FileSpreadsheet,
  Plus,
  HelpCircle,
  Sparkles,
  ClipboardPaste,
  Check,
  Building2,
  Calendar,
  Presentation,
  Maximize2,
  Minimize2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  GICHA_ROLES,
  GICHA_DOMAINS,
  DOMAIN_COLORS,
  DEFAULT_CLASSES,
  DEFAULT_YEARS
} from "@/lib/data/shelach-gicha-roles";

export default function GichaPage() {
  // --- Comfort Reading Mode ---
  const [comfortMode, setComfortMode] = useState<"dark" | "light">("dark");
  const isLight = comfortMode === "light";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("teaching-site-comfort-mode");
      if (stored === "light" || stored === "dark") {
        setComfortMode(stored);
      }
    }
  }, []);

  const toggleComfortMode = () => {
    const next = comfortMode === "dark" ? "light" : "dark";
    setComfortMode(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("teaching-site-comfort-mode", next);
    }
  };

  // --- Year & Class Selection ---
  const [years, setYears] = useState(DEFAULT_YEARS);
  const [selectedYearId, setSelectedYearId] = useState<string>("5787"); // ברירת מחדל תשפ״ז
  const [classes, setClasses] = useState(DEFAULT_CLASSES);
  const [selectedClassId, setSelectedClassId] = useState<string>("h1");

  // Load custom years / classes if saved in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedYears = localStorage.getItem("gicha_years_list");
      if (savedYears) {
        try {
          const parsed = JSON.parse(savedYears);
          if (Array.isArray(parsed) && parsed.length > 0) setYears(parsed);
        } catch (e) {
          console.error(e);
        }
      }

      const savedClasses = localStorage.getItem("gicha_classes_list");
      if (savedClasses) {
        try {
          const parsed = JSON.parse(savedClasses);
          if (Array.isArray(parsed) && parsed.length > 0) setClasses(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Current year & class labels
  const currentYearObj = years.find((y) => y.id === selectedYearId) || years[0];
  const currentClassObj = classes.find((c) => c.id === selectedClassId) || classes[0];

  // --- Student Assignments State ---
  // Key format: gicha_assignments_{yearId}_{classId} -> Record<roleId, studentName>
  const storageKey = `gicha_assignments_${selectedYearId}_${selectedClassId}`;
  const [assignments, setAssignments] = useState<Record<number, string>>({});
  const [loadedStorage, setLoadedStorage] = useState(false);

  // Load assignments when class or year changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          setAssignments(JSON.parse(stored));
        } catch (e) {
          setAssignments({});
        }
      } else {
        setAssignments({});
      }
      setLoadedStorage(true);
    }
  }, [storageKey]);

  // Handle name change for a role
  const handleStudentNameChange = (roleId: number, name: string) => {
    const updated = { ...assignments, [roleId]: name };
    setAssignments(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  };

  // --- Filtering & Searching ---
  const [selectedDomain, setSelectedDomain] = useState<string>("הכל");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"cards" | "table" | "projector">("cards");
  const [isProjectorMode, setIsProjectorMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Toggle Fullscreen API
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const filteredRoles = useMemo(() => {
    return GICHA_ROLES.filter((role) => {
      const matchDomain = selectedDomain === "הכל" || role.domain === selectedDomain;
      const assignedName = assignments[role.id] || "";
      const matchSearch =
        searchQuery.trim() === "" ||
        role.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignedName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDomain && matchSearch;
    });
  }, [selectedDomain, searchQuery, assignments]);

  // --- Statistics ---
  const totalRoles = GICHA_ROLES.length; // 39
  const assignedCount = useMemo(() => {
    return GICHA_ROLES.filter((r) => !!(assignments[r.id] && assignments[r.id].trim() !== "")).length;
  }, [assignments]);
  const progressPercent = Math.round((assignedCount / totalRoles) * 100);

  // --- Modal / Dialogs for Extra Actions ---
  const [showAddYearModal, setShowAddYearModal] = useState(false);
  const [newYearName, setNewYearName] = useState("");
  const [showBulkPasteModal, setShowBulkPasteModal] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Add Year
  const handleAddYear = () => {
    if (!newYearName.trim()) return;
    const newId = `year_${Date.now()}`;
    const updated = [...years, { id: newId, name: newYearName.trim() }];
    setYears(updated);
    setSelectedYearId(newId);
    if (typeof window !== "undefined") {
      localStorage.setItem("gicha_years_list", JSON.stringify(updated));
    }
    setNewYearName("");
    setShowAddYearModal(false);
  };

  // Bulk Paste Students
  const handleBulkApply = () => {
    const lines = bulkText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const updated = { ...assignments };
    lines.forEach((name, idx) => {
      if (idx < GICHA_ROLES.length) {
        const roleId = GICHA_ROLES[idx].id;
        updated[roleId] = name;
      }
    });

    setAssignments(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
    setBulkText("");
    setShowBulkPasteModal(false);
  };

  // Clear current class assignments
  const handleClearAssignments = () => {
    setAssignments({});
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
    setShowClearConfirm(false);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["מספר", "תחום / צוות", "תפקיד מוגדר", "שם התלמיד/ה", "תיאור אחריות ומשימות"];
    const rows = GICHA_ROLES.map((r) => [
      r.id,
      `"${r.domain}"`,
      `"${r.role}"`,
      `"${(assignments[r.id] || "").trim()}"`,
      `"${r.description.replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `חלוקת_תפקידים_גיחה_${currentClassObj.name.replace(/\s+/g, "_")}_${currentYearObj.name.replace(/\s+/g, "_")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print view
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      dir="rtl"
      className={`min-h-screen transition-colors duration-200 bg-canvas text-fg`}
    >
      {/* Background Glows for dark mode */}
      {/* Top Header & Navbar (hidden in print) */}
      <header
        className={`sticky top-0 z-30 border-b print:hidden transition-colors bg-card border-line shadow-xs dark:shadow-sm`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Back button & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <Link
              href="/shelach"
              className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors text-fg-muted hover:text-fg hover:bg-subtle`}
            >
              <ArrowRight className="w-4 h-4" />
              <span>חזרה לשל״ח</span>
            </Link>
            <div className={`h-4 w-px bg-subtle-hover`} />
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-orange-500/10 text-orange-500">
                <Compass className="w-4 h-4" />
              </span>
              <span className="font-bold text-sm sm:text-base">גיחה מחנאית</span>
            </div>
          </div>

          {/* Controls: Actions & Comfort Mode */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Projector Mode Toggle Button */}
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsProjectorMode(true)}
              title="הקרנה כיתתית במסך אחד (מקרן / לוח חכם)"
              className="gap-1.5 text-xs sm:text-sm font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
            >
              <Presentation className="w-4 h-4" />
              <span>מצב הקרנה כיתתי</span>
            </Button>

            {/* Print button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              title="הדפסת טופס משימה כיתתי"
              className={`gap-1.5 text-xs sm:text-sm font-medium border-line bg-card hover:bg-subtle text-fg`}
            >
              <Printer className="w-4 h-4 text-orange-700 dark:text-orange-400" />
              <span className="hidden sm:inline">הדפסה</span>
            </Button>

            {/* Export CSV */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              title="ייצוא לגיליון אקסל / CSV"
              className={`gap-1.5 text-xs sm:text-sm font-medium border-line bg-card hover:bg-subtle text-fg`}
            >
              <Download className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span className="hidden sm:inline">ייצוא ל-CSV</span>
            </Button>

            {/* Comfort Mode Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleComfortMode}
              title={isLight ? "מעבר למצב כהה" : "מצב קריאה נוח (בהיר)"}
              className={`transition-colors border-line bg-subtle hover:bg-subtle-hover text-amber-600 dark:text-fg-muted hover:text-fg`}
            >
              {isLight ? (
                <Moon className="w-4 h-4 text-fg" />
              ) : (
                <Sun className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Banner Section */}
        <div
          className={`rounded-xl p-6 sm:p-8 mb-6 border transition-all bg-card border-line shadow-sm`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-500 border border-orange-500/20 mb-3">
                <Compass className="w-3.5 h-3.5" />
                <span>הכנה ליציאה לשדה • חלוקת תפקידים</span>
              </div>
              <h1
                className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-fg`}
              >
                חלוקת תפקידים כיתתית לגיחה
              </h1>
              <p
                className={`text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed text-fg-muted`}
              >
                בכל כיתה 39 בעלי תפקידים המאורגנים בצוותי משימה: הנהגה, מחנה, כלכלה, תרבות, פרסום ותיעוד, בטיחות ועוד.
                הקצו שמות לכל תפקיד, צפו באחוז האיוש בזמן אמת, והפיקו דף משימה כיתתי להדפסה או גיליון נתונים.
              </p>
            </div>

            {/* Quick Stat Card */}
            <div
              className={`p-5 rounded-xl border flex flex-col items-center justify-center min-w-[240px] text-center bg-orange-50/60 border-orange-200/80 dark:bg-subtle dark:border-line dark:shadow-inner`}
            >
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-orange-500">
                <Users className="w-4 h-4" />
                <span>סטטוס איוש כיתתי</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-bold text-fg`}>
                  {assignedCount}
                </span>
                <span className={`text-lg font-bold text-fg-muted`}>
                  / {totalRoles}
                </span>
              </div>
              <p className={`text-xs mt-1 font-medium text-fg-muted`}>
                {progressPercent === 100
                  ? "כל התפקידים אוישו בהצלחה! 🎉"
                  : `${progressPercent}% מהתפקידים אוישו`}
              </p>

              {/* Mini Progress Bar */}
              <div className="w-full bg-subtle-hover dark:bg-zinc-800 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="h-full transition-all duration-300 bg-orange-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Print-Only Header Block */}
        <div className="hidden print:block mb-8 pb-4 border-b-2 border-line text-center">
          <h1 className="text-3xl font-bold text-fg">גיחה מחנאית — חלוקת תפקידים כיתתית</h1>
          <div className="flex justify-center gap-8 mt-2 text-lg font-bold text-fg">
            <span>כיתה: {currentClassObj.name}</span>
            <span>שנת לימודים: {currentYearObj.name}</span>
            <span>סה״כ תלמידים: {assignedCount} / {totalRoles}</span>
          </div>
        </div>

        {/* Selectors Bar: Year & Class Switcher (hidden in print) */}
        <div
          className={`p-4 rounded-xl border mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden transition-colors bg-card border-line`}
        >
          {/* Year selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-700 dark:text-orange-400" />
            <span className="text-xs font-bold text-fg-muted">שנת לימודים:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {years.map((y) => (
                <button
                  key={y.id}
                  onClick={() => setSelectedYearId(y.id)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    selectedYearId === y.id
                      ? "bg-orange-500 text-white shadow-xs"
                      : "bg-subtle text-fg hover:bg-subtle-hover"
                  }`}
                >
                  {y.name}
                </button>
              ))}
              <button
                onClick={() => setShowAddYearModal(true)}
                title="הוספת שנת לימודים חדשה"
                className={`p-1.5 rounded-lg border text-xs transition-colors border-line hover:bg-subtle text-fg-muted hover:text-fg`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Class selector */}
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-orange-700 dark:text-orange-400" />
            <span className="text-xs font-bold text-fg-muted">בחירת כיתה:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    selectedClassId === cls.id
                      ? "bg-amber-500 text-white shadow-xs"
                      : "bg-subtle text-fg hover:bg-subtle-hover"
                  }`}
                >
                  {cls.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick utility tools */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBulkPasteModal(true)}
              title="הדבקת שמות מהירה מרשימה"
              className={`text-xs gap-1.5 border-line bg-card`}
            >
              <ClipboardPaste className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
              <span>הדבקה מהירה</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearConfirm(true)}
              title="ניקוי שמות התלמידים בכיתה הנוכחית"
              className={`text-xs gap-1.5 text-rose-500 hover:text-rose-600 border-line bg-card`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>איפוס</span>
            </Button>
          </div>
        </div>

        {/* Filter Tabs & Search Bar (hidden in print) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 print:hidden">
          {/* Domains tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {GICHA_DOMAINS.map((domain) => {
              const countInDomain =
                domain === "הכל"
                  ? totalRoles
                  : GICHA_ROLES.filter((r) => r.domain === domain).length;
              return (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedDomain === domain
                      ? "bg-orange-600 text-white shadow-xs"
                      : "bg-card text-fg-muted border border-line hover:bg-subtle hover:text-fg"
                  }`}
                >
                  <span>{domain}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedDomain === domain
                        ? "bg-subtle text-fg"
                        : "bg-subtle text-fg-muted"
                    }`}
                  >
                    {countInDomain}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search box & View Switch */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none" />
              <input
                type="text"
                placeholder="חיפוש תפקיד, תיאור או תלמיד/ה..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pr-9 pl-3 py-1.5 rounded-lg text-xs font-medium border outline-none transition-all bg-card border-line text-fg focus:border-orange-500 focus:ring-1 focus:ring-orange-500`}
              />
            </div>

            {/* Toggle View: Cards / Table */}
            <div
              className={`flex items-center p-0.5 rounded-lg border bg-subtle border-line`}
            >
              <button
                onClick={() => setViewMode("cards")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  viewMode === "cards"
                    ? "bg-orange-500 text-white shadow-xs"
                    : "text-fg-muted hover:text-fg"
                }`}
              >
                כרטיסיות
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  viewMode === "table"
                    ? "bg-orange-500 text-white shadow-xs"
                    : "text-fg-muted hover:text-fg"
                }`}
              >
                טבלה
              </button>
              <button
                onClick={() => setIsProjectorMode(true)}
                className="px-2.5 py-1 text-xs font-semibold rounded-md transition-all text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 flex items-center gap-1"
                title="הצגת כל התפקידים במסך אחד להקרנה"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>הקרנה</span>
              </button>
            </div>
          </div>
        </div>

        {/* Roles Display: Cards Mode */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:hidden">
            {filteredRoles.map((role) => {
              const currentName = assignments[role.id] || "";
              const isAssigned = currentName.trim() !== "";
              const colorConfig = DOMAIN_COLORS[role.domain] || {
                bgDark: "bg-subtle",
                borderDark: "border-line",
                textDark: "text-orange-700 dark:text-orange-400",
                bgLight: "bg-card",
                borderLight: "border-line",
                textLight: "text-orange-600",
                badge: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30"
              };

              return (
                <div
                  key={role.id}
                  className={`rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 ${
                    isLight
                      ? isAssigned
                        ? "bg-card border-line shadow-sm"
                        : "bg-subtle border-line hover:border-line"
                      : isAssigned
                      ? "bg-subtle border-line shadow-md"
                      : "bg-subtle border-line hover:border-line"
                  }`}
                >
                  <div>
                    {/* Top row: ID, Domain badge, assignment status */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold bg-subtle-hover text-fg`}
                        >
                          {role.id}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${colorConfig.badge}`}
                        >
                          {role.domain}
                        </span>
                      </div>

                      {isAssigned ? (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>מאויש</span>
                        </div>
                      ) : (
                        <div
                          className={`flex items-center gap-1 text-[11px] font-medium text-fg-muted`}
                        >
                          <Circle className="w-3.5 h-3.5" />
                          <span>פנוי</span>
                        </div>
                      )}
                    </div>

                    {/* Role Title */}
                    <h3
                      className={`text-base font-bold mb-1.5 leading-snug text-fg`}
                    >
                      {role.role}
                    </h3>

                    {/* Role Description */}
                    <p
                      className={`text-xs leading-relaxed mb-4 text-fg-muted`}
                    >
                      {role.description}
                    </p>
                  </div>

                  {/* Student Name Input */}
                  <div className="pt-2 border-t border-line">
                    <label
                      className={`block text-[11px] font-bold mb-1 text-fg`}
                    >
                      שם התלמיד/ה המשובץ/ת:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="הקלידו שם מלא..."
                        value={currentName}
                        onChange={(e) => handleStudentNameChange(role.id, e.target.value)}
                        className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium border outline-none transition-all bg-card border-line text-fg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${isAssigned ? "font-bold" : ""}`}
                      />
                      {isAssigned && (
                        <button
                          onClick={() => handleStudentNameChange(role.id, "")}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-fg-muted hover:text-rose-500 transition-colors"
                          title="הסרת תלמיד/ה"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Roles Display: Table Mode (Interactive & Always used in Print View) */}
        {(viewMode === "table" || true) && (
          <div
            className={`rounded-xl border overflow-hidden ${
              viewMode !== "table" ? "hidden print:block" : "print:block"
            } bg-card border-line`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr
                    className={`border-b font-bold bg-subtle text-fg border-line`}
                  >
                    <th className="py-3 px-3 w-12 text-center">#</th>
                    <th className="py-3 px-4 w-36">תחום / צוות</th>
                    <th className="py-3 px-4 w-60">תפקיד מוגדר</th>
                    <th className="py-3 px-4 w-64">שם התלמיד/ה</th>
                    <th className="py-3 px-4">תיאור אחריות ומשימות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-custom/50">
                  {filteredRoles.map((role) => {
                    const currentName = assignments[role.id] || "";
                    const isAssigned = currentName.trim() !== "";
                    const colorConfig = DOMAIN_COLORS[role.domain];

                    return (
                      <tr
                        key={role.id}
                        className={`transition-colors ${
                          isLight
                            ? isAssigned
                              ? "bg-orange-50/20 hover:bg-orange-50/40"
                              : "hover:bg-subtle"
                            : isAssigned
                            ? "bg-subtle hover:bg-subtle-hover"
                            : "hover:bg-subtle"
                        }`}
                      >
                        {/* Number */}
                        <td className="py-2.5 px-3 text-center font-bold font-mono">
                          {role.id}
                        </td>

                        {/* Domain */}
                        <td className="py-2.5 px-4 font-bold">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] border ${
                              colorConfig?.badge || "bg-subtle text-fg-muted"
                            }`}
                          >
                            {role.domain}
                          </span>
                        </td>

                        {/* Role Name */}
                        <td className="py-2.5 px-4 font-bold text-sm">
                          {role.role}
                        </td>

                        {/* Student Name (Interactive input on screen, clean text in print) */}
                        <td className="py-2.5 px-4">
                          <div className="print:hidden">
                            <input
                              type="text"
                              placeholder="הקלדת שם..."
                              value={currentName}
                              onChange={(e) => handleStudentNameChange(role.id, e.target.value)}
                              className={`w-full px-2.5 py-1 rounded text-xs border outline-none bg-card border-line text-fg focus:border-orange-500 ${isAssigned ? "font-bold text-orange-600 dark:text-orange-400" : ""}`}
                            />
                          </div>
                          <div className="hidden print:block font-bold text-sm text-fg">
                            {currentName || "____________________"}
                          </div>
                        </td>

                        {/* Description */}
                        <td
                          className={`py-2.5 px-4 leading-relaxed text-fg-muted`}
                        >
                          {role.description}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty Search state */}
        {filteredRoles.length === 0 && (
          <div className="text-center py-12 border rounded-xl my-4">
            <Search className="w-8 h-8 text-fg-muted mx-auto mb-2" />
            <h3 className="font-bold text-base">לא נמצאו תפקידים תואמים</h3>
            <p className="text-xs text-fg-muted mt-1">
              נסו לשנות את מונח החיפוש או לבחור בלשונית ״הכל״.
            </p>
          </div>
        )}

      </main>

      {/* Footer (hidden in print) */}
      <footer className="w-full text-center py-6 border-t border-line text-xs text-fg-muted mt-12 print:hidden bg-subtle">
        <span>© {new Date().getFullYear()} נקודת ציון — של״ח וידע הארץ | מודול גיחה מחנאית</span>
      </footer>

      {/* ========================================================= */}
      {/* --- CLASSROOM PROJECTOR FULLSCREEN OVERLAY (39 ROLES) --- */}
      {/* ========================================================= */}
      {isProjectorMode && (
        <div
          dir="rtl"
          className={`fixed inset-0 z-50 flex flex-col p-3 sm:p-5 overflow-hidden transition-colors duration-200 bg-canvas text-fg`}
        >
          {/* Top Projector Bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-line shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
                  <span>גיחה מחנאית — לוח תפקידים כיתתי</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-orange-500 text-white font-bold">
                    מצב הקרנה
                  </span>
                </h2>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-fg-muted mt-0.5">
                  <span className="text-amber-500">{currentClassObj.name}</span>
                  <span>•</span>
                  <span>{currentYearObj.name}</span>
                </div>
              </div>
            </div>

            {/* Middle: Progress stats */}
            <div className="hidden md:flex items-center gap-4 bg-subtle px-4 py-2 rounded-xl border border-line">
              <div className="text-xs">
                <span className="text-fg-muted">מאוישים: </span>
                <span className="text-base font-bold text-orange-700 dark:text-orange-400">
                  {assignedCount}
                </span>
                <span className="text-fg-muted"> / {totalRoles}</span>
              </div>
              <div className="w-28 bg-subtle h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all bg-orange-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{progressPercent}%</span>
            </div>

            {/* Actions: Class switcher, Fullscreen, Comfort mode, Close */}
            <div className="flex items-center gap-2">
              {/* Class switcher buttons */}
              <div className="hidden sm:flex items-center gap-1 bg-subtle p-1 rounded-lg border border-line">
                {classes.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                      selectedClassId === cls.id
                        ? "bg-orange-500 text-white shadow-xs"
                        : "text-fg-muted hover:bg-subtle-hover hover:text-fg"
                    }`}
                  >
                    {cls.name}
                  </button>
                ))}
              </div>

              {/* Toggle Comfort Mode */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleComfortMode}
                title="שינוי מצב תצוגה (כהה/בהיר)"
                className={"bg-card border-line"}
              >
                {isLight ? <Moon className="w-4 h-4 text-fg" /> : <Sun className="w-4 h-4 text-amber-700 dark:text-amber-400" />}
              </Button>

              {/* Fullscreen toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                title={isFullscreen ? "יציאה ממסך מלא" : "מסך מלא (F11)"}
                className={"bg-card border-line"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>

              {/* Close Projector Mode */}
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsProjectorMode(false)}
                className="bg-subtle hover:bg-subtle text-fg gap-1.5 text-xs font-bold"
              >
                <X className="w-4 h-4" />
                <span>סגירה (ESC)</span>
              </Button>
            </div>
          </div>

          {/* Projector Grid: Displays all 9 domains and all 39 roles seamlessly */}
          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {GICHA_DOMAINS.filter((d) => d !== "הכל").map((domain) => {
              const domainRoles = GICHA_ROLES.filter((r) => r.domain === domain);
              const colorConfig = DOMAIN_COLORS[domain];
              const assignedInDomain = domainRoles.filter((r) => !!assignments[r.id]?.trim()).length;

              return (
                <div
                  key={domain}
                  className={`rounded-xl border p-2.5 flex flex-col justify-between transition-all bg-card border-line shadow-2xs`}
                >
                  <div>
                    {/* Domain Title Header */}
                    <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-line">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${colorConfig?.badge}`}>
                          {domain}
                        </span>
                        <span className="text-[11px] font-bold text-fg-muted">
                          ({domainRoles.length})
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-fg-muted">
                        {assignedInDomain}/{domainRoles.length} מאוישים
                      </span>
                    </div>

                    {/* Roles list inside domain */}
                    <div className="space-y-1.5">
                      {domainRoles.map((role) => {
                        const assignedName = assignments[role.id] || "";
                        const isFilled = assignedName.trim() !== "";

                        return (
                          <div
                            key={role.id}
                            className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center justify-between gap-2 ${
                              isLight
                                ? isFilled
                                  ? "bg-amber-50/70 border-amber-200"
                                  : "bg-subtle border-line"
                                : isFilled
                                ? "bg-subtle-hover border-orange-500/40"
                                : "bg-subtle border-line"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              <span
                                className={`w-5 h-5 shrink-0 rounded flex items-center justify-center text-[10px] font-bold bg-subtle-hover text-fg`}
                              >
                                {role.id}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div
                                  className={`font-bold text-[11px] truncate leading-tight text-fg`}
                                  title={role.role}
                                >
                                  {role.role}
                                </div>
                                <div className="text-[9.5px] text-fg-muted truncate leading-none mt-0.5">
                                  {role.description}
                                </div>
                              </div>
                            </div>

                            {/* Assigned Student Name badge or quick input */}
                            <div className="shrink-0 w-28 text-left">
                              <input
                                type="text"
                                placeholder="שם תלמיד/ה..."
                                value={assignedName}
                                onChange={(e) => handleStudentNameChange(role.id, e.target.value)}
                                className={`w-full px-2 py-0.5 rounded text-[11px] border outline-none text-right font-bold transition-all ${
                                  isLight
                                    ? isFilled
                                      ? "bg-card border-amber-300 text-amber-900"
                                      : "bg-card border-line text-fg placeholder:text-fg-muted"
                                    : isFilled
                                    ? "bg-subtle border-orange-500 text-orange-700 dark:text-orange-300"
                                    : "bg-subtle border-line text-fg placeholder:text-fg-muted"
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- Dialog: Add New Year --- */}
      {showAddYearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div
            className={`w-full max-w-md p-6 rounded-xl border shadow-sm bg-card border-line`}
          >
            <h3 className="text-lg font-bold mb-2">הוספת שנת לימודים חדשה</h3>
            <p className="text-xs text-fg-muted mb-4">
              הוסיפו שנת לימודים עתידית כדי להמשיך להשתמש במודול בשנים הבאות.
            </p>
            <input
              type="text"
              placeholder="למשל: תשצ״א (2030-2031)"
              value={newYearName}
              onChange={(e) => setNewYearName(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm border outline-none mb-4 bg-subtle border-line`}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAddYearModal(false)}>
                ביטול
              </Button>
              <Button size="sm" onClick={handleAddYear} className="bg-orange-500 hover:bg-orange-600 text-white">
                הוספה
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- Dialog: Bulk Paste Names --- */}
      {showBulkPasteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div
            className={`w-full max-w-lg p-6 rounded-xl border shadow-sm bg-card border-line`}
          >
            <h3 className="text-lg font-bold mb-2">הדבקת שמות מהירה מרשימה</h3>
            <p className="text-xs text-fg-muted mb-3 leading-relaxed">
              הדביקו כאן רשימת תלמידים (שם אחד בכל שורה). השמות ישובצו לפי סדר התפקידים (1 עד 39)
              בכיתה הנוכחית ({currentClassObj.name}).
            </p>
            <textarea
              rows={8}
              placeholder="שם תלמיד 1&#10;שם תלמיד 2&#10;שם תלמיד 3..."
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              className={`w-full p-3 rounded-lg text-xs font-mono border outline-none mb-4 bg-subtle border-line`}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowBulkPasteModal(false)}>
                ביטול
              </Button>
              <Button size="sm" onClick={handleBulkApply} className="bg-orange-500 hover:bg-orange-600 text-white">
                שבץ ברשימה
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- Dialog: Confirm Clear --- */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div
            className={`w-full max-w-sm p-6 rounded-xl border shadow-sm text-center bg-card border-line`}
          >
            <Trash2 className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold mb-2">איפוס שמות התלמידים?</h3>
            <p className="text-xs text-fg-muted mb-6 leading-relaxed">
              פעולה זו תמחק את כל שמות התלמידים המשובצים ב-{currentClassObj.name} ({currentYearObj.name}).
              לא ניתן לבטל פעולה זו.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(false)}>
                ביטול
              </Button>
              <Button size="sm" onClick={handleClearAssignments} className="bg-rose-600 hover:bg-rose-700 text-white">
                איפוס נתונים
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
