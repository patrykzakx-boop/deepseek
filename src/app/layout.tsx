import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookThePlace - Znajd\u017a i zarezerwuj miejsce na swoj\u0105 imprez\u0119",
  description:
    "Platforma do wyszukiwania i rezerwacji sal weselnych oraz miejsc na imprezy okoliczno\u015bciowe.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();

  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50">
        <Providers>
          <Navbar session={session} />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
