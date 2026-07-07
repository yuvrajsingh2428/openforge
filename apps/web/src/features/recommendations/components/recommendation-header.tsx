interface RecommendationHeaderProps {
  title: string;
  description: string;
  resultCount?: number;
}

export function RecommendationHeader({ title, description, resultCount }: RecommendationHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-2">
        {description}
        {resultCount !== undefined && (
          <span className="ml-1 text-foreground/70">
            · {resultCount} {resultCount === 1 ? "recommendation" : "recommendations"}
          </span>
        )}
      </p>
    </div>
  );
}
