import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-3xl font-extrabold tracking-tight mb-2">404 - Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The requested page or resource could not be found. Please check the URL or return home.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            Go to Home
          </Button>
        </Link>
        <Link href="/repositories">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Browse Repositories
          </Button>
        </Link>
      </div>
    </div>
  );
}
