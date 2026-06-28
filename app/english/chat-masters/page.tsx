"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ArrowRight, 
  Send, 
  Sparkles, 
  Download, 
  CheckCircle, 
  Moon, 
  Sun, 
  RefreshCw, 
  MessageSquare, 
  User, 
  HelpCircle, 
  Copy, 
  Check, 
  BookOpen
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import confetti from "canvas-confetti";
import { dbFirestore } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, onSnapshot, serverTimestamp, doc } from "firebase/firestore";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

interface Character {
  id: string;
  name: string;
  englishName: string;
  avatar: string;
  description: string;
  greeting: string;
  themeColor: string;
  bgGlow: string;
}

const CHARACTERS: Character[] = [
  {
    id: "friend",
    name: "סם (חבר לכיתה)",
    englishName: "Sam",
    avatar: "😊",
    description: "חבר לשיחה חם ותומך שאוהב מוזיקה, ספורט וסרטים.",
    greeting: "Hi! I'm Sam. It's so nice to meet you! What do you like to do for fun after school?",
    themeColor: "border-sky-500 text-sky-400 bg-sky-500/10",
    bgGlow: "from-sky-500/5"
  },
  {
    id: "astronaut",
    name: "באדי (אסטרונאוט/ית)",
    englishName: "Buddy",
    avatar: "🚀",
    description: "חוקר/ת חלל שמדבר/ת על כוכבים, כוכבי לכת ואוכל של אסטרונאוטים.",
    greeting: "Hey there, explorer! I'm Buddy. I'm currently floating in zero gravity inside the space station! How are you today?",
    themeColor: "border-purple-500 text-purple-400 bg-purple-500/10",
    bgGlow: "from-purple-500/5"
  },
  {
    id: "superhero",
    name: "הירו (גיבור/ת על)",
    englishName: "Hero",
    avatar: "⚡",
    description: "מגן על העולם, עוזר לאנשים ואוהב להשתמש בגאדג'טים מגניבים.",
    greeting: "Greetings, citizen! I'm Hero. I just returned from a rescue mission! What's your name, and what is your superpower?",
    themeColor: "border-red-500 text-red-400 bg-red-500/10",
    bgGlow: "from-red-500/5"
  },
  {
    id: "builder",
    name: "אלקס (בנאי/ת מיינקראפט)",
    englishName: "Alex",
    avatar: "🧱",
    description: "אוהב/ת כרייה, בנייה יצירתית ויצירת מבנים מדהימים.",
    greeting: "Hey! I'm Alex. I was just designing a massive redstone castle. Do you play video games? What would you like to build?",
    themeColor: "border-emerald-500 text-emerald-400 bg-emerald-500/10",
    bgGlow: "from-emerald-500/5"
  },
  {
    id: "cat",
    name: "לונה (חתול/ה מדבר/ת)",
    englishName: "Luna",
    avatar: "🐱",
    description: "חתול/ה שנון/ה ומצחיק/ה שאוהב/ת חלב חם, שנת צהריים וסקרנות.",
    greeting: "*Meow*! Hello there! I'm Luna. I was just taking a cozy nap in the sun. *Purr*... Do you have any pets at home?",
    themeColor: "border-amber-500 text-amber-400 bg-amber-500/10",
    bgGlow: "from-amber-500/5"
  },
  {
    id: "custom",
    name: "דמות מפורסמת מוכרת",
    englishName: "Custom Figure",
    avatar: "🎭",
    description: "זמר/ת, מדען/נית, ספורטאי/ת או דמות היסטורית (למשל: Einstein, Messi, Taylor Swift, Harry Potter).",
    greeting: "Hi there! I am ready to chat with you. Who would you like me to be?",
    themeColor: "border-rose-500 text-rose-400 bg-rose-500/10",
    bgGlow: "from-rose-500/5"
  }
];

interface GuideStep {
  id: number;
  title: string;
  hebrewTitle: string;
  description: string;
  guidelines: string;
  starters: string[];
}

