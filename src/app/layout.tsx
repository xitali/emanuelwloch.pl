import { SOCIAL_IMAGE_URL } from "@/lib/seo";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import "./globals.css";
import "@/components/portfolio/portfolio.css";
import "@/components/portfolio/premium.css";
import "@/components/portfolio/hero-scenes.css";
import "@/components/portfolio/readability.css";
import "@/components/portfolio/offer.css";
import "@/components/portfolio/service-page.css";
import "@/components/world/world.css";
import "@/components/palette/palettes.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import NavigationScroll from "@/components/NavigationScroll";
import Morph from "@/components/motion/Morph";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

const displayFont = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin", "latin-ext"], display: "swap" });
const serifFont = Instrument_Serif({ variable: "--font-serif", weight: "400", style: "italic", subsets: ["latin", "latin-ext"], display: "swap" });

export const viewport: Viewport = {
  themeColor: "#0c0d0e",
  colorScheme: "dark",
};

// Ustawia stan „ruch włączony” PRZED pierwszym malowaniem, żeby animacje wejścia nie migotały.
// Bez ruchu (prefers-reduced-motion) lub gdy hydracja nie ruszy w 4,5 s — treść zostaje w pełni widoczna.
const motionBootstrap = `(function(){try{var d=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.classList.add("js-motion");setTimeout(function(){if(!d.classList.contains("motion-armed"))d.classList.remove("js-motion")},4500)}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL("https://emanuelwloch.pl"),
  title: {
    default: "Emanuel Włoch – strony, sklepy, aplikacje i programy | Jarosław",
    template: "%s | Emanuel Włoch",
  },
  description:
    "Projektuję i programuję strony internetowe, sklepy, aplikacje z bazą danych i programy na Windows dla firm z Jarosławia, Podkarpacia i całej Polski. Od ustalenia celu po wdrożenie. Omów swój projekt.",
  applicationName: "Emanuel Włoch — oprogramowanie dla firm",
  category: "technology",
  authors: [{ name: "Emanuel Włoch", url: "https://emanuelwloch.pl" }],
  creator: "Emanuel Włoch",
  publisher: "Emanuel Włoch",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {

  },
  openGraph: {
    title: "Emanuel Włoch – strony, sklepy, aplikacje i programy | Jarosław",
    description:
      "Strony, sklepy, aplikacje z bazą danych i programy na Windows dla firm z Jarosławia, Podkarpacia i całej Polski.",
    url: "https://emanuelwloch.pl",
    siteName: "Emanuel Włoch — strony, aplikacje i programy",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: SOCIAL_IMAGE_URL,
        secureUrl: SOCIAL_IMAGE_URL,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Emanuel Włoch — strony, aplikacje i programy dla firm",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emanuel Włoch – strony, aplikacje i programy dla firm",
    description:
      "Strony, sklepy, aplikacje z bazą danych i programy na Windows dla firm z Jarosławia, Podkarpacia i całej Polski.",
    images: [SOCIAL_IMAGE_URL],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} ${serifFont.variable} h-full antialiased scroll-smooth scroll-pt-28`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-[#0b0d0f] dark:text-slate-100 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NavigationScroll />
          {/* Route changes crossfade; named elements inside (project mockups) morph between pages. */}
          <Morph default="page-fade">{children}</Morph>
        </ThemeProvider>
      </body>
    </html>
  );
}
