import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next"
import { Inter_Tight, Pixelify_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import LenisProvider from "@/components/providers/lenis-provider";

// Default font
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// Special font for headings
const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Dhruvit Navadiya — AI Automation Engineer & Agentic Systems Developer",
  description:
    "Portfolio of Dhruvit Navadiya — AI Automation Engineer specializing in multi-agent systems, agentic AI platforms, and full-stack development. Featuring 9 production projects, an AI-powered chatbot assistant, and interactive 3D experiences.",
  keywords: [
    "Dhruvit Navadiya",
    "AI Automation Engineer",
    "Agentic Systems",
    "Multi-Agent AI",
    "Full Stack Developer",
    "Next.js",
    "Python",
    "Portfolio",
  ],
  authors: [{ name: "Dhruvit Navadiya" }],
  openGraph: {
    title: "Dhruvit Navadiya — AI Automation Engineer",
    description:
      "Explore 9 production AI projects, an interactive AI chatbot, and a premium dark-themed portfolio built with Next.js, Three.js, and Framer Motion.",
    type: "website",
    url: "https://dhruvit.vercel.app",
    images: [
      "https://res.cloudinary.com/dz12pywzs/image/upload/v1766372535/Copy_of_Copy_of_Webinar_Keynote_Presentation_1_ljemzi.jpg",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhruvit Navadiya — AI Automation Engineer",
    description:
      "Portfolio featuring 9 AI projects, an agentic chatbot assistant, and immersive 3D experiences.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${interTight.variable} ${pixelify.variable} antialiased`}
      >
        <LenisProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
            <Toaster />
          </ThemeProvider>
        </LenisProvider>
        <Analytics/>
      </body>
    </html>
  );
}
