"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Users,
  Grid,
  Clock,
  Play,
  ArrowLeft,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Plus,
  Trash2,
  BookOpen,
  CheckCircle2,
  Loader2,
  Layers,
  Wand2,
  Flame,
  Award
} from "lucide-react";
import { colorMap, colorsList } from "@/lib/colors";
import { sounds } from "@/lib/sounds";
import { useAuth } from "@/lib/context/AuthContext";
import { loadScopedLocalWords } from "@/lib/vocab-storage";
import { PRESET_PACKS, PresetPack } from "@/lib/crossword/presets";
import { generateCrosswordGrid, dealTeamRack } from "@/lib/crossword/generator";
import { saveActiveGame } from "@/lib/crossword/game-storage";
import { GameMode, GameState, RawVocabularyItem, Team } from "@/lib/crossword/types";

interface SetupTeam {
  id: string;
  name: string;
  color: string;
}

const DEFAULT_TEAMS: SetupTeam[] = [
  { id: "team-1", name: "Team Emerald", color: "emerald" },
  { id: "team-2", name: "Team Sky", color: "sky" },
  { id: "team-3", name: "Team Amber", color: "amber" },
  { id: "team-4", name: "Team Rose", color: "rose" }
];

export default function CrosswordClashSetupPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Comfort Reading Mode
  const [comfortMode, setComfortMode] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const stored = localStorage.getItem("teaching-site-comfort-mode");
    if (stored === "dark" || stored === "light") {
      setComfortMode(stored);
    }
  }, []);

  const toggleComfortMode = () => {
    const next = comfortMode === "dark" ? "light" : "dark";
    setComfortMode(next);
    localStorage.setItem("teaching-site-comfort-mode", next);
  };
  const isLight = comfortMode === "light";

  // Audio state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const toggleSound = () => {
    const next = sounds.toggle();
    setSoundEnabled(next);
  };

  // Game Configuration State
  const [mode, setMode] = useState<GameMode>("simultaneous");
  const [teams, setTeams] = useState<SetupTeam[]>(DEFAULT_TEAMS);
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorsList[4] || "violet");

  // Vocabulary Source Tabs
  const [vocabTab, setVocabTab] = useState<"ai" | "presets" | "custom">("ai");

  // AI Generator state
  const [aiTopic, setAiTopic] = useState("Animals & Wild Nature");
  const [aiGrade, setAiGrade] = useState("7th grade");
  const [aiDifficulty, setAiDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Selected Preset
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_PACKS[0].id);

  // Custom / Imported Words
  const [customWordsText, setCustomWordsText] = useState("");
  const [userSavedWords, setUserSavedWords] = useState<any[]>([]);

  // Settings
  const [roundTimer, setRoundTimer] = useState<number>(90);
  const [showHebrewHints, setShowHebrewHints] = useState(false);

  // Load saved words from Vocab Trainer on mount
  useEffect(() => {
    const words = loadScopedLocalWords(user?.uid);
    if (words && words.length > 0) {
      setUserSavedWords(words);
    }
  }, [user?.uid]);

  // Add Team
  const handleAddTeam = () => {
    if (!newTeamName.trim()) return;
    if (teams.length >= 6) {
      alert("Maximum 6 teams allowed for optimal board visibility.");
      return;
    }
    const newTeam: SetupTeam = {
      id: `team-${Date.now()}`,
      name: newTeamName.trim(),
      color: selectedColor
    };
    setTeams([...teams, newTeam]);
    setNewTeamName("");
    // Cycle color
    const nextIdx = (colorsList.indexOf(selectedColor) + 1) % colorsList.length;
    setSelectedColor(colorsList[nextIdx]);
  };

  const handleRemoveTeam = (id: string) => {
    if (teams.length <= 2) {
      alert("At least 2 teams are required to play!");
      return;
    }
    setTeams(teams.filter(t => t.id !== id));
  };

  const handleImportVocabTrainer = () => {
    if (userSavedWords.length === 0) {
      alert("No saved words found in your Vocab Trainer yet!");
      return;
    }
    const formatted = userSavedWords
      .slice(0, 15)
      .map(w => `${w.english} - ${w.hebrew}`)
      .join("\n");
    setCustomWordsText(formatted);
  };

  // Launch Game
  const handleStartGame = async () => {
    if (teams.length < 2) {
      alert("Please configure at least 2 teams.");
      return;
    }

    let targetWords: RawVocabularyItem[] = [];
    let gameTopic = "Classroom Vocabulary";

    if (vocabTab === "presets") {
      const preset = PRESET_PACKS.find(p => p.id === selectedPresetId) || PRESET_PACKS[0];
      targetWords = preset.words;
      gameTopic = preset.name;
    } else if (vocabTab === "ai") {
      setIsGeneratingAi(true);
      setAiError(null);
      try {
        const res = await fetch("/api/generate-crossword", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: aiTopic,
            grade: aiGrade,
            difficulty: aiDifficulty
          })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to generate AI crossword");
        }
        targetWords = data.words;
        gameTopic = data.topic;
      } catch (err: any) {
        console.error("AI Generation error:", err);
        setAiError(err.message || "Failed to connect to AI service. Using preset instead.");
        // Fallback to preset if AI failed
        const fallback = PRESET_PACKS[0];
        targetWords = fallback.words;
        gameTopic = `${fallback.name} (Fallback)`;
      } finally {
        setIsGeneratingAi(false);
      }
    } else {
      // Custom words
      const lines = customWordsText
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean);

      if (lines.length < 4) {
        alert("Please enter at least 4 words (one per line). Format: WORD - CLUE");
        return;
      }

      targetWords = lines.map(line => {
        const parts = line.split("-");
        const word = parts[0]?.trim().toUpperCase().replace(/[^A-Z]/g, "") || "WORD";
        const clueOrTrans = parts[1]?.trim() || `Definition of ${word}`;
        return {
          word,
          clue: clueOrTrans,
          hebrewHint: clueOrTrans
        };
      });
      gameTopic = "Custom Vocabulary";
    }

    // Build Crossword Grid
    const grid = generateCrosswordGrid(targetWords, 8, 10);
    if (grid.words.length < 3) {
      alert("Could not generate a valid interlocking crossword from these words. Try choosing a different preset or topic.");
      return;
    }

    // Initialize Teams with 5-Letter Racks
    const initializedTeams: Team[] = teams.map(t => ({
      id: t.id,
      name: t.name,
      color: t.color,
      score: 0,
      rack: dealTeamRack(grid, []),
      pendingPlacements: [],
      wordsCompleted: 0,
      stats: {
        correctLetters: 0,
        wrongLetters: 0
      }
    }));

    const gameState: GameState = {
      id: `clash-${Date.now()}`,
      title: "Crossword Clash",
      topic: gameTopic,
      mode,
      grid,
      teams: initializedTeams,
      currentTeamIndex: 0,
      roundNumber: 1,
      isTimerRunning: roundTimer > 0,
      timeLeft: roundTimer,
      isGameOver: false,
      settings: {
        roundTimerSeconds: roundTimer,
        pointsPerCorrect: 10,
        penaltyPerWrong: -5,
        wordCompletionBonus: 30,
        allLettersBonus: 20,
        showHebrewHints
      }
    };

    saveActiveGame(gameState);
    sounds.playPop();
    router.push("/english/crossword-clash/play");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isLight ? "bg-slate-50 text-slate-900" : "bg-zinc-950 text-zinc-100"
      }`}
    >
      {/* Top Navigation */}
      <header
        className={`border-b sticky top-0 z-30 backdrop-blur-md px-6 py-4 transition-colors ${
          isLight ? "bg-white/80 border-slate-200" : "bg-zinc-900/80 border-zinc-800"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/english"
              className={`p-2 rounded-xl border transition-all ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
                  : "bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-zinc-300"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                #
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  CROSSWORD CLASH
                </h1>
                <p className={`text-xs ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                  קרב התשבצים הכיתתי • לוח 8x10
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
                  : "bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-zinc-300"
              }`}
              title={soundEnabled ? "השתק צלילים" : "הפעל צלילים"}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-cyan-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-zinc-500" />
              )}
            </button>

            {/* Comfort Reading Mode Toggle */}
            <button
              onClick={toggleComfortMode}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
                  : "bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-zinc-300"
              }`}
              title="Comfort Reading Mode (מצב תצוגה)"
            >
              {isLight ? <Moon className="w-5 h-5 text-indigo-500" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Hero Banner */}
        <div
          className={`p-6 md:p-8 rounded-3xl border relative overflow-hidden transition-all ${
            isLight
              ? "bg-gradient-to-br from-indigo-50 via-cyan-50 to-white border-indigo-100 shadow-sm"
              : "bg-gradient-to-br from-indigo-950/40 via-zinc-900/60 to-zinc-950 border-indigo-500/20"
          }`}
        >
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              משחק כיתתי אינטראקטיבי בהשראת Crossword Master
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              התאימו אותיות, השלימו הגדרות וצברו נקודות!
            </h2>
            <p className={`text-sm md:text-base leading-relaxed ${isLight ? "text-slate-600" : "text-zinc-300"}`}>
              חלקו את הכיתה ל-2 עד 6 קבוצות. כל קבוצה מקבלת 5 אותיות ועליה לזהות היכן למקם אותן בלוח התשבץ לפי ההגדרות.
              אות נכונה מעניקה 10 נקודות, אך אות שגויה מפחיתה 5 נקודות!
            </p>
          </div>
        </div>

        {/* Section 1: Choose Game Mode */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold">1. בחרו סגנון משחק כיתתי</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mode 1: Simultaneous Clash */}
            <div
              onClick={() => setMode("simultaneous")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                mode === "simultaneous"
                  ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                  : isLight
                  ? "border-slate-200 hover:border-slate-300 bg-white"
                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base">סיבוב סימולטני (מומלץ לכיתה)</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500 text-black">
                      מומלץ
                    </span>
                  </div>
                  <p className={`text-xs ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                    כל הקבוצות מקבלות 5 אותיות וחושבות יחד במקביל עם טיימר. בתום הזמן המורה מזין את המהלכים על הלוח וכל הקבוצות מקבלות ניקוד יחד.
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    mode === "simultaneous" ? "border-cyan-500 bg-cyan-500" : "border-zinc-600"
                  }`}
                >
                  {mode === "simultaneous" && <CheckCircle2 className="w-4 h-4 text-black" />}
                </div>
              </div>
            </div>

            {/* Mode 2: Turn-by-Turn */}
            <div
              onClick={() => setMode("turn-by-turn")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                mode === "turn-by-turn"
                  ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                  : isLight
                  ? "border-slate-200 hover:border-slate-300 bg-white"
                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="font-bold text-base">תור אחר תור (Turn-by-Turn)</span>
                  <p className={`text-xs ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                    כל קבוצה עולה בתורה ללוח החכם (או אומרת למורה), מניחה את האותיות שלה ומקבלת ניקוד מיידי.
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    mode === "turn-by-turn" ? "border-indigo-500 bg-indigo-500" : "border-zinc-600"
                  }`}
                >
                  {mode === "turn-by-turn" && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Teams Setup */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold">2. הגדרת קבוצות (2–6 קבוצות)</h3>
            </div>
            <span className={`text-xs ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
              {teams.length} מתוך 6 קבוצות
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {teams.map((team, idx) => {
              const theme = colorMap[team.color] || colorMap.sky;
              return (
                <div
                  key={team.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    isLight ? "bg-white border-slate-200" : "bg-zinc-900/60 border-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${theme.solidBg} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                      {idx + 1}
                    </div>
                    <div>
                      <input
                        type="text"
                        value={team.name}
                        onChange={e => {
                          const updated = [...teams];
                          updated[idx].name = e.target.value;
                          setTeams(updated);
                        }}
                        className={`text-sm font-bold bg-transparent outline-none border-b border-transparent focus:border-cyan-500 w-32 ${
                          isLight ? "text-slate-900" : "text-white"
                        }`}
                      />
                      <p className="text-[10px] text-zinc-500 capitalize">{team.color}</p>
                    </div>
                  </div>

                  {teams.length > 2 && (
                    <button
                      onClick={() => handleRemoveTeam(team.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="הסר קבוצה"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}

            {teams.length < 6 && (
              <div
                className={`p-3.5 rounded-2xl border border-dashed flex items-center gap-2 ${
                  isLight ? "border-slate-300 bg-slate-50/50" : "border-zinc-700 bg-zinc-900/30"
                }`}
              >
                <input
                  type="text"
                  placeholder="שם קבוצה חדשה..."
                  value={newTeamName}
                  onChange={e => setNewTeamName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddTeam()}
                  className={`text-xs px-2.5 py-1.5 rounded-xl border flex-1 bg-transparent outline-none ${
                    isLight ? "border-slate-300 text-slate-800" : "border-zinc-700 text-zinc-200"
                  }`}
                />
                <button
                  onClick={handleAddTeam}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  הוסף
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Vocabulary Source */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold">3. בחירת אוצר מילים לתשבץ</h3>
          </div>

          {/* Source Tabs */}
          <div
            className={`p-1 rounded-2xl border inline-flex gap-1 ${
              isLight ? "bg-slate-100 border-slate-200" : "bg-zinc-900 border-zinc-800"
            }`}
          >
            <button
              onClick={() => setVocabTab("ai")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                vocabTab === "ai"
                  ? "bg-indigo-600 text-white shadow-md"
                  : isLight
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              מחולל בינה מלאכותית (Gemini)
            </button>

            <button
              onClick={() => setVocabTab("presets")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                vocabTab === "presets"
                  ? "bg-indigo-600 text-white shadow-md"
                  : isLight
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              ערכות מוכנות מראש
            </button>

            <button
              onClick={() => setVocabTab("custom")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                vocabTab === "custom"
                  ? "bg-indigo-600 text-white shadow-md"
                  : isLight
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              ייבוא מילים / הקלדה חופשית
            </button>
          </div>

          {/* AI Generator Tab Panel */}
          {vocabTab === "ai" && (
            <div
              className={`p-5 rounded-2xl border space-y-4 ${
                isLight ? "bg-white border-slate-200" : "bg-zinc-900/60 border-zinc-800"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1">נושא / Topic</label>
                  <input
                    type="text"
                    value={aiTopic}
                    onChange={e => setAiTopic(e.target.value)}
                    placeholder="למשל: Space, Food, Jobs..."
                    className={`w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-indigo-500 ${
                      isLight ? "border-slate-300 text-slate-800" : "border-zinc-700 text-zinc-100"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">שכבת גיל / כיתה</label>
                  <select
                    value={aiGrade}
                    onChange={e => setAiGrade(e.target.value)}
                    className={`w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-indigo-500 ${
                      isLight ? "border-slate-300 text-slate-800" : "border-zinc-700 text-zinc-100 bg-zinc-900"
                    }`}
                  >
                    <option value="5th grade">כיתה ה׳ (5th Grade)</option>
                    <option value="6th grade">כיתה ו׳ (6th Grade)</option>
                    <option value="7th grade">כיתה ז׳ (7th Grade)</option>
                    <option value="8th grade">כיתה ח׳ (8th Grade)</option>
                    <option value="9th grade">כיתה ט׳ (9th Grade)</option>
                    <option value="High school">תיכון (High School)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">רמת קושי</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(["Easy", "Medium", "Hard"] as const).map(diff => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setAiDifficulty(diff)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          aiDifficulty === diff
                            ? "bg-indigo-600 text-white"
                            : isLight
                            ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        }`}
                      >
                        {diff === "Easy" ? "קל" : diff === "Medium" ? "בינוני" : "מאתגר"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {aiError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {aiError}
                </div>
              )}
            </div>
          )}

          {/* Presets Tab Panel */}
          {vocabTab === "presets" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRESET_PACKS.map(pack => (
                <div
                  key={pack.id}
                  onClick={() => setSelectedPresetId(pack.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPresetId === pack.id
                      ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                      : isLight
                      ? "border-slate-200 hover:border-slate-300 bg-white"
                      : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl">{pack.icon}</span>
                    <span className="font-bold text-sm">{pack.name}</span>
                  </div>
                  <p className={`text-xs mb-2 ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                    {pack.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>{pack.words.length} מילים</span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-500/10 border border-zinc-500/20">
                      {pack.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Custom Words Tab Panel */}
          {vocabTab === "custom" && (
            <div
              className={`p-5 rounded-2xl border space-y-3 ${
                isLight ? "bg-white border-slate-200" : "bg-zinc-900/60 border-zinc-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">הזינו מילים (מילה אחת בכל שורה - פורמט: WORD - DEFINITION)</span>
                {userSavedWords.length > 0 && (
                  <button
                    onClick={handleImportVocabTrainer}
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold cursor-pointer"
                  >
                    ייבא ממאגר אוצר המילים שלי ({userSavedWords.length} מילים)
                  </button>
                )}
              </div>
              <textarea
                rows={5}
                value={customWordsText}
                onChange={e => setCustomWordsText(e.target.value)}
                placeholder={"TIGER - A wild cat with stripes\nMONKEY - Loves climbing and bananas\nEAGLE - Bird with sharp eyes"}
                className={`w-full text-xs p-3 rounded-xl border bg-transparent font-mono outline-none focus:border-indigo-500 ${
                  isLight ? "border-slate-300 text-slate-800" : "border-zinc-700 text-zinc-100"
                }`}
              />
            </div>
          )}
        </section>

        {/* Section 4: Rules & Settings */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold">4. טיימר והגדרות ניקוד</h3>
          </div>

          <div
            className={`p-5 rounded-2xl border grid grid-cols-1 md:grid-cols-2 gap-6 ${
              isLight ? "bg-white border-slate-200" : "bg-zinc-900/60 border-zinc-800"
            }`}
          >
            <div>
              <label className="text-xs font-bold block mb-2">זמן לסיבוב / Round Timer</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "60 שנ׳", val: 60 },
                  { label: "90 שנ׳", val: 90 },
                  { label: "120 שנ׳", val: 120 },
                  { label: "ללא", val: 0 }
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setRoundTimer(opt.val)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      roundTimer === opt.val
                        ? "bg-cyan-500 text-black shadow-md"
                        : isLight
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-2">שיטת ניקוד</label>
              <div className="text-xs text-zinc-400 space-y-1">
                <p>• אות נכונה: <span className="text-emerald-400 font-bold">+10 נקודות</span></p>
                <p>• אות שגויה: <span className="text-rose-400 font-bold">-5 נקודות</span></p>
                <p>• השלמת מילה: <span className="text-amber-400 font-bold">+30 נקודות בונוס</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* Start Game Action */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={handleStartGame}
            disabled={isGeneratingAi}
            className="w-full md:w-auto px-12 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-teal-500 hover:opacity-95 text-white font-black text-lg shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            {isGeneratingAi ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>מייצר תשבץ מותאם עם AI...</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-white" />
                <span>התחל את המשחק הכיתתי!</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
