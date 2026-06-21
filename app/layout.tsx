import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "RowSafe — Welfare & Crew Management for Rowing Clubs",
  description:
    "Welfare reporting, crew management, and member portal for rowing clubs. Built for RowSafe.",
  openGraph: {
    title: "RowSafe — Welfare & Crew Management for Rowing Clubs",
    description:
      "Welfare reporting, crew management, and member portal for rowing clubs.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthSessionProvider>
            {children}
            <Toaster richColors position="top-center" />
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
