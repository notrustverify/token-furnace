import "./globals.css";
import { Urbanist } from "next/font/google";
import { AlephiumWalletProvider } from "@alephium/web3-react";
import Navbar from "./components/navbar";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { getNetwork } from "./services/utils";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-urbanist",
});

export const metadata = {
  title: "Token Furnace",
  description: "Token Furnace",
  openGraph: {
    title: "Token Furnace",
    description: "Token Furnace",
    images: [
      {
        url: "https://furnace.notrustverify.ch/images/burnmeme.webp",
        width: 700,
        height: 400,
        alt: "Token Furnace Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Token Furnace",
    description: "Token Furnace",
    images: ["https://furnace.notrustverify.ch/images/burnmeme.webp"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={urbanist.variable} suppressHydrationWarning>
      <body className={urbanist.className}>
        <ThemeProvider>
          <LanguageProvider>
            <AlephiumWalletProvider theme="midnight" network={getNetwork()}>
              <div className="app-shell">
                <Navbar />
                <main id="main-content" className="site-content">
                  {children}
                </main>
              </div>
            </AlephiumWalletProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
