"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Sun, Moon, BookOpen, FileText, Flame, LayoutGrid, CheckCircle, LucideIcon } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { dbFirestore } from "@/lib/firebase";
import { collection, query, getDocs, updateDoc, doc, orderBy } from "firebase/firestore";
import { UnseenDashboardView, WritingDashboardView, UnseenAssignment, WritingAssignment } from "./components/UnseenWritingViews";
import MissionDashboardView from "./components/MissionDashboardView";
import VisibilityManager from "./components/VisibilityManager";
import ChatMastersView, { ChatAssignment } from "./components/ChatMastersView";
import AdminSidebar, { AdminTab, ADMIN_TABS, NAV_ITEMS } from "./components/AdminSidebar";
import { isTeacherUser } from "@/lib/auth/teacher";

const FUTURE_PROJECTS: { id: string; title: string; desc: string; badge: string; icon: LucideIcon }[] = [
  {
    id: "vocab",
    title: "מעקב אימון אוצר מילים",
    desc: "רשימות המילים האישיות של התלמידים, התקדמות בתרגול הכרטיסיות ואחוזי הצלחה בבחנים.",
    badge: "בפיתוח",
    icon: BookOpen,
  },
  {
    id: "auction",
    title: "מכירה פומבית של משפטים",
    desc: "דוחות ביצוע כיתתיים, ההון הקבוצתי שנצבר וציון לשיפור הדקדוק הקבוצתי.",
    badge: "בתכנון",
    icon: Flame,
  },
  {
    id: "writing",
    title: "משימות כתיבה חופשית",
    desc: "ניהול חיבורים ומכתבים, עם דריסת ציון ה-AI ומשוב מורה מורחב.",
    badge: "בתכנון",
    icon: FileText,
  },
  {
    id: "snakes",
    title: "לוח מנצחים כיתתי",
    desc: "מעקב אחר משחקי סולמות ונחשים פעילים ולוח תוצאות בזמן אמת.",
    badge: "בתכנון",
    icon: LayoutGrid,
  },
];

