import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Syakir | Portfolio",
  description:
    "Senior Full-Stack Engineer with expertise in React, Node.js, TypeScript, and AWS. Specialized in scalable web applications and system architecture. Available for senior engineering roles.",
  keywords: [
    "Full-Stack Developer",
    "Senior Software Engineer",
    "React",
    "Node.js",
    "TypeScript",
    "Next.js",
    "PostgreSQL",
    "AWS",
    "Docker",
    "Web Development",
  ],
  authors: [{ name: "Syakir" }],
  creator: "Syakir",
  publisher: "Syakir",
  metadataBase: new URL("https://your-domain.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Syakir - Senior Full-Stack Developer",
    description:
      "Senior Full-Stack Engineer specializing in React, Node.js, and TypeScript. Building scalable web applications and system architecture.",
    url: "https://your-domain.com",
    siteName: "Syakir Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Syakir - Senior Full-Stack Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Syakir - Senior Full-Stack Developer",
    description:
      "Senior Full-Stack Engineer specializing in React, Node.js, and TypeScript.",
    creator: "@yourtwitterhandle",
    images: ["/og-image.jpg"],
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
  verification: {},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
