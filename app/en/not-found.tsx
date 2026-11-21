import { MissingPage } from "@/components/marketing/not-found";
import { copy } from "@/lib/marketing";
export const metadata = {
  title: copy.en.notFound.metaTitle,
  robots: { index: false, follow: false },
};
export default function NotFound() {
  return <MissingPage locale="en" />;
}
