import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Header } from "@/components/nav/Header";
import { Footer } from "@/components/nav/Footer";
import { CartDrawer } from "@/components/nav/CartDrawer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { AbandonedCartWatcher } from "@/components/cart/AbandonedCartWatcher";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Nudge — Home & Lifestyle Goods",
  description: "A minimalist home & lifestyle goods store with AI-powered recommendations.",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <CartProvider>
                <Header />
                <main className="min-h-[60vh]">{children}</main>
                <Footer />
                <CartDrawer />
                <ChatWidget />
                <AbandonedCartWatcher />
                {modal}
              </CartProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
