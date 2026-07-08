import { fetchGraphQL } from "@openforge/github-client/src/client";
import { REPOSITORY_ANALYSIS_CONFIG } from "@openforge/config";
import type { RepositorySnapshot, SnapshotFile } from "./types";

const MAX_FILES = REPOSITORY_ANALYSIS_CONFIG.maxFilesToProcess;

interface TreeEntry {
  path: string;
  type: string;
  oid: string;
  object?: {
    byteSize?: number;
    text?: string;
    entries?: TreeEntry[];
  };
}

export class SnapshotService {
  public static async createSnapshot(owner: string, repo: string): Promise<RepositorySnapshot> {
    const query = `
      query getRepoTree($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          defaultBranchRef {
            target {
              ... on Commit {
                tree {
                  entries {
                    path
                    type
                    oid
                    object {
                      ... on Blob {
                        byteSize
                        text
                      }
                      ... on Tree {
                        entries {
                          path
                          type
                          oid
                          object {
                            ... on Blob {
                              byteSize
                              text
                            }
                            ... on Tree {
                              entries {
                                path
                                type
                                oid
                                object {
                                  ... on Blob {
                                    byteSize
                                    text
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await fetchGraphQL<any>({
      query,
      variables: { owner, name: repo }
    });

    const entries = data?.repository?.defaultBranchRef?.target?.tree?.entries ?? [];
    const files: SnapshotFile[] = [];

    // Flatten up to depth 3 based on the GraphQL query structure. For deeper trees, we'd need to paginate or use REST trees API.
    // Given the constraints of the GraphQL API, we use a basic recursive flattener up to the fetched depth.
    
    function flatten(entries: TreeEntry[], currentPath: string = "") {
      if (files.length >= MAX_FILES) return;

      for (const entry of entries) {
        if (files.length >= MAX_FILES) break;

        const fullPath = currentPath ? `${currentPath}/${entry.path}` : entry.path;
        
        if (REPOSITORY_ANALYSIS_CONFIG.excludedDirectories.some(dir => fullPath.includes(`/${dir}/`) || fullPath.startsWith(`${dir}/`))) {
          continue;
        }

        files.push({
          path: fullPath,
          type: entry.type === "tree" ? "tree" : "blob",
          sha: entry.oid,
          size: entry.object?.byteSize,
          content: entry.object?.byteSize && entry.object.byteSize < REPOSITORY_ANALYSIS_CONFIG.maxFileSizeKb * 1024 ? entry.object?.text : undefined
        });

        if (entry.type === "tree" && entry.object?.entries) {
          flatten(entry.object.entries, fullPath);
        }
      }
    }

    flatten(entries);

    return {
      owner,
      repo,
      tree: files,
      fetchedAt: new Date()
    };
  }
}
