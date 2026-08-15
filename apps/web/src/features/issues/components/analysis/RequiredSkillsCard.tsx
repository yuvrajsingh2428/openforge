import { Wrench } from "lucide-react";

interface RequiredSkillsCardProps {
  skills: string[];
}

export function RequiredSkillsCard({ skills }: RequiredSkillsCardProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
        <Wrench className="h-4 w-4" aria-hidden="true" />
        Required Skills
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <span
            key={idx}
            className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium border border-border/50"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
