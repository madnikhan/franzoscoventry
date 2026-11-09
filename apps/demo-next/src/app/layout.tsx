import type { Metadata } from "next";
import { Mouse_Memoirs, Modak } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { businessConfig, copyConfig } from "@/lib/data";
import "./globals.css";

const mouse = Mouse_Memoirs({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mouse",
});

const modak = Modak({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-modak",
});

const siteUrl = (
  process.env.NEXT_PUBLIC_APP_URL ||
  (businessConfig as { siteUrl?: string }).siteUrl ||
  "https://franzoscoventry.co.uk"
).replace(/\/$/, "");

const ogImage = {
  url: "/media/og/opengraph.jpg",
  width: 1200,
  height: 630,
  alt: `${businessConfig.name} logo`,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: businessConfig.name,
    template: `%s · ${businessConfig.name}`,
  },
  description: copyConfig.tagline,
  applicationName: businessConfig.name,
  keywords: [
    "Franzos",
    "Coventry",
    "peri peri chicken",
    "halal",
    "burgers",
    "takeaway",
  ],
  authors: [{ name: businessConfig.name }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: businessConfig.name,
    title: businessConfig.name,
    description: copyConfig.tagline,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: businessConfig.name,
    description: copyConfig.tagline,
    images: [ogImage.url],
  },
  icons: {
    icon: [{ url: "/media/logo/franzos-logo-nav.png", type: "image/png" }],
    apple: [{ url: "/media/logo/franzos-logo.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mouse.variable} ${modak.variable} flex min-h-screen flex-col antialiased`}
      >
        <CartProvider>
          <MarketingChrome>
            <SiteNav />
            <main className="marketing-main w-full flex-1 pt-[calc(14vw+5.5rem)] md:pt-40">
              {children}
            </main>
            <SiteFooter />
          </MarketingChrome>
        </CartProvider>
      </body>
    </html>
  );
}
