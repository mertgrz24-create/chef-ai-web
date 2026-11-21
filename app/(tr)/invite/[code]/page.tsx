import { Invite } from "@/components/marketing/invite";
import { pageMetadata } from "@/components/marketing/site-layout";
import { inviteCode } from "@/lib/marketing";
import { notFound } from "next/navigation";
type Props = { params: Promise<{ code: string }> };
export async function generateMetadata({ params }: Props) {
  const code = inviteCode((await params).code);
  if (!code) notFound();
  return pageMetadata("tr", `/invite/${code}`, true);
}
export default async function Page({ params }: Props) {
  return <Invite locale="tr" rawCode={(await params).code} />;
}
