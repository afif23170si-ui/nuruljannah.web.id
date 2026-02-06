import type { Metadata } from "next";
import { Poppins, El_Messiri } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Header, Footer } from "@/components/layout";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const elMessiri = El_Messiri({
  variable: "--font-el-messiri",
  subsets: ["arabic", "latin"],
  display: "swap", 
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "Masjid Nurul Jannah | Pusat Ibadah & Dakwah",
    template: "%s | Masjid Nurul Jannah",
  },
  description:
    "Website resmi Masjid Nurul Jannah - Pusat informasi jadwal shalat, kajian, kegiatan masjid, dan pendidikan Islam (TPA/TPQ).",
  keywords: [
    "masjid",
    "nurul jannah",
    "jadwal shalat",
    "kajian islam",
    "TPA",
    "TPQ",
    "pendidikan islam",
    "dakwah",
  ],
  authors: [{ name: "Masjid Nurul Jannah" }],
  creator: "Masjid Nurul Jannah",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "Masjid Nurul Jannah",
    title: "Masjid Nurul Jannah | Pusat Ibadah & Dakwah",
    description:
      "Website resmi Masjid Nurul Jannah - Pusat informasi jadwal shalat, kajian, kegiatan masjid, dan pendidikan Islam.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Masjid Nurul Jannah",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Masjid Nurul Jannah | Pusat Ibadah & Dakwah",
    description:
      "Website resmi Masjid Nurul Jannah - Pusat informasi jadwal shalat, kajian, kegiatan masjid, dan pendidikan Islam.",
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
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${poppins.variable} ${elMessiri.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

