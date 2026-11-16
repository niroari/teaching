import SiteHeader, { Crumb } from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import type { Subject } from "@/lib/content-registry";

const WIDTHS = {
  reading: "max-w-3xl",
  wide: "max-w-6xl",
  full: "max-w-none",
} as const;

interface Props {
  children: React.ReactNode;
  /** Sets the accent color for everything inside. */
  subject?: Subject;
  crumbs?: Crumb[];
  width?: keyof typeof WIDTHS;
  /** Direction of the page body. The header always stays RTL. */
  dir?: "rtl" | "ltr";
  footer?: React.ReactNode;
  className?: string;
}

/** Standard page frame: shared header, centered container, footer. */
export default function PageShell({ children, subject, crumbs, width = "wide", dir, footer, className = "" }: Props) {
  return (
    <div data-subject={subject} className="site flex min-h-screen flex-col bg-canvas text-fg">
      <SiteHeader crumbs={crumbs} />
      <main dir={dir} className={`mx-auto w-full flex-1 px-4 py-10 sm:px-6 sm:py-14 print:p-0 ${WIDTHS[width]} ${className}`}>
        {children}
      </main>
      <SiteFooter>{footer}</SiteFooter>
    </div>
  );
}
