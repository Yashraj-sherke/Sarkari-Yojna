import type { Metadata } from "next";
import {Header,Footer} from '@/components/site';
import {Toaster} from '@/components/ui/sonner';
import {Offline} from '@/components/offline';
import {LanguageProvider} from '@/lib/i18n';
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";

import { DEFAULT_OG_IMAGE, SITE_NAME_EN, SITE_TAGLINE, SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: {default:`${SITE_NAME_EN} — MP योजनाएं, प्रमाण पत्र, पात्रता जानकारी`,template:`%s | ${SITE_NAME_EN}`},
  description: 'मध्य प्रदेश और केंद्र सरकार की योजनाओं के लाभ, पात्रता, दस्तावेज़, आवेदन प्रक्रिया और आधिकारिक स्रोत सरल हिन्दी में देखें।',
  metadataBase:new URL(SITE_URL),
  applicationName:SITE_NAME_EN,
  robots:{index:true,follow:true},
  openGraph:{locale:'hi_IN',type:'website',url:SITE_URL,siteName:SITE_NAME_EN,title:`${SITE_NAME_EN} — योजनाओं की सरल और स्रोत-सहित जानकारी`,description:SITE_TAGLINE,images:[{url:DEFAULT_OG_IMAGE,alt:`${SITE_NAME_EN} लोगो`}]},
  twitter:{card:'summary',images:[DEFAULT_OG_IMAGE]},
  manifest:'/manifest.webmanifest',
  verification: process.env.GOOGLE_SITE_VERIFICATION ? {google: process.env.GOOGLE_SITE_VERIFICATION} : undefined,
  icons: {
    icon: [
      { url: "/favicon.png?v=6", sizes: "64x64", type: "image/png" },
      { url: "/favicon-32x32.png?v=6", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg?v=6", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico?v=6",
    apple: "/apple-touch-icon.png?v=6",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body className="antialiased">
        <LanguageProvider>
          <Header/>{children}<Footer/>
          <Toaster position="bottom-right"/>
          <Offline/>
        </LanguageProvider>
        <GoogleAnalytics gaId="G-X5LKN3EQP3" />
      </body>
    </html>
  );
}
