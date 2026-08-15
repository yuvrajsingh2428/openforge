import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function IssueNotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <AlertCircle className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">Issue Not Found</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        The requested GitHub issue could not be found or has been removed.
      </p>
      <Link href="/issues">
        <Button variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Issues
        </Button>
      </Link>
    </div>
  );
}
