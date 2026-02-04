import { Topbar } from "@/components/layout/topbar";
import { DiscoverClient } from "@/components/discover/discover-client";

export default function DiscoverPage() {
  return (
    <>
      <Topbar title="AI Discover" />
      <DiscoverClient />
    </>
  );
}
