interface ConfidenceBadgeProps {
  confidence: number; // 0.0 to 1.0
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const percentage = Math.round(confidence * 100);
  
  let colorClass = "bg-green-500/10 text-green-600 border-green-500/20";
  if (percentage < 60) {
    colorClass = "bg-amber-500/10 text-amber-600 border-amber-500/20";
  } else if (percentage < 40) {
    colorClass = "bg-red-500/10 text-red-600 border-red-500/20";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${colorClass}`}
      title={`AI Confidence Score: ${percentage}%`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {percentage}% Confidence
    </span>
  );
}
