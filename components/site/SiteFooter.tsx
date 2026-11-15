export default function SiteFooter({ children }: { children?: React.ReactNode }) {
  return (
    <footer dir="rtl" className="border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 text-xs text-fg-subtle sm:px-6">
        {children ?? <span>© {new Date().getFullYear()} ניר עוז-ארי — כל הזכויות שמורות</span>}
      </div>
    </footer>
  );
}
