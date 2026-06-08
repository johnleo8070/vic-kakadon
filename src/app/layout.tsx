import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ToastContainer from "@/components/Toast";
import MainWrapper from "@/components/MainWrapper";

export const metadata: Metadata = {
  title: "K D K Collections Wears | Premium Fashion Store",
  description: "Shop premium watches, caps, shirts, trousers, shoes and accessories at K D K Collections Wears. Quality fashion for every occasion.",
  keywords: "watches, caps, shirts, trousers, shoes, fashion, accessories, kdk, k d k",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <CartDrawer />
          <MainWrapper>{children}</MainWrapper>
          <Footer />
          <ToastContainer />
        </CartProvider>
      </body>
    </html>
  );
}