const GUIDE_STEPS: GuideStep[] = [
  {
    id: 1,
    title: "1. Greeting & Intro",
    hebrewTitle: "ברכה והצגה עצמית",
    description: "Start the conversation by greeting your AI friend and introducing yourself. You don't have to use your real name, and you can mention where you live!",
    guidelines: "התחילו בלומר שלום והציגו את עצמכם. טיפ: אפשר להשתמש בשם אמיתי או בדוי ולספר שאתם מישראל.",
    starters: [
      "Hi! I'm David, a student from Israel. What's your name?",
      "Hello! My name is Sara. I live in Jerusalem. How are you?",
      "Hey AI! I'm Noam from Haifa. Nice to meet you!",
      "Hello friend! I'm Lior, 13 years old. Tell me about yourself."
    ]
  },
  {
    id: 2,
    title: "2. Share Likes",
    hebrewTitle: "שיתוף תחומי עניין",
    description: "Talk about what you like or dislike. You can talk about food, sports, music, games, or school, and then ask the AI about its favorites.",
    guidelines: "ספרו ל-AI מה אתם אוהבים או פחות אוהבים (אוכל, ספורט, תחביב) ושאלו אותו מה דעתו או מה הוא אוהב.",
    starters: [
      "I like falafel. What food do you like?",
      "I don't like homework. What do you dislike?",
      "My favorite sport is basketball. Do you like sports?",
      "I like reading books. What's your favorite activity?",
      "I love beaches in Israel. What places do you like?",
      "I dislike rainy days. What weather do you prefer?"
    ]
  },
  {
    id: 3,
    title: "3. Ask AI Questions",
    hebrewTitle: "שאילת שאלות",
    description: "Ask your AI friend some questions. If you want clear and easy answers, try starting your questions with 'What' or 'Do you'.",
    guidelines: "שאלו את ה-AI שאלות כדי להכיר אותו טוב יותר. התחלת שאלות במילים כמו What או Do you תקל על קבלת תשובה ברורה.",
    starters: [
      "What do you like to do for fun?",
      "Do you know about Israel? Tell me something!",
      "What's your favorite color?",
      "Do you like animals? Which one?",
      "What music do you listen to?",
      "Do you have friends? Who are they?"
    ]
  },
  {
    id: 4,
    title: "4. Share Hobbies & Routines",
    hebrewTitle: "שגרה ותחביבים",
    description: "Think about your daily routine (what time you wake up, what you do after school) or your hobbies, share it, and ask the AI about theirs.",
    guidelines: "שתפו משהו על השגרה היומית שלכם (מתי אתם קמים, מה אתם עושים אחרי בית הספר) או על תחביב שלכם, ושאלו את ה-AI על שלו.",
    starters: [
      "I play soccer after school. What do you do?",
      "My hobby is drawing. What's yours?",
      "I celebrate Hanukkah. What holidays do you know?",
      "I wake up at 7 AM. What's your routine?",
      "I like video games. Do you play any?"
    ]
  },
  {
    id: 5,
    title: "5. What If AI is Funny?",
    hebrewTitle: "תגובות משעשעות",
    description: "Sometimes the AI will say something funny or unexpected. Don't worry! Keep the chat positive, ask it to explain, or laugh it off.",
    guidelines: "ה-AI ענה משהו מצחיק או לא צפוי? הכל טוב! הגיבו בצורה זורמת או בקשו ממנו להסביר. ה-AI תמיד שמח לעזור.",
    starters: [
      "That's cool! Why?",
      "Tell me more.",
      "Stars? Like in the sky? Cool!",
      "Why not? What do robots eat?",
      "Yes! Have you 'visited'?"
    ]
  },
  {
    id: 6,
    title: "6. Reflection & Exit Ticket",
    hebrewTitle: "סיכום וכרטיס יציאה",
    description: "You've made it! Now reflect on what you learned, write down your exit ticket responses, and download your final conversation portfolio.",
    guidelines: "הגעתם לשלב הסיכום. מלאו את כרטיס היציאה (דבר אחד שלמדתם ו-3 שאלות לחבר לעט) למטה כדי לסיים ולקבל סיכום מעוצב להגשה.",
    starters: []
  }
];

