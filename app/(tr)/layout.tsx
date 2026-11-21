import { SiteLayout, pageMetadata } from "@/components/marketing/site-layout";
export { viewport } from "@/components/marketing/site-layout";
export const metadata = pageMetadata("tr");
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteLayout locale="tr">{children}</SiteLayout>;
}
