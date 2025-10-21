import { headers } from "next/headers";
import { SiteFooter } from "./SiteFooter";
import SiteHeader from "@/app/(site)/components/SiteHeader";

export async function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Don't show header/footer on admin or login routes
  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/login");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
