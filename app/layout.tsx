import type { Metadata } from "next";
import {Header,Footer} from '@/components/site';
import {Toaster} from '@/components/ui/sonner';
import "./globals.css";

export const metadata: Metadata = {
  title: {default:'सरकारी योजना — सही जानकारी, आसान भाषा में',template:'%s | सरकारी योजना'},
  description: 'अपने और अपने परिवार के लिए सरकारी योजनाएं खोजें। लाभ समझें, पात्रता जानें और सही सरकारी स्रोत तक पहुँचें। स्वतंत्र नागरिक सहायता मंच।',
  alternates:{canonical:'/'},
  openGraph:{locale:'hi_IN',type:'website',title:'सरकारी योजना',description:'समझिए। पात्रता जानिए। सही जगह आवेदन करें।'},
  manifest:'/manifest.webmanifest',
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body className="antialiased"><Header/>{children}<Footer/><Toaster position="bottom-right"/></body>
    </html>
  );
}
