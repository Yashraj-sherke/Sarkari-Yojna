import type { Metadata } from "next";
import {Header,Footer} from '@/components/site';
import {Toaster} from '@/components/ui/sonner';
import {Offline} from '@/components/offline';
import {LanguageProvider} from '@/lib/i18n';
import Script from 'next/script';

import "./globals.css";

import { DEFAULT_OG_IMAGE, SITE_ALTERNATE_NAMES, SITE_NAME_EN, SITE_TAGLINE, SITE_URL } from "@/lib/config";

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
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "https://www.sarkariyojanasetu.com/#website",
          "name": SITE_NAME_EN,
          "alternateName": SITE_ALTERNATE_NAMES,
          "url": "https://www.sarkariyojanasetu.com/",
          "publisher": {"@id": "https://www.sarkariyojanasetu.com/#organization"},
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.sarkariyojanasetu.com/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://www.sarkariyojanasetu.com/#organization",
          "name": SITE_NAME_EN,
          "alternateName": SITE_ALTERNATE_NAMES,
          "url": "https://www.sarkariyojanasetu.com/",
          "logo": "https://www.sarkariyojanasetu.com/logo-icon.webp",
          "description": "Sarkari Yojana Setu is an independent citizen-information platform providing simplified details on Indian government schemes.",
          "contactPoint": {
            "@type": "ContactPoint",
            "email": "sarkariyojanasetu@gmail.com",
            "contactType": "customer support"
          }
        })}} />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          <Header/>{children}<div data-nosnippet=""><Footer/></div>
          <Toaster position="bottom-right"/>
          <Offline/>
        </LanguageProvider>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-X5LKN3EQP3"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X5LKN3EQP3');
          `}
        </Script>

      </body>
    </html>
  );
}
