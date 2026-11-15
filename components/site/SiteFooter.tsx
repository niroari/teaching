import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function SiteFooter({ children }: { children?: React.ReactNode }) {
  return (
    <footer dir="rtl" className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-6 text-xs text-fg-subtle sm:px-6">
        {children ?? <span>© {new Date().getFullYear()} {SITE_NAME}</span>}
        <Link href="/credits" className="rounded underline-offset-4 hover:text-fg hover:underline">
          קרדיטים לתמונות
        </Link>
      </div>
    </footer>
  );
}
