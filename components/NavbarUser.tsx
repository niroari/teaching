"use client";

import React from "react";
import Link from "next/link";
import { User, LogOut, LogIn, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { isTeacherUser } from "@/lib/auth/teacher";

export default function NavbarUser() {
  const { user, loading, logout } = useAuth();
  const isTeacher = isTeacherUser(user);

  if (loading) {
    return <div className="h-9 w-24 animate-pulse rounded-md bg-subtle" />;
  }

  // Anonymous sessions (parents booking a meeting) are not real accounts.
  if (!user || user.isAnonymous) {
    return (
      <Link
        href="/login"
        className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        <LogIn className="h-4 w-4" strokeWidth={1.75} />
        <span>התחברות</span>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-fg">
      {isTeacher && (
        <Link
          href="/admin"
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-sm font-medium text-fg transition-colors hover:bg-subtle"
          title="כניסה ללוח מורה מרכזי"
        >
          <LayoutDashboard className="h-4 w-4 text-fg-muted" strokeWidth={1.75} />
          <span>לוח מורה</span>
        </Link>
      )}

      {/* User Info Badge */}
      <div className="flex h-9 items-center gap-2 rounded-md px-2 text-sm">
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.photoURL}
            alt={user.displayName || "משתמש"}
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-subtle text-fg-muted">
            <User className="h-3.5 w-3.5" strokeWidth={1.75} />
          </div>
        )}
        <div className="hidden items-center gap-1.5 sm:flex">
          <span className="max-w-[130px] truncate font-medium text-fg" title={user.displayName || user.email || ""}>
            {user.displayName || user.email?.split("@")[0] || "משתמש"}
          </span>
          {isTeacher && (
            <span className="rounded border border-line px-1.5 py-0.5 text-[11px] font-medium text-fg-muted">
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
        className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-fg-muted transition-colors hover:bg-subtle hover:text-fg cursor-pointer"
        title="התנתקות מהחשבון"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.75} />
        <span className="hidden sm:inline">התנתק</span>
      </button>
    </div>
  );
}
