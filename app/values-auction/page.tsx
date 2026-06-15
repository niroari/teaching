"use client";

import React, { useState, useEffect, useRef } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, set, remove, runTransaction } from "firebase/database";
import { Gavel, Users, ClipboardList, Share2, Award, X, Copy, Check, LogOut, ArrowLeft } from "lucide-react";

// Firebase Config
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDMwQXeiDibuy6q0q_emHGAmxB3xSqRVbU",
  authDomain: "values-auction-ed09c.firebaseapp.com",
  databaseURL: "https://values-auction-ed09c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "values-auction-ed09c",
  storageBucket: "values-auction-ed09c.firebasestorage.app",
  messagingSenderId: "157059499738",
  appId: "1:157059499738:web:c1c20c62219f91168b87e3"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApps()[0];
const db = getDatabase(app);

// Default lists
const DEFAULT_STUDENTS = [
  "אלבז אלכס", "בן חמו אביתר", "ג'ונסטון כרמל", "גיא אלום נויה",
  "דוד נתאי", "דוד פור נטע", "דונט אורי", "דלופינו ארי",
  "הורוביץ אביגייל", "הרפז אלון", "ויטונסקי יונתן", "ולד איתי",
  "חבקין אריאל", "חיימוביץ שחר", "כהן אמי", "ליכטר שירה",
  "לסרי חן", "מויאל ריף", "מיכאלי נועה", "סבאן איתמר",
  "סיני אלה", "עוזיאלי יונתן", "עמיחי יואב", "פז אלון",
  "פרימט יובל", "צדקיהו אלונה", "צורף רוני", "רובין ענבר",
  "רחמים רועי", "שגב בן חמו נועם", "שוחט אלון", "שושני בר", "שנרגס עדי"
];

const DEFAULT_VALUES = [
  { id: 0, name: "חברות אמת", desc: "חבר או חברה שאפשר לסמוך עליהם בכל מצב, בשיא הכנות ובלי תנאים.", status: 'pending', winner: null, finalPrice: null, bidCount: 0 },
  { id: 1, name: "הצלחה אקדמית ללא מאמץ", desc: "לקבל 100 בכל המבחנים והעבודות בלי להשקיע דקה של למידה.", status: 'pending', winner: null, finalPrice: null, bidCount: 0 },
  { id: 2, name: "אינטליגנציה רגשית (אמפתיה)", desc: "היכולת להבין תמיד מה אחרים מרגישים ולדעת בדיוק מה לומר להם.", status: 'pending', winner: null, finalPrice: null, bidCount: 0 },
  { id: 3, name: "עושר כלכלי", desc: "חשבון בנק עם מיליון דולר שמאפשר לקנות כל מה שרוצים.", status: 'pending', winner: null, finalPrice: null, bidCount: 0 },
  { id: 4, name: "ביטחון עצמי גבוה", desc: "להרגיש תמיד בנוח עם עצמי, בלי לחשוש ממה שאחרים יגידו או יחשבו.", status: 'pending', winner: null, finalPrice: null, bidCount: 0 },
  { id: 5, name: "השפעה חברתית/פוליטית", desc: "היכולת להוביל שינויים גדולים ולהשפיע על החלטות חשובות במדינה.", status: 'pending', winner: null, finalPrice: null, bidCount: 0 },
  { id: 6, name: "בריאות איתנה", desc: "להבטיח בריאות מושלמת ואריכות ימים לי ולבני המשפחה שלי.", status: 'pending', winner: null, finalPrice: null, bidCount: 0 },
  { id: 7, name: "זמן פנוי אינסופי", desc: 'האפשרות לעשות רק מה שאני אוהב/ת, מתי שאני רוצה, בלי "חובות" ומטלות.', status: 'pending', winner: null, finalPrice: null, bidCount: 0 },
  { id: 8, name: "פופולריות חברתית", desc: "להיות הילד או הילדה הכי מקובלים ואהובים בשכבה ובמדיה החברתית.", status: 'pending', winner: null, finalPrice: null, bidCount: 0 },
  { id: 9, name: "אומץ חברתי", desc: "היכולת לעמוד על שלי ולהשמיע את קולי גם כשהרוב חושב אחרת.", status: 'pending', winner: null, finalPrice: null, bidCount: 0 },
  { id: 10, name: "כישרון יוצא דופן", desc: "להיות הכי טוב/ה בעולם בתחום מסוים (ספורט, מוזיקה, גיימינג וכו').", status: 'pending', winner: null, finalPrice: null, bidCount: 0 },
  { id: 11, name: "משפחה עוטפת", desc: "בית שתמיד מפרגן, מבין ומקבל אותי בדיוק כפי שאני, ללא ביקורת.", status: 'pending', winner: null, finalPrice: null, bidCount: 0 }
];

interface Student {
  name: string;
  budget: number;
  bought: { name: string; price: number }[];
}

interface ValueItem {
  id: number;
  name: string;
  desc: string;
  status: string; // 'pending' | 'active' | 'sold'
  winner: string | null;
  finalPrice: number | null;
  bidCount: number;
}

interface AuctionState {
  valueId: number;
  currentBid: number;
  currentBidderId: number | null;
}

interface LogEntry {
  time: string;
  text: string;
  type: string; // 'info' | 'bid' | 'sold'
}

