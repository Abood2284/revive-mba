import type { Metadata } from "next";
import { nunito } from "@/lib/font";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

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
      <body className={`${nunito.variable} ${nunito.className} antialiased`}>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
