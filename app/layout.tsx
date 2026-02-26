import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminModeBar from "@/components/AdminModeBar";
import MobileContactFab from "@/components/MobileContactFab";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "ד״ר בני פרדמן | מומחה לשיקום הפה בהרצליה",
  description:
    "שיקום פה מורכב ואסתטיקה דנטלית בהרצליה, עם תכנון דיגיטלי מתקדם, פתרונות למקרים מורכבים וליווי אישי רגוע לאורך כל התהליך."
};

export const dynamic = "force-dynamic";

const fontMap = {
  assistant: '"Assistant", "Noto Sans Hebrew", "Segoe UI", sans-serif',
  heebo: '"Heebo", "Noto Sans Hebrew", "Segoe UI", sans-serif',
  rubik: '"Rubik", "Noto Sans Hebrew", "Segoe UI", sans-serif'
} as const;

const letterSpacingMap = {
  tight: "-0.03em",
  normal: "-0.01em",
  wide: "0.04em"
} as const;

const fontSizeScaleMap = {
  compact: "compact",
  normal: "normal",
  large: "large"
} as const;

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const {
    shared: { theme }
  } = await getSiteContent();

  return (
    <html lang="he" dir="rtl">
      <body
        className="min-h-screen"
        data-theme={theme.presetId}
        data-font-scale={theme.fontSizeScale ?? "normal"}
        style={
          ({
            ["--primary-color" as string]: theme.primaryColor,
            ["--accent-color" as string]: theme.accentColor,
            ["--heading-font" as string]: fontMap[theme.headingFont ?? theme.fontFamily],
            ["--heading-weight" as string]: theme.headingWeight ?? "800",
            ["--heading-letter-spacing" as string]: letterSpacingMap[theme.letterSpacing ?? "normal"],
            fontFamily: fontMap[theme.fontFamily]
          } as CSSProperties)
        }
      >
        <AdminModeBar />
        <Navbar />
        <main className="relative">{children}</main>
        <MobileContactFab />
        <Footer />
      </body>
    </html>
  );
}
