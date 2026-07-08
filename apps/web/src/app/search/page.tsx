import type { Metadata } from "next";
import { SearchClient } from "@/features/search/components/search-client";

export const metadata: Metadata = {
  title: "Live Search | OpenForge",
  description: "Search for GitHub repositories in real-time.",
};

export default function SearchPage() {
  return (
    <div className="container py-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Repository Search</h1>
        <p className="text-muted-foreground">
          Find repositories to contribute to with live GitHub search.
        </p>
      </div>
      <SearchClient />
    </div>
  );
}
