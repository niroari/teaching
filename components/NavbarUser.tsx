"use client";

import React from "react";
import Link from "next/link";
import { User, LogOut, LogIn, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

export default function NavbarUser() {
  const { user, loading, logout } = useAuth();
  const isTeacher = Boolean(
    user && (user.email === "niroari@gmail.com" || user.email === "nirozari@gmail.com")
  );

  if (loading) {
    return (
      <div className="h-8 w-24 rounded-xl bg-white/5 animate-pulse border border-white/10" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-zinc-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/10 border border-cyan-400/20 hover:scale-[1.02] cursor-pointer"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span>התחברות</span>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {isTeacher && (
        <Link
          href="/admin"
          className="px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:scale-[1.02] cursor-pointer"
          title="כניסה ללוח מורה מרכזי"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>לוח מורה</span>
        </Link>
      )}

      {/* User Info Badge */}
      <div className="flex items-center gap-2 bg-surface/90 border border-border-custom rounded-xl px-3 py-1.5 text-xs text-zinc-200 shadow-sm">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || "משתמש"}
            className="w-5 h-5 rounded-full object-cover border border-cyan-500/40"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <User className="w-3 h-3" />
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="font-bold max-w-[130px] truncate text-white" title={user.displayName || user.email || ""}>
            {user.displayName || user.email?.split("@")[0] || "משתמש"}
          </span>
          {isTeacher && (
            <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
              מורה
            </span>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <button
        type="button"
        onClick={async () => {
          try {
            await logout();
          } catch (err) {
            console.error("Logout failed:", err);
          }
        }}
        className="px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-950/20 hover:bg-red-900/30 text-red-400 hover:text-red-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
        title="התנתקות מהחשבון"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">התנתק</span>
      </button>
    </div>
  );
}
