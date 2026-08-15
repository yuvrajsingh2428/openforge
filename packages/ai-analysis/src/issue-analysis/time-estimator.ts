export interface TimeEstimateSummary {
  hours: number;
  displayText: string;
  breakdownNotice: string;
}

export function estimateTimeRequirements(hours: number): TimeEstimateSummary {
  const roundedHours = Math.max(0.5, Math.round(hours * 10) / 10);

  let displayText = `${roundedHours} hour${roundedHours === 1 ? "" : "s"}`;
  let breakdownNotice = "~1-2 sessions of focused contribution.";

  if (roundedHours <= 1) {
    displayText = "< 1 hour";
    breakdownNotice = "Quick fix or minor documentation edit.";
  } else if (roundedHours >= 8) {
    displayText = `${roundedHours}+ hours`;
    breakdownNotice = "Multi-day contribution. Recommended to break into small commits.";
  }

  return {
    hours: roundedHours,
    displayText,
    breakdownNotice,
  };
}
