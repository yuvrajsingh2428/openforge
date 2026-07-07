interface IssueLabelsProps {
  labels: { name: string; color: string }[];
  limit?: number;
}

export function IssueLabels({ labels, limit = 4 }: IssueLabelsProps) {
  const visible = labels.slice(0, limit);
  const remaining = labels.length - limit;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((label) => (
        <span
          key={label.name}
          className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border"
          style={{
            backgroundColor: `#${label.color}20`,
            borderColor: `#${label.color}40`,
            color: `#${label.color}`,
          }}
        >
          {label.name}
        </span>
      ))}
      {remaining > 0 && (
        <span className="text-xs text-muted-foreground self-center">
          +{remaining} more
        </span>
      )}
    </div>
  );
}
