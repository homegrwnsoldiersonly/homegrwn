import type { Metadata } from "next";
import { PrivacyPolicy } from "@/components/policy/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What Ads Driver collects on adsdriver.homegrwndigital.com, why, and how to have it removed. Draft pending review by counsel.",
  alternates: { canonical: "/privacy" },
};

export default function AdsDriverPrivacyPage() {
  return (
    <PrivacyPolicy
      product="Ads Driver"
      host="adsdriver.homegrwndigital.com"
      forms={[
        "The early-access application on /apply: your business, trade or practice area, monthly Google Ads spend band, site URL, email, and any notes you add.",
      ]}
    />
  );
}
