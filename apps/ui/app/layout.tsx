import type { Metadata } from "next";
import { Playfair_Display, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Canopy",
  description: "your life, tended carefully",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${lora.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-full bg-parchment">
        {/* Paper grain overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-50 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        {/* Margin botanical sketches — visible on xl screens */}
        <div className="fixed top-24 right-6 opacity-[0.08] pointer-events-none hidden xl:block select-none">
          <svg width="120" height="180" viewBox="0 0 100 150" fill="none" stroke="#7a6040" strokeWidth="0.9" strokeLinecap="round">
            {/* Fern frond */}
            <path d="M50 140 Q 50 90 70 30" />
            <path d="M50 140 Q 50 90 30 50" />
            <path d="M50 110 L 68 95 M50 90 L 32 78 M50 72 L 72 55 M50 55 L 30 44" />
            <path d="M50 38 L 56 26" />
          </svg>
          <p className="font-data text-[9px] mt-1 italic text-[#7a6040] text-center">
            Dryopteris filix-mas
          </p>
        </div>

        <div className="fixed bottom-24 right-8 opacity-[0.07] pointer-events-none hidden xl:block select-none">
          <svg width="90" height="90" viewBox="0 0 100 100" fill="none" stroke="#7a6040" strokeWidth="1" strokeLinecap="round">
            {/* Compass rose */}
            <circle cx="50" cy="50" r="32" strokeDasharray="3 4" />
            <path d="M50 18 L50 8 M82 50 L92 50 M50 82 L50 92 M18 50 L8 50" />
            <path d="M73 27 L80 20 M73 73 L80 80 M27 73 L20 80 M27 27 L20 20" />
            <circle cx="50" cy="50" r="4" fill="#7a6040" stroke="none" />
          </svg>
        </div>

        <div className="fixed top-1/2 right-4 opacity-[0.06] pointer-events-none hidden 2xl:block select-none -translate-y-1/2">
          <svg width="70" height="120" viewBox="0 0 60 100" fill="none" stroke="#7a6040" strokeWidth="0.9" strokeLinecap="round">
            {/* Mushroom cluster */}
            <path d="M30 90 L30 55" />
            <path d="M30 55 Q 10 55 8 40 Q 8 24 30 24 Q 52 24 52 40 Q 50 55 30 55" />
            <path d="M22 90 L22 72" />
            <path d="M22 72 Q 10 72 9 62 Q 9 54 22 54 Q 35 54 35 62 Q 34 72 22 72" />
          </svg>
        </div>

        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
