import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { getSiteContent } from "@/lib/site-content";

export default async function MobileContactFab() {
  const {
    shared: { phone }
  } = await getSiteContent();

  return (
    <Link
      href={`tel:${phone}`}
      aria-label="חיוג מהיר למרפאה"
      className="md:hidden fixed bottom-4 left-4 z-40 inline-flex min-h-12 min-w-12 items-center justify-center rounded-full bg-[var(--primary-color)] text-white shadow-lg transition duration-300 hover:scale-105"
    >
      <PhoneCall size={20} />
    </Link>
  );
}
