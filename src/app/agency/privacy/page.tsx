import type { Metadata } from "next";
import { PrivacyPolicy } from "@/components/policy/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What HOMEGRWN collects on homegrwndigital.com, why, and how to have it removed. Draft pending review by counsel.",
  alternates: { canonical: "/privacy" },
};

export default function AgencyPrivacyPage() {
  return (
    <PrivacyPolicy
      product="HOMEGRWN"
      host="homegrwndigital.com"
      forms={[
        "The strategy-call form on /book: your name, business, trade, phone, email, and the ad-budget band you pick.",
      ]}
    />
  );
}
