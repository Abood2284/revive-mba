import type { Metadata } from "next";
import Script from "next/script";
import { nunito } from "@/lib/font";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

const GOOGLE_ADS_ID = "AW-18226023895";

export const metadata: Metadata = {
  title: "Revive Education",
  description:
    "Revive Education is a platform that helps you find the right MBA program for your goals. We offer AI-curated suggestions and counsellor support in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="bg-[var(--surface-base)] text-[var(--surface-contrast)]"
    >
      <head>
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
          `}
        </Script>
      </head>
      <body className={`${nunito.variable} ${nunito.className} antialiased`}>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
