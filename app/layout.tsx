export const dynamic = "force-dynamic";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Notification from "@components/Notification";
import AuthSession from "@components/AuthSession";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ma Boutique",
  description: "Votre boutique en ligne",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthSession>
      <html lang="fr">
        <body
          className={`${inter.className} bg-slate-50 text-slate-800`}
          suppressHydrationWarning={true}
        >
          {children}
          <Analytics />
          <Notification />
        </body>
      </html>
    </AuthSession>
  );
}
