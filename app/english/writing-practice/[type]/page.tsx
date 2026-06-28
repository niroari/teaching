"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { dbFirestore } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  ArrowRight, 
  Mail, 
  FileText, 
  Sparkles, 
  Sun, 
  Moon, 
  RefreshCw, 
  Check, 
  Copy, 
  Trophy, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  HelpCircle
} from "lucide-react";

interface PromptData {
  id: string;
  title: string;
  prompt: string;
}

const PROMPTS: Record<string, PromptData[]> = {
  letter: [
    {
      id: "letter-1",
      title: "מכתב לחבר על חופשת קיץ",
      prompt: "Write a letter to a friend in English describing your summer vacation. Tell them about what you did, places you visited, and how you felt. Ask them about their summer too."
    },
    {
      id: "letter-2",
      title: "מכתב תודה לאחר אירוח",
      prompt: "Write a thank-you letter to a friend or relative after spending a weekend at their house. Thank them for the food, hospitality, and activities you enjoyed together."
    },
    {
      id: "letter-3",
      title: "מכתב רשמי למנהל בית הספר",
      prompt: "Write a letter to your school principal proposing a new extracurricular activity or school club (e.g. photography, debate, or chess). Explain why it is important and how it will benefit students."
    }
  ],
  essay: [
    {
      id: "essay-1",
      title: "שימוש בטלפונים בבית הספר",
      prompt: "Should students be allowed to use mobile phones during school hours? Write a paragraph expressing your opinion. Provide at least two reasons to support your position."
    },
    {
      id: "essay-2",
      title: "חשיבות הפעילות הגופנית",
      prompt: "Explain why physical exercise is important for teenagers. Write an opinion paragraph discussing health benefits, mood improvement, and social aspects."
    },
    {
      id: "essay-3",
      title: "בעל החיים האהוב עליכם",
      prompt: "Describe your favorite animal and explain why you admire it. Discuss its characteristics, behavior, and what people can learn from this animal."
    }
  ]
};

const CONNECTOR_CATEGORIES = [
  {
    name: "סדר וארגון (Sequencing)",
    items: [
      { text: "First of all, ", translation: "קודם כל" },
      { text: "Secondly, ", translation: "שנית" },
      { text: "Next, ", translation: "לאחר מכן" },
      { text: "Then, ", translation: "אז" },
      { text: "Finally, ", translation: "לבסוף" },
      { text: "In conclusion, ", translation: "לסיכום" }
    ]
  },
  {
    name: "הוספת מידע (Adding Info)",
    items: [
      { text: "In addition, ", translation: "בנוסף" },
      { text: "Furthermore, ", translation: "יתרה מכך" },
      { text: "Moreover, ", translation: "בנוסף לכך" },
      { text: "Also, ", translation: "גם" }
    ]
  },
  {
    name: "הצגת ניגוד (Contrasting)",
    items: [
      { text: "However, ", translation: "אולם, עם זאת" },
      { text: "On the other hand, ", translation: "מצד שני" },
      { text: "Although ", translation: "למרות ש-" },
      { text: "In contrast, ", translation: "בניגוד לכך" }
    ]
  },
  {
    name: "דוגמאות והסברים (Examples)",
    items: [
      { text: "For example, ", translation: "לדוגמה" },
      { text: "For instance, ", translation: "למשל" },
      { text: "Such as ", translation: "כמו למשל" }
    ]
  },
  {
    name: "סיבה ותוצאה (Reason & Result)",
    items: [
      { text: "Therefore, ", translation: "לכן" },
      { text: "As a result, ", translation: "כתוצאה מכך" },
      { text: "Consequently, ", translation: "לפיכך" }
    ]
  }
];

interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

interface EvaluationResult {
  score: number;
  structureFeedback: {
    passed: boolean;
    details: string;
  };
  grammarFeedback: string;
  corrections: Correction[];
  improvedVersion: string;
}