export default function ValuesAuctionPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Game state
  const [students, setStudents] = useState<Student[]>(() => {
    return DEFAULT_STUDENTS.map(name => ({ name, budget: 1000, bought: [] }));
  });
  const [values, setValues] = useState<ValueItem[]>(DEFAULT_VALUES);
  const [auction, setAuction] = useState<AuctionState | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [joinedStudents, setJoinedStudents] = useState<number>(0);

  // Student specific state
  const [myStudentIdx, setMyStudentIdx] = useState<number | null>(null);
  const [studentBidInput, setStudentBidInput] = useState<string>("");
  const [studentError, setStudentError] = useState<string>("");
  const [sessionNotFound, setSessionNotFound] = useState<boolean>(false);

  // Teacher input state
  const [teacherBidderId, setTeacherBidderId] = useState<string>("");
  const [teacherBidAmount, setTeacherBidAmount] = useState<string>("");
  const [teacherBidError, setTeacherBidError] = useState<string>("");

  // Modals state
  const [showRemoteModal, setShowRemoteModal] = useState<boolean>(false);
  const [showEditStudentsModal, setShowEditStudentsModal] = useState<boolean>(false);
  const [showEditValuesModal, setShowEditValuesModal] = useState<boolean>(false);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Temp editing fields
  const [tempStudentsText, setTempStudentsText] = useState<string>("");
  const [tempValuesList, setTempValuesList] = useState<{ name: string; desc: string; status: string }[]>([]);

  // Helpers
  const fmt = (n: number) => n.toLocaleString('he-IL') + ' ₪';
  const getNow = () => {
    const d = new Date();
    return [d.getHours(), d.getMinutes(), d.getSeconds()].map(x => String(x).padStart(2, '0')).join(':');
  };

  const addLog = (text: string, type: string = 'info') => {
    const newLog = { time: getNow(), text, type };
    setLogs(prev => [newLog, ...prev]);
  };

  // Get URL Params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setSessionId(params.get("session"));
      setRole(params.get("role"));
    }
  }, []);

  // Sync state to Firebase if teacher has an active remote session
  const syncStateToFirebase = (
    currentStudents: Student[],
    currentValues: ValueItem[],
    currentAuction: AuctionState | null
  ) => {
    if (!sessionId || role === 'student') return;
    const auctionToSync = currentAuction
      ? { ...currentAuction, currentBidderId: currentAuction.currentBidderId ?? -1 }
      : null;
    set(ref(db, `sessions/${sessionId}/state`), {
      students: currentStudents,
      values: currentValues,
      auction: auctionToSync
    });
  };

  // Teacher: listen to Firebase
  useEffect(() => {
    if (!sessionId || role === 'student') return;

    // Load initial remote session if it was active
    const stateRef = ref(db, `sessions/${sessionId}/state`);
    onValue(stateRef, (snap) => {
      const state = snap.val();
      if (state) {
        if (state.students) setStudents(state.students);
        if (state.values) setValues(state.values);
        if (state.auction) {
          const rawAuc = state.auction;
          setAuction({
            valueId: rawAuc.valueId,
            currentBid: rawAuc.currentBid,
            currentBidderId: rawAuc.currentBidderId === -1 ? null : rawAuc.currentBidderId
          });
        } else {
          setAuction(null);
        }
      }
    });

    // Listen for student bids
    const pendingRef = ref(db, `sessions/${sessionId}/pendingBid`);
    onValue(pendingRef, (snap) => {
      const bid = snap.val();
      if (!bid) return;
      applyStudentBid(bid.studentIdx, bid.amount);
    });

    // Listen for joined count
    const joinedRef = ref(db, `sessions/${sessionId}/joined`);
    onValue(joinedRef, (snap) => {
      const joined = snap.val() || {};
      setJoinedStudents(Object.keys(joined).length);
    });
  }, [sessionId, role]);

  // Student: listen to Firebase
  useEffect(() => {
    if (!sessionId || role !== 'student') return;

    // Check if session exists and load initial state
    const stateRef = ref(db, `sessions/${sessionId}/state`);
    onValue(stateRef, (snap) => {
      const state = snap.val();
      if (!state) {
        setSessionNotFound(true);
        return;
      }
      setSessionNotFound(false);
      if (state.students) setStudents(state.students);
      if (state.values) setValues(state.values);
      if (state.auction) {
        const rawAuc = state.auction;
        setAuction({
          valueId: rawAuc.valueId,
          currentBid: rawAuc.currentBid,
          currentBidderId: rawAuc.currentBidderId === -1 ? null : rawAuc.currentBidderId
        });
      } else {
        setAuction(null);
      }
    });

    // Auto-login if previously joined
    const savedIdx = localStorage.getItem('student_idx_' + sessionId);
    if (savedIdx !== null) {
      setMyStudentIdx(parseInt(savedIdx));
    }
  }, [sessionId, role]);

  // Handle student bid submission (atomic transaction)
  const submitStudentBid = () => {
    setStudentError("");
    const amount = parseInt(studentBidInput);
    if (isNaN(amount) || amount <= 0) {
      setStudentError("יש להזין סכום תקין.");
      return;
    }
    if (myStudentIdx === null || !sessionId) return;

    const currentMe = students[myStudentIdx];
    if (!auction) {
      setStudentError("אין מכירה פעילה כרגע.");
      return;
    }
    if (auction.currentBidderId === myStudentIdx) {
      setStudentError("אתה כבר מוביל!");
      return;
    }
    if (amount <= auction.currentBid) {
      setStudentError(`ההצעה חייבת להיות מעל ${fmt(auction.currentBid)}.`);
      return;
    }
    if (amount > currentMe.budget) {
      setStudentError(`אין לך מספיק כסף (יתרה: ${fmt(currentMe.budget)}).`);
      return;
    }

    // Submit bid atomically
    const pendingRef = ref(db, `sessions/${sessionId}/pendingBid`);
    runTransaction(pendingRef, (currentData) => {
      if (currentData !== null) return; // Abort if another transaction is in flight
      return { studentIdx: myStudentIdx, amount };
    }).then((result) => {
      if (!result.committed) {
        setStudentError("הצעה אחרת בתהליך — נסה שנית.");
      } else {
        setStudentBidInput("");
      }
    });
  };

  const applyStudentBid = (studentIdx: number, amount: number) => {
    setAuction(prev => {
      if (!prev) return null;
      if (prev.currentBidderId === studentIdx) return prev;
      if (amount <= prev.currentBid) return prev;

      setStudents(prevStudents => {
        if (studentIdx < 0 || studentIdx >= prevStudents.length) return prevStudents;
        if (amount > prevStudents[studentIdx].budget) return prevStudents;

        const updatedStudents = [...prevStudents];
        // Log bid action
        addLog(`💰 <strong>${updatedStudents[studentIdx].name}</strong> הציע ${fmt(amount)} (מרחוק) על <strong>${values[prev.valueId].name}</strong>`, 'bid');

        // Update values bid count
        setValues(prevValues => {
          const updatedValues = [...prevValues];
          updatedValues[prev.valueId] = {
            ...updatedValues[prev.valueId],
            bidCount: updatedValues[prev.valueId].bidCount + 1
          };
          syncStateToFirebase(updatedStudents, updatedValues, { ...prev, currentBid: amount, currentBidderId: studentIdx });
          return updatedValues;
        });

        return updatedStudents;
      });

      // Clear pending bid from Firebase
      if (sessionId) {
        remove(ref(db, `sessions/${sessionId}/pendingBid`));
      }

      return {
        ...prev,
        currentBid: amount,
        currentBidderId: studentIdx
      };
    });
  };

  // Student joining
  const handleJoinAsStudent = (idx: number) => {
    if (isNaN(idx) || !sessionId) return;
    setMyStudentIdx(idx);
    localStorage.setItem('student_idx_' + sessionId, String(idx));
    set(ref(db, `sessions/${sessionId}/joined/${idx}`), true);
  };

  // Teacher actions
  const startAuction = (valueId: number) => {
    if (auction) {
      alert('יש מכירה פעילה — סגור אותה קודם.');
      return;
    }
    const newAuction = { valueId, currentBid: 0, currentBidderId: null };
    setAuction(newAuction);

    const updatedValues = [...values];
    updatedValues[valueId] = { ...updatedValues[valueId], status: 'active' };
    setValues(updatedValues);

    addLog(`📢 <strong>${updatedValues[valueId].name}</strong> — נפתחה למכירה!`, 'info');
    syncStateToFirebase(students, updatedValues, newAuction);
  };

  const handleTeacherPlaceBid = () => {
    setTeacherBidError("");
    if (!auction) return;
    if (teacherBidderId === "") {
      setTeacherBidError("יש לבחור תלמיד.");
      return;
    }
    const idx = parseInt(teacherBidderId);
    const amount = parseInt(teacherBidAmount);

    if (auction.currentBidderId === idx) {
      setTeacherBidError(`${students[idx].name} כבר מוביל — לא ניתן להגיש הצעה נגד עצמך.`);
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setTeacherBidError("יש להזין סכום תקין.");
      return;
    }
    if (amount <= auction.currentBid) {
      setTeacherBidError(`הסכום חייב להיות מעל ההצעה הנוכחית (${fmt(auction.currentBid)}).`);
      return;
    }
    if (amount > students[idx].budget) {
      setTeacherBidError(`${students[idx].name} אין מספיק כסף (יתרה: ${fmt(students[idx].budget)}).`);
      return;
    }

    const newAuction = { ...auction, currentBid: amount, currentBidderId: idx };
    setAuction(newAuction);

    const updatedValues = [...values];
    updatedValues[auction.valueId] = {
      ...updatedValues[auction.valueId],
      bidCount: updatedValues[auction.valueId].bidCount + 1
    };
    setValues(updatedValues);

    addLog(`💰 <strong>${students[idx].name}</strong> הציע ${fmt(amount)} על <strong>${updatedValues[auction.valueId].name}</strong>`, 'bid');
    setTeacherBidAmount("");
    syncStateToFirebase(students, updatedValues, newAuction);
  };

  const closeAuction = () => {
    if (!auction || auction.currentBid === 0 || auction.currentBidderId === null) return;
    const v = values[auction.valueId];
    const idx = auction.currentBidderId;
    const price = auction.currentBid;

    const updatedStudents = [...students];
    updatedStudents[idx] = {
      ...updatedStudents[idx],
      budget: updatedStudents[idx].budget - price,
      bought: [...updatedStudents[idx].bought, { name: v.name, price }]
    };
    setStudents(updatedStudents);

    const updatedValues = [...values];
    updatedValues[auction.valueId] = {
      ...updatedValues[auction.valueId],
      status: 'sold',
      winner: updatedStudents[idx].name,
      finalPrice: price
    };
    setValues(updatedValues);

    addLog(`🎉 <strong>${v.name}</strong> נמכר ל-<strong>${updatedStudents[idx].name}</strong> ב-${fmt(price)}!`, 'sold');
    setAuction(null);
    setTeacherBidAmount("");
    setTeacherBidError("");
    syncStateToFirebase(updatedStudents, updatedValues, null);
  };

  const cancelAuction = () => {
    if (!auction) return;
    if (!confirm('לבטל את המכירה הנוכחית?')) return;

    const updatedValues = [...values];
    updatedValues[auction.valueId] = { ...updatedValues[auction.valueId], status: 'pending' };
    setValues(updatedValues);

    setAuction(null);
    addLog('X המכירה בוטלה.', 'info');
    setTeacherBidAmount("");
    setTeacherBidError("");
    syncStateToFirebase(students, updatedValues, null);
  };

  // Remote Session logic
  const generateSessionId = () => {
    const arr = new Uint8Array(4);
    if (typeof window !== "undefined" && window.crypto) {
      crypto.getRandomValues(arr);
    }
    return Array.from(arr, b => b.toString(36).padStart(2, '0')).join('').toUpperCase().substring(0, 6);
  };

  const startRemoteSession = () => {
    const newSid = generateSessionId();
    setSessionId(newSid);
    // Push state
    const newSessionRef = ref(db, `sessions/${newSid}`);
    set(ref(db, `sessions/${newSid}/active`), true);
    set(ref(db, `sessions/${newSid}/state`), {
      students,
      values,
      auction: auction ? { ...auction, currentBidderId: auction.currentBidderId ?? -1 } : null
    });

    if (typeof window !== "undefined") {
      window.history.pushState({}, '', '?session=' + newSid);
    }
    addLog(`🌐 נפתח מפגש מרחוק. קוד: ${newSid}`, 'info');
  };

  const endRemoteSession = () => {
    if (!confirm('לסיים את המפגש המרחוק? התלמידים לא יוכלו להמשיך להציע.')) return;
    if (sessionId) {
      set(ref(db, `sessions/${sessionId}/active`), false);
    }
    setSessionId(null);
    if (typeof window !== "undefined") {
      window.history.pushState({}, '', window.location.pathname);
    }
    setShowRemoteModal(false);
    addLog('🔴 המפגש המרחוק הסתיים.', 'info');
  };

  const getStudentLink = () => {
    if (typeof window !== "undefined") {
      return window.location.origin + window.location.pathname + '?session=' + sessionId + '&role=student';
    }
    return "";
  };

  const copyStudentLink = () => {
    navigator.clipboard.writeText(getStudentLink()).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  // Edit Students Logic
  const openEditStudents = () => {
    setTempStudentsText(students.map(s => s.name).join('\n'));
    setShowEditStudentsModal(true);
  };

  const applyStudents = () => {
    const names = tempStudentsText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (names.length === 0) {
      alert('יש להכניס לפחות תלמיד אחד.');
      return;
    }

    const hasSales = values.some(v => v.status === 'sold');
    if (hasSales) {
      if (!confirm('שינוי הרשימה יאפס את כל הרכישות והתקציבים. להמשיך?')) return;
      setValues(prev => prev.map(v => ({ ...v, status: 'pending', winner: null, finalPrice: null, bidCount: 0 })));
      setAuction(null);
      setLogs([]);
    }

    const newStudents = names.map(name => ({ name, budget: 1000, bought: [] }));
    setStudents(newStudents);
    setShowEditStudentsModal(false);
    addLog(`✏️ רשימת המשתתפים עודכנה — ${names.length} תלמידים.`, 'info');

    // Sync remote
    if (sessionId) {
      syncStateToFirebase(newStudents, values, null);
    }
  };

  // Edit Values Logic
  const openEditValues = () => {
    setTempValuesList(values.map(v => ({ name: v.name, desc: v.desc, status: v.status })));
    setShowEditValuesModal(true);
  };

  const addValueRow = () => {
    setTempValuesList(prev => [...prev, { name: "", desc: "", status: "pending" }]);
  };

  const removeValueRow = (idx: number) => {
    setTempValuesList(prev => prev.filter((_, i) => i !== idx));
  };

  const applyValues = () => {
    const updatedValues: ValueItem[] = [];
    let isValid = true;

    for (let i = 0; i < tempValuesList.length; i++) {
      const name = tempValuesList[i].name.trim();
      const desc = tempValuesList[i].desc.trim();
      if (!name) {
        alert('שם הערך הוא שדה חובה.');
        isValid = false;
        break;
      }

      // Check if existing
      const existing = values.find(v => v.name === name);
      updatedValues.push({
        id: i,
        name,
        desc,
        status: existing ? existing.status : 'pending',
        winner: existing ? existing.winner : null,
        finalPrice: existing ? existing.finalPrice : null,
        bidCount: existing ? existing.bidCount : 0
      });
    }

    if (!isValid) return;
    if (updatedValues.length === 0) {
      alert('יש להכניס לפחות ערך אחד.');
      return;
    }

    setValues(updatedValues);
    if (auction && !updatedValues.find(v => v.id === auction.valueId)) {
      setAuction(null);
    }
    setShowEditValuesModal(false);
    addLog(`📋 רשימת הערכים עודכנה — ${updatedValues.length} ערכים.`, 'info');

    if (sessionId) {
      syncStateToFirebase(students, updatedValues, auction);
    }
  };

  // STUDENT VIEW RENDER
  if (role === 'student' && sessionId) {
    if (sessionNotFound) {
      return (
        <div className="min-h-screen bg-[#080c18] text-[#e8edf8] flex items-center justify-center p-6">
          <div className="glass-card max-w-md w-full rounded-2xl p-8 border border-red-500/30 text-center">
            <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-400 mb-2">המפגש לא נמצא</h3>
            <p className="text-text-muted text-sm mb-6">בדוק את קישור ההתחברות או קוד המפגש שקיבלת מהמורה.</p>
            <a href="/values-auction" className="inline-block px-5 py-2.5 bg-surface hover:bg-surface-hover border border-border-custom hover:border-gold rounded-xl transition-all font-semibold">
              חזרה לדף הבית
            </a>
          </div>
        </div>
      );
    }

    if (myStudentIdx === null) {
      return (
        <div className="min-h-screen bg-[#080c18] text-[#e8edf8] flex items-center justify-center p-6">
          <div className="glass-card max-w-md w-full rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <span className="text-4xl inline-block mb-3">🏛️</span>
              <h2 className="text-2xl font-bold">מכירה פומבית של ערכים</h2>
              <p className="text-text-muted text-sm mt-1">בחר את שמך כדי להצטרף למכירה</p>
            </div>

            <div className="space-y-4">
              <select
                className="w-full bg-surface border border-border-custom hover:border-border-custom-hover rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan"
                onChange={(e) => {
                  if (e.target.value !== "") {
                    handleJoinAsStudent(parseInt(e.target.value));
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>— בחר שם תלמיד —</option>
                {students.map((s, i) => (
                  <option key={i} value={i}>{s.name}</option>
                ))}
              </select>

              <p className="text-xs text-text-muted text-center leading-relaxed">
                * כל משתתף מתחיל עם תקציב וירטואלי של 1,000 ₪
              </p>
            </div>
          </div>
        </div>
      );
    }

    const me = students[myStudentIdx];
    if (!me) return null;

    const liveAuction = auction;
    const activeValue = liveAuction ? values[liveAuction.valueId] : null;
    const amLeading = liveAuction ? liveAuction.currentBidderId === myStudentIdx : false;
    const currentBidderName = liveAuction && liveAuction.currentBidderId !== null ? students[liveAuction.currentBidderId].name : "—";

    return (
      <div className="min-h-screen bg-[#080c18] text-[#e8edf8] flex flex-col">
        {/* Student Header */}
        <header className="bg-surface/80 backdrop-blur-md border-b border-border-custom px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h2 className="text-lg font-bold">{me.name}</h2>
            <div className="text-xs text-text-muted">קוד מפגש: {sessionId}</div>
          </div>
          <div className="text-left">
            <div className={`text-xl font-black ${me.budget < 200 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              {fmt(me.budget)}
            </div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider">יתרה זמינה</div>
          </div>
        </header>

        {/* Student Body */}
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-6 space-y-6">
          {/* Waiting or Active screen */}
          {!liveAuction ? (
            <div className="glass-card rounded-2xl p-8 border border-border-custom text-center space-y-4 shadow-xl">
              <div className="text-4xl animate-bounce">⏳</div>
              <h3 className="text-lg font-bold">ממתין לפתיחת המכירה הבאה...</h3>
              <p className="text-text-muted text-sm">המורה יפתח את הערך הבא למכירה בקרוב</p>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 border border-border-custom space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-amber-300" />
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                  מכירה פעילה
                </span>
                {amLeading && (
                  <span className="text-xs font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                    🏆 אתה מוביל!
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-black text-amber-400 leading-tight">{activeValue?.name}</h3>
                <p className="text-text-muted text-sm mt-2 leading-relaxed">{activeValue?.desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface/60 rounded-xl p-3 border border-border-custom text-center">
                  <div className="text-[10px] text-text-muted font-bold tracking-wider">הצעה מובילה</div>
                  <div className="text-xl font-black text-amber-400 mt-1">
                    {liveAuction.currentBid > 0 ? fmt(liveAuction.currentBid) : "פתיחה"}
                  </div>
                </div>
                <div className="bg-surface/60 rounded-xl p-3 border border-border-custom text-center">
                  <div className="text-[10px] text-text-muted font-bold tracking-wider">מציע</div>
                  <div className="text-sm font-semibold text-[#e8edf8] mt-2 truncate">
                    {currentBidderName}
                  </div>
                </div>
              </div>

              {/* Bidding input */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={studentBidInput}
                    onChange={(e) => setStudentBidInput(e.target.value)}
                    disabled={amLeading}
                    placeholder="הזן סכום ₪"
                    className="flex-1 bg-surface border border-border-custom rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 text-left font-mono font-bold"
                  />
                  <button
                    onClick={submitStudentBid}
                    disabled={amLeading}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-surface disabled:border disabled:border-border-custom disabled:text-text-muted text-zinc-950 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    {amLeading ? "✓ מוביל" : "הצע"}
                  </button>
                </div>
                {studentError && (
                  <p className="text-xs text-red-400 font-medium min-h-[1.5em]">{studentError}</p>
                )}
              </div>
            </div>
          )}

          {/* Bought Items list */}
          {me.bought && me.bought.length > 0 && (
            <div className="glass-card rounded-2xl p-5 border border-border-custom space-y-3">
              <div className="text-xs font-bold text-text-muted tracking-wider">הערכים שרכשת</div>
              <div className="divide-y divide-border-custom">
                {me.bought.map((item, index) => (
                  <div key={index} className="py-2.5 flex justify-between items-center text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="font-bold text-emerald-400">{fmt(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // TEACHER VIEW RENDER
  const liveAuction = auction;
  const activeValue = liveAuction ? values[liveAuction.valueId] : null;

  return (
    <div className="min-h-screen bg-[#080c18] text-[#e8edf8] flex flex-col">
      {/* Top Navbar */}
      <header className="bg-surface/80 backdrop-blur-md border-b border-border-custom px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <a href="/" className="p-2 bg-surface hover:bg-surface-hover border border-border-custom rounded-xl text-text-muted hover:text-[#e8edf8] transition-all" title="חזרה לפורטל">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold text-xl shadow-[0_0_15px_rgba(240,165,0,0.15)]">
            $
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              מכירה פומבית של ערכים
            </h1>
            <p className="text-[10px] text-text-muted tracking-wider uppercase">כל תלמיד מתחיל עם 1,000 ₪</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={openEditStudents}
            className="hbtn px-4 py-2 bg-surface hover:bg-surface-hover border border-border-custom hover:border-amber-500/50 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            👥 עריכת משתתפים
          </button>
          <button
            onClick={openEditValues}
            className="hbtn px-4 py-2 bg-surface hover:bg-surface-hover border border-border-custom hover:border-amber-500/50 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            📋 עריכת ערכים
          </button>
          <button
            onClick={() => {
              if (sessionId) {
                setShowRemoteModal(true);
              } else {
                startRemoteSession();
                setShowRemoteModal(true);
              }
            }}
            className={`hbtn px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${sessionId ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-surface hover:bg-surface-hover border border-border-custom'}`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{sessionId ? "🟢 מפגש פעיל" : "🌐 מפגש מרחוק"}</span>
          </button>
          <button
            onClick={() => setShowSummaryModal(true)}
            className="hbtn px-4 py-2 bg-amber-500 hover:bg-amber-400 border border-transparent text-zinc-950 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            📊 סיכום
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        
        {/* Students Sidebar (3 cols) */}
        <section className="lg:col-span-3 flex flex-col min-h-[300px]">
          <div className="glass-card rounded-2xl p-5 border border-border-custom flex-1 flex flex-col shadow-lg">
            <h2 className="text-md font-bold mb-4 text-text-muted flex items-center gap-2 border-b border-border-custom pb-2">
              <Users className="w-4 h-4 text-amber-500" />
              <span>תלמידים</span>
              <span className="text-xs font-normal text-text-muted mr-auto">
                {students.length} משתתפים
              </span>
            </h2>

            <div className="flex-1 overflow-y-auto space-y-2 max-h-[500px] pr-1">
              {students.map((s, i) => {
                const isLeading = liveAuction && liveAuction.currentBidderId === i;
                const isLow = s.budget < 200;
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border transition-all flex justify-between items-center ${isLeading ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-surface/40 border-border-custom'}`}
                  >
                    <span className="font-semibold text-sm">{s.name}</span>
                    <span className={`text-xs font-bold font-mono ${isLow ? 'text-red-400' : 'text-emerald-400'}`}>
                      {fmt(s.budget)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Center: Live Card + Logs (6 cols) */}
        <section className="lg:col-span-6 flex flex-col gap-6">
          {/* Auction Card */}
          <div className={`glass-card rounded-2xl p-6 border transition-all shadow-xl relative overflow-hidden ${liveAuction ? 'border-amber-500/40' : 'border-border-custom'}`}>
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-amber-300 opacity-50" />
            <div className="flex justify-between items-center mb-4">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${liveAuction ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-surface border border-border-custom text-text-muted'}`}>
                {liveAuction ? "מכירה פעילה" : "ממתין למכירה"}
              </span>
            </div>

            <div className="min-h-[110px] mb-6">
              <h3 className="text-2xl font-black text-amber-400 leading-tight">
                {liveAuction ? activeValue?.name : "בחר ערך לפתיחת מכירה"}
              </h3>
              <p className="text-text-muted text-sm mt-2 leading-relaxed">
                {liveAuction ? activeValue?.desc : "לחץ על 'פתח מכירה' ליד אחד הערכים ברשימה משמאל כדי להתחיל."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-surface/50 border border-border-custom rounded-xl p-4 text-center">
                <div className="text-[10px] text-text-muted font-bold tracking-wider">הצעה גבוהה</div>
                <div className="text-2xl font-black text-amber-500 mt-1">
                  {liveAuction && liveAuction.currentBid > 0 ? fmt(liveAuction.currentBid) : "—"}
                </div>
              </div>
              <div className="bg-surface/50 border border-border-custom rounded-xl p-4 text-center">
                <div className="text-[10px] text-text-muted font-bold tracking-wider">מציע</div>
                <div className="text-lg font-bold text-[#e8edf8] mt-2 truncate">
                  {liveAuction && liveAuction.currentBidderId !== null ? students[liveAuction.currentBidderId].name : "—"}
                </div>
              </div>
            </div>

            {/* Bidding inputs (Teacher control panel) */}
            <div className="border-t border-border-custom pt-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col">
                  <label className="text-[10px] text-text-muted font-bold mb-1.5">תלמיד מציע</label>
                  <select
                    disabled={!liveAuction}
                    value={teacherBidderId}
                    onChange={(e) => setTeacherBidderId(e.target.value)}
                    className="bg-surface border border-border-custom rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="">— בחר תלמיד —</option>
                    {students.map((s, i) => (
                      <option key={i} value={i} disabled={s.budget === 0}>
                        {s.name} ({fmt(s.budget)})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] text-text-muted font-bold mb-1.5">סכום ₪</label>
                  <input
                    type="number"
                    disabled={!liveAuction}
                    value={teacherBidAmount}
                    onChange={(e) => setTeacherBidAmount(e.target.value)}
                    placeholder="0"
                    className="bg-surface border border-border-custom rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-400 text-left font-mono font-bold"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <button
                    disabled={!liveAuction}
                    onClick={handleTeacherPlaceBid}
                    className="py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-surface disabled:border disabled:border-border-custom disabled:text-text-muted text-zinc-950 font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    📤 הגש הצעה
                  </button>
                </div>
              </div>

              {teacherBidError && (
                <p className="text-xs text-red-400 font-medium min-h-[1.5em]">{teacherBidError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  disabled={!liveAuction || liveAuction.currentBid === 0}
                  onClick={closeAuction}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-surface disabled:border disabled:border-border-custom disabled:text-text-muted text-zinc-950 font-bold rounded-xl text-sm transition-all cursor-pointer"
                >
                  🔨 מכור לגבוה ביותר!
                </button>
                <button
                  disabled={!liveAuction}
                  onClick={cancelAuction}
                  className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 disabled:bg-transparent disabled:border-transparent disabled:text-transparent text-red-400 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  ✕ בטל מכירה
                </button>
              </div>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="glass-card rounded-2xl p-5 border border-border-custom flex-1 flex flex-col max-h-[300px] overflow-hidden shadow-lg">
            <h2 className="text-xs font-bold text-text-muted tracking-wider border-b border-border-custom pb-2 mb-3">
              יומן פעילות
            </h2>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {logs.length === 0 ? (
                <div className="text-center py-6 text-xs text-text-muted">אין פעילות כרגע</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="text-xs flex gap-2 items-start py-1 leading-relaxed">
                    <span className="font-mono text-text-muted shrink-0">{log.time}</span>
                    <span
                      dangerouslySetInnerHTML={{ __html: log.text }}
                      className={log.type === 'sold' ? 'text-emerald-400 font-bold' : log.type === 'bid' ? 'text-amber-400' : 'text-text-muted'}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Right Sidebar: Values (3 cols) */}
        <section className="lg:col-span-3 flex flex-col min-h-[300px]">
          <div className="glass-card rounded-2xl p-5 border border-border-custom flex-1 flex flex-col shadow-lg">
            <h2 className="text-md font-bold mb-4 text-text-muted flex items-center gap-2 border-b border-border-custom pb-2">
              <ClipboardList className="w-4 h-4 text-amber-500" />
              <span>רשימת ערכים</span>
            </h2>

            <div className="flex-1 overflow-y-auto space-y-2 max-h-[500px] pr-1">
              {values.map((v, i) => {
                const isActive = liveAuction && liveAuction.valueId === v.id;
                const isSold = v.status === 'sold';
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border transition-all flex flex-col gap-2 ${isActive ? 'bg-amber-500/10 border-amber-500/40' : isSold ? 'opacity-60 border-border-custom bg-surface/10' : 'bg-surface/40 border-border-custom hover:border-border-custom-hover'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs">{v.name}</span>
                      {isSold ? (
                        <span className="text-[10px] font-bold text-emerald-400">
                          {v.winner} ({fmt(v.finalPrice ?? 0)})
                        </span>
                      ) : isActive ? (
                        <span className="text-[10px] font-bold text-amber-400 animate-pulse">פעיל...</span>
                      ) : (
                        <button
                          onClick={() => startAuction(v.id)}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                        >
                          פתח מכירה
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      {/* ══ Remote Session Modal ══ */}
      {showRemoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="glass-card max-w-sm w-full rounded-2xl p-6 border border-border-custom shadow-2xl relative">
            <button onClick={() => setShowRemoteModal(false)} className="absolute top-4 left-4 p-1 rounded-lg hover:bg-surface text-text-muted hover:text-[#e8edf8] transition-all">
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-400 border-b border-border-custom pb-2">
              <Share2 className="w-5 h-5" />
              <span>מפגש מרחוק</span>
            </h2>

            {/* Active session state */}
            {sessionId ? (
              <div className="space-y-5 text-center">
                <div className="bg-surface/50 border border-border-custom rounded-xl p-3">
                  <span className="text-2xl font-black text-emerald-400">{joinedStudents}</span>
                  <p className="text-[10px] text-text-muted font-bold tracking-wider mt-0.5">תלמידים מחוברים</p>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider">קוד המפגש</div>
                  <div className="text-3xl font-black text-[#e8edf8] font-mono select-all">{sessionId}</div>
                </div>

                {/* QR Code */}
                <div className="w-36 h-36 bg-white p-2.5 mx-auto rounded-xl shadow-lg border border-border-custom">
                  {/* Generate QR code via public QR code server API */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(getStudentLink())}`}
                    alt="QR Code"
                    className="w-full h-full"
                  />
                </div>

                {/* Copy Link */}
                <div className="flex items-center gap-2 bg-surface border border-border-custom rounded-xl p-2.5 text-xs text-right">
                  <span className="flex-1 truncate font-mono text-text-muted">{getStudentLink()}</span>
                  <button
                    onClick={copyStudentLink}
                    className="p-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg font-bold transition-all cursor-pointer shrink-0"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border-custom">
                  <button onClick={() => setShowRemoteModal(false)} className="flex-1 py-2.5 bg-surface border border-border-custom hover:border-border-custom-hover rounded-xl text-xs font-bold transition-all cursor-pointer">
                    סגור
                  </button>
                  <button onClick={endRemoteSession} className="flex-1 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-all cursor-pointer">
                    סיים מפגש
                  </button>
                </div>
              </div>
            ) : (
              // Pre-start
              <div className="space-y-4">
                <p className="text-xs text-text-muted leading-relaxed">
                  תלמידים יקבלו קישור או יסרקו קוד QR, יבחרו את שמם ויוכלו להציע הצעות מהטלפון שלהם.
                </p>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setShowRemoteModal(false)} className="flex-1 py-2.5 bg-surface border border-border-custom hover:border-border-custom-hover rounded-xl text-xs font-bold transition-all cursor-pointer">
                    ביטול
                  </button>
                  <button onClick={startRemoteSession} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl text-xs font-bold transition-all cursor-pointer">
                    🚀 פתח מפגש
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ Edit Students Modal ══ */}
      {showEditStudentsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="glass-card max-w-sm w-full rounded-2xl p-6 border border-border-custom shadow-2xl relative">
            <button onClick={() => setShowEditStudentsModal(false)} className="absolute top-4 left-4 p-1 rounded-lg hover:bg-surface text-text-muted hover:text-[#e8edf8] transition-all">
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-400 border-b border-border-custom pb-2">
              <Users className="w-5 h-5" />
              <span>עריכת משתתפים</span>
            </h2>

            <div className="space-y-4">
              <p className="text-[10px] text-text-muted leading-relaxed">
                הזן שם אחד בכל שורה. שים לב שעדכון הרשימה יאפס את כל הרכישות והתקציבים הקיימים!
              </p>
              <textarea
                value={tempStudentsText}
                onChange={(e) => setTempStudentsText(e.target.value)}
                placeholder="שם תלמיד&#10;שם תלמיד&#10;..."
                className="w-full h-48 bg-surface border border-border-custom rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowEditStudentsModal(false)} className="flex-1 py-2.5 bg-surface border border-border-custom hover:border-border-custom-hover rounded-xl text-xs font-bold transition-all cursor-pointer">
                  ביטול
                </button>
                <button onClick={applyStudents} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl text-xs font-bold transition-all cursor-pointer">
                  ✔ עדכן רשימה
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ Edit Values Modal ══ */}
      {showEditValuesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full rounded-2xl p-6 border border-border-custom shadow-2xl relative">
            <button onClick={() => setShowEditValuesModal(false)} className="absolute top-4 left-4 p-1 rounded-lg hover:bg-surface text-text-muted hover:text-[#e8edf8] transition-all">
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-400 border-b border-border-custom pb-2">
              <ClipboardList className="w-5 h-5" />
              <span>עריכת רשימת הערכים</span>
            </h2>

            <div className="space-y-4">
              <p className="text-[10px] text-text-muted leading-relaxed">
                ניתן לערוך שמות ותיאורים, להוסיף ערכים ולמחוק אותם. שם הוא שדה חובה. ערכים שנמכרו לא ניתנים לעריכה.
              </p>

              <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
                {tempValuesList.map((tv, idx) => {
                  const isLocked = tv.status === 'sold' || tv.status === 'active';
                  return (
                    <div key={idx} className="p-3 border border-border-custom rounded-xl bg-surface/30 flex gap-2 items-start relative">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          disabled={isLocked}
                          value={tv.name}
                          onChange={(e) => {
                            const updated = [...tempValuesList];
                            updated[idx].name = e.target.value;
                            setTempValuesList(updated);
                          }}
                          placeholder="שם הערך *"
                          className="w-full bg-surface border border-border-custom rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-400 disabled:opacity-60"
                        />
                        <textarea
                          disabled={isLocked}
                          value={tv.desc}
                          onChange={(e) => {
                            const updated = [...tempValuesList];
                            updated[idx].desc = e.target.value;
                            setTempValuesList(updated);
                          }}
                          placeholder="תיאור הערך..."
                          className="w-full bg-surface border border-border-custom rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-400 disabled:opacity-60 h-16"
                        />
                      </div>
                      {!isLocked ? (
                        <button
                          onClick={() => removeValueRow(idx)}
                          className="p-1 text-red-400 hover:bg-surface rounded-lg transition-all"
                          title="מחק ערך"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[9px] font-bold text-amber-400 mt-1 uppercase rotate-12">{tv.status === 'sold' ? "נמכר" : "פעיל"}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={addValueRow}
                className="w-full py-2 bg-surface hover:bg-surface-hover border border-border-custom hover:border-amber-500/50 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                + הוסף ערך חדש
              </button>

              <div className="flex gap-2">
                <button onClick={() => setShowEditValuesModal(false)} className="flex-1 py-2.5 bg-surface border border-border-custom hover:border-border-custom-hover rounded-xl text-xs font-bold transition-all cursor-pointer">
                  ביטול
                </button>
                <button onClick={applyValues} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl text-xs font-bold transition-all cursor-pointer">
                  ✔ עדכן ערכים
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ Summary Modal ══ */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="glass-card max-w-2xl w-full rounded-2xl p-6 border border-border-custom shadow-2xl relative flex flex-col max-h-[85vh]">
            <button onClick={() => setShowSummaryModal(false)} className="absolute top-4 left-4 p-1 rounded-lg hover:bg-surface text-text-muted hover:text-[#e8edf8] transition-all">
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-400 border-b border-border-custom pb-2 shrink-0">
              <Award className="w-5 h-5" />
              <span>סיכום המכירה הפומבית</span>
            </h2>

            <div className="flex-1 overflow-y-auto space-y-6 pr-1 pl-1">
              {/* Values summary table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-text-muted tracking-wider uppercase">סיכום לפי ערכים</h3>
                <div className="overflow-x-auto border border-border-custom rounded-xl">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-surface/50 border-b border-border-custom">
                      <tr>
                        <th className="p-3">ערך</th>
                        <th className="p-3 text-center">הצעות</th>
                        <th className="p-3">הצעה זוכה</th>
                        <th className="p-3">זוכה</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-custom">
                      {values.map((v, i) => (
                        <tr key={i} className="hover:bg-surface/20">
                          <td className="p-3 font-semibold">{v.name}</td>
                          <td className="p-3 text-center"><span className="px-2 py-0.5 bg-surface border border-border-custom rounded-full font-bold">{v.bidCount}</span></td>
                          <td className="p-3 font-mono font-bold text-amber-400">
                            {v.status === 'sold' ? fmt(v.finalPrice ?? 0) : v.status === 'active' ? 'בתהליך...' : '—'}
                          </td>
                          <td className="p-3 font-medium text-emerald-400">
                            {v.status === 'sold' ? `🏆 ${v.winner}` : v.status === 'active' ? 'בתהליך...' : 'לא נמכר'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Students summary grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-text-muted tracking-wider uppercase">סיכום לפי תלמידים</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {students.map((s, idx) => (
                    <div key={idx} className="p-4 border border-border-custom bg-surface/30 rounded-xl space-y-3">
                      <div className="flex justify-between items-center border-b border-border-custom pb-2">
                        <span className="font-bold text-sm">{s.name}</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">{fmt(s.budget)} נותר</span>
                      </div>
                      <div className="space-y-1.5">
                        {s.bought.length === 0 ? (
                          <div className="text-[10px] text-text-muted italic">לא רכש ערכים</div>
                        ) : (
                          s.bought.map((item, index) => (
                            <div key={index} className="text-xs flex justify-between text-text-muted">
                              <span>✔ {item.name}</span>
                              <span className="font-mono">{fmt(item.price)}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-custom mt-4 shrink-0">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-sm transition-all cursor-pointer"
              >
                סגור סיכום
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
