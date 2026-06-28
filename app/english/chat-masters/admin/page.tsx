"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Search, 
  Moon, 
  Sun, 
  RefreshCw, 
  Award, 
  Clock, 
  BookOpen, 
  Sparkles, 
  CheckCircle,
  FileText,
  Check
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { dbFirestore } from "@/lib/firebase";
import { collection, query, getDocs, updateDoc, doc, orderBy } from "firebase/firestore";

interface ChatAssignment {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  character: string;
  messages: Array<{ sender: "user" | "bot"; text: string; timestamp: string }>;
  exitTicketLearned: string;
  exitTicketPenPal: string;
  submittedAt: any;
  status: "submitted" | "graded";
  score: number | null;
  feedback: string | null;
  studentClass?: string;
}

const CHARACTERS_MAP: Record<string, { name: string; avatar: string; themeColor: string }> = {
  astronaut: { name: "Buddy", avatar: "👨‍🚀", themeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  superhero: { name: "Hero", avatar: "🦸‍♂️", themeColor: "text-red-400 bg-red-500/10 border-red-500/20" },
  builder: { name: "Alex", avatar: "👷", themeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  cat: { name: "Luna", avatar: "🐱", themeColor: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
  sam: { name: "Sam", avatar: "🧑", themeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20" }
};

export default function ChatMastersAdmin() {
  const { user, signInWithGoogle } = useAuth();
  
  // Theme state
  const [comfortMode, setComfortMode] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  
  // Data states
  const [submissions, setSubmissions] = useState<ChatAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<ChatAssignment | null>(null);
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "graded">("all");
  
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

  useEffect(() => {
    // Only fetch if authenticated as admin/teacher
    if (user && (user.email === "niroari@gmail.com" || user.email === "nirozari@gmail.com")) {
      fetchSubmissions();
    }
  }, [user]);

  const handleSelectSub = (sub: ChatAssignment) => {
    setSelectedSub(sub);
    setGradeInput(sub.score !== null ? String(sub.score) : "");
    setFeedbackInput(sub.feedback || "");
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

  const toggleTheme = () => {
    const nextTheme = comfortMode === "dark" ? "light" : "dark";
    setComfortMode(nextTheme);
    localStorage.setItem("teaching-site-comfort-mode", nextTheme);
  };

  if (!mounted) return null;

  const isLight = comfortMode === "light";
  const isTeacher = user && (user.email === "niroari@gmail.com" || user.email === "nirozari@gmail.com");

  // Dynamic Theme Styling
  const bgTheme = isLight ? "bg-[#f1f5f9]" : "bg-[#080c18]";
  const textTitle = isLight ? "text-zinc-900" : "text-white";
  const textBody = isLight ? "text-zinc-700" : "text-[#e8edf8]";
  const textMuted = isLight ? "text-zinc-500" : "text-slate-400";
  const cardStyle = isLight ? "light-card text-zinc-800" : "glass-card text-[#e8edf8]";
  const borderStyle = isLight ? "border-zinc-200" : "border-border-custom";
  const inputStyle = isLight 
    ? "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-purple-500" 
    : "bg-[#0d1222]/80 border-border-custom text-white placeholder:text-zinc-700 focus:border-purple-500/50";

  // Filter logic
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.studentEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "pending") return matchesSearch && sub.status === "submitted";
    if (activeTab === "graded") return matchesSearch && sub.status === "graded";
    return matchesSearch;
  });

  // Stats calculations
  const totalCount = submissions.length;
  const gradedCount = submissions.filter(s => s.status === "graded").length;
  const pendingCount = submissions.filter(s => s.status === "submitted").length;
  const avgScore = gradedCount > 0 
    ? Math.round(submissions.filter(s => s.status === "graded" && s.score !== null).reduce((sum, s) => sum + (s.score || 0), 0) / gradedCount)
    : 0;

  return (
    <div className={`min-h-screen ${bgTheme} transition-colors duration-300 flex flex-col font-sans relative overflow-hidden`}>
      {/* Background Glows */}
      {!isLight && (
        <>
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[150px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-950/10 blur-[120px] pointer-events-none" />
        </>
      )}

      {/* Main Header */}
      <header className={`w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between border-b ${borderStyle} relative z-10`}>
        <Link
          href="/english"
          className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border ${borderStyle} ${isLight ? "bg-white hover:bg-zinc-100" : "bg-surface hover:bg-[#111728]"} transition-colors duration-200`}
        >
          <ArrowRight className="w-4 h-4" />
          <span>חזרה לאנגלית</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <h1 className={`text-sm md:text-base font-black ${textTitle} flex items-center gap-2`}>
            <span>לוח מורה: Chat Masters</span>
            <Sparkles className="w-4.5 h-4.5 text-purple-400" />
          </h1>
        </div>

        {/* Toggle Theme Button */}
        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl border ${borderStyle} ${isLight ? "bg-white hover:bg-zinc-100" : "bg-[#0f1526]/80 hover:bg-[#161d35]"} transition-colors duration-200`}
          title="Comfort Reading Mode (שינוי ניגודיות/צבע)"
        >
          {isLight ? <Moon className="w-4 h-4 text-purple-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>
      </header>

      {/* Content Body */}
      <main className="w-full max-w-6xl mx-auto px-6 py-8 flex-1 flex flex-col z-10">
        
        {/* Auth checks */}
        {!user ? (
          <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto py-16 text-center">
            <div className={`p-8 rounded-2xl ${cardStyle} border ${borderStyle} space-y-6 w-full shadow-2xl`}>
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-full inline-flex text-purple-400 text-3xl">
                🔑
              </div>
              <h2 className={`text-xl font-bold ${textTitle}`}>נדרשת התחברות ללוח בקרה</h2>
              <p className={`text-xs ${textMuted} leading-relaxed`}>
                כדי לצפות בעבודות התלמידים ולהעריך אותן, עליך להתחבר עם חשבון המורה המורשה שלך.
              </p>
              <button
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
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl cursor-pointer shadow-lg shadow-purple-500/25 transition-all text-sm"
              >
                התחברות עם Google
              </button>
            </div>
          </div>
        ) : !isTeacher ? (
          <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto py-16 text-center">
            <div className={`p-8 rounded-2xl ${cardStyle} border ${borderStyle} space-y-6 w-full shadow-2xl`}>
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-full inline-flex text-red-400 text-3xl">
                🚫
              </div>
              <h2 className={`text-xl font-bold ${textTitle}`}>גישה נדחתה (Access Denied)</h2>
              <p className={`text-xs ${textMuted} leading-relaxed`}>
                אימייל זה אינו מורשה כחשבון מורה באתר. יש להתחבר עם חשבון המורה המתאים (<b>niroari@gmail.com</b>).
              </p>
              <Link
                href="/english"
                className="w-full block py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl text-center transition-all border border-zinc-700"
              >
                חזרה לדף הבית
              </Link>
            </div>
          </div>
        ) : (
          /* Authorized Teacher view */
          <div className="space-y-8 flex-1 flex flex-col">
            
            {/* Stats Panel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl ${cardStyle} border ${borderStyle} flex items-center justify-between text-right`}>
                <div>
                  <span className={`text-[10px] ${textMuted} block font-bold`}>סה"כ הגשות</span>
                  <span className={`text-2xl font-black ${textTitle} block mt-1`}>{totalCount}</span>
                </div>
                <span className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-lg">
                  <FileText className="w-5 h-5" />
                </span>
              </div>

              <div className={`p-4 rounded-xl ${cardStyle} border ${borderStyle} flex items-center justify-between text-right`}>
                <div>
                  <span className={`text-[10px] ${textMuted} block font-bold`}>ממתינות לבדיקה</span>
                  <span className={`text-2xl font-black ${textTitle} block mt-1`}>{pendingCount}</span>
                </div>
                <span className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-lg">
                  <Clock className="w-5 h-5" />
                </span>
              </div>

              <div className={`p-4 rounded-xl ${cardStyle} border ${borderStyle} flex items-center justify-between text-right`}>
                <div>
                  <span className={`text-[10px] ${textMuted} block font-bold`}>נבדקו</span>
                  <span className={`text-2xl font-black ${textTitle} block mt-1`}>{gradedCount}</span>
                </div>
                <span className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-lg">
                  <CheckCircle className="w-5 h-5" />
                </span>
              </div>

              <div className={`p-4 rounded-xl ${cardStyle} border ${borderStyle} flex items-center justify-between text-right`}>
                <div>
                  <span className={`text-[10px] ${textMuted} block font-bold`}>ממוצע ציונים</span>
                  <span className={`text-2xl font-black ${textTitle} block mt-1`}>{avgScore}</span>
                </div>
                <span className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-lg">
                  <Award className="w-5 h-5" />
                </span>
              </div>
            </div>

            {/* Split Screen Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1 min-h-[500px]">
              
              {/* LEFT COLUMN: Submissions List (Columns: 5) */}
              <div className="lg:col-span-5 flex flex-col space-y-4">
                
                {/* Search & Filter Card */}
                <div className={`p-4 rounded-xl ${cardStyle} border ${borderStyle} space-y-3`}>
                  
                  {/* Search bar */}
                  <div className="relative">
                    <span className="absolute inset-y-0 right-3.5 flex items-center text-text-muted">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="חיפוש לפי שם תלמיד או אימייל..."
                      className={`w-full pr-10 pl-4 py-2 text-xs rounded-xl border outline-none text-right transition-all font-bold ${inputStyle}`}
                    />
                  </div>

                  {/* Tabs */}
                  <div className="grid grid-cols-3 gap-1 bg-zinc-800/40 p-1 rounded-lg text-xs font-bold border border-zinc-700/30">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`py-1.5 rounded-md cursor-pointer text-center transition-colors ${
                        activeTab === "all"
                          ? "bg-purple-600 text-white"
                          : `${textMuted} hover:text-white`
                      }`}
                    >
                      הכל ({totalCount})
                    </button>
                    <button
                      onClick={() => setActiveTab("pending")}
                      className={`py-1.5 rounded-md cursor-pointer text-center transition-colors ${
                        activeTab === "pending"
                          ? "bg-purple-600 text-white"
                          : `${textMuted} hover:text-white`
                      }`}
                    >
                      ממתין ({pendingCount})
                    </button>
                    <button
                      onClick={() => setActiveTab("graded")}
                      className={`py-1.5 rounded-md cursor-pointer text-center transition-colors ${
                        activeTab === "graded"
                          ? "bg-purple-600 text-white"
                          : `${textMuted} hover:text-white`
                      }`}
                    >
                      נבדק ({gradedCount})
                    </button>
                  </div>

                </div>

                {/* Submissions List Card */}
                <div className={`p-4 rounded-xl ${cardStyle} border ${borderStyle} flex-1 overflow-y-auto max-h-[500px] space-y-2.5`}>
                  {loading ? (
                    <div className="flex flex-col items-center justify-center p-12 space-y-3">
                      <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
                      <span className={`text-xs ${textMuted}`}>טוען הגשות...</span>
                    </div>
                  ) : filteredSubmissions.length === 0 ? (
                    <div className="text-center py-12 text-xs text-text-muted">
                      לא נמצאו הגשות מתאימות.
                    </div>
                  ) : (
                    filteredSubmissions.map((sub) => {
                      const isSelected = selectedSub?.id === sub.id;
                      const charDetails = CHARACTERS_MAP[sub.character] || { name: sub.character, avatar: "🤖", themeColor: "" };
                      const dateStr = sub.submittedAt 
                        ? new Date(sub.submittedAt.seconds * 1000).toLocaleDateString("he-IL") 
                        : "";
                      
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSelectSub(sub)}
                          className={`w-full p-3.5 rounded-xl border text-right transition-all flex items-center justify-between gap-3 hover:scale-[1.01] cursor-pointer ${
                            isSelected 
                              ? "border-purple-500 bg-purple-500/5 ring-1 ring-purple-500/20" 
                              : `${borderStyle} ${isLight ? "bg-white hover:bg-zinc-50" : "bg-[#0b0f19] hover:bg-[#111727]"}`
                          }`}
                        >
                          {/* Score or Pending badge */}
                          <div>
                            {sub.status === "graded" ? (
                              <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                                {sub.score}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                                <span>ממתין</span>
                              </span>
                            )}
                          </div>

                          {/* Student Details */}
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <h4 className={`text-xs font-bold ${textTitle}`}>
                                {sub.studentName} {sub.studentClass ? `(${sub.studentClass})` : ""}
                              </h4>
                              <p className="text-[10px] text-text-muted mt-0.5">{sub.studentEmail}</p>
                              <div className="flex gap-2 items-center justify-end mt-1.5 text-[9px] text-text-muted">
                                <span>הוגש ב: {dateStr}</span>
                                <span>•</span>
                                <span className={`flex items-center gap-0.5 px-1 rounded bg-zinc-800 border border-zinc-700/50`}>
                                  <span>{charDetails.avatar}</span>
                                  <span>{charDetails.name}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

              </div>

              {/* RIGHT COLUMN: Detailed View & Grading Form (Columns: 7) */}
              <div className="lg:col-span-7 flex flex-col">
                <div className={`rounded-2xl ${cardStyle} border ${borderStyle} flex-1 flex flex-col justify-between overflow-hidden shadow-2xl h-full min-h-[500px]`}>
                  
                  {!selectedSub ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-xs text-text-muted space-y-4">
                      <BookOpen className="w-12 h-12 text-zinc-700 animate-pulse" />
                      <p className="max-w-xs leading-relaxed">
                        יש לבחור הגשת תלמיד מרשימת ההגשות משמאל כדי לקרוא את תמלול, לראות את כרטיס היציאה ולהזין ציון ומשוב.
                      </p>
                    </div>
                  ) : (
                    /* Detailed submission review panel */
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                      
                      {/* Active Sub Header */}
                      <div className={`px-6 py-4 border-b ${borderStyle} flex items-center justify-between ${
                        isLight ? "bg-zinc-50" : "bg-[#0b0f19]/70"
                      }`}>
                        <div className="text-right">
                          <h3 className={`text-sm font-black ${textTitle}`}>
                            {selectedSub.studentName} {selectedSub.studentClass ? `(${selectedSub.studentClass})` : ""}
                          </h3>
                          <p className="text-[10px] text-text-muted mt-0.5">{selectedSub.studentEmail}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-xl border font-bold flex items-center gap-1 ${
                            CHARACTERS_MAP[selectedSub.character]?.themeColor || ""
                          }`}>
                            <span>שותף שיחה: {CHARACTERS_MAP[selectedSub.character]?.avatar} {CHARACTERS_MAP[selectedSub.character]?.name}</span>
                          </span>
                        </div>
                      </div>

                      {/* Content scroll block (Transcripts + Exit Ticket) */}
                      <div className="flex-1 p-6 overflow-y-auto space-y-6 max-h-[380px]">
                        
                        {/* Conversation Transcript section */}
                        <div className="space-y-3">
                          <h4 className={`text-xs font-bold ${textTitle} text-right border-r-2 border-purple-500 pr-2`}>
                            תמלול השיחה באנגלית (Chat Transcript)
                          </h4>
                          <div className={`p-4 rounded-xl border ${borderStyle} ${isLight ? "bg-zinc-100/50" : "bg-[#0b101d]"} space-y-4 max-h-[250px] overflow-y-auto`}>
                            {selectedSub.messages.map((msg, idx) => {
                              const isUser = msg.sender === "user";
                              return (
                                <div key={idx} className={`flex w-full ${isUser ? "justify-start" : "justify-end"}`}>
                                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                                    isUser
                                      ? "bg-purple-600 text-white rounded-tl-none font-medium shadow-md shadow-purple-500/10"
                                      : isLight
                                        ? "bg-white border border-zinc-200 text-zinc-900 rounded-tr-none shadow-sm"
                                        : "bg-surface border border-border-custom text-[#e8edf8] rounded-tr-none shadow-md shadow-black/10"
                                  }`} dir="ltr">
                                    <div className={`text-[9px] mb-1 font-bold ${isUser ? "text-purple-200" : "text-purple-400"}`}>
                                      {isUser ? selectedSub.studentName : (CHARACTERS_MAP[selectedSub.character]?.name || "AI Partner")}
                                    </div>
                                    <p className="text-left break-words">{msg.text}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Exit Ticket Responses section */}
                        <div className="space-y-3">
                          <h4 className={`text-xs font-bold ${textTitle} text-right border-r-2 border-purple-500 pr-2`}>
                            כרטיס יציאה (Exit Ticket Answers)
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                            <div className={`p-3 rounded-xl border ${borderStyle} bg-purple-500/5`}>
                              <span className="block text-[10px] font-bold text-purple-400">1. דבר אחד שלמדתי:</span>
                              <p className={`mt-1 text-xs text-slate-200 leading-relaxed font-sans`}>
                                {selectedSub.exitTicketLearned}
                              </p>
                            </div>
                            <div className={`p-3 rounded-xl border ${borderStyle} bg-purple-500/5`}>
                              <span className="block text-[10px] font-bold text-purple-400">2. 3 שאלות לחבר לעט:</span>
                              <p className={`mt-1 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap`} dir="ltr">
                                {selectedSub.exitTicketPenPal}
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Grading and Review Submission Form (Fixed Footer) */}
                      <form onSubmit={handleSaveGrade} className={`p-5 border-t ${borderStyle} ${
                        isLight ? "bg-zinc-50" : "bg-[#0b0f19]/80"
                      } space-y-4`}>
                        <div className="grid grid-cols-4 gap-4 items-center flex-row-reverse text-right">
                          
                          {/* Feedback text area (Span: 3) */}
                          <div className="col-span-3 space-y-1.5">
                            <label className={`block text-[10px] font-bold ${textTitle}`}>
                              הערות ומשוב המורה (באנגלית או בעברית):
                            </label>
                            <input
                              type="text"
                              value={feedbackInput}
                              onChange={(e) => setFeedbackInput(e.target.value)}
                              placeholder="כתבו משוב תומך (לדוגמה: כל הכבוד! שיחה מגוונת ומשפטים נהדרים...)"
                              className={`w-full px-3 py-2 text-xs rounded-lg border outline-none text-right transition-all ${inputStyle}`}
                            />
                          </div>

                          {/* Grade numeric input (Span: 1) */}
                          <div className="col-span-1 space-y-1.5">
                            <label className={`block text-[10px] font-bold ${textTitle}`}>
                              ציון (0-100):
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={gradeInput}
                              onChange={(e) => setGradeInput(e.target.value)}
                              placeholder="90"
                              className={`w-full px-3 py-2 text-xs rounded-lg border outline-none text-center font-bold transition-all ${inputStyle}`}
                              required
                            />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-between items-center gap-3">
                          
                          {gradeSuccess && (
                            <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                              <Check className="w-4 h-4" />
                              <span>הציון והמשוב נשמרו בהצלחה!</span>
                            </div>
                          )}
                          {!gradeSuccess && <div />}

                          <button
                            type="submit"
                            disabled={isGrading}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700 text-white font-bold text-xs rounded-lg cursor-pointer shadow-md transition-all flex items-center gap-1.5 mr-auto"
                          >
                            {isGrading ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>שומר...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>שמירת ציון ומשוב</span>
                              </>
                            )}
                          </button>
                        </div>

                      </form>

                    </div>
                  )}

                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-border-custom text-xs text-text-muted relative z-10 bg-surface/30">
        <span>© {new Date().getFullYear()} ניר עוז-ארי — לוח בקרה Chat Masters</span>
      </footer>
    </div>
  );
}
