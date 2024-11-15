import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Logo from "./logo.ico";
import Header from "@/components/layout/Header";
import QueryProvider from "@/providers/QueryProvider";
import { WalletProvider } from "@/contexts/WalletContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "EthPoll",
  description:
    "A decentralized voting dApp on Ethereum that allows users to create and participate in polls with results stored on-chain for transparency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={Logo.src} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <WalletProvider>
            <Header />
            {children}
          </WalletProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