const DEMO_UNSEEN: UnseenAssignment = {
  id: "demo-unseen-1",
  studentId: "student-101",
  studentName: "רועי בלש",
  studentClass: "כיתה ח'2",
  studentEmail: "roy.detective@school.edu",
  unseenTitle: "Max the Small Dog",
  difficulty: "Easy",
  score: 85,
  correctOnFirstTry: 7,
  totalQuestions: 8,
  submittedAt: { seconds: Math.floor(Date.now() / 1000) },
  status: "submitted",
  scoreTeacher: null,
  feedbackTeacher: null,
  answers: [
    {
      questionId: 1,
      questionNumber: 1,
      type: "mcq",
      paragraph: 1,
      prompt: "What does Max look like?",
      studentAnswer: "He is white with long ears and a short tail",
      correctAnswer: "He is white with long ears and a short tail",
      firstTrySuccess: true,
      attempts: 1,
      explanation: "בפסקה 1 רשום בבירור שהכלב לבן, בעל אוזניים ארוכות וזנב קצר."
    },
    {
      questionId: 2,
      questionNumber: 2,
      type: "mcq",
      paragraph: 1,
      prompt: "How old is Max?",
      studentAnswer: "Three years old",
      correctAnswer: "Three years old",
      firstTrySuccess: true,
      attempts: 1,
      explanation: "הטקסט מציין 'Max is three years old'."
    },
    {
      questionId: 3,
      questionNumber: 3,
      type: "mcq",
      paragraph: 1,
      prompt: "What does Max see near the big house?",
      studentAnswer: "A yellow cat",
      correctAnswer: "A yellow cat",
      firstTrySuccess: true,
      attempts: 1,
      explanation: "נכון! בפסקה 1 רשום שמקס רואה חתול צהוב (yellow cat)."
    },
    {
      questionId: 4,
      questionNumber: 4,
      type: "copy",
      paragraph: 1,
      prompt: "Copy the sentence that proves Tom gives food to Max.",
      studentAnswer: "Tom gives Max a small cookie.",
      correctAnswer: "Tom gives Max a small cookie.",
      firstTrySuccess: true,
      attempts: 1,
      explanation: "משפט מלא ומדויק המוכיח שמתן העוגיה הוא האכלה."
    },
    {
      questionId: 5,
      questionNumber: 5,
      type: "open",
      paragraph: 2,
      prompt: "Why does Max run to Tom's room every morning?",
      studentAnswer: "Because he wants to eat his food and wakes Tom up.",
      correctAnswer: "Because he wants to eat his food.",
      firstTrySuccess: true,
      attempts: 1,
      explanation: "תשובה מצוינת! התלמיד ציין את הסיבה המדויקת מהפסקה.",
      matchedKeywords: ["eat", "food", "wants"],
      missingKeywords: []
    },
    {
      questionId: 6,
      questionNumber: 6,
      type: "mcq",
      paragraph: 2,
      prompt: "What does Max drink?",
      studentAnswer: "Cold water",
      correctAnswer: "Cold water",
      firstTrySuccess: false,
      attempts: 2,
      explanation: "מקס שותה מים קרים מקערה כחולה (He drinks cold water from a blue bowl)."
    },
    {
      questionId: 7,
      questionNumber: 7,
      type: "open",
      paragraph: 3,
      prompt: "What does Max do with the red ball?",
      studentAnswer: "He runs after the ball and brings it back to Tom.",
      correctAnswer: "He runs after the red ball and brings the ball back to Tom.",
      firstTrySuccess: true,
      attempts: 1,
      explanation: "תשובה מדויקת להפליא.",
      matchedKeywords: ["runs", "ball", "brings"],
      missingKeywords: []
    },
    {
      questionId: 8,
      questionNumber: 8,
      type: "open",
      paragraph: 3,
      prompt: "What is this story mostly about?",
      studentAnswer: "Max the small dog and what he does every day with Tom.",
      correctAnswer: "Tom's dog Max and his daily routine.",
      firstTrySuccess: true,
      attempts: 1,
      explanation: "הבנה גלובלית מלאה של הסיפור.",
      matchedKeywords: ["Max", "dog", "Tom"],
      missingKeywords: []
    }
  ],
  passage: {
    title: "Max the Small Dog",
    difficulty: "Easy",
    paragraphs: [
      "Tom has a small dog. The dog is white. His name is Max. Max has long ears and a short tail. Tom likes Max very much. Max is three years old. Every day, Tom walks with Max. They walk near the big house. Max sees a yellow cat. He does not run after the cat. Max is a good dog. He stands next to Tom. Tom gives Max a small cookie. Max is happy.",
      "Max sleeps in a warm bed near the door. The bed is soft and brown. Every morning, Max runs to Tom's room. Max wakes Tom up because he wants to eat his food. Tom gets up from his bed. He walks to the kitchen. Tom puts dog food in a red bowl. Max eats his food fast. He drinks cold water from a blue bowl. Then, Max waits by the door.",
      "In the afternoon, Tom and Max play in the big garden. Max runs after a red ball. He brings the ball back to Tom. Tom smiles and pats Max's head. Sometimes, their friend Sarah comes to play. Sarah has a funny hat. Max sniffs the hat and wags his tail. At night, Max lies down in his bed. He closes his eyes and sleeps. Max is a lovely pet."
    ]
  }
};