export default function ChatMastersPage() {
  const { user, signInWithGoogle } = useAuth();
  const isTeacher = user && (user.email === "niroari@gmail.com" || user.email === "nirozari@gmail.com");
  
  // App states
  const [comfortMode, setComfortMode] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"setup" | "chat" | "finished">("setup");
  
  // Setup inputs
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [selectedChar, setSelectedChar] = useState<Character>(CHARACTERS[0]);
  const [customCharName, setCustomCharName] = useState("");
  
  // Chat states
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentGuideStep, setCurrentGuideStep] = useState(1);
  const [completedPhases, setCompletedPhases] = useState<boolean[]>([false, false, false, false, false, false]);

  // Assignment states
  const [isAssignmentMode, setIsAssignmentMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingAssignment, setExistingAssignment] = useState<any>(null);
  const [loadingExisting, setLoadingExisting] = useState(false);
  
  // Translation helper states
  const [hebrewInput, setHebrewInput] = useState("");
  const [translationResult, setTranslationResult] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Exit ticket states
  const [exitTicketLearned, setExitTicketLearned] = useState("");
  const [exitTicketPenPal, setExitTicketPenPal] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Load theme preference and set user name
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("teaching-site-comfort-mode");
    if (savedTheme === "light" || savedTheme === "dark") {
      setComfortMode(savedTheme);
    }
    if (user?.displayName) {
      setStudentName(user.displayName);
    } else if (user?.email) {
      setStudentName(user.email.split("@")[0]);
    }
  }, [user]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Check for existing assignment
  useEffect(() => {
    if (!user) {
      setExistingAssignment(null);
      return;
    }

    const checkExisting = async () => {
      setLoadingExisting(true);
      
      // Create a 3-second query timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Query timeout")), 3000)
      );

      try {
        const q = query(
          collection(dbFirestore, "chat_assignments"),
          where("studentId", "==", user.uid)
        );
        
        // Race the getDocs call against the 3-second timeout
        const querySnapshot = await Promise.race([
          getDocs(q),
          timeoutPromise
        ]) as any;

        if (querySnapshot && !querySnapshot.empty) {
          const docs = querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
          // Sort client-side by submittedAt desc to avoid requiring composite indexes
          docs.sort((a: any, b: any) => {
            const timeA = a.submittedAt?.seconds || 0;
            const timeB = b.submittedAt?.seconds || 0;
            return timeB - timeA;
          });
          const latest = docs[0];
          setExistingAssignment(latest);

          // Listen for real-time updates on this specific document
          const docRef = doc(dbFirestore, "chat_assignments", latest.id);
          const unsubscribe = onSnapshot(docRef, (snapshot) => {
            if (snapshot.exists()) {
              const updatedData = snapshot.data();
              setExistingAssignment({ id: snapshot.id, ...updatedData });
              
              // Sync student fields if they already submitted
              if (updatedData.exitTicketLearned) setExitTicketLearned(updatedData.exitTicketLearned);
              if (updatedData.exitTicketPenPal) setExitTicketPenPal(updatedData.exitTicketPenPal);
              if (updatedData.character) {
                const charObj = CHARACTERS.find(c => c.id === updatedData.character);
                if (charObj) setSelectedChar(charObj);
              }
              if (updatedData.studentClass) setStudentClass(updatedData.studentClass);
              if (updatedData.studentName) setStudentName(updatedData.studentName);
              if (updatedData.customCharacterName) setCustomCharName(updatedData.customCharacterName);
              if (updatedData.messages) {
                setMessages(updatedData.messages.map((m: any) => ({
                  sender: m.sender,
                  text: m.text,
                  timestamp: new Date(m.timestamp)
                })));
              }
            }
          });
          unsubscribeRef.current = unsubscribe;
        }
      } catch (err) {
        console.warn("Error or timeout checking existing assignment:", err);
      } finally {
        setLoadingExisting(false);
      }
    };

    checkExisting();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [user]);

  // Heuristic Phase Detector
  useEffect(() => {
    if (messages.length === 0) return;

    // Filter user messages
    const userMsgs = messages.filter((m) => m.sender === "user");
    if (userMsgs.length === 0) return;

    const lastUserMsg = userMsgs[userMsgs.length - 1].text.toLowerCase();

    setCompletedPhases((prev) => {
      const next = [...prev];
      let updated = false;

      // Phase 1: Greeting & Intro
      if (!next[0]) {
        const hasGreeting = /\b(hi|hello|hey|greetings|howdy)\b/i.test(lastUserMsg);
        const hasIntro = /\b(i'm|i am|my name|name is|from israel|live in|old)\b/i.test(lastUserMsg);
        if (hasGreeting || hasIntro || userMsgs.length >= 1) {
          next[0] = true;
          updated = true;
        }
      }

      // Phase 2: Share Likes
      if (next[0] && !next[1]) {
        const hasLikes = /\b(like|don't like|dislike|love|hate|favorite|prefer|enjoy)\b/i.test(lastUserMsg);
        if (hasLikes) {
          next[1] = true;
          updated = true;
        }
      }

      // Phase 3: Ask AI Questions
      if (next[1] && !next[2]) {
        const hasQuestion = lastUserMsg.includes("?") || /\b(what|do you|are you|how|why|who|can you|tell me)\b/i.test(lastUserMsg);
        if (hasQuestion) {
          next[2] = true;
          updated = true;
        }
      }

      // Phase 4: Share Hobbies & Routines
      if (next[2] && !next[3]) {
        const hasRoutines = /\b(play|hobby|hobbies|draw|read|wake|routine|school|soccer|basketball|game|minecraft|music|watch)\b/i.test(lastUserMsg);
        if (hasRoutines) {
          next[3] = true;
          updated = true;
        }
      }

      // Phase 5: Response to AI/Active conversation
      if (next[3] && !next[4]) {
        if (userMsgs.length >= 5) {
          next[4] = true;
          updated = true;
        }
      }

      if (updated) {
        // Auto-advance stepper to first uncompleted phase
        const firstUncompleted = next.findIndex((val) => !val);
        if (firstUncompleted !== -1) {
          setCurrentGuideStep(firstUncompleted + 1);
        } else {
          setCurrentGuideStep(6);
        }
        return next;
      }
      return prev;
    });
  }, [messages]);

  const toggleTheme = () => {
    const nextTheme = comfortMode === "dark" ? "light" : "dark";
    setComfortMode(nextTheme);
    localStorage.setItem("teaching-site-comfort-mode", nextTheme);
  };

  const isLight = comfortMode === "light";

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

  const handleStartChat = () => {
    if (!studentName.trim()) {
      alert("אנא הקלידו שם לפני שנתחיל!");
      return;
    }
    
    if (isAssignmentMode) {
      if (!user) {
        alert("אנא התחברו למערכת כדי להתחיל את הפעילות כמשימה להגשה!");
        return;
      }
      if (!studentClass.trim()) {
        alert("אנא הקלידו את כיתתכם (לדוגמה: ז׳1, ז׳3) כדי להתחיל את המשימה להגשה!");
        return;
      }
    }

    if (selectedChar.id === "custom" && !customCharName.trim()) {
      alert("אנא הקלידו את שם הדמות שתרצו לשוחח איתה!");
      return;
    }
    
    // Set initial message
    setMessages([
      {
        sender: "bot",
        text: selectedChar.id === "custom"
          ? `Hi! I am ${customCharName.trim()}. It's great to meet you! How are you today? Let's talk English!`
          : selectedChar.greeting,
        timestamp: new Date()
      }
    ]);
    setStep("chat");
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: inputText.trim(),
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const chatHistory = [...messages, userMsg];
      
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          character: selectedChar.id,
          studentName: studentName.trim(),
          messages: chatHistory,
          currentGuideStep: currentGuideStep,
          customCharacterName: selectedChar.id === "custom" ? customCharName.trim() : undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.text) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.text,
            timestamp: new Date()
          }
        ]);
        
        // Auto-advance guide step on successful turns (up to step 5)
        if (currentGuideStep < 5 && messages.length >= currentGuideStep * 2) {
          // Subtle progress suggestion
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `Oh, I didn't catch that. Could you say it again? (סליחה, לא הבנתי, תוכלי/תוכל לכתוב שוב?)`,
            timestamp: new Date()
          }
        ]);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Sorry, my connection is a bit slow. Let's try again! (אופס, החיבור שלי מעט איטי. בואו ננסה שוב!)`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTranslate = async () => {
    if (!hebrewInput.trim()) return;
    setIsTranslating(true);
    setTranslationResult("");

    try {
      // We will make a tiny call to the chat API with a specific system instruction to translate
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          character: "default",
          studentName: "helper",
          messages: [
            {
              sender: "user",
              text: `Translate the following Hebrew word or short phrase into clear English suitable for writing a chat message. Return ONLY the English translation, no other text or explanation. Hebrew: "${hebrewInput.trim()}"`
            }
          ]
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.text) {
        // Strip any quotes or periods if Gemini added them
        let cleanText = data.text.trim();
        if (cleanText.startsWith('"') && cleanText.endsWith('"')) {
          cleanText = cleanText.substring(1, cleanText.length - 1);
        }
        setTranslationResult(cleanText);
      } else {
        setTranslationResult("Error translating.");
      }
    } catch (err) {
      console.error(err);
      setTranslationResult("Error translating.");
    } finally {
      setIsTranslating(false);
    }
  };


  const handleFinishActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exitTicketLearned.trim() || !exitTicketPenPal.trim()) {
      alert("אנא מלאו את שני חלקי כרטיס היציאה לפני הסיום!");
      return;
    }

    if (isAssignmentMode) {
      if (!user) {
        alert("עלייך להתחבר למערכת כדי להגיש את המשימה.");
        return;
      }
      setIsSubmitting(true);
      try {
        const docRef = await addDoc(collection(dbFirestore, "chat_assignments"), {
          studentId: user.uid,
          studentName: studentName.trim(),
          studentClass: studentClass.trim(),
          studentEmail: user.email || "",
          character: selectedChar.id,
          customCharacterName: selectedChar.id === "custom" ? customCharName.trim() : undefined,
          messages: messages.map(m => ({
            sender: m.sender,
            text: m.text,
            timestamp: m.timestamp.toISOString()
          })),
          exitTicketLearned: exitTicketLearned.trim(),
          exitTicketPenPal: exitTicketPenPal.trim(),
          submittedAt: serverTimestamp(),
          status: "submitted",
          score: null,
          feedback: null
        });

        // Set up real-time listener for this new assignment
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
          if (snapshot.exists()) {
            setExistingAssignment({ id: snapshot.id, ...snapshot.data() });
          }
        });
      } catch (err) {
        console.error("Error submitting assignment:", err);
        alert("אירעה שגיאה בשליחת המשימה. אנא נסו שוב.");
        setIsSubmitting(false);
        return;
      } finally {
        setIsSubmitting(false);
      }
    }

    setStep("finished");
    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleDownloadTranscript = () => {
    const formattedTranscript = messages.map(msg => {
      const name = msg.sender === "user" ? studentName : (selectedChar.id === "custom" ? customCharName : selectedChar.englishName);
      return `[${msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}] ${name}: ${msg.text}`;
    }).join("\n");

    const reportContent = `==================================================
PORTFOLIO SUMMARY: CHAT WITH AN AI FRIEND (CHAT MASTERS)
==================================================
Student Name: ${studentName}
Chat Partner: ${selectedChar.id === "custom" ? customCharName : selectedChar.name} (${selectedChar.id === "custom" ? "Custom Figure" : selectedChar.englishName})
Date: ${new Date().toLocaleDateString("he-IL")}

--------------------------------------------------
EXIT TICKET (כרטיס יציאה)
--------------------------------------------------
1. One thing I learned from AI (דבר אחד שלמדתי):
   ${exitTicketLearned}

2. 3 questions for a real pen pal (3 שאלות לחבר לעט):
   ${exitTicketPenPal}

--------------------------------------------------
CONVERSATION TRANSCRIPT (תמלול השיחה)
--------------------------------------------------
${formattedTranscript}
==================================================`;

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Chat_Masters_Report_${studentName.replace(/\s+/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!mounted) return null;

  return (
    <div className={`relative min-h-screen ${bgTheme} ${textBody} flex flex-col justify-between overflow-x-hidden transition-colors duration-300`}>
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Top Navbar */}
      <header className={`w-full max-w-6xl mx-auto px-6 pt-6 flex justify-between items-center relative z-20`}>
        <Link
          href="/english"
          className={`inline-flex items-center gap-2 text-sm ${isLight ? "text-zinc-500 hover:text-zinc-800" : "text-text-muted hover:text-english"} transition-colors`}
        >
          <span>→ חזרה לדף אנגלית</span>
        </Link>
        
        <div className="flex items-center gap-3">
          {isTeacher && (
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>לוח מורה</span>
            </Link>
          )}
          {/* Toggle Theme Button */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl border ${borderStyle} ${isLight ? "bg-white hover:bg-zinc-100" : "bg-[#0f1526]/80 hover:bg-[#161d35]"} transition-colors duration-200`}
            title="Comfort Reading Mode (שינוי ניגודיות/צבע)"
          >
            {isLight ? <Moon className="w-4 h-4 text-purple-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* Main Page Layout */}
      <main className="w-full max-w-6xl mx-auto px-6 py-8 flex-1 flex flex-col z-10">
        
        {/* Setup Screen (Step 0) */}
        {step === "setup" && (
          <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full py-6">
            
            {/* Badge & Title */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm font-bold text-purple-400 mb-4">
                <Sparkles className="w-4 h-4" />
                <span>פרויקט דיגיטלי אינטראקטיבי</span>
              </div>
              <h1 className={`text-4xl md:text-5xl font-black ${textTitle} tracking-tight`}>
                Chat Masters: שיחה עם חבר AI
              </h1>
              <p className={`text-sm mt-3 ${textMuted} max-w-lg mx-auto leading-relaxed`}>
                בואו נשוחח באנגלית עם דמות בינה מלאכותית שתבחרו! הפעילות מיועדת לתרגול שיחה יומיומית, למידת אוצר מילים ובניית ביטחון, בסביבה תומכת וללא לחץ.
              </p>
            </div>

            {/* Config Card / Status Check */}
            {loadingExisting ? (
              <div className={`w-full p-12 rounded-2xl ${cardStyle} border ${borderStyle} flex flex-col items-center justify-center space-y-4`}>
                <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
                <span className={`text-xs ${textMuted}`}>בודק הגשות קודמות...</span>
              </div>
            ) : existingAssignment ? (
              /* If there is an existing submission, show status card */
              <div className={`w-full p-8 rounded-2xl ${cardStyle} border ${borderStyle} text-right space-y-6 shadow-xl`}>
                <div className="border-b border-purple-500/10 pb-4">
                  <h3 className={`text-lg font-bold text-purple-400`}>המשימה שלך הוגשה!</h3>
                  <p className={`text-xs mt-1 ${textMuted}`}>
                    הגשת את השיחה עם {CHARACTERS.find(c => c.id === existingAssignment.character)?.name || existingAssignment.character} ב-
                    {existingAssignment.submittedAt ? new Date(existingAssignment.submittedAt.seconds * 1000).toLocaleString("he-IL") : ""}
                  </p>
                </div>

                {existingAssignment.status === "graded" ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-emerald-400">ציון: {existingAssignment.score} / 100</span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">נבדק על ידי המורה</span>
                    </div>
                    {existingAssignment.feedback && (
                      <div className="mt-2 text-xs leading-relaxed text-slate-200">
                        <span className="font-bold block text-emerald-400">משוב מהמורה:</span>
                        <p className="mt-1 whitespace-pre-wrap">{existingAssignment.feedback}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between flex-row-reverse">
                    <div className="text-right">
                      <span className="text-sm font-bold text-amber-400 block font-sans">המשימה הוגשה וממתינה לבדיקה</span>
                      <span className="text-xs text-amber-300/80">המורה יבדוק ויתן ציון בקרוב. תוכלו לצפות בשיחה שהוגשה.</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <button
                    onClick={() => {
                      setIsAssignmentMode(true);
                      setStep("finished");
                    }}
                    className="py-3.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <span>צפייה בשיחה שהוגשה</span>
                  </button>

                  <button
                    onClick={() => {
                      // Allow re-practicing by clearing local messages but NOT deleting the submission
                      setMessages([
                        {
                          sender: "bot",
                          text: selectedChar.greeting,
                          timestamp: new Date()
                        }
                      ]);
                      setCompletedPhases([false, false, false, false, false, false]);
                      setCurrentGuideStep(1);
                      setIsAssignmentMode(false); // Disable assignment mode for self-practice
                      setExistingAssignment(null); // Clear local reference so they can configure
                      setStep("setup");
                    }}
                    className={`py-3.5 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400 text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-2`}
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>תרגול מחדש (ללא הגשה)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Config Card */
              <div className={`w-full p-8 rounded-2xl ${cardStyle} border ${borderStyle} space-y-8`}>
                
                {/* Name Input */}
                <div className="space-y-3">
                  <label className={`block text-sm font-bold ${textTitle} text-right`}>
                    הקלידו את שמכם (באנגלית או בעברית):
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-4 flex items-center text-text-muted">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="לדוגמה: נועם / Noam"
                      className={`w-full pr-12 pl-4 py-3 rounded-xl border outline-none text-right transition-all font-bold ${inputStyle}`}
                    />
                  </div>
                </div>

                {/* Class Input (Only if Assignment Mode is enabled) */}
                {isAssignmentMode && (
                  <div className="space-y-3">
                    <label className={`block text-sm font-bold ${textTitle} text-right`}>
                      הכיתה שלך (לדוגמה: ז׳1, ז׳3, ח׳2):
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        placeholder="הקלידו כיתה..."
                        className={`w-full px-4 py-3 rounded-xl border outline-none text-right transition-all font-bold ${inputStyle}`}
                        required={isAssignmentMode}
                      />
                    </div>
                  </div>
                )}

                {/* Character Selector */}
                <div className="space-y-4">
                  <label className={`block text-sm font-bold ${textTitle} text-right`}>
                    בחרו את החבר/ה לשיחה (AI Friend):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {CHARACTERS.map((char) => {
                      const isSelected = selectedChar.id === char.id;
                      return (
                        <button
                          key={char.id}
                          onClick={() => setSelectedChar(char)}
                          className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between min-h-[140px] hover:scale-[1.02] cursor-pointer ${
                            isSelected 
                              ? `border-purple-500 ring-2 ring-purple-500/20 bg-purple-500/5` 
                              : `${borderStyle} ${isLight ? "bg-white hover:bg-zinc-50" : "bg-[#0b0f19] hover:bg-[#111727]"}`
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="text-3xl">{char.avatar}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${char.themeColor} font-bold`}>
                              {char.englishName}
                            </span>
                          </div>
                          <div className="mt-3">
                            <h3 className={`text-sm font-bold ${isSelected ? "text-purple-400" : textTitle}`}>
                              {char.name}
                            </h3>
                            <p className={`text-xs mt-1 leading-normal ${textMuted}`}>
                              {char.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Character Details Input */}
                {selectedChar.id === "custom" && (
                  <div className="space-y-3 pt-2">
                    <label className={`block text-sm font-bold ${textTitle} text-right`}>
                      שם הדמות המוכרת שתרצו לדבר איתה (באנגלית או בעברית):
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customCharName}
                        onChange={(e) => setCustomCharName(e.target.value)}
                        placeholder="לדוגמה: Albert Einstein, Taylor Swift, Lionel Messi, Harry Potter..."
                        className={`w-full px-4 py-3 rounded-xl border outline-none text-right transition-all font-bold ${inputStyle}`}
                        required={selectedChar.id === "custom"}
                      />
                    </div>
                    <p className={`text-[10px] ${textMuted} text-right leading-relaxed`}>
                      הערה: ה-AI ייכנס לדמות זו וידבר איתכם כאילו הוא הדמות שבחרתם!
                    </p>
                  </div>
                )}

                {/* Assignment Mode Toggle */}
                <div className={`p-4 rounded-xl border ${borderStyle} ${isLight ? "bg-zinc-50" : "bg-[#0b0f19]/30"} space-y-3`}>
                  <div className="flex items-center justify-between flex-row-reverse">
                    <label className={`text-sm font-bold ${textTitle} flex items-center gap-2 cursor-pointer select-none`}>
                      <input 
                        type="checkbox"
                        checked={isAssignmentMode}
                        onChange={(e) => setIsAssignmentMode(e.target.checked)}
                        className="w-4.5 h-4.5 rounded border-zinc-300 text-purple-600 focus:ring-purple-500 accent-purple-600"
                      />
                      <span>הפיכת הפעילות למשימה להגשה (מצב משימה)</span>
                    </label>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold">
                      אופציונלי
                    </span>
                  </div>
                  
                  {isAssignmentMode && (
                    <div className="pt-2 text-right">
                      {user ? (
                        <div className="text-xs text-emerald-400 font-medium flex items-center justify-end gap-1.5">
                          <span>מחובר/ת כעת בתור: <b>{user.displayName || user.email}</b>. המשימה תישמר תחת חשבון זה.</span>
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg space-y-2">
                          <p className="text-xs text-amber-300">
                            כדי שתוכלו להגיש את המשימה למורה ושהציון יישמר, עליכם להתחבר תחילה.
                          </p>
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
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 mr-auto"
                          >
                            <span>התחברות עם Google</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Instructions Summary */}
                <div className={`p-4 rounded-xl text-right text-xs leading-relaxed ${isLight ? "bg-zinc-100/50 text-zinc-600" : "bg-surface-hover/40 text-text-muted"} border ${borderStyle}`}>
                  <p className="font-bold text-purple-400 mb-1">איך הפעילות עובדת?</p>
                  <ul className="list-disc pr-4 space-y-1">
                    <li>בצד שמאל יוצג מדריך השיחה צעד-אחר-צעד, כולל הצעות למשפטי פתיחה ודוגמאות.</li>
                    <li>בצד ימין תוכלו להתכתב עם החבר הדיגיטלי שלכם, שמתאים את עצמו לקצב שלכם.</li>
                    <li>אם תצטרכו עזרה בתרגום מילים מעברית לאנגלית, תוכלו להשתמש בעוזר התרגום המובנה!</li>
                    <li>בסיום השיחה, תמלאו כרטיס סיכום קצר ותורידו קובץ מעוצב עם השיחה שלכם להגשה למורה.</li>
                  </ul>
                </div>

                {/* Start Button */}
                <button
                  onClick={handleStartChat}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl cursor-pointer shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 text-base"
                >
                  <span>בואו נתחיל לדבר!</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>

              </div>
            )}
          </div>
        )}

        {/* Interactive Main Layout (Step 1: Chat and Stepper) */}
        {step === "chat" && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[600px] py-4">
            
            {/* LEFT COLUMN: Adventure Stepper Guide (Columns: 5 on lg) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className={`p-6 rounded-2xl ${cardStyle} border ${borderStyle} flex-1 flex flex-col justify-between overflow-hidden relative`}>
                
                {/* Stepper Progress bar */}
                <div className="w-full mb-6">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-purple-400">שלב {currentGuideStep} מתוך 6</span>
                    <span className={textTitle}>התקדמות המשימה</span>
                  </div>
                  <div className="w-full h-2 bg-purple-950/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-300 rounded-full" 
                      style={{ width: `${(currentGuideStep / 6) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Main Stepper Content Area */}
                <div className="flex-1 flex flex-col justify-start text-right overflow-y-auto pr-1">
                  
                  {/* Step Title */}
                  <div className="border-b border-purple-500/10 pb-4 mb-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400">
                      {GUIDE_STEPS[currentGuideStep - 1].title}
                    </span>
                    <h2 className={`text-xl font-bold ${textTitle} mt-2 flex items-center justify-end gap-2`}>
                      {completedPhases[currentGuideStep - 1] && (
                        <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                      )}
                      <span>{GUIDE_STEPS[currentGuideStep - 1].hebrewTitle}</span>
                    </h2>
                  </div>

                  {/* Step Descriptions */}
                  <div className="space-y-4">
                    <p className={`text-sm leading-relaxed ${textBody}`}>
                      {GUIDE_STEPS[currentGuideStep - 1].description}
                    </p>
                    <p className="text-xs font-semibold text-purple-400 bg-purple-500/5 p-3 rounded-lg border border-purple-500/10">
                      💡 {GUIDE_STEPS[currentGuideStep - 1].guidelines}
                    </p>
                  </div>

                  {/* Conversational Starters (if step < 6) */}
                  {GUIDE_STEPS[currentGuideStep - 1].starters.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <h4 className={`text-xs font-bold ${textTitle} border-r-2 border-purple-500 pr-2 mb-2`}>
                        רעיונות למשפטים באנגלית:
                      </h4>
                      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pl-1 pr-0.5">
                        {GUIDE_STEPS[currentGuideStep - 1].starters.map((starter, sIdx) => {
                          return (
                            <div 
                              key={sIdx} 
                              className={`p-3 rounded-xl border flex items-center gap-3 transition-colors text-xs font-mono select-none ${
                                isLight 
                                  ? "bg-zinc-50 border-zinc-200 text-zinc-800" 
                                  : "bg-surface border-border-custom text-zinc-100"
                              }`}
                              dir="ltr"
                            >
                              <span className="block flex-1 text-left break-words select-none">
                                {starter}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Exit Ticket Form inside Step 6 */}
                  {currentGuideStep === 6 && (
                    <form onSubmit={handleFinishActivity} className="mt-6 space-y-5 text-right">
                      <div className="space-y-2">
                        <label className={`block text-xs font-bold ${textTitle}`}>
                          1. דבר אחד שלמדתי מהשיחה עם ה-AI (באנגלית או עברית):
                        </label>
                        <textarea
                          value={exitTicketLearned}
                          onChange={(e) => setExitTicketLearned(e.target.value)}
                          placeholder="לדוגמה: למדתי איך לשאול על סדר יום, או מילה חדשה כמו astronaut..."
                          className={`w-full p-3 rounded-xl border outline-none text-right text-xs transition-all ${inputStyle} min-h-[70px]`}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className={`block text-xs font-bold ${textTitle}`}>
                          2. שלוש שאלות שהייתי רוצה לשאול חבר/ה לעט אמיתי מחו״ל:
                        </label>
                        <textarea
                          value={exitTicketPenPal}
                          onChange={(e) => setExitTicketPenPal(e.target.value)}
                          placeholder="כתבו 3 שאלות באנגלית, לדוגמה:
1. What do you like to do for fun?
2. Do you have pets?
3. What is your favorite school subject?"
                          className={`w-full p-3 rounded-xl border outline-none text-left text-xs transition-all ${inputStyle} min-h-[90px]`}
                          dir="ltr"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 text-white font-bold rounded-xl cursor-pointer shadow-lg transition-all flex items-center justify-center gap-1.5 text-xs ${
                          isSubmitting 
                            ? "bg-zinc-700 cursor-not-allowed opacity-50"
                            : isAssignmentMode
                              ? "bg-purple-600 hover:bg-purple-500 shadow-purple-500/25"
                              : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25"
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>מגיש משימה...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>{isAssignmentMode ? "הגשת משימה לבדיקת המורה" : "סיום והורדת סיכום שיחה!"}</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}

                </div>

                {/* Step Navigation Controls */}
                <div className={`mt-6 pt-4 border-t ${borderStyle} flex justify-between items-center w-full`}>
                  <button
                    disabled={currentGuideStep === 6}
                    onClick={() => setCurrentGuideStep((prev) => Math.min(prev + 1, 6))}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      currentGuideStep === 6 
                        ? "opacity-50 cursor-not-allowed bg-zinc-800 text-zinc-500" 
                        : "bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/10"
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>שלב הבא</span>
                  </button>

                  <div className={`text-xs font-bold ${textMuted}`}>
                    {currentGuideStep} / 6
                  </div>

                  <button
                    disabled={currentGuideStep === 1}
                    onClick={() => setCurrentGuideStep((prev) => Math.max(prev - 1, 1))}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      currentGuideStep === 1 
                        ? "opacity-40 cursor-not-allowed" 
                        : `${isLight ? "bg-zinc-200 hover:bg-zinc-300 text-zinc-800" : "bg-surface-hover hover:bg-surface text-white"}`
                    }`}
                  >
                    <span>שלב הקודם</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Chat Client (Columns: 7 on lg) */}
            <div className="lg:col-span-7 flex flex-col justify-between h-[650px] lg:h-auto">
              <div className={`rounded-2xl ${cardStyle} border ${borderStyle} flex-1 flex flex-col justify-between overflow-hidden shadow-2xl`}>
                
                {/* Chat Header */}
                <div className={`px-6 py-4 border-b ${borderStyle} flex items-center gap-3 justify-between ${
                  isLight ? "bg-zinc-50" : "bg-[#0b0f19]/70"
                }`}>
                  {/* Info Button or character detail */}
                  <div className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${selectedChar.themeColor}`}>
                    <span>{selectedChar.id === "custom" ? customCharName : selectedChar.englishName} is online</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  </div>

                  {/* Character Avatar & Title */}
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <h3 className={`text-sm font-bold ${textTitle}`}>
                        {selectedChar.id === "custom" ? customCharName : selectedChar.name}
                      </h3>
                      <p className={`text-[10px] ${textMuted}`}>
                        {selectedChar.id === "custom" ? "Custom Figure" : selectedChar.englishName} (AI Friend)
                      </p>
                    </div>
                    <span className="text-3xl shrink-0 p-1 bg-surface-hover rounded-xl border border-border-custom-hover">
                      {selectedChar.avatar}
                    </span>
                  </div>
                </div>

                {/* Current Active Goal Banner */}
                <div className={`px-6 py-2.5 border-b ${borderStyle} flex flex-col sm:flex-row gap-2 items-center justify-between text-xs bg-purple-500/5`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                    <span className="font-semibold text-purple-300">
                      🎯 היעד הנוכחי: {GUIDE_STEPS[currentGuideStep - 1].hebrewTitle}
                    </span>
                  </div>
                  <div className="flex gap-1" dir="ltr">
                    {[1, 2, 3, 4, 5, 6].map((num) => {
                      const isCompleted = completedPhases[num - 1];
                      const isActive = currentGuideStep === num;
                      return (
                        <span 
                          key={num} 
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                            isCompleted 
                              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" 
                              : isActive
                                ? "bg-purple-500/20 border-purple-500/40 text-purple-400 animate-pulse font-extrabold"
                                : "bg-zinc-800/40 border-zinc-700/30 text-zinc-500"
                          }`}
                          title={GUIDE_STEPS[num - 1].hebrewTitle}
                        >
                          {isCompleted ? "✓" : num}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Messages Panel */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-[300px]">
                  {messages.map((msg, index) => {
                    const isUser = msg.sender === "user";
                    return (
                      <div
                        key={index}
                        className={`flex w-full ${isUser ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            isUser
                              ? "bg-purple-600 text-white rounded-tl-none font-medium shadow-md shadow-purple-500/10"
                              : isLight
                                ? "bg-white border border-zinc-200 text-zinc-900 rounded-tr-none shadow-sm"
                                : "bg-surface border border-border-custom text-[#e8edf8] rounded-tr-none shadow-md shadow-black/10"
                          }`}
                          dir="ltr"
                        >
                          {/* Sender name for context */}
                          <div className={`text-[10px] mb-1 font-bold ${isUser ? "text-purple-200" : "text-purple-400"}`}>
                            {isUser ? studentName : (selectedChar.id === "custom" ? customCharName : selectedChar.englishName)}
                          </div>
                          
                          {/* Text content */}
                          <div className="break-words whitespace-pre-wrap font-sans">
                            {msg.text}
                          </div>
                          
                          {/* Timestamp */}
                          <div className={`text-[9px] mt-1.5 text-right ${isUser ? "text-purple-300" : "text-text-muted"}`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex w-full justify-end">
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 rounded-tr-none flex items-center gap-1 bg-surface border border-border-custom text-text-muted shadow-sm`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Translation & Helper Drawer (Above Chat Input) */}
                <div className={`px-6 py-3 border-t ${borderStyle} ${
                  isLight ? "bg-zinc-100/50" : "bg-[#0b0f19]/30"
                } flex flex-col gap-2.5`}>
                  
                  {/* Translate Accordion Header */}
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] text-purple-400 font-mono" dir="ltr">
                      {translationResult ? `English: "${translationResult}"` : ""}
                    </span>
                    <div className="flex items-center gap-1.5 text-right font-bold text-xs text-purple-400">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>עוזר תרגום מעברית לאנגלית</span>
                    </div>
                  </div>

                  {/* Translate Input Fields */}
                  <div className="flex gap-2">
                    <button
                      disabled={isTranslating || !hebrewInput.trim()}
                      onClick={handleTranslate}
                      className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/35 border border-purple-500/20 text-purple-400 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      {isTranslating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "תרגם"}
                    </button>
                    <input
                      type="text"
                      value={hebrewInput}
                      onChange={(e) => setHebrewInput(e.target.value)}
                      placeholder="הקלידו מילה או משפט בעברית..."
                      className={`flex-1 px-4 py-1.5 rounded-xl border outline-none text-right text-xs transition-all ${inputStyle}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleTranslate();
                        }
                      }}
                    />
                  </div>

                  {/* Translation Action button */}
                  {translationResult && (
                    <button
                      onClick={() => {
                        // Append or insert to message input
                        setInputText((prev) => prev ? `${prev} ${translationResult}` : translationResult);
                        setHebrewInput("");
                        setTranslationResult("");
                      }}
                      className="self-end inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>הוסף לתיבת השיחה</span>
                    </button>
                  )}
                </div>

                {/* Chat Input form */}
                <form 
                  onSubmit={handleSendMessage}
                  className={`px-6 py-4 border-t ${borderStyle} flex gap-3 items-center ${
                    isLight ? "bg-zinc-50" : "bg-[#0b0f19]/70"
                  }`}
                >
                  <button
                    type="submit"
                    disabled={isTyping || !inputText.trim()}
                    className={`p-3 rounded-xl cursor-pointer text-white transition-all flex items-center justify-center shrink-0 ${
                      !inputText.trim() || isTyping
                        ? "bg-zinc-800 text-zinc-500 opacity-50 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-500/15"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="כתבו הודעה באנגלית לחבר ה-AI שלכם..."
                    className={`flex-1 px-4 py-3 rounded-xl border outline-none transition-all font-medium text-sm text-left ${inputStyle}`}
                    disabled={isTyping}
                    dir="ltr"
                  />
                </form>

              </div>
            </div>

          </div>
        )}

        {/* Finished / Victory Screen (Step 2) */}
        {step === "finished" && (
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full py-8 text-center">
            
            {/* Victory Badge */}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl inline-flex items-center justify-center text-emerald-400 text-4xl mb-6 shadow-inner animate-bounce">
              🎉
            </div>

            <h1 className={`text-4xl font-black ${textTitle} tracking-tight`}>
              כל הכבוד, Chat Masters!
            </h1>
            <p className={`text-base mt-3 ${textMuted} leading-relaxed max-w-lg`}>
              סיימתם בהצלחה את פעילות הדיבור באנגלית! ניהלתם שיחה שלמה, שיתפתם תחביבים והשלמתם את משימת כרטיס היציאה.
            </p>

            {/* Portfolio Summary Card */}
            <div className={`w-full p-8 rounded-2xl ${cardStyle} border ${borderStyle} text-right space-y-6 mt-8 shadow-xl`}>
              
              <div className="border-b border-purple-500/10 pb-4">
                <h3 className={`text-lg font-bold text-purple-400`}>כרטיס היציאה שלכם:</h3>
                <p className={`text-xs mt-1 ${textMuted}`}>התשובות שנרשמו בתיק העבודות</p>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <span className={`font-bold ${textTitle} block`}>דבר אחד שלמדתי:</span>
                  <p className={`mt-1 text-xs leading-relaxed ${textBody} bg-purple-500/5 p-3 rounded-lg border border-purple-500/10`}>
                    {exitTicketLearned}
                  </p>
                </div>
                
                <div>
                  <span className={`font-bold ${textTitle} block`}>שלוש שאלות לחבר לעט מחו״ל:</span>
                  <p className={`mt-1 text-xs leading-relaxed ${textBody} font-mono bg-purple-500/5 p-3 rounded-lg border border-purple-500/10 text-left whitespace-pre-wrap`} dir="ltr">
                    {exitTicketPenPal}
                  </p>
                </div>

                {isAssignmentMode && (
                  <div className="pt-2 text-right">
                    {existingAssignment && existingAssignment.status === "graded" ? (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-black text-emerald-400">ציון: {existingAssignment.score} / 100</span>
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">נבדק על ידי המורה</span>
                        </div>
                        {existingAssignment.feedback && (
                          <div className="mt-2 text-xs leading-relaxed text-slate-200">
                            <span className="font-bold block text-emerald-400">משוב מהמורה:</span>
                            <p className="mt-1 whitespace-pre-wrap">{existingAssignment.feedback}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between flex-row-reverse">
                        <div className="text-right">
                          <span className="text-sm font-bold text-amber-400 block font-sans">המשימה הוגשה למורה!</span>
                          <span className="text-xs text-amber-300/80">ממתין לבדיקה ומתן ציון. תוכלו לחזור לדף זה בהמשך כדי לראות את הציון שלכם.</span>
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2.5 items-center justify-end text-xs font-bold text-emerald-400">
                  <span>שיחה מלאה הוקלטה בתיקיית הסיכום!</span>
                  <CheckCircle className="w-4 h-4 shrink-0" />
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                
                <button
                  onClick={() => {
                    // Reset to chat again
                    setMessages([
                      {
                        sender: "bot",
                        text: selectedChar.greeting,
                        timestamp: new Date()
                      }
                    ]);
                    setExitTicketLearned("");
                    setExitTicketPenPal("");
                    setCompletedPhases([false, false, false, false, false, false]);
                    setCurrentGuideStep(1);
                    setIsAssignmentMode(false);
                    setExistingAssignment(null);
                    setStep("setup");
                  }}
                  className={`py-3.5 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400 text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-2`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{isAssignmentMode ? "תרגול מחדש (ללא הגשה)" : "שיחה חדשה"}</span>
                </button>

                <button
                  onClick={handleDownloadTranscript}
                  className="py-3.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>הורדת סיכום שיחה וכרטיס יציאה</span>
                </button>

              </div>

            </div>

            {/* Back link */}
            <Link
              href="/english"
              className={`inline-flex items-center gap-2 text-sm mt-8 ${isLight ? "text-zinc-500 hover:text-zinc-800" : "text-text-muted hover:text-english"} transition-colors`}
            >
              <ArrowRight className="w-4 h-4" />
              <span>חזרה לדף הבית של אנגלית</span>
            </Link>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-border-custom text-xs text-text-muted relative z-10 bg-surface/30">
        <span>© {new Date().getFullYear()} ניר עוז-ארי — שיחה עם חבר AI</span>
      </footer>
    </div>
  );
}
