"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  Plus,
  Trash2,
  Volume2,
  Search,
  Check,
  X,
  RotateCcw,
  BookOpen,
  BookmarkCheck,
  Layers,
  HelpCircle,
  FileText,
  Sparkles,
  Trophy,
  VolumeX,
  LogIn,
  LogOut,
  User,
  CloudLightning,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { dbFirestore } from "@/lib/firebase";
import { collection, doc, setDoc, deleteDoc, getDocs, writeBatch } from "firebase/firestore";

interface Word {
  id: string;
  english: string;
  hebrew: string;
  partOfSpeech: string;
  example?: string;
  mastered?: boolean;
}

const DEFAULT_WORDS: Word[] = [
  { id: "1", english: "accomplish", hebrew: "להשיג, להשלים", partOfSpeech: "verb", example: "You can accomplish anything with hard work." },
  { id: "2", english: "determine", hebrew: "לקבוע, להחליט", partOfSpeech: "verb", example: "Your attitude determines your direction." },
  { id: "3", english: "significant", hebrew: "משמעותי, בעל ערך", partOfSpeech: "adjective", example: "This is a significant discovery for science." },
  { id: "4", english: "influence", hebrew: "להשפיע, השפעה", partOfSpeech: "verb", example: "Good books can influence your behavior." },
  { id: "5", english: "challenge", hebrew: "אתגר, לאתגר", partOfSpeech: "noun", example: "Learning English is a fun challenge." },
  { id: "6", english: "opportunity", hebrew: "הזדמנות", partOfSpeech: "noun", example: "Every day is a new opportunity to learn." },
  { id: "7", english: "improve", hebrew: "לשפר, להשתפר", partOfSpeech: "verb", example: "Practice is the best way to improve." },
  { id: "8", english: "constant", hebrew: "קבוע, רציף", partOfSpeech: "adjective", example: "Learning requires constant effort." },
  { id: "9", english: "acquire", hebrew: "לרכוש (ידע או מיומנות)", partOfSpeech: "verb", example: "It takes time to acquire a new language." },
  { id: "10", english: "essential", hebrew: "חיוני, הכרחי", partOfSpeech: "adjective", example: "Vocabulary is essential for communication." }
];

const FALLBACK_DISTRACTORS = [
  { english: "explore", hebrew: "לחקור" },
  { english: "create", hebrew: "ליצור" },
  { english: "comprehend", hebrew: "להבין" },
  { english: "evaluate", hebrew: "להעריך" },
  { english: "analyze", hebrew: "לנתח" },
  { english: "express", hebrew: "לבטא" },
  { english: "support", hebrew: "לתמוך" },
  { english: "prevent", hebrew: "למנוע" },
  { english: "identify", hebrew: "לזהות" },
  { english: "compare", hebrew: "להשוות" }
];

interface QuizQuestion {
  wordId: string;
  type: "en-to-he" | "he-to-en" | "fill-blank";
  prompt: string;
  correctAnswer: string;
  options: string[];
  exampleContext?: string;
  englishWord: string;
}

