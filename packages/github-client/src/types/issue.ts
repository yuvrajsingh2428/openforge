import { z } from "zod";

export const IssueAuthorSchema = z.object({
  login: z.string(),
  avatarUrl: z.string(),
});

export const IssueLabelSchema = z.object({
  name: z.string(),
  color: z.string(),
});

export const IssueAssigneeSchema = z.object({
  login: z.string(),
  avatarUrl: z.string(),
});

export const IssueMilestoneSchema = z.object({
  title: z.string(),
});

export const IssueRepositorySchema = z.object({
  name: z.string(),
  nameWithOwner: z.string(),
  owner: z.object({
    login: z.string(),
    avatarUrl: z.string(),
  }),
  primaryLanguage: z.object({
    name: z.string(),
    color: z.string().nullable().optional(),
  }).nullable().optional(),
});

export const IssueSchema = z.object({
  id: z.string(),
  number: z.number(),
  title: z.string(),
  body: z.string().nullable().optional(),
  state: z.string(),
  url: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  closedAt: z.string().nullable().optional(),
  author: IssueAuthorSchema.nullable().optional(),
  labels: z.object({
    nodes: z.array(IssueLabelSchema),
  }).optional(),
  comments: z.object({
    totalCount: z.number(),
  }).optional(),
  reactions: z.object({
    totalCount: z.number(),
  }).optional(),
  assignees: z.object({
    nodes: z.array(IssueAssigneeSchema),
  }).optional(),
  milestone: IssueMilestoneSchema.nullable().optional(),
  repository: IssueRepositorySchema.optional(),
});

export type Issue = z.infer<typeof IssueSchema>;
export type IssueAuthor = z.infer<typeof IssueAuthorSchema>;
export type IssueLabel = z.infer<typeof IssueLabelSchema>;
export type IssueRepository = z.infer<typeof IssueRepositorySchema>;
