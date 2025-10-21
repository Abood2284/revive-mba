import type { Metadata } from "next";
import { nunito } from "@/lib/font";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

export const metadata: Metadata = {
  title: "Revive MBA | AI-Guided Online MBA Counselling",
  description:
    "Discover online MBA and PGDM programs tailored to your goals. Revive delivers AI-curated suggestions and counsellor support in minutes.",
  icons: {
    icon: "/favicon.ico",
  },
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