export default function GeneralTeacherAdmin() {
  const { user, signInWithGoogle } = useAuth();
  
  // Theme state
  const [comfortMode, setComfortMode] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  
  // Tab state
  const [currentTab, setCurrentTab] = useState<AdminTab>("visibility");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [devPreview, setDevPreview] = useState(false);
  
  // Chat Masters Submissions data states
  const [submissions, setSubmissions] = useState<ChatAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<ChatAssignment | null>(null);

  // Unseen and Writing Practice states
  const [unseenSubmissions, setUnseenSubmissions] = useState<UnseenAssignment[]>([]);
  const [loadingUnseen, setLoadingUnseen] = useState(true);
  const [selectedUnseen, setSelectedUnseen] = useState<UnseenAssignment | null>(null);

  const [writingSubmissions, setWritingSubmissions] = useState<WritingAssignment[]>([]);
  const [loadingWriting, setLoadingWriting] = useState(true);
  const [selectedWriting, setSelectedWriting] = useState<WritingAssignment | null>(null);
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeListTab, setActiveListTab] = useState<"all" | "pending" | "graded">("all");
  
  // Grading form states
  const [gradeInput, setGradeInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [isGrading, setIsGrading] = useState(false);
  const [gradeSuccess, setGradeSuccess] = useState(false);

  // Load theme preference
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("teaching-site-comfort-mode");
    if (savedTheme === "light" || savedTheme === "dark") {
      setComfortMode(savedTheme);
    }
    const tabParam = new URLSearchParams(window.location.search).get("tab");
    if (tabParam && (ADMIN_TABS as string[]).includes(tabParam)) {
      setCurrentTab(tabParam as AdminTab);
    }
  }, []);

  // Fetch submissions
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(dbFirestore, "chat_assignments"),
        orderBy("submittedAt", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatAssignment[];
      setSubmissions(data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnseenSubmissions = async () => {
    setLoadingUnseen(true);
    try {
      const q = query(
        collection(dbFirestore, "unseen_assignments"),
        orderBy("submittedAt", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UnseenAssignment[];
      setUnseenSubmissions(data);
    } catch (err) {
      console.error("Error fetching unseen submissions:", err);
    } finally {
      setLoadingUnseen(false);
    }
  };

  const fetchWritingSubmissions = async () => {
    setLoadingWriting(true);
    try {
      const q = query(
        collection(dbFirestore, "writing_assignments"),
        orderBy("submittedAt", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WritingAssignment[];
      setWritingSubmissions(data);
    } catch (err) {
      console.error("Error fetching writing submissions:", err);
    } finally {
      setLoadingWriting(false);
    }
  };

  useEffect(() => {
    // Only fetch if authenticated as admin/teacher
    if (user && (user.email === "niroari@gmail.com" || user.email === "nirozari@gmail.com")) {
      fetchSubmissions();
      fetchUnseenSubmissions();
      fetchWritingSubmissions();
    }
  }, [user]);

  const handleSelectSub = (sub: ChatAssignment) => {
    setSelectedSub(sub);
    setSelectedUnseen(null);
    setSelectedWriting(null);
    setGradeInput(sub.score !== null ? String(sub.score) : "");
    setFeedbackInput(sub.feedback || "");
    setGradeSuccess(false);
  };

  const handleSelectUnseen = (sub: UnseenAssignment) => {
    setSelectedUnseen(sub);
    setSelectedSub(null);
    setSelectedWriting(null);
    setGradeInput(sub.scoreTeacher !== null ? String(sub.scoreTeacher) : "");
    setFeedbackInput(sub.feedbackTeacher || "");
    setGradeSuccess(false);
  };

  const handleSelectWriting = (sub: WritingAssignment) => {
    setSelectedWriting(sub);
    setSelectedSub(null);
    setSelectedUnseen(null);
    setGradeInput(sub.scoreTeacher !== null ? String(sub.scoreTeacher) : "");
    setFeedbackInput(sub.feedbackTeacher || "");
    setGradeSuccess(false);
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    const scoreVal = parseInt(gradeInput);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
      alert("אנא הזינו ציון תקין בין 0 ל-100");
      return;
    }

    setIsGrading(true);
    try {
      const docRef = doc(dbFirestore, "chat_assignments", selectedSub.id);
      await updateDoc(docRef, {
        status: "graded",
        score: scoreVal,
        feedback: feedbackInput.trim()
      });

      // Update local state list
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === selectedSub.id 
            ? { ...sub, status: "graded", score: scoreVal, feedback: feedbackInput.trim() } 
            : sub
        )
      );

      // Update selected sub view
      setSelectedSub(prev => prev ? { ...prev, status: "graded", score: scoreVal, feedback: feedbackInput.trim() } : null);
      
      setGradeSuccess(true);
      setTimeout(() => setGradeSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving grade:", err);
      alert("שגיאה בשמירת הציון. נסו שוב.");
    } finally {
      setIsGrading(false);
    }
  };

  const handleSaveUnseenGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnseen) return;
    const scoreVal = parseInt(gradeInput);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
      alert("אנא הזינו ציון תקין בין 0 ל-100");
      return;
    }

    setIsGrading(true);
    try {
      const docRef = doc(dbFirestore, "unseen_assignments", selectedUnseen.id);
      await updateDoc(docRef, {
        status: "graded",
        scoreTeacher: scoreVal,
        feedbackTeacher: feedbackInput.trim()
      });

      setUnseenSubmissions(prev =>
        prev.map(sub =>
          sub.id === selectedUnseen.id
            ? { ...sub, status: "graded" as const, scoreTeacher: scoreVal, feedbackTeacher: feedbackInput.trim() }
            : sub
        )
      );

      setSelectedUnseen(prev =>
        prev ? { ...prev, status: "graded" as const, scoreTeacher: scoreVal, feedbackTeacher: feedbackInput.trim() } : null
      );

      setGradeSuccess(true);
      setTimeout(() => setGradeSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving unseen grade:", err);
      alert("שגיאה בשמירת הציון. נסו שוב.");
    } finally {
      setIsGrading(false);
    }
  };

  const handleSaveWritingGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWriting) return;
    const scoreVal = parseInt(gradeInput);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
      alert("אנא הזינו ציון תקין בין 0 ל-100");
      return;
    }

    setIsGrading(true);
    try {
      const docRef = doc(dbFirestore, "writing_assignments", selectedWriting.id);
      await updateDoc(docRef, {
        status: "graded",
        scoreTeacher: scoreVal,
        feedbackTeacher: feedbackInput.trim()
      });

      setWritingSubmissions(prev =>
        prev.map(sub =>
          sub.id === selectedWriting.id
            ? { ...sub, status: "graded" as const, scoreTeacher: scoreVal, feedbackTeacher: feedbackInput.trim() }
            : sub
        )
      );

      setSelectedWriting(prev =>
        prev ? { ...prev, status: "graded" as const, scoreTeacher: scoreVal, feedbackTeacher: feedbackInput.trim() } : null
      );

      setGradeSuccess(true);
      setTimeout(() => setGradeSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving writing grade:", err);
      alert("שגיאה בשמירת הציון. נסו שוב.");
    } finally {
      setIsGrading(false);
    }
  };

  const toggleTheme = () => {
    const nextTheme = comfortMode === "dark" ? "light" : "dark";
    setComfortMode(nextTheme);
    localStorage.setItem("teaching-site-comfort-mode", nextTheme);
  };

  const selectTab = (tab: AdminTab) => {
    setCurrentTab(tab);
    setSearchQuery("");
    setActiveListTab("all");
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState(null, "", url.toString());
  };

  if (!mounted) return null;

  const isLight = comfortMode === "light";
  const isTeacher = isTeacherUser(user) || devPreview;

  // Flat, neutral theme tokens shared by every admin view
  const bgTheme = isLight ? "bg-zinc-50" : "bg-[#0a0b10]";
  const textTitle = isLight ? "text-zinc-900" : "text-zinc-100";
  const textMuted = isLight ? "text-zinc-500" : "text-zinc-400";
  const cardStyle = isLight ? "bg-white text-zinc-800" : "bg-[#0e1016] text-zinc-200";
  const borderStyle = isLight ? "border-zinc-200" : "border-white/[0.07]";
  const inputStyle = isLight
    ? "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500"
    : "bg-white/[0.02] border-white/[0.1] text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500";
  const primaryBtn = isLight
    ? "bg-zinc-900 hover:bg-zinc-800 text-white"
    : "bg-zinc-100 hover:bg-white text-zinc-900";
  const secondaryBtn = isLight
    ? "border-zinc-200 text-zinc-700 hover:bg-zinc-100"
    : "border-white/[0.1] text-zinc-300 hover:bg-white/[0.04]";

  const pending = <T extends { status: string }>(list: T[]) => list.filter((s) => s.status === "submitted").length;
  const counts: Partial<Record<AdminTab, number>> = {
    "chat-masters": pending(submissions),
    "unseen-practice": pending(unseenSubmissions),
    "writing-practice": pending(writingSubmissions),
  };
  const activeItem = NAV_ITEMS.find((i) => i.id === currentTab) ?? NAV_ITEMS[0];

  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-md border cursor-pointer transition-colors ${secondaryBtn}`}
      title="Comfort Reading Mode (מצב בהיר/כהה)"
      aria-label="החלפת מצב תצוגה"
    >
      {isLight ? <Moon className="w-4 h-4" strokeWidth={1.75} /> : <Sun className="w-4 h-4" strokeWidth={1.75} />}
    </button>
  );

  // ---------- Signed out / not a teacher: centered card, no sidebar ----------
  if ((!user && !devPreview) || !isTeacher) {
    const signedOut = !user && !devPreview;
    return (
      <div className={`min-h-screen ${bgTheme} transition-colors flex flex-col`}>
        <div className="flex items-center justify-between px-6 h-14">
          <Link href="/" className={`text-sm ${textMuted} hover:underline`}>חזרה לאתר</Link>
          {themeButton}
        </div>
        <div className="flex-1 flex items-center justify-center px-4 pb-16">
          <div className={`w-full max-w-sm p-6 rounded-lg border ${borderStyle} ${cardStyle} space-y-5 text-right`}>
            <div className="space-y-1.5">
              <h1 className={`text-lg font-semibold ${textTitle}`}>
                {signedOut ? "התחברות ללוח המורה" : "אין גישה"}
              </h1>
              <p className={`text-sm leading-relaxed ${textMuted}`}>
                {signedOut
                  ? "כדי לצפות בעבודות התלמידים ולהעריך אותן, יש להתחבר עם חשבון המורה."
                  : "החשבון הזה אינו מורשה כחשבון מורה. יש להתחבר עם חשבון המורה המורשה."}
              </p>
            </div>
            {signedOut ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await signInWithGoogle();
                    } catch (err: any) {
                      console.error(err);
                      if (err.code === "auth/unauthorized-domain") {
                        alert("שגיאה: הדומיין אינו מורשה ב-Firebase. אנא הוסיפו את דומיין האתר הנוכחי לרשימת הדומיינים המורשים בקונסולת Firebase (תחת Authentication -> Settings).");
                      } else if (err.code !== "auth/popup-closed-by-user") {
                        alert("ההתחברות נכשלה. נסו שוב.");
                      }
                    }
                  }}
                  className={`w-full py-2.5 rounded-md text-sm font-medium cursor-pointer transition-colors ${primaryBtn}`}
                >
                  התחברות עם Google
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDevPreview(true);
                    selectTab("unseen-practice");
                    setLoadingUnseen(false);
                    setLoadingWriting(false);
                    setLoading(false);
                    if (unseenSubmissions.length === 0) {
                      setUnseenSubmissions([DEMO_UNSEEN]);
                      setSelectedUnseen(DEMO_UNSEEN);
                    }
                  }}
                  className={`w-full py-2.5 rounded-md border text-sm cursor-pointer transition-colors ${secondaryBtn}`}
                >
                  תצוגה לדוגמה (מצב בדיקה)
                </button>
              </div>
            ) : (
              <Link href="/" className={`block w-full py-2.5 rounded-md text-sm font-medium text-center ${primaryBtn}`}>
                חזרה לאתר
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const viewProps = { inputStyle, cardStyle, borderStyle, textTitle, textMuted, isLight };
  const listProps = {
    gradeInput, setGradeInput, feedbackInput, setFeedbackInput, isGrading, gradeSuccess,
    searchQuery, setSearchQuery, activeListTab, setActiveListTab,
  };

  // ---------- Teacher console ----------
  return (
    <div className={`min-h-screen ${bgTheme} transition-colors flex`}>
      <AdminSidebar
        current={currentTab}
        onSelect={selectTab}
        counts={counts}
        isLight={isLight}
        onToggleTheme={toggleTheme}
        userEmail={user?.email ?? (devPreview ? "מצב תצוגה לדוגמה" : null)}
        mobileOpen={mobileNavOpen}
        setMobileOpen={setMobileNavOpen}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className={`lg:hidden sticky top-0 z-30 h-14 px-4 flex items-center justify-between border-b ${borderStyle} ${cardStyle}`}>
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className={`p-2 rounded-md border cursor-pointer ${secondaryBtn}`}
            aria-label="פתיחת תפריט"
          >
            <Menu className="w-4 h-4" />
          </button>
          <span className={`text-sm font-semibold ${textTitle}`}>{activeItem.label}</span>
          {themeButton}
        </div>

        <main className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 flex-1 flex flex-col">
          {/* Page header */}
          <header className={`mb-6 pb-5 border-b ${borderStyle} text-right`}>
            <h1 className={`text-xl font-semibold tracking-tight ${textTitle}`}>{activeItem.label}</h1>
            <p className={`text-sm mt-1 ${textMuted}`}>{activeItem.description}</p>
          </header>

          {currentTab === "visibility" ? (
            <VisibilityManager {...viewProps} />
          ) : currentTab === "chat-masters" ? (
            <ChatMastersView
              {...viewProps}
              {...listProps}
              submissions={submissions}
              loading={loading}
              selectedSub={selectedSub}
              handleSelectSub={handleSelectSub}
              handleSaveGrade={handleSaveGrade}
            />
          ) : currentTab === "unseen-practice" ? (
            <UnseenDashboardView
              {...viewProps}
              {...listProps}
              unseenSubmissions={unseenSubmissions}
              loadingUnseen={loadingUnseen}
              selectedUnseen={selectedUnseen}
              handleSelectUnseen={handleSelectUnseen}
              handleSaveUnseenGrade={handleSaveUnseenGrade}
            />
          ) : currentTab === "writing-practice" ? (
            <WritingDashboardView
              {...viewProps}
              {...listProps}
              writingSubmissions={writingSubmissions}
              loadingWriting={loadingWriting}
              selectedWriting={selectedWriting}
              handleSelectWriting={handleSelectWriting}
              handleSaveWritingGrade={handleSaveWritingGrade}
            />
          ) : currentTab === "mission-new-home" ? (
            <MissionDashboardView {...viewProps} isTeacher={isTeacher} demo={devPreview} />
          ) : currentTab === "future-projects" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              {FUTURE_PROJECTS.map((proj) => {
                const Icon = proj.icon;
                return (
                  <div key={proj.id} className={`p-5 rounded-lg border ${borderStyle} ${cardStyle} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${textMuted}`} strokeWidth={1.75} />
                        <h3 className={`text-sm font-semibold ${textTitle}`}>{proj.title}</h3>
                      </div>
                      <span className={`text-[11px] px-2 py-0.5 rounded border ${borderStyle} ${textMuted}`}>{proj.badge}</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${textMuted}`}>{proj.desc}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`max-w-xl rounded-lg border ${borderStyle} ${cardStyle} divide-y ${isLight ? "divide-zinc-200" : "divide-white/[0.07]"} text-right`}>
              <div className="p-5 flex items-center justify-between gap-4">
                <span className={`text-sm ${textMuted}`}>חשבון מחובר</span>
                <span className={`text-sm ${textTitle}`} dir="ltr">{user?.email || "מצב תצוגה לדוגמה"}</span>
              </div>
              <div className="p-5 flex items-center justify-between gap-4">
                <span className={`text-sm ${textMuted}`}>הרשאות</span>
                <span className="text-sm text-emerald-500 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> מנהל/ת מערכת
                </span>
              </div>
              <div className="p-5 space-y-1">
                <span className={`block text-sm ${textMuted}`}>סינון לפי כיתה</span>
                <p className={`text-sm leading-relaxed ${textTitle}`}>
                  התלמידים מקלידים את הכיתה ידנית (ז׳1, ז׳3 וכו׳). אפשר לסנן לפי כיתה בשדה החיפוש של כל רשימת הגשות.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
