import { AlertCircle } from "lucide-react";

interface SearchErrorStateProps {
  message: string;
}

export function SearchErrorState({ message }: SearchErrorStateProps) {
  return (
    <div className="max-w-2xl mx-auto mt-8 border border-red-200 bg-red-50 text-red-900 p-4 rounded-lg flex items-start gap-3">
      <AlertCircle className="h-5 w-5 mt-0.5" />
      <div>
        <h4 className="font-medium">Error loading results</h4>
        <p className="text-sm mt-1">
          {message || "An unexpected error occurred while searching. Please try again."}
        </p>
      </div>
    </div>
  );
}
