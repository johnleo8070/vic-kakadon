import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ToastContainer from "@/components/Toast";
import MainWrapper from "@/components/MainWrapper";
import Script from "next/script";

export const metadata: Metadata = {
  title: "K D K Collections Wears | Premium Fashion Store",
  description: "Shop premium watches, caps, shirts, trousers, shoes and accessories at K D K Collections Wears. Quality fashion for every occasion.",
  keywords: "watches, caps, shirts, trousers, shoes, fashion, accessories, kdk, k d k",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1019230593813850');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1019230593813850&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
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