export default function WritingWorkspacePage() {
  const { type } = useParams();
  const router = useRouter();
  const taskType = typeof type === "string" ? type : "letter";
  const promptsList = PROMPTS[taskType] || [];

  // Theme state
  const [comfortMode, setComfortMode] = useState<"dark" | "light">("dark");

  // Page States
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number>(0);
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [customPromptText, setCustomPromptText] = useState("");
  const [text, setText] = useState("");
  
  // Evaluation States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const { user } = useAuth();
  const [isAssignmentMode, setIsAssignmentMode] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedDocId, setSubmittedDocId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.displayName) {
      setStudentName(user.displayName);
    }
  }, [user]);

  // Editor Ref
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedImproved, setCopiedImproved] = useState(false);

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

  const activePrompt = isCustomPrompt 
    ? (customPromptText.trim() || "נושא כתיבה מותאם אישית") 
    : (promptsList[selectedPromptIndex]?.prompt || "");

  // Word & Line count logic
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const estimatedLines = text.trim() === "" ? 0 : text.trim().split("\n").reduce((acc, val) => {
    const words = val.trim().split(/\s+/).filter(Boolean).length;
    if (words === 0) return acc;
    return acc + Math.max(1, Math.ceil(words / 10)); // 10 words ≈ 1 line
  }, 0);

  // Validation boundary: 10-15 lines
  const isLineCountPerfect = estimatedLines >= 10 && estimatedLines <= 15;
  const isLineCountTooShort = estimatedLines < 10;
  const isLineCountTooLong = estimatedLines > 15;

  const handleConnectorClick = (connector: string, index: number) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = text.substring(0, start) + connector + text.substring(end);
      setText(newText);
      
      // Keep focus and set cursor position after the inserted connector
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + connector.length, start + connector.length);
      }, 0);
    } else {
      navigator.clipboard.writeText(connector);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  };

  const submitWritingAssignment = async (evalData: EvaluationResult) => {
    if (!user) return;
    setIsSubmitting(true);
    setSubmittedDocId(null);
    try {
      const uploadPromise = addDoc(collection(dbFirestore, "writing_assignments"), {
        studentId: user.uid,
        studentName: studentName.trim(),
        studentClass: studentClass.trim(),
        studentEmail: user.email || "",
        taskType: taskType,
        prompt: activePrompt,
        studentText: text,
        score: evalData.score,
        evaluation: evalData,
        submittedAt: serverTimestamp(),
        status: "submitted",
        scoreTeacher: null,
        feedbackTeacher: null
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database connection timeout")), 8000)
      );

      const docRef = await Promise.race([uploadPromise, timeoutPromise]) as any;
      setSubmittedDocId(docRef.id);
    } catch (err) {
      console.error("Error submitting writing assignment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEvaluate = async (forceSubmit = false) => {
    if (!text.trim()) {
      setErrorMsg("נא לכתוב טקסט לפני ההגשה.");
      return;
    }

    if (isAssignmentMode) {
      if (!user) {
        setErrorMsg("עלייך להתחבר למערכת כדי להגיש את המשימה.");
        return;
      }
      if (!studentName.trim() || !studentClass.trim()) {
        setErrorMsg("אנא מלאו שם מלא וכיתה לפני ההגשה במצב משימה.");
        return;
      }
    }

    if (!forceSubmit && (isLineCountTooShort || isLineCountTooLong)) {
      setShowWarningModal(true);
      return;
    }

    setShowWarningModal(false);
    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const res = await fetch("/api/evaluate-writing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          taskType,
          prompt: activePrompt,
          text
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.data);
        if (isAssignmentMode && user) {
          submitWritingAssignment(data.data);
        }
        // Scroll to results
        setTimeout(() => {
          document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      } else {
        setErrorMsg(data.message || "שגיאה בחיבור לשרת הבדיקה. נא לנסות שוב.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("אירעה שגיאה בבדיקת החיבור. נא לבדוק את החיבור לרשת ולנסות שוב.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyImproved = () => {
    if (result) {
      navigator.clipboard.writeText(result.improvedVersion);
      setCopiedImproved(true);
      setTimeout(() => setCopiedImproved(false), 2000);
    }
  };

  // Theme Variables
  const isLight = comfortMode === "light";
  const bgTheme = isLight ? "bg-[#f4f6fa] text-zinc-800" : "bg-[#080c18] text-[#e8edf8]";
  const borderTheme = isLight ? "border-zinc-200" : "border-border-custom";
  const textTitle = isLight ? "text-zinc-900" : "text-white";
  const textMuted = isLight ? "text-zinc-500" : "text-text-muted";
  const cardStyle = isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-[#0c1222]/60 border-border-custom";
  const inputStyle = isLight 
    ? "bg-white border-zinc-300 text-zinc-900 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" 
    : "bg-[#0d1222]/80 border-border-custom text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30";

  return (
    <div className={`relative min-h-screen flex flex-col justify-between overflow-hidden transition-colors duration-200 ${bgTheme}`}>
      {/* Glow Effects */}
      {!isLight && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />
        </>
      )}

      {/* Main Container */}
      <div className="relative w-full max-w-5xl mx-auto px-6 py-12 flex-1 flex flex-col z-10">
        
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/english/writing-practice"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold hover:text-cyan-500 transition-colors ${textMuted}`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>חזרה לתפריט כתיבה</span>
          </Link>

          <button
            onClick={toggleComfortMode}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isLight 
                ? "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50" 
                : "bg-surface border-border-custom text-zinc-300 hover:bg-surface-hover"
            }`}
          >
            {isLight ? (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-600" />
                <span>מצב קריאה כהה</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>מצב קריאה בהיר</span>
              </>
            )}
          </button>
        </div>

        {/* Workspace Title */}
        <div className="text-right mb-8">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-bold mb-3 ${isLight ? "bg-white border-zinc-200 text-cyan-600" : "bg-surface border-border-custom text-english"}`}>
            {taskType === "letter" ? <Mail className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
            <span>{taskType === "letter" ? "אימון מכתבים (Letter)" : "אימון חיבורים (Essay)"}</span>
          </div>
          <h1 className={`text-3xl font-black ${textTitle}`}>
            {taskType === "letter" ? "סדנת כתיבת מכתבים" : "סדנת כתיבת חיבורים ופסקאות"}
          </h1>
          <p className={`text-xs mt-1.5 ${textMuted}`}>
            {taskType === "letter" 
              ? "תרגול מכתבים אישיים ורשמיים. כתבו 10-15 שורות בהתאם למבנה מכתב תקין." 
              : "תרגול כתיבת פסקאות הבעת דעה וטיעונים. שמרו על מבנה מובן ואורך מתאים."}
          </p>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* LEFT/SIDEBAR COLUMN: Instruction Guide & Prompt Selector (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Writing Guide */}
            <div className={`border rounded-2xl p-6 ${cardStyle}`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 border-b pb-3 mb-4 ${textTitle} ${borderTheme}`}>
                <BookOpen className="w-5 h-5 text-cyan-500" />
                <span>{taskType === "letter" ? "מבנה המכתב הנכון באנגלית" : "מבנה חיבור טיעוני נכון"}</span>
              </h3>
              
              {taskType === "letter" ? (
                <div className={`text-xs leading-relaxed space-y-3.5 ${textMuted}`}>
                  <p>כתיבת מכתב באנגלית צריכה לכלול מספר חלקים מובחנים:</p>
                  <ol className="list-decimal list-inside space-y-2 pr-1">
                    <li>
                      <span className={`font-bold ${textTitle}`}>תאריך ופרטי שולח</span> (לא חובה בטקסט קצר, מומלץ למעלה).
                    </li>
                    <li>
                      <span className={`font-bold ${textTitle}`}>פנייה (Salutation):</span> פתיחה עם פסיק בסוף, למשל:
                      <code className="block mt-1 px-2 py-1 bg-black/10 rounded font-mono select-all text-center">Dear Friend,</code>
                      <code className="block mt-1 px-2 py-1 bg-black/10 rounded font-mono select-all text-center">Dear Mr. Green,</code>
                    </li>
                    <li>
                      <span className={`font-bold ${textTitle}`}>שורת פתיחה:</span> משפט נימוס מקובל כגון:
                      <code className="block mt-1 px-2 py-1 bg-black/10 rounded font-mono select-all text-center">I hope this letter finds you well.</code>
                    </li>
                    <li>
                      <span className={`font-bold ${textTitle}`}>גוף המכתב (Body):</span> התוכן המרכזי שבו מפרטים את המידע (צריך לתפוס את מרבית ה-10-15 שורות).
                    </li>
                    <li>
                      <span className={`font-bold ${textTitle}`}>ברכת פרידה (Closing):</span> פרידה מנומסת עם פסיק:
                      <code className="block mt-1 px-2 py-1 bg-black/10 rounded font-mono select-all text-center">Sincerely, / Best regards, / Love,</code>
                    </li>
                    <li>
                      <span className={`font-bold ${textTitle}`}>חתימה:</span> השם שלכם בשורה נפרדת למטה.
                    </li>
                  </ol>
                </div>
              ) : (
                <div className={`text-xs leading-relaxed space-y-3.5 ${textMuted}`}>
                  <p>פסקה או חיבור דעה צריכים להיבנות בצורה לוגית:</p>
                  <ol className="list-decimal list-inside space-y-2.5 pr-1">
                    <li>
                      <span className={`font-bold ${textTitle}`}>משפט פתיחה (Topic Sentence):</span> מציג את הנושא המרכזי ואת דעתכם הברורה בצורה ישירה.
                    </li>
                    <li>
                      <span className={`font-bold ${textTitle}`}>משפטים תומכים (Supporting Sentences):</span> מפרטים 2-3 סיבות או טיעונים.
                    </li>
                    <li>
                      <span className={`font-bold ${textTitle}`}>דוגמה או הסבר:</span> מומלץ להציג דוגמה קונקרטית כדי לתמוך בדעתכם.
                    </li>
                    <li>
                      <span className={`font-bold ${textTitle}`}>מילות קישור (Connectors):</span> מומלץ להשתמש במעברים כמו:
                      <span className="block mt-1.5 font-mono bg-black/10 px-2 py-1 text-center rounded">First of all, In addition, However...</span>
                    </li>
                    <li>
                      <span className={`font-bold ${textTitle}`}>משפט סיום (Concluding Sentence):</span> מסכם את הטענה הכללית ומסיים את הפסקה.
                    </li>
                  </ol>
                </div>
              )}
            </div>

            {/* 2. Prompt Selector */}
            <div className={`border rounded-2xl p-6 ${cardStyle}`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 border-b pb-3 mb-4 ${textTitle} ${borderTheme}`}>
                <HelpCircle className="w-5 h-5 text-cyan-500" />
                <span>בחירת נושא לכתיבה</span>
              </h3>
              
              <div className="space-y-3.5">
                {promptsList.map((p, idx) => (
                  <label
                    key={p.id}
                    className={`block p-3 border rounded-xl cursor-pointer text-xs transition-all ${
                      !isCustomPrompt && selectedPromptIndex === idx
                        ? "border-cyan-500/80 bg-cyan-500/5 text-cyan-400 font-bold"
                        : isLight ? "border-zinc-200 hover:bg-zinc-50" : "border-border-custom hover:bg-[#0c1222]/40 text-text-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      name="prompt-selector"
                      checked={!isCustomPrompt && selectedPromptIndex === idx}
                      onChange={() => {
                        setIsCustomPrompt(false);
                        setSelectedPromptIndex(idx);
                      }}
                      className="hidden"
                    />
                    <div className="text-right">
                      <p className={`font-bold mb-1 ${!isCustomPrompt && selectedPromptIndex === idx ? "text-cyan-500" : textTitle}`}>
                        {p.title}
                      </p>
                      <p className="text-[11px] leading-relaxed font-normal opacity-90">{p.prompt}</p>
                    </div>
                  </label>
                ))}

                <label
                  className={`block p-3 border rounded-xl cursor-pointer text-xs transition-all ${
                    isCustomPrompt
                      ? "border-cyan-500/80 bg-cyan-500/5 text-cyan-400 font-bold"
                      : isLight ? "border-zinc-200 hover:bg-zinc-50" : "border-border-custom hover:bg-[#0c1222]/40 text-text-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="prompt-selector"
                    checked={isCustomPrompt}
                    onChange={() => setIsCustomPrompt(true)}
                    className="hidden"
                  />
                  <div className="text-right space-y-2">
                    <p className={`font-bold ${isCustomPrompt ? "text-cyan-500" : textTitle}`}>
                      נושא מותאם אישית (Custom Prompt)
                    </p>
                    <p className="text-[11px] leading-relaxed font-normal opacity-90">הגדירו נושא משלכם לתרגול חופשי</p>
                    
                    {isCustomPrompt && (
                      <textarea
                        value={customPromptText}
                        onChange={(e) => setCustomPromptText(e.target.value)}
                        placeholder="כיתבו כאן את נושא הכתיבה באנגלית..."
                        onClick={(e) => e.stopPropagation()}
                        className={`w-full p-2.5 rounded-lg text-xs font-normal h-16 resize-none focus:outline-none ${inputStyle}`}
                      />
                    )}
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Writing Canvas & Connectors (Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Active Prompt Info Box */}
            <div className={`p-4 border rounded-xl border-l-4 border-l-cyan-500 ${isLight ? "bg-cyan-500/5 text-zinc-800" : "bg-cyan-500/5 text-[#e8edf8]"}`}>
              <h4 className="text-xs font-bold text-cyan-500 mb-1">משימת הכתיבה שלך:</h4>
              <p className="text-xs leading-relaxed font-semibold italic">"{activePrompt}"</p>
            </div>

            {/* Main Canvas Card */}
            <div className={`border rounded-2xl p-6 ${cardStyle}`}>
              
              {/* Toolbar Connector categories */}
              <div className="mb-4">
                <h4 className={`text-xs font-bold mb-2 ${textTitle}`}>מחסן מילות קישור (לחצו כדי להוסיף לטקסט):</h4>
                <div className="flex flex-wrap gap-2.5 max-h-24 overflow-y-auto p-1 border rounded-xl border-border-custom bg-black/10">
                  {CONNECTOR_CATEGORIES.map((cat) => (
                    <div key={cat.name} className="contents">
                      {cat.items.map((item, idx) => {
                        const globalIdx = cat.items.length * idx; // unique ref for copy state
                        return (
                          <button
                            key={item.text}
                            onClick={() => handleConnectorClick(item.text, globalIdx)}
                            title={`${cat.name} · ${item.translation}`}
                            className={`px-2.5 py-1 text-[10px] font-mono rounded bg-surface border border-border-custom text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/30 cursor-pointer flex items-center gap-1 transition-all`}
                          >
                            <span>{item.text.trim()}</span>
                            {copiedIndex === globalIdx && <Check className="w-2.5 h-2.5 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Assignment Mode Toggle */}
              <div className={`p-4 mb-4 rounded-xl border ${borderTheme} ${isLight ? "bg-zinc-50" : "bg-[#0b0f19]/30"} space-y-3 text-right`}>
                <div className="flex items-center justify-between flex-row-reverse">
                  <label className={`text-xs font-bold ${textTitle} flex items-center gap-2 cursor-pointer select-none`}>
                    <input 
                      type="checkbox"
                      checked={isAssignmentMode}
                      onChange={(e) => {
                        setIsAssignmentMode(e.target.checked);
                        setSubmittedDocId(null);
                      }}
                      className="w-4 h-4 rounded border-zinc-300 text-cyan-600 focus:ring-cyan-500 accent-cyan-600"
                    />
                    <span>הפיכת הפעילות למשימה להגשה (מצב משימה)</span>
                  </label>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold">
                    אופציונלי
                  </span>
                </div>
                
                {isAssignmentMode && (
                  <div className="pt-2 text-right space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name Input */}
                      <div className="space-y-1.5">
                        <label className={`block text-[11px] font-bold ${textTitle} text-right`}>
                          שם התלמיד/ה:
                        </label>
                        <input
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="הכניסו שם מלא..."
                          className={`w-full px-3 py-2 text-xs rounded-xl border outline-none text-right transition-all font-bold ${inputStyle}`}
                          required={isAssignmentMode}
                        />
                      </div>

                      {/* Class Input */}
                      <div className="space-y-1.5">
                        <label className={`block text-[11px] font-bold ${textTitle} text-right`}>
                          הכיתה שלך (לדוגמה: ז׳1, ז׳3):
                        </label>
                        <input
                          type="text"
                          value={studentClass}
                          onChange={(e) => setStudentClass(e.target.value)}
                          placeholder="ז׳3"
                          className={`w-full px-3 py-2 text-xs rounded-xl border outline-none text-right transition-all font-bold ${inputStyle}`}
                          required={isAssignmentMode}
                        />
                      </div>
                    </div>

                    {user ? (
                      <div className="text-[11px] text-emerald-400 font-medium flex items-center justify-end gap-1.5 font-bold">
                        {submittedDocId ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <b>המשימה הוגשה למורה בהצלחה! ✓</b>
                          </span>
                        ) : isSubmitting ? (
                          <span>שולח משימה למערכת...</span>
                        ) : result ? (
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-rose-400">המשימה טרם הוגשה למערכת.</span>
                            <button
                              type="button"
                              onClick={() => submitWritingAssignment(result)}
                              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold text-[10px] rounded-lg transition-all cursor-pointer shadow-md"
                            >
                              הגש משימה כעת
                            </button>
                          </div>
                        ) : (
                          <span>מחובר/ת כעת בתור: <b>{user.displayName || user.email}</b>. המשימה תוגש אוטומטית בעת בדיקת ה-AI.</span>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg space-y-2 text-right">
                        <p className="text-xs text-amber-300">
                          עלייך להתחבר למערכת כדי שתוכל/י להגיש את המשימה.
                        </p>
                        <Link href={`/login?redirect=/english/writing-practice/${taskType}`} className="inline-block text-xs text-cyan-400 hover:underline font-bold">
                          התחברות כעת ←
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Text Area */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="כיתבו את משימת הכתיבה שלכם באנגלית כאן..."
                  className={`w-full h-80 p-4 rounded-2xl text-sm leading-relaxed focus:outline-none focus:ring-1 ${inputStyle}`}
                  dir="ltr"
                />
              </div>

              {/* Live Info Bar & Progress */}
              <div className="flex justify-between items-center mt-4">
                {/* Visual line check meter */}
                <div className="flex items-center gap-2 text-xs">
                  <span className={textMuted}>אורך מוערך:</span>
                  <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                    isLineCountPerfect 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : isLineCountTooLong 
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-red-500/10 text-rose-400 border border-red-500/20"
                  }`}>
                    {estimatedLines} {estimatedLines === 1 ? "שורה" : "שורות"}
                  </span>
                  
                  {isLineCountPerfect && (
                    <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>אורך מושלם לתרגול כיתתי (10-15 שורות)</span>
                    </span>
                  )}
                  {isLineCountTooShort && estimatedLines > 0 && (
                    <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-0.5">
                      <AlertCircle className="w-3 h-3" />
                      <span>קצר מדי (עדיין לא הגיע ל-10 שורות)</span>
                    </span>
                  )}
                  {isLineCountTooLong && (
                    <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-0.5">
                      <AlertCircle className="w-3 h-3" />
                      <span>חריגה (עבר את הגבול המומלץ של 15 שורות)</span>
                    </span>
                  )}
                </div>

                {/* Word counter */}
                <div className={`text-xs ${textMuted}`}>
                  <span>סה"כ מילים: </span>
                  <span className={`font-bold ${textTitle}`}>{wordCount}</span>
                </div>
              </div>

              {/* Action trigger */}
              <div className="mt-6 flex flex-col md:flex-row gap-4 items-center justify-between border-t border-border-custom/50 pt-5">
                <p className={`text-[11px] leading-normal ${textMuted}`}>
                  * שימו לב: בדיקת ה-AI משווה את הכתיבה שלכם לחוקי דקדוק ומבנה, ומסבירה כיצד לשפר את המשפטים בעברית.
                </p>

                <button
                  onClick={() => handleEvaluate(false)}
                  disabled={loading || !text.trim()}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-zinc-950 font-bold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-500/10 shrink-0"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>ה-AI מנתח...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>הגש לבדיקת AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Error messages */}
              {errorMsg && (
                <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorMsg}</span>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* AI FEEDBACK VIEWING SECTION */}
        {result && (
          <div id="results-section" className="mt-12 space-y-6 scroll-mt-6">
            <h2 className={`text-2xl font-black text-right flex items-center gap-2.5 ${textTitle}`}>
              <Trophy className="w-6 h-6 text-cyan-500" />
              <span>תוצאות והערכת כתיבה</span>
            </h2>

            {/* Summary Score Card */}
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-6`}>
              
              {/* Score Gauge */}
              <div className={`border rounded-2xl p-6 flex flex-col items-center justify-center text-center md:col-span-1 ${cardStyle}`}>
                <span className={`text-xs font-bold ${textMuted} mb-2`}>ציון כתיבה כללי</span>
                <div className="relative w-28 h-28 flex items-center justify-center border-4 border-cyan-500/20 rounded-full">
                  <div className="absolute inset-2 border-4 border-cyan-500 rounded-full flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">{result.score}</span>
                    <span className="text-[10px] text-cyan-400 font-bold">מתוך 100</span>
                  </div>
                </div>
                <span className={`text-[10px] mt-4 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20`}>
                  {result.score >= 90 ? "מצוין (Excellent)" : result.score >= 80 ? "טוב מאוד (Good)" : "צריך שיפור (Needs Improvement)"}
                </span>
              </div>

              {/* Structure Check */}
              <div className={`border rounded-2xl p-6 md:col-span-3 flex flex-col justify-between ${cardStyle}`}>
                <div>
                  <h3 className={`text-base font-bold flex items-center gap-2 border-b pb-3 mb-4 ${textTitle} ${borderTheme}`}>
                    {result.structureFeedback.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    )}
                    <span>מבנה ועימוד החיבור / המכתב</span>
                  </h3>
                  <div className="flex items-start gap-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      result.structureFeedback.passed 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {result.structureFeedback.passed ? "המבנה תקין" : "יש לתקן מבנה"}
                    </span>
                    <p className={`text-xs leading-relaxed ${textMuted}`}>
                      {result.structureFeedback.details}
                    </p>
                  </div>
                </div>
                
                <div className={`text-[11px] leading-relaxed p-3 mt-4 rounded-xl border ${isLight ? "bg-zinc-50 border-zinc-200 text-zinc-600" : "bg-[#090e1b] border-border-custom/50 text-[#e8edf8]/80"}`}>
                  <span className="font-bold text-cyan-500">דקדוק ואיות: </span>
                  {result.grammarFeedback}
                </div>
              </div>

            </div>

            {/* Corrections list */}
            <div className={`border rounded-2xl p-6 ${cardStyle}`}>
              <h3 className={`text-base font-bold flex items-center gap-2 border-b pb-3 mb-4 ${textTitle} ${borderTheme}`}>
                <XCircle className="w-5 h-5 text-rose-400" />
                <span>שגיאות ותיקונים דקדוקיים</span>
              </h3>

              {result.corrections && result.corrections.length > 0 ? (
                <div className="space-y-4">
                  {result.corrections.map((corr, idx) => (
                    <div 
                      key={idx} 
                      className={`p-4 border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                        isLight ? "bg-rose-500/5 border-rose-500/10" : "bg-[#180a0e]/60 border-rose-950/40"
                      }`}
                    >
                      <div className="space-y-1.5 text-right flex-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          הסבר שגיאה
                        </span>
                        <p className={`text-xs font-semibold leading-relaxed ${textMuted}`}>{corr.explanation}</p>
                      </div>

                      <div className="flex items-center gap-3.5 font-mono text-sm shrink-0 w-full md:w-auto justify-end" dir="ltr">
                        <span className="text-rose-400 line-through bg-rose-500/10 px-2 py-1 rounded select-all max-w-[150px] overflow-x-auto whitespace-nowrap block">
                          {corr.original}
                        </span>
                        <span className="text-[#e8edf8]">&rarr;</span>
                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded select-all max-w-[150px] overflow-x-auto whitespace-nowrap block">
                          {corr.corrected}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <p className={`text-sm font-bold ${textTitle}`}>אין שגיאות דקדוק או איות מהותיות!</p>
                  <p className={`text-xs ${textMuted}`}>הכתיבה שלכם מדויקת ונקייה משגיאות נפוצות. כל הכבוד!</p>
                </div>
              )}
            </div>

            {/* Model Revised Copy */}
            <div className={`border rounded-2xl p-6 ${cardStyle}`}>
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <button
                  onClick={handleCopyImproved}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isLight 
                      ? "bg-zinc-50 border-zinc-300 text-zinc-700 hover:bg-zinc-100" 
                      : "bg-[#090e1b] border-border-custom hover:bg-surface-hover text-zinc-300"
                  }`}
                >
                  {copiedImproved ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>הועתק בהצלחה</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>העתק גרסה משופרת</span>
                    </>
                  )}
                </button>
                
                <h3 className={`text-base font-bold flex items-center gap-2 ${textTitle}`}>
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>גרסה משופרת מומלצת (Model Revision)</span>
                </h3>
              </div>

              <div 
                className={`p-5 rounded-2xl text-sm leading-relaxed border font-medium ${
                  isLight ? "bg-zinc-50/50 border-zinc-200 text-zinc-800" : "bg-[#090e1b]/80 border-border-custom/50 text-slate-100"
                }`}
                dir="ltr"
              >
                {result.improvedVersion.split("\n").map((line, idx) => (
                  <p key={idx} className={idx > 0 ? "mt-3" : ""}>
                    {line}
                  </p>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Line Count Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6 backdrop-blur-sm">
          <div className="bg-[#0c1222] border border-border-custom max-w-md w-full rounded-2xl p-6 text-right space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2 justify-end">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span>התרעת אורך טקסט</span>
            </h3>
            <p className="text-xs text-[#e8edf8]/80 leading-relaxed">
              הטקסט שכתבת כולל כעת <span className="font-bold text-white">{estimatedLines}</span> {estimatedLines === 1 ? "שורה" : "שורות"}. 
              הדרישה המומלצת היא כתיבה ממוקדת של <span className="font-bold text-cyan-400">10-15 שורות</span> (~100-150 מילים).
              <br />
              האם להגיש לבדיקת AI בכל זאת או להמשיך לערוך?
            </p>
            <div className="flex gap-3 justify-start pt-2">
              <button
                onClick={() => handleEvaluate(true)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                כן, הגש לבדיקה
              </button>
              <button
                onClick={() => setShowWarningModal(false)}
                className="px-4 py-2 bg-[#1a233a] hover:bg-[#253253] text-[#e8edf8] font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                המשך לערוך
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`w-full text-center py-6 border-t text-xs relative z-10 bg-surface/10 ${borderTheme} ${textMuted}`}>
        <span>© {new Date().getFullYear()} ניר עוז-ארי — אימון כתיבה באנגלית</span>
      </footer>
    </div>
  );
}