interface MatchCard {
  id: string;
  text: string;
  type: "english" | "hebrew";
  matchId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function VocabTrainerPage() {
  const { user, logout, loading: authLoading } = useAuth();

  // Navigation & Core state
  const [activeTab, setActiveTab] = useState<"manage" | "flashcards" | "quiz" | "spelling" | "match">("manage");
  const [words, setWords] = useState<Word[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sound & Speech Synthesis
  const [speechSupported, setSpeechSupported] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Syncing states
  const [isMerging, setIsMerging] = useState(false);
  const [hasLocalWordsToMerge, setHasLocalWordsToMerge] = useState(false);

  // --- Manage Words Tab States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [newEnglish, setNewEnglish] = useState("");
  const [newHebrew, setNewHebrew] = useState("");
  const [newPart, setNewPart] = useState("noun");
  const [newExample, setNewExample] = useState("");
  const [formError, setFormError] = useState("");

  // --- Flashcards Tab States ---
  const [cardIndex, setCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // --- Quiz Tab States ---
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // --- Spelling Tab States ---
  const [spellingWords, setSpellingWords] = useState<Word[]>([]);
  const [spellingIndex, setSpellingIndex] = useState(0);
  const [spellingInput, setSpellingInput] = useState("");
  const [spellingChecked, setSpellingChecked] = useState(false);
  const [spellingCorrect, setSpellingCorrect] = useState(false);
  const [spellingScore, setSpellingScore] = useState(0);
  const [spellingFinished, setSpellingFinished] = useState(false);

  // --- Match Game Tab States ---
  const [matchCards, setMatchCards] = useState<MatchCard[]>([]);
  const [selectedMatchIndices, setSelectedMatchIndices] = useState<number[]>([]);
  const [matchMoves, setMatchMoves] = useState(0);
  const [matchTimer, setMatchTimer] = useState(0);
  const [matchGameActive, setMatchGameActive] = useState(false);
  const [matchCompleted, setMatchCompleted] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load local storage fallback list
  const loadLocalWords = () => {
    const stored = localStorage.getItem("teaching-site-vocab-words");
    if (stored) {
      try {
        setWords(JSON.parse(stored));
      } catch (e) {
        setWords(DEFAULT_WORDS);
      }
    } else {
      setWords(DEFAULT_WORDS);
      localStorage.setItem("teaching-site-vocab-words", JSON.stringify(DEFAULT_WORDS));
    }
  };

  // Load words from Firestore or LocalStorage on user status change
  useEffect(() => {
    if (authLoading) return;

    const loadData = async () => {
      setIsLoaded(false);
      if (user) {
        try {
          const querySnapshot = await getDocs(collection(dbFirestore, "users", user.uid, "words"));
          const firestoreWords: Word[] = [];
          querySnapshot.forEach((doc) => {
            firestoreWords.push(doc.data() as Word);
          });

          // Sort newer words first (by numeric comparison of ID, which is Date.now().toString())
          firestoreWords.sort((a, b) => Number(b.id) - Number(a.id));
          setWords(firestoreWords);

          // Check if local storage has unsynced local words
          const localStr = localStorage.getItem("teaching-site-vocab-words");
          if (localStr) {
            const localWords = JSON.parse(localStr) as Word[];
            const hasNewLocal = localWords.some(
              lw => !firestoreWords.some(fw => fw.english.toLowerCase() === lw.english.toLowerCase())
            );
            setHasLocalWordsToMerge(hasNewLocal);
          }
        } catch (error) {
          console.error("Error loading words from Firestore:", error);
          loadLocalWords();
        }
      } else {
        // Logged out: load from local storage
        loadLocalWords();
        setHasLocalWordsToMerge(false);
      }
      setIsLoaded(true);
    };

    loadData();

    // Check for SpeechSynthesis support
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSupported(true);
    }
  }, [user, authLoading]);

  // Save words state, update local storage cache, and sync to Firestore
  const saveWords = async (newWords: Word[]) => {
    const previousWords = words;
    setWords(newWords);

    if (typeof window !== "undefined") {
      localStorage.setItem("teaching-site-vocab-words", JSON.stringify(newWords));
    }

    if (user) {
      try {
        // Find deleted words
        const deleted = previousWords.filter(w => !newWords.some(nw => nw.id === w.id));
        // Find added or updated words
        const updated = newWords.filter(nw => {
          const prev = previousWords.find(w => w.id === nw.id);
          return !prev || JSON.stringify(prev) !== JSON.stringify(nw);
        });

        const batch = writeBatch(dbFirestore);

        deleted.forEach(w => {
          const docRef = doc(dbFirestore, "users", user.uid, "words", w.id);
          batch.delete(docRef);
        });

        updated.forEach(w => {
          const docRef = doc(dbFirestore, "users", user.uid, "words", w.id);
          batch.set(docRef, w);
        });

        await batch.commit();
      } catch (error) {
        console.error("Error syncing to Firestore:", error);
      }
    }
  };

  // Merge Local Words to cloud
  const handleMergeLocalWords = async () => {
    if (!user || isMerging) return;
    setIsMerging(true);
    try {
      const localStr = localStorage.getItem("teaching-site-vocab-words");
      if (localStr) {
        const localWords = JSON.parse(localStr) as Word[];
        
        // Find local words not in current Firestore list
        const toAdd = localWords.filter(
          lw => !words.some(fw => fw.english.toLowerCase() === lw.english.toLowerCase())
        );
        
        if (toAdd.length > 0) {
          const batch = writeBatch(dbFirestore);
          toAdd.forEach(w => {
            // Re-assign id to ensure unique key in Firestore if needed, or use existing
            const docRef = doc(dbFirestore, "users", user.uid, "words", w.id);
            batch.set(docRef, w);
          });
          await batch.commit();

          const merged = [...toAdd, ...words].sort((a, b) => Number(b.id) - Number(a.id));
          setWords(merged);
          
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      }
      setHasLocalWordsToMerge(false);
    } catch (error) {
      console.error("Error merging words:", error);
      alert("מיזוג המילים נכשל. אנא נסו שוב.");
    } finally {
      setIsMerging(false);
    }
  };

  // Text-To-Speech Pronounce function
  const speakWord = (text: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Avoid triggering card flips
    }
    if (!speechSupported || !soundEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  // --- Manage Words Handlers ---
  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!newEnglish.trim() || !newHebrew.trim()) {
      setFormError("אנא מלאו גם את המילה באנגלית וגם את התרגום בעברית.");
      return;
    }

    const englishClean = newEnglish.trim().toLowerCase();
    const hebrewClean = newHebrew.trim();

    // Check duplicate
    if (words.some(w => w.english.toLowerCase() === englishClean)) {
      setFormError("המילה הזו כבר קיימת ברשימה שלכם.");
      return;
    }

    const newWord: Word = {
      id: Date.now().toString(),
      english: englishClean,
      hebrew: hebrewClean,
      partOfSpeech: newPart,
      example: newExample.trim() || undefined,
      mastered: false
    };

    const updated = [newWord, ...words];
    saveWords(updated);

    // Reset inputs
    setNewEnglish("");
    setNewHebrew("");
    setNewPart("noun");
    setNewExample("");

    // Trigger mini confetti
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.8 }
    });
  };

  const handleDeleteWord = (id: string) => {
    const updated = words.filter(w => w.id !== id);
    saveWords(updated);
    // Reset index limits
    if (cardIndex >= updated.length && updated.length > 0) {
      setCardIndex(updated.length - 1);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm("האם ברצונכם לאפס את הרשימה לרשימת המילים המקורית? כל המילים שהוספתם יימחקו.")) {
      saveWords(DEFAULT_WORDS);
      setCardIndex(0);
      setIsCardFlipped(false);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("האם למחוק את כל המילים מהרשימה?")) {
      saveWords([]);
      setCardIndex(0);
      setIsCardFlipped(false);
    }
  };

  const handleToggleMastered = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = words.map(w => w.id === id ? { ...w, mastered: !w.mastered } : w);
    saveWords(updated);
  };

  const filteredWords = words.filter(w =>
    w.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.hebrew.includes(searchQuery)
  );

  // --- Flashcards Logic ---
  const handleCardMastered = () => {
    if (words.length === 0) return;
    const currentWord = words[cardIndex];
    const updated = words.map(w => w.id === currentWord.id ? { ...w, mastered: true } : w);
    saveWords(updated);
    
    // Play sound/effect and transition
    if (soundEnabled && speechSupported) {
      speakWord("Great job!");
    }
    
    // Smooth next
    setTimeout(() => {
      handleNextCard();
    }, 300);
  };

  const handleNextCard = () => {
    setIsCardFlipped(false);
    setTimeout(() => {
      setCardIndex(prev => (prev + 1) % words.length);
    }, 150);
  };

  const handlePrevCard = () => {
    setIsCardFlipped(false);
    setTimeout(() => {
      setCardIndex(prev => (prev - 1 + words.length) % words.length);
    }, 150);
  };

  // --- Quiz Logic ---
  const startNewQuiz = () => {
    if (words.length === 0) return;
    
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledWords.slice(0, Math.min(10, words.length));
    
    const questions: QuizQuestion[] = selectedWords.map(word => {
      const qTypes: Array<"en-to-he" | "he-to-en" | "fill-blank"> = ["en-to-he", "he-to-en"];
      if (word.example && word.example.toLowerCase().includes(word.english.toLowerCase())) {
        qTypes.push("fill-blank");
      }
      
      const chosenType = qTypes[Math.floor(Math.random() * qTypes.length)];
      let prompt = "";
      let correctAnswer = "";
      let exampleContext = "";
      
      if (chosenType === "en-to-he") {
        prompt = `What is the Hebrew translation for "${word.english}"?`;
        correctAnswer = word.hebrew;
      } else if (chosenType === "he-to-en") {
        prompt = `מהי המילה באנגלית עבור: "${word.hebrew}"?`;
        correctAnswer = word.english;
      } else {
        // Replace the word in the example sentence with blanks
        const regex = new RegExp(`\\b${word.english}\\b`, 'gi');
        prompt = word.example!.replace(regex, "_______");
        correctAnswer = word.english;
        exampleContext = `התרגום של המילה החסרה: ${word.hebrew}`;
      }

      // Generate distractors
      const distractors: string[] = [];
      const isEnglishAnswer = chosenType === "he-to-en" || chosenType === "fill-blank";
      
      // Filter potential sources for distractors
      const listSources = words.filter(w => w.id !== word.id);
      
      while (distractors.length < 3) {
        if (listSources.length > distractors.length) {
          // Draw from user words
          const potential = listSources[Math.floor(Math.random() * listSources.length)];
          const val = isEnglishAnswer ? potential.english : potential.hebrew;
          if (!distractors.includes(val) && val !== correctAnswer) {
            distractors.push(val);
          }
        } else {
          // Draw from fallback list
          const potential = FALLBACK_DISTRACTORS[Math.floor(Math.random() * FALLBACK_DISTRACTORS.length)];
          const val = isEnglishAnswer ? potential.english : potential.hebrew;
          if (!distractors.includes(val) && val !== correctAnswer) {
            distractors.push(val);
          }
        }
      }

      const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);

      return {
        wordId: word.id,
        type: chosenType,
        prompt,
        correctAnswer,
        options,
        exampleContext,
        englishWord: word.english
      };
    });

    setQuizQuestions(questions);
    setQuizIndex(0);
    setSelectedQuizOption(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const handleQuizAnswer = (option: string) => {
    if (selectedQuizOption !== null) return; // Answered already
    
    setSelectedQuizOption(option);
    const isCorrect = option === quizQuestions[quizIndex].correctAnswer;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      if (soundEnabled && speechSupported) {
        speakWord("Correct!");
      }
    } else {
      if (soundEnabled && speechSupported) {
        speakWord("Oops!");
      }
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedQuizOption(null);
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      // Trigger full page confetti if score is high
      if (quizScore >= quizQuestions.length * 0.7) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  // --- Spelling Game Logic ---
  const startNewSpelling = () => {
    if (words.length === 0) return;
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setSpellingWords(shuffled.slice(0, Math.min(10, words.length)));
    setSpellingIndex(0);
    setSpellingInput("");
    setSpellingChecked(false);
    setSpellingCorrect(false);
    setSpellingScore(0);
    setSpellingFinished(false);
  };

  const handleCheckSpelling = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (spellingChecked) return;

    const currentWord = spellingWords[spellingIndex];
    const userAns = spellingInput.trim().toLowerCase();
    const correctAns = currentWord.english.trim().toLowerCase();
    const isRight = userAns === correctAns;

    setSpellingCorrect(isRight);
    setSpellingChecked(true);

    if (isRight) {
      setSpellingScore(prev => prev + 1);
      confetti({
        particleCount: 20,
        spread: 30,
        origin: { y: 0.8 }
      });
      if (soundEnabled && speechSupported) {
        speakWord(currentWord.english);
      }
    } else {
      if (soundEnabled && speechSupported) {
        speakWord("Study spelling");
      }
    }
  };

  const handleNextSpelling = () => {
    setSpellingInput("");
    setSpellingChecked(false);
    if (spellingIndex < spellingWords.length - 1) {
      setSpellingIndex(prev => prev + 1);
    } else {
      setSpellingFinished(true);
      if (spellingScore >= spellingWords.length * 0.7) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  // --- Match Game Logic ---
  const startNewMatchGame = () => {
    if (words.length < 4) return; // Need at least 4 words
    
    // Choose 4 random words
    const selected = [...words].sort(() => Math.random() - 0.5).slice(0, 4);
    
    const englishCards: MatchCard[] = selected.map(w => ({
      id: `en-${w.id}`,
      text: w.english,
      type: "english",
      matchId: w.id,
      isFlipped: false,
      isMatched: false
    }));

    const hebrewCards: MatchCard[] = selected.map(w => ({
      id: `he-${w.id}`,
      text: w.hebrew,
      type: "hebrew",
      matchId: w.id,
      isFlipped: false,
      isMatched: false
    }));

    const allCards = [...englishCards, ...hebrewCards].sort(() => Math.random() - 0.5);
    
    setMatchCards(allCards);
    setSelectedMatchIndices([]);
    setMatchMoves(0);
    setMatchTimer(0);
    setMatchGameActive(true);
    setMatchCompleted(false);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = setInterval(() => {
      setMatchTimer(prev => prev + 1);
    }, 1000);
  };

  const handleMatchCardClick = (clickedIndex: number) => {
    const card = matchCards[clickedIndex];
    if (card.isMatched || card.isFlipped || selectedMatchIndices.length >= 2) return;

    // Flip card
    const updatedCards = [...matchCards];
    updatedCards[clickedIndex].isFlipped = true;
    setMatchCards(updatedCards);

    const newSelected = [...selectedMatchIndices, clickedIndex];
    setSelectedMatchIndices(newSelected);

    if (newSelected.length === 2) {
      setMatchMoves(prev => prev + 1);
      const firstCard = matchCards[newSelected[0]];
      const secondCard = matchCards[newSelected[1]];

      // Check match
      if (firstCard.matchId === secondCard.matchId && firstCard.type !== secondCard.type) {
        // Match found!
        setTimeout(() => {
          const matched = [...matchCards];
          matched[newSelected[0]].isMatched = true;
          matched[newSelected[1]].isMatched = true;
          setMatchCards(matched);
          setSelectedMatchIndices([]);

          // Pronounce the English word when matched
          const englishText = firstCard.type === "english" ? firstCard.text : secondCard.text;
          speakWord(englishText);

          // Check if game complete
          const allMatched = matched.every(c => c.isMatched);
          if (allMatched) {
            setMatchCompleted(true);
            setMatchGameActive(false);
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
            }
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetFlipped = [...matchCards];
          resetFlipped[newSelected[0]].isFlipped = false;
          resetFlipped[newSelected[1]].isFlipped = false;
          setMatchCards(resetFlipped);
          setSelectedMatchIndices([]);
        }, 1000);
      }
    }
  };

  // Clean up match game interval on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // When changing tabs, initialize/reset appropriate states
  useEffect(() => {
    if (words.length > 0) {
      if (activeTab === "quiz") {
        startNewQuiz();
      } else if (activeTab === "spelling") {
        startNewSpelling();
      } else if (activeTab === "match") {
        startNewMatchGame();
      }
    }
    setIsCardFlipped(false);
    
    // Clear match timer if leaving match game tab
    if (activeTab !== "match" && timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      setMatchGameActive(false);
    }
  }, [activeTab, words.length]);

  return (
    <div className="relative min-h-screen bg-[#080c18] text-[#e8edf8] flex flex-col justify-between overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl mx-auto px-4 md:px-6 py-12 flex-1 flex flex-col z-10">
        
        {/* Back Link & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <Link
            href="/english"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-english transition-colors self-start"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>חזרה לאנגלית</span>
          </Link>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="px-3 py-1.5 rounded-lg border border-border-custom bg-surface hover:bg-surface-hover text-text-muted hover:text-white transition-all text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>שמע פעיל</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                  <span>שמע כבוי</span>
                </>
              )}
            </button>

            {/* Auth Dropdown/State */}
            {user ? (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 bg-surface border border-border-custom rounded-lg px-3 py-1.5 text-xs text-zinc-300">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold">{user.displayName || user.email || "תלמיד/ה"}</span>
                </div>
                <button
                  onClick={() => logout()}
                  className="px-3 py-1.5 rounded-lg border border-red-950/40 bg-red-950/10 hover:bg-red-900/20 text-red-400 text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>התנתק</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login?redirect=/english/vocab-trainer"
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-zinc-950 text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>התחבר לשמירה בענן</span>
              </Link>
            )}
          </div>
        </div>

        <div className="text-right mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-border-custom rounded-full text-xs font-bold text-english mb-3">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>אימון אוצר מילים</span>
          </div>
          <h1 className="text-3xl font-black text-white">מאגר מילים ואימונים</h1>
          <p className="text-text-muted text-xs mt-1.5">הזינו את מילות השיעור ותרגלו אותן במגוון דרכים אינטראקטיביות</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border-custom pb-4 justify-start">
          <button
            onClick={() => setActiveTab("manage")}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === "manage"
                ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                : "border-transparent text-text-muted hover:text-white hover:bg-surface/50"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>מאגר המילים ({words.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab("flashcards")}
            disabled={words.length === 0}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 border disabled:opacity-50 disabled:cursor-not-allowed ${
              activeTab === "flashcards"
                ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                : "border-transparent text-text-muted hover:text-white hover:bg-surface/50"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>כרטיסיות מידע</span>
          </button>

          <button
            onClick={() => setActiveTab("quiz")}
            disabled={words.length === 0}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 border disabled:opacity-50 disabled:cursor-not-allowed ${
              activeTab === "quiz"
                ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                : "border-transparent text-text-muted hover:text-white hover:bg-surface/50"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>מבחן אמריקאי</span>
          </button>

          <button
            onClick={() => setActiveTab("spelling")}
            disabled={words.length === 0}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 border disabled:opacity-50 disabled:cursor-not-allowed ${
              activeTab === "spelling"
                ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                : "border-transparent text-text-muted hover:text-white hover:bg-surface/50"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>אימון כתיבה</span>
          </button>

          <button
            onClick={() => setActiveTab("match")}
            disabled={words.length < 4}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 border disabled:opacity-50 disabled:cursor-not-allowed ${
              activeTab === "match"
                ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                : "border-transparent text-text-muted hover:text-white hover:bg-surface/50"
            }`}
            title={words.length < 4 ? "יש להזין לפחות 4 מילים כדי לשחק" : ""}
          >
            <Trophy className="w-4 h-4" />
            <span>משחק התאמה</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="flex-1 w-full">
          {!isLoaded ? (
            <div className="flex justify-center items-center py-20 text-text-muted text-sm">
              בטוען מילים...
            </div>
          ) : words.length === 0 && activeTab !== "manage" ? (
            <div className="glass-card rounded-2xl border border-border-custom p-12 text-center max-w-md mx-auto space-y-4">
              <BookOpen className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">מאגר המילים שלכם ריק</h3>
              <p className="text-text-muted text-xs leading-relaxed">
                כדי להתחיל להתאמן, יש להיכנס ללשונית "מאגר המילים" ולהוסיף מילים או לטעון את רשימת מילות המחדל.
              </p>
              <button
                onClick={() => setActiveTab("manage")}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold text-xs transition-all cursor-pointer"
              >
                עבור למאגר המילים
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* TAB 1: MANAGE WORDS */}
              {activeTab === "manage" && (
                <motion.div
                  key="manage"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {hasLocalWordsToMerge && (
                    <div className="glass-card rounded-2xl border border-cyan-500/30 bg-cyan-950/15 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-right">
                      <div className="flex items-center gap-3">
                        <CloudLightning className="w-5 h-5 text-cyan-400 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-white">יש לכם מילים מקומיות בדפדפן זה</p>
                          <p className="text-xs text-text-muted mt-0.5">מצאנו מילים ששמרתם במחשב זה. האם ברצונכם להעלות ולסנכרן אותן עם החשבון שלכם בענן?</p>
                        </div>
                      </div>
                      <button
                        onClick={handleMergeLocalWords}
                        disabled={isMerging}
                        className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-zinc-950 font-bold text-xs shrink-0 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        {isMerging ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>ממזג מילים...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>סנכרן מילים לענן</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Form to Add Word */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card rounded-2xl border border-border-custom p-6">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-cyan-400" />
                        <span>הוספת מילה חדשה</span>
                      </h3>

                      <form onSubmit={handleAddWord} className="space-y-4 text-right">
                        <div className="space-y-1.5">
                          <label className="text-xs text-text-muted font-bold block">המילה באנגלית</label>
                          <input
                            type="text"
                            placeholder="e.g. significant"
                            value={newEnglish}
                            onChange={(e) => setNewEnglish(e.target.value.replace(/[^a-zA-Z\s-]/g, ""))}
                            dir="ltr"
                            className="w-full h-10 bg-[#0d1222]/80 border border-border-custom rounded-xl px-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-text-muted font-bold block">התרגום לעברית</label>
                          <input
                            type="text"
                            placeholder="לדוגמה: משמעותי"
                            value={newHebrew}
                            onChange={(e) => setNewHebrew(e.target.value)}
                            className="w-full h-10 bg-[#0d1222]/80 border border-border-custom rounded-xl px-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-text-muted font-bold block">חלק דיבר</label>
                          <select
                            value={newPart}
                            onChange={(e) => setNewPart(e.target.value)}
                            className="w-full h-10 bg-[#0f1526] border border-border-custom rounded-xl px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                          >
                            <option value="noun">שם עצם (Noun)</option>
                            <option value="verb">פועל (Verb)</option>
                            <option value="adjective">שם תואר (Adjective)</option>
                            <option value="adverb">תואר הפועל (Adverb)</option>
                            <option value="other">אחר (Other)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-text-muted font-bold block">משפט דוגמה (אופציונלי)</label>
                          <textarea
                            placeholder="e.g. This is a significant improvement."
                            value={newExample}
                            onChange={(e) => setNewExample(e.target.value)}
                            dir="ltr"
                            rows={3}
                            className="w-full bg-[#0d1222]/80 border border-border-custom rounded-xl p-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 resize-none"
                          />
                        </div>

                        {formError && (
                          <div className="text-xs text-rose-400 font-semibold bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg">
                            {formError}
                          </div>
                        )}

                        <button
                          type="submit"
                          className="w-full h-10 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border border-cyan-400/20"
                        >
                          <Plus className="w-4 h-4" />
                          <span>הוסף מילה לרשימה</span>
                        </button>
                      </form>
                    </div>

                    {/* Actions panel */}
                    <div className="glass-card rounded-2xl border border-border-custom p-5 flex justify-between gap-3">
                      <button
                        onClick={handleResetDefaults}
                        className="flex-1 py-2 px-3 rounded-lg border border-border-custom bg-surface hover:bg-surface-hover text-text-muted hover:text-white transition-colors text-xs font-semibold cursor-pointer text-center"
                      >
                        איפוס מילות ברירת מחדל
                      </button>
                      <button
                        onClick={handleClearAll}
                        disabled={words.length === 0}
                        className="flex-1 py-2 px-3 rounded-lg border border-red-950/40 bg-red-950/10 hover:bg-red-900/20 text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-semibold cursor-pointer text-center"
                      >
                        מחק את כל המילים
                      </button>
                    </div>

                    {!user && (
                      <div className="glass-card rounded-2xl border border-cyan-500/20 bg-cyan-950/5 p-5 text-right space-y-3">
                        <p className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 justify-end">
                          <span>שמירה בענן</span>
                          <CloudLightning className="w-3.5 h-3.5 animate-pulse" />
                        </p>
                        <p className="text-xs text-text-muted leading-relaxed">
                          המילים שלכם נשמרות כרגע מקומית בדפדפן זה בלבד. התחברו כדי לשמור אותן בענן ולגשת אליהן מכל מכשיר (מחשב, טאבלט או נייד).
                        </p>
                        <Link
                          href="/login?redirect=/english/vocab-trainer"
                          className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-cyan-400/20"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>התחברו כעת</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Words Table / List */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center gap-4 bg-[#0c1222]/80 border border-border-custom rounded-2xl px-4 py-2">
                      <Search className="w-5 h-5 text-text-muted shrink-0" />
                      <input
                        type="text"
                        placeholder="חיפוש מילה באנגלית או בעברית..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 bg-transparent text-sm text-white placeholder:text-text-muted focus:outline-none text-right"
                      />
                    </div>

                    <div className="glass-card rounded-2xl border border-border-custom overflow-hidden">
                      {filteredWords.length === 0 ? (
                        <div className="py-20 text-center text-text-muted text-xs">
                          לא נמצאו מילים התואמות את החיפוש.
                        </div>
                      ) : (
                        <div className="divide-y divide-border-custom">
                          {filteredWords.map((word) => (
                            <div key={word.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-[#0c1222]/40 transition-colors text-right">
                              {/* Left part: Actions & English Word */}
                              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleDeleteWord(word.id)}
                                    className="p-2 rounded-lg border border-border-custom text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                    title="מחק מילה"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                  
                                  <button
                                    onClick={(e) => handleToggleMastered(word.id, e)}
                                    className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                                      word.mastered
                                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                        : "border-border-custom text-text-muted hover:text-white"
                                    }`}
                                    title={word.mastered ? "סמן כלא נלמד" : "סמן כנלמד"}
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>

                                  {speechSupported && (
                                    <button
                                      onClick={(e) => speakWord(word.english, e)}
                                      className="p-2 rounded-lg border border-border-custom text-text-muted hover:text-cyan-400 hover:bg-cyan-500/10 transition-all cursor-pointer"
                                      title="השמע מילה"
                                    >
                                      <Volume2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>

                                <div className="text-left" dir="ltr">
                                  <span className="font-extrabold text-white text-base tracking-wide block">{word.english}</span>
                                  <span className="text-[10px] font-bold text-cyan-400/80 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/30">
                                    {word.partOfSpeech}
                                  </span>
                                </div>
                              </div>

                              {/* Right part: Hebrew Meaning & Example */}
                              <div className="flex-1 md:max-w-md w-full">
                                <span className="font-bold text-sm text-zinc-200">{word.hebrew}</span>
                                {word.example && (
                                  <p className="text-xs text-text-muted mt-1 leading-relaxed text-left bg-[#080c18]/50 p-2 rounded border border-border-custom/50" dir="ltr">
                                    {word.example}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

              {/* TAB 2: FLASHCARDS */}
              {activeTab === "flashcards" && words.length > 0 && (
                <motion.div
                  key="flashcards"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="max-w-md mx-auto py-4 text-center space-y-6"
                >
                  {/* Progress bar */}
                  <div className="space-y-1.5 text-right">
                    <div className="flex justify-between text-[11px] font-bold text-text-muted">
                      <span>{words.filter(w => w.mastered).length} מתוך {words.length} מילים נלמדו</span>
                      <span>התקדמות המאגר</span>
                    </div>
                    <div className="h-2 w-full bg-surface border border-border-custom rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${(words.filter(w => w.mastered).length / words.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* 3D Flip Card Container */}
                  <div
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="w-full h-80 relative cursor-pointer group perspective-1000"
                  >
                    <div
                      className={`w-full h-full rounded-2xl relative transition-transform duration-500 transform-style-3d border ${
                        isCardFlipped ? "rotate-y-180 border-emerald-500/25" : "border-cyan-500/25"
                      }`}
                    >
                      {/* CARD FRONT: English Word */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-2xl backface-hidden glass-card flex flex-col justify-between p-8"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <div className="flex justify-between items-center text-xs text-text-muted font-bold">
                          <span>כרטיסייה {cardIndex + 1} מתוך {words.length}</span>
                          <span className="text-[10px] text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded bg-cyan-950/20">
                            {words[cardIndex].partOfSpeech}
                          </span>
                        </div>

                        <div className="flex-1 flex flex-col justify-center items-center gap-4">
                          <span className="text-4xl font-black text-white tracking-wider font-sans select-all">
                            {words[cardIndex].english}
                          </span>
                          
                          {speechSupported && (
                            <button
                              onClick={(e) => speakWord(words[cardIndex].english, e)}
                              className="p-3 rounded-full border border-border-custom bg-[#080c18] hover:bg-cyan-500/10 hover:border-cyan-500/40 text-cyan-400 transition-all cursor-pointer"
                              title="השמע מילה"
                            >
                              <Volume2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>

                        <div className="text-[10px] text-text-muted font-bold animate-pulse">
                          לחץ כדי להציג את התרגום
                        </div>
                      </div>

                      {/* CARD BACK: Hebrew Meaning */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-2xl backface-hidden glass-card flex flex-col justify-between p-8 rotate-y-180"
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                      >
                        <div className="flex justify-between items-center text-xs text-text-muted font-bold">
                          <span>תשובה / תרגום</span>
                          {words[cardIndex].mastered && (
                            <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 border border-emerald-800/30 rounded font-bold">
                              נלמד ✓
                            </span>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-center items-center gap-3">
                          <span className="text-3xl font-black text-emerald-400 select-all">
                            {words[cardIndex].hebrew}
                          </span>
                          {words[cardIndex].example && (
                            <p className="text-xs text-zinc-300 max-w-xs mt-2 leading-relaxed bg-[#080c18]/50 p-3 rounded-lg border border-border-custom/50" dir="ltr">
                              {words[cardIndex].example}
                            </p>
                          )}
                        </div>

                        <div className="text-[10px] text-text-muted font-bold">
                          לחץ כדי לחזור למילה
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Navigation */}
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={handlePrevCard}
                      className="p-3 rounded-xl border border-border-custom bg-surface hover:bg-surface-hover text-text-muted hover:text-white transition-all cursor-pointer"
                      title="מילה קודמת"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    <div className="flex gap-2.5">
                      <button
                        onClick={handleCardMastered}
                        disabled={words[cardIndex].mastered}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all border border-emerald-400/20"
                      >
                        <Check className="w-4 h-4" />
                        <span>ידעתי! (סמן כנלמד)</span>
                      </button>

                      <button
                        onClick={(e) => handleToggleMastered(words[cardIndex].id, e)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                          words[cardIndex].mastered
                            ? "bg-rose-950/20 border-rose-800/40 text-rose-400 hover:bg-rose-900/20"
                            : "bg-surface border-border-custom text-text-muted hover:text-white"
                        }`}
                      >
                        {words[cardIndex].mastered ? "הסר מרשימת הנלמדים" : "סמן כצריך חזרה"}
                      </button>
                    </div>

                    <button
                      onClick={handleNextCard}
                      className="p-3 rounded-xl border border-border-custom bg-surface hover:bg-surface-hover text-text-muted hover:text-white transition-all cursor-pointer"
                      title="מילה הבאה"
                    >
                      <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: QUIZ */}
              {activeTab === "quiz" && words.length > 0 && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-xl mx-auto space-y-6"
                >
                  {quizQuestions.length === 0 ? (
                    <div className="text-center py-10 text-text-muted">מייצר שאלות...</div>
                  ) : !quizFinished ? (
                    <div className="glass-card rounded-2xl border border-border-custom p-8 text-right space-y-6">
                      {/* Quiz Header info */}
                      <div className="flex justify-between items-center text-xs text-text-muted font-bold border-b border-border-custom/50 pb-4">
                        <span>שאלה {quizIndex + 1} מתוך {quizQuestions.length}</span>
                        <span className="text-emerald-400">ניקוד: {quizScore}</span>
                      </div>

                      {/* Prompt */}
                      <div className="space-y-3">
                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                          {quizQuestions[quizIndex].type === "fill-blank" ? "השלמת משפט" : quizQuestions[quizIndex].type === "he-to-en" ? "תרגום לעברית" : "תרגום לאנגלית"}
                        </span>
                        
                        <h3 className={`text-xl font-bold text-white leading-relaxed ${quizQuestions[quizIndex].type === "fill-blank" ? "font-serif text-left pt-2" : ""}`} dir={quizQuestions[quizIndex].type === "fill-blank" ? "ltr" : "rtl"}>
                          {quizQuestions[quizIndex].prompt}
                        </h3>

                        {quizQuestions[quizIndex].exampleContext && (
                          <p className="text-xs text-text-muted font-medium bg-[#080c18] p-2.5 rounded-lg border border-border-custom">
                            {quizQuestions[quizIndex].exampleContext}
                          </p>
                        )}

                        {/* Pronunciation of word in quiz */}
                        {quizQuestions[quizIndex].type === "en-to-he" && speechSupported && (
                          <button
                            onClick={() => speakWord(quizQuestions[quizIndex].englishWord)}
                            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>האזנה להגייה</span>
                          </button>
                        )}
                      </div>

                      {/* Options List */}
                      <div className="grid grid-cols-1 gap-3 pt-4">
                        {quizQuestions[quizIndex].options.map((option, idx) => {
                          const isSelected = selectedQuizOption === option;
                          const isCorrectAns = option === quizQuestions[quizIndex].correctAnswer;
                          const hasAnswered = selectedQuizOption !== null;

                          let btnStyle = "border-border-custom bg-surface hover:bg-surface-hover text-white";

                          if (hasAnswered) {
                            if (isCorrectAns) {
                              btnStyle = "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                            } else if (isSelected) {
                              btnStyle = "bg-rose-500/10 border-rose-500/40 text-rose-400 font-bold";
                            } else {
                              btnStyle = "border-border-custom bg-surface/30 text-text-muted opacity-50";
                            }
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => handleQuizAnswer(option)}
                              disabled={hasAnswered}
                              dir={quizQuestions[quizIndex].type === "he-to-en" || quizQuestions[quizIndex].type === "fill-blank" ? "ltr" : "rtl"}
                              className={`w-full py-4 px-6 rounded-xl border text-right font-semibold text-sm transition-all cursor-pointer flex justify-between items-center ${btnStyle} ${
                                quizQuestions[quizIndex].type === "he-to-en" || quizQuestions[quizIndex].type === "fill-blank" ? "text-left font-serif" : ""
                              }`}
                            >
                              <span>{option}</span>
                              {hasAnswered && isCorrectAns && <Check className="w-4 h-4 text-emerald-400" />}
                              {hasAnswered && isSelected && !isCorrectAns && <X className="w-4 h-4 text-rose-400" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Action Button */}
                      {selectedQuizOption !== null && (
                        <div className="flex justify-end pt-4 border-t border-border-custom/50">
                          <button
                            onClick={handleNextQuizQuestion}
                            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <span>{quizIndex === quizQuestions.length - 1 ? "סיים בוחן" : "לשאלה הבאה"}</span>
                            <ArrowRight className="w-4 h-4 rotate-180" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Quiz Results Panel
                    <div className="glass-card rounded-2xl border border-border-custom p-10 text-center space-y-6">
                      <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto text-3xl font-black">
                        {Math.round((quizScore / quizQuestions.length) * 100)}%
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-white">הבוחן הושלם בהצלחה!</h3>
                        <p className="text-text-muted text-sm leading-relaxed">
                          עניתם נכון על <span className="text-cyan-400 font-bold">{quizScore}</span> מתוך <span className="text-white font-bold">{quizQuestions.length}</span> שאלות.
                        </p>
                      </div>

                      <div className="flex justify-center gap-3">
                        <button
                          onClick={startNewQuiz}
                          className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>בוחן חדש</span>
                        </button>

                        <button
                          onClick={() => setActiveTab("manage")}
                          className="px-5 py-2.5 rounded-xl border border-border-custom bg-surface hover:bg-surface-hover text-text-muted hover:text-white transition-all text-xs font-semibold cursor-pointer"
                        >
                          חזרה למאגר
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 4: SPELLING GAME */}
              {activeTab === "spelling" && words.length > 0 && (
                <motion.div
                  key="spelling"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-xl mx-auto space-y-6"
                >
                  {spellingWords.length === 0 ? (
                    <div className="text-center py-10 text-text-muted">טוען שאלות...</div>
                  ) : !spellingFinished ? (
                    <div className="glass-card rounded-2xl border border-border-custom p-8 text-right space-y-6">
                      <div className="flex justify-between items-center text-xs text-text-muted font-bold border-b border-border-custom/50 pb-4">
                        <span>מילה {spellingIndex + 1} מתוך {spellingWords.length}</span>
                        <span className="text-emerald-400">ניקוד: {spellingScore}</span>
                      </div>

                      <div className="space-y-4">
                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                          אימון כתיבה ואיות
                        </span>
                        
                        <div className="space-y-1">
                          <p className="text-xs text-text-muted font-bold">כיצד כותבים באנגלית:</p>
                          <h3 className="text-2xl font-black text-white">
                            {spellingWords[spellingIndex].hebrew}
                          </h3>
                        </div>

                        {spellingWords[spellingIndex].example && (
                          <div className="bg-[#080c18] border border-border-custom rounded-xl p-3.5 text-left" dir="ltr">
                            <p className="text-xs text-text-muted font-bold mb-1.5 text-right" dir="rtl">
                              משפט דוגמה להקשר:
                            </p>
                            <p className="text-sm font-serif text-zinc-300">
                              {spellingWords[spellingIndex].example!.replace(
                                new RegExp(`\\b${spellingWords[spellingIndex].english}\\b`, "gi"),
                                "_______"
                              )}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Spell Form */}
                      <form onSubmit={handleCheckSpelling} className="space-y-4">
                        <div className="space-y-1.5 text-left">
                          <input
                            type="text"
                            placeholder="Type the English word..."
                            value={spellingInput}
                            onChange={(e) => setSpellingInput(e.target.value.replace(/[^a-zA-Z\s-]/g, ""))}
                            disabled={spellingChecked}
                            dir="ltr"
                            className={`w-full h-12 bg-[#0d1222]/80 border rounded-xl px-4 text-base font-bold font-serif text-white focus:outline-none focus:ring-1 transition-all ${
                              spellingChecked
                                ? spellingCorrect
                                  ? "border-emerald-500/50 focus:ring-emerald-500/30"
                                  : "border-rose-500/50 focus:ring-rose-500/30"
                                : "border-border-custom focus:border-cyan-500/50 focus:ring-cyan-500/30"
                            }`}
                          />
                        </div>

                        {/* Speech option */}
                        {spellingChecked && speechSupported && (
                          <div className="flex justify-start">
                            <button
                              type="button"
                              onClick={() => speakWord(spellingWords[spellingIndex].english)}
                              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                            >
                              <Volume2 className="w-4 h-4" />
                              <span>האזנה להגייה הנכונה</span>
                            </button>
                          </div>
                        )}

                        {/* Checked Feedback */}
                        {spellingChecked && (
                          <div className={`p-4 rounded-xl border flex items-center justify-between text-right text-sm ${
                            spellingCorrect
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                          }`}>
                            {spellingCorrect ? (
                              <div className="flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                <span className="font-bold">כל הכבוד! אייתתם נכון.</span>
                              </div>
                            ) : (
                              <div>
                                <p className="font-bold">טעות קלה באיות.</p>
                                <p className="text-xs mt-1 opacity-90">
                                  הכתיב הנכון הוא: <span className="font-mono font-bold select-all bg-[#080c18] px-2 py-0.5 border border-border-custom rounded" dir="ltr">{spellingWords[spellingIndex].english}</span>
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Form Buttons */}
                        <div className="flex justify-end gap-3 pt-2">
                          {!spellingChecked ? (
                            <button
                              type="submit"
                              disabled={!spellingInput.trim()}
                              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-bold text-xs transition-all cursor-pointer"
                            >
                              בדוק איוש
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleNextSpelling}
                              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <span>{spellingIndex === spellingWords.length - 1 ? "סיים אימון" : "למילה הבאה"}</span>
                              <ArrowRight className="w-4 h-4 rotate-180" />
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                  ) : (
                    // Spelling Finished Panel
                    <div className="glass-card rounded-2xl border border-border-custom p-10 text-center space-y-6">
                      <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto text-3xl font-black">
                        {Math.round((spellingScore / spellingWords.length) * 100)}%
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-white">אימון הכתיבה הושלם!</h3>
                        <p className="text-text-muted text-sm leading-relaxed">
                          אייתתם נכון <span className="text-cyan-400 font-bold">{spellingScore}</span> מתוך <span className="text-white font-bold">{spellingWords.length}</span> מילים.
                        </p>
                      </div>

                      <div className="flex justify-center gap-3">
                        <button
                          onClick={startNewSpelling}
                          className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>אימון חדש</span>
                        </button>

                        <button
                          onClick={() => setActiveTab("manage")}
                          className="px-5 py-2.5 rounded-xl border border-border-custom bg-surface hover:bg-surface-hover text-text-muted hover:text-white transition-all text-xs font-semibold cursor-pointer"
                        >
                          חזרה למאגר
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 5: MATCH GAME */}
              {activeTab === "match" && words.length >= 4 && (
                <motion.div
                  key="match"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="max-w-2xl mx-auto space-y-6"
                >
                  {/* Stats display */}
                  <div className="flex justify-between items-center bg-[#0c1222]/80 border border-border-custom rounded-2xl p-4 text-xs font-bold text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <span>מהלכים:</span>
                      <span className="text-white">{matchMoves}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span>זמן:</span>
                      <span className="text-cyan-400">
                        {Math.floor(matchTimer / 60)}:{(matchTimer % 60).toString().padStart(2, "0")}
                      </span>
                    </div>

                    <button
                      onClick={startNewMatchGame}
                      className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>אתחל משחק</span>
                    </button>
                  </div>

                  {!matchCompleted ? (
                    /* Matrix Grid */
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {matchCards.map((card, idx) => {
                        return (
                          <div
                            key={card.id}
                            onClick={() => handleMatchCardClick(idx)}
                            className={`h-24 rounded-xl border transition-all duration-300 flex items-center justify-center p-3 text-center cursor-pointer select-none relative overflow-hidden ${
                              card.isMatched
                                ? "bg-emerald-950/10 border-emerald-500/20 text-emerald-500/40 opacity-40 cursor-default"
                                : card.isFlipped
                                  ? card.type === "english"
                                    ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)] scale-[1.02]"
                                    : "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] scale-[1.02]"
                                  : "bg-surface border-border-custom text-zinc-300 hover:border-zinc-700 hover:text-white"
                            }`}
                          >
                            <span
                              className={`text-xs md:text-sm font-bold leading-normal ${
                                card.isFlipped && card.type === "english" ? "font-serif text-sm tracking-wide" : ""
                              }`}
                              dir={card.isFlipped && card.type === "english" ? "ltr" : "rtl"}
                            >
                              {card.isFlipped || card.isMatched ? card.text : "?"}
                            </span>

                            {card.isMatched && (
                              <div className="absolute top-2 right-2">
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Completion state */
                    <div className="glass-card rounded-2xl border border-border-custom p-10 text-center space-y-6 max-w-md mx-auto">
                      <Trophy className="w-12 h-12 text-yellow-500 mx-auto" />
                      
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-white">כל הכבוד!</h3>
                        <p className="text-text-muted text-sm">התאמתם את כל הזוגות בהצלחה!</p>
                      </div>

                      <div className="bg-[#080c18] border border-border-custom rounded-xl p-4 grid grid-cols-2 divide-x divide-border-custom">
                        <div className="text-center p-1">
                          <p className="text-[10px] text-text-muted uppercase font-bold">מהלכים</p>
                          <p className="text-xl font-extrabold text-white mt-1">{matchMoves}</p>
                        </div>
                        <div className="text-center p-1">
                          <p className="text-[10px] text-text-muted uppercase font-bold">זמן משחק</p>
                          <p className="text-xl font-extrabold text-cyan-400 mt-1">
                            {Math.floor(matchTimer / 60)}:{(matchTimer % 60).toString().padStart(2, "0")}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-center gap-3">
                        <button
                          onClick={startNewMatchGame}
                          className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>שחק שוב</span>
                        </button>
                        
                        <button
                          onClick={() => setActiveTab("manage")}
                          className="px-5 py-2.5 rounded-xl border border-border-custom bg-surface hover:bg-surface-hover text-text-muted hover:text-white transition-all text-xs font-semibold cursor-pointer"
                        >
                          חזרה למאגר
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-border-custom text-xs text-text-muted relative z-10 bg-surface/30 shrink-0">
        <span>© {new Date().getFullYear()} ניר עוז-ארי — אימון מילים באנגלית</span>
      </footer>
    </div>
  );
}
