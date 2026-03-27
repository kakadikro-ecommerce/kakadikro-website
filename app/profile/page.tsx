import type { Metadata } from "next";

import ProfilePage from "@/components/profile/ProfilePage";
import { buildMetadata } from "@/app/seo";

export const metadata: Metadata = buildMetadata({
  title: "Your Profile",
  description: "Manage your Kaka Dikro profile information, addresses, and account details.",
  path: "/profile",
  index: false,
});

export default function ProfileRoute() {
  return <ProfilePage />;
}
