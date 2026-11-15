import type { Metadata } from "next";
import { IBM_Plex_Sans_Hebrew } from "next/font/google";
import { AuthProvider } from "@/lib/context/AuthContext";
import { VisibilityProvider } from "@/lib/context/VisibilityContext";
import ContentGate from "@/components/ContentGate";
import { DEFAULT_THEME, THEME_INIT_SCRIPT } from "@/lib/theme/config";
import "./globals.css";

const plex = IBM_Plex_Sans_Hebrew({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ניר עוז-ארי — חומרי לימוד",
  description: "פורטל חומרי לימוד אינטראקטיביים — של״ח, אנגלית והעשרה",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      data-theme={DEFAULT_THEME}
      className={`${plex.variable} h-full antialiased${DEFAULT_THEME === "dark" ? " dark" : ""}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <VisibilityProvider>
            <ContentGate>{children}</ContentGate>
          </VisibilityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

