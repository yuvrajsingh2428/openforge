import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FolderX, ArrowLeft } from "lucide-react";

export default function RepositoryNotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <FolderX className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">Repository Not Found</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        The GitHub repository you are looking for could not be found or is not publicly accessible.
      </p>
      <Link href="/repositories">
        <Button variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Repositories
        </Button>
      </Link>
    </div>
  );
}
