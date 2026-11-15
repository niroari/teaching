"use client";

import React, { useEffect, useRef, useState } from "react";
import { Eraser, Pencil, Trash2 } from "lucide-react";
import type { MissionTheme } from "./theme";

const WIDTH = 600;
const HEIGHT = 400;
const COLORS = ["#111827", "#dc2626", "#2563eb", "#f59e0b"];

function paintWhite(canvas: HTMLCanvasElement | null) {
  const c = canvas?.getContext("2d");
  if (!c) return;
  c.fillStyle = "#ffffff";
  c.fillRect(0, 0, WIDTH, HEIGHT);
}

interface Props {
  value?: string;
  disabled?: boolean;
  onSave: (dataUrl: string) => void;
  theme: MissionTheme;
}

// A small paper-like drawing board. Works with mouse, pen and touch, and saves
// the picture as a compressed JPEG data URL after every stroke.
export default function DrawingCanvas({ value, disabled, onSave, theme }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState(COLORS[0]);
  const [eraser, setEraser] = useState(false);
  // `null` means "nothing loaded yet", so an empty board is still painted white on mount.
  const lastLoaded = useRef<string | undefined | null>(null);

  const ctx = () => canvasRef.current?.getContext("2d") ?? null;
  const paintBackground = () => paintWhite(canvasRef.current);

  // Load the saved drawing (also when the partner saves a new one), but never
  // while this user is in the middle of a stroke.
  useEffect(() => {
    if (drawing.current || value === lastLoaded.current) return;
    lastLoaded.current = value;
    const canvas = canvasRef.current;
    paintWhite(canvas);
    if (!value || !canvas) return;
    const img = new Image();
    img.onload = () => canvas.getContext("2d")?.drawImage(img, 0, 0, WIDTH, HEIGHT);
    img.src = value;
  }, [value]);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * WIDTH,
      y: ((e.clientY - rect.top) / rect.height) * HEIGHT,
    };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = point(e);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return;
    const c = ctx();
    if (!c) return;
    const p = point(e);
    c.strokeStyle = eraser ? "#ffffff" : color;
    c.lineWidth = eraser ? 22 : 3.5;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(last.current.x, last.current.y);
    c.lineTo(p.x, p.y);
    c.stroke();
    last.current = p;
  };

  const save = () => {
    // JPEG has no transparency: fill any see-through pixels with white first,
    // otherwise they are exported as black.
    const c = ctx();
    if (c) {
      c.globalCompositeOperation = "destination-over";
      c.fillStyle = "#ffffff";
      c.fillRect(0, 0, WIDTH, HEIGHT);
      c.globalCompositeOperation = "source-over";
    }
    const url = canvasRef.current?.toDataURL("image/jpeg", 0.7);
    if (!url) return;
    lastLoaded.current = url;
    onSave(url);
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    save();
  };

  const clear = () => {
    if (disabled || !window.confirm("למחוק את כל הציור?")) return;
    paintBackground();
    save();
  };

  return (
    <div className="space-y-2">
      {!disabled && (
        <div className="flex flex-wrap items-center gap-2" dir="rtl">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label="בחירת צבע"
              onClick={() => {
                setColor(c);
                setEraser(false);
              }}
              className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
                !eraser && color === c ? "border-teal-400 scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
          <button
            type="button"
            onClick={() => setEraser(false)}
            className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer ${theme.ghostButton} ${!eraser ? "ring-1 ring-teal-400" : ""}`}
          >
            <Pencil className="w-3.5 h-3.5" /> עט
          </button>
          <button
            type="button"
            onClick={() => setEraser(true)}
            className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer ${theme.ghostButton} ${eraser ? "ring-1 ring-teal-400" : ""}`}
          >
            <Eraser className="w-3.5 h-3.5" /> מחק
          </button>
          <button
            type="button"
            onClick={clear}
            className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer ${theme.ghostButton}`}
          >
            <Trash2 className="w-3.5 h-3.5" /> ניקוי
          </button>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onPointerLeave={end}
        className={`w-full max-w-[600px] aspect-[3/2] rounded-xl border ${theme.border} bg-card ${
          disabled ? "cursor-default" : "cursor-crosshair"
        }`}
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
