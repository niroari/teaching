"use client";

import React from "react";
import { SlidersHorizontal, Timer, Globe, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface GameSettings {
  categories: {
    cities: boolean;
    nature: boolean;
    heritage: boolean;
    regions: boolean;
  };
  regions: {
    north: boolean;
    center: boolean;
    south: boolean;
    jerusalem: boolean;
    east: boolean;
  };
  difficulties: {
    easy: boolean;
    medium: boolean;
    hard: boolean;
  };
  timerDuration: number;
  englishEnabled: boolean;
}

interface SettingsPanelProps {
  settings: GameSettings;
  onChange: (settings: GameSettings) => void;
}

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const toggleCategory = (key: keyof GameSettings["categories"]) => {
    const updated = {
      ...settings.categories,
      [key]: !settings.categories[key],
    };
    if (Object.values(updated).some(Boolean)) {
      onChange({ ...settings, categories: updated });
    }
  };

  const toggleRegion = (key: keyof GameSettings["regions"]) => {
    const updated = {
      ...settings.regions,
      [key]: !settings.regions[key],
    };
    if (Object.values(updated).some(Boolean)) {
      onChange({ ...settings, regions: updated });
    }
  };

  const toggleDifficulty = (key: keyof GameSettings["difficulties"]) => {
    const updated = {
      ...settings.difficulties,
      [key]: !settings.difficulties[key],
    };
    if (Object.values(updated).some(Boolean)) {
      onChange({ ...settings, difficulties: updated });
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="gap-2 border-line text-fg-muted hover:text-fg hover:bg-subtle-hover"
          >
            <SlidersHorizontal className="w-4 h-4" />
            הגדרות משחק
          </Button>
        }
      />
      <DialogContent className="max-w-lg bg-subtle text-fg border-line p-6 rounded-xl shadow-sm" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 mb-4 text-fg">
            <SlidersHorizontal className="w-5 h-5 text-accent" />
            הגדרות המשחק
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Difficulty Selection */}
          <div>
            <h3 className="text-sm font-semibold text-fg-muted mb-2">רמת קושי</h3>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(settings.difficulties) as Array<keyof GameSettings["difficulties"]>).map((diff) => {
                const labels = { easy: "קל", medium: "בינוני", hard: "קשה" };
                const isSelected = settings.difficulties[diff];
                return (
                  <Button
                    key={diff}
                    variant={isSelected ? "default" : "outline"}
                    className={`h-10 text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-accent hover:bg-accent-soft text-fg shadow"
                        : "border-line text-fg hover:bg-subtle-hover"
                    }`}
                    onClick={() => toggleDifficulty(diff)}
                  >
                    {isSelected && <Check className="w-4 h-4 ml-1.5 inline-block" />}
                    {labels[diff]}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <h3 className="text-sm font-semibold text-fg-muted mb-2">קטגוריות מקומות</h3>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(settings.categories) as Array<keyof GameSettings["categories"]>).map((cat) => {
                const labels = {
                  cities: "ערים ויישובים",
                  nature: "טבע ומים",
                  heritage: "אתרי מורשת והיסטוריה",
                  regions: "אזורים גיאוגרפיים",
                };
                const isSelected = settings.categories[cat];
                return (
                  <Button
                    key={cat}
                    variant={isSelected ? "default" : "outline"}
                    className={`h-10 text-sm font-medium justify-start px-3 transition-all ${
                      isSelected
                        ? "bg-accent hover:bg-accent-soft text-fg shadow"
                        : "border-line text-fg hover:bg-subtle-hover"
                    }`}
                    onClick={() => toggleCategory(cat)}
                  >
                    {isSelected && <Check className="w-4 h-4 ml-2 shrink-0" />}
                    <span>{labels[cat]}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Region Selection */}
          <div>
            <h3 className="text-sm font-semibold text-fg-muted mb-2">אזורים בארץ</h3>
            <div className="grid grid-cols-5 gap-1.5">
              {(Object.keys(settings.regions) as Array<keyof GameSettings["regions"]>).map((reg) => {
                const labels = {
                  north: "צפון",
                  center: "מרכז",
                  south: "דרום",
                  jerusalem: "ירושלים",
                  east: "מזרח",
                };
                const isSelected = settings.regions[reg];
                return (
                  <Button
                    key={reg}
                    variant={isSelected ? "default" : "outline"}
                    className={`h-9 px-1 text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-accent hover:bg-accent-soft text-fg shadow"
                        : "border-line text-fg hover:bg-subtle-hover"
                    }`}
                    onClick={() => toggleRegion(reg)}
                  >
                    {labels[reg]}
                  </Button>
                );
              })}
            </div>
          </div>

          <hr className="border-line" />

          {/* Other settings */}
          <div className="space-y-4">
            {/* Timer Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 text-fg-muted" />
                <div>
                  <div className="text-sm font-semibold text-fg">טיימר שאלות</div>
                  <div className="text-xs text-fg-muted">הגבלת זמן למציאת המקום במפה</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {[0, 15, 30, 60].map((sec) => (
                  <Button
                    key={sec}
                    size="sm"
                    variant={settings.timerDuration === sec ? "default" : "outline"}
                    className={`h-7 px-2.5 text-xs ${
                      settings.timerDuration === sec
                        ? "bg-accent hover:bg-accent-soft text-fg"
                        : "border-line text-fg hover:bg-subtle-hover"
                    }`}
                    onClick={() => onChange({ ...settings, timerDuration: sec })}
                  >
                    {sec === 0 ? "ללא" : `${sec} ש'`}
                  </Button>
                ))}
              </div>
            </div>

            {/* English translation settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-fg-muted" />
                <div>
                  <div className="text-sm font-semibold text-fg">תרגום לאנגלית</div>
                  <div className="text-xs text-fg-muted">הצגת שם המקום גם באנגלית</div>
                </div>
              </div>
              <Switch
                checked={settings.englishEnabled}
                onCheckedChange={(checked) => onChange({ ...settings, englishEnabled: checked })}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
