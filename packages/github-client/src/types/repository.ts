import { z } from "zod";

export const RepositoryOwnerSchema = z.object({
  login: z.string(),
  avatarUrl: z.string(),
});

export const RepositoryLicenseSchema = z.object({
  name: z.string(),
  spdxId: z.string().nullable(),
});

export const RepositoryTopicSchema = z.object({
  topic: z.object({
    name: z.string(),
  }),
});

export const RepositorySchema = z.object({
  id: z.string(),
  name: z.string(),
  nameWithOwner: z.string(),
  description: z.string().nullable(),
  url: z.string(),
  homepageUrl: z.string().nullable().optional(),
  stargazerCount: z.number(),
  forkCount: z.number(),
  updatedAt: z.string().optional(),
  defaultBranchRef: z.object({
    name: z.string(),
  }).nullable().optional(),
  owner: RepositoryOwnerSchema.optional(),
  primaryLanguage: z.object({
    name: z.string(),
    color: z.string().nullable().optional(),
  }).nullable().optional(),
  licenseInfo: RepositoryLicenseSchema.nullable().optional(),
  repositoryTopics: z.object({
    nodes: z.array(RepositoryTopicSchema),
  }).optional(),
  openIssues: z.object({
    totalCount: z.number(),
  }).optional(),
});

export type Repository = z.infer<typeof RepositorySchema>;
export type RepositoryOwner = z.infer<typeof RepositoryOwnerSchema>;
export type RepositoryLicense = z.infer<typeof RepositoryLicenseSchema>;
