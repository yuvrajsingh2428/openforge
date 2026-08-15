export interface LearningRoadmapItem {
  category: "Required Skill" | "Concept to Learn";
  name: string;
}

export function generateLearningRoadmap(requiredSkills: string[], conceptsToLearn: string[]): LearningRoadmapItem[] {
  const skills: LearningRoadmapItem[] = requiredSkills.map((s) => ({
    category: "Required Skill",
    name: s,
  }));

  const concepts: LearningRoadmapItem[] = conceptsToLearn.map((c) => ({
    category: "Concept to Learn",
    name: c,
  }));

  return [...skills, ...concepts];
}
