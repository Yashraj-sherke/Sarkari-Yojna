import type { Metadata } from "next";
import {Header,Footer} from '@/components/site';
import {Toaster} from '@/components/ui/sonner';
import {Offline} from '@/components/offline';
import {LanguageProvider} from '@/lib/i18n';
import "./globals.css";

export const metadata: Metadata = {
  title: {default:'सरकारी योजना — MP योजनाएं, प्रमाण पत्र, पात्रता जानकारी',template:'%s | सरकारी योजना MP'},
  description: 'मध्य प्रदेश और केंद्र सरकार की सभी सरकारी योजनाएं एक जगह। लाड़ली बहना, PM किसान, आयुष्मान भारत, संबल योजना — पात्रता, दस्तावेज़ और आवेदन की पूरी जानकारी हिन्दी में।',
  keywords: ['सरकारी योजना','MP सरकारी योजना','मध्य प्रदेश योजना','प्रमाण पत्र','लाड़ली बहना योजना','PM किसान','आयुष्मान भारत','संबल योजना','सीखो कमाओ योजना','लाड़ली लक्ष्मी','गांव की बेटी','किसान कल्याण योजना','sarkari yojana','MP government scheme','yojana documents','patra','aavedan'],
  alternates:{canonical:'/'},
  metadataBase:new URL('https://sarkari-yojna-navigator.ombhayde.chatgpt.site'),
  openGraph:{locale:'hi_IN',type:'website',title:'सरकारी योजना — MP की सभी योजनाएं',description:'मध्य प्रदेश सरकारी योजनाएं — पात्रता, दस्तावेज़ और आवेदन प्रक्रिया।'},
  manifest:'/manifest.webmanifest',
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
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
      <body className="antialiased">
        <LanguageProvider>
          <Header/>{children}<Footer/>
          <Toaster position="bottom-right"/>
          <Offline/>
        </LanguageProvider>
      </body>
    </html>
  );
}
