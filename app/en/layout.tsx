import { SiteLayout, pageMetadata } from "@/components/marketing/site-layout";
export { viewport } from "@/components/marketing/site-layout";
export const metadata = pageMetadata("en");
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteLayout locale="en">{children}</SiteLayout>;
}
