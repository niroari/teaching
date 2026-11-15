import type { Metadata } from "next";
import { Alef } from "next/font/google";
import { AuthProvider } from "@/lib/context/AuthContext";
import { VisibilityProvider } from "@/lib/context/VisibilityContext";
import ContentGate from "@/components/ContentGate";
import "./globals.css";

const alef = Alef({
  subsets: ["hebrew", "latin"],
  weight: ["400", "700"],
  variable: "--font-alef",
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
      className={`${alef.variable} h-full antialiased`}
    >
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

