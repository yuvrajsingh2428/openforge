export interface GraphQLRequestOptions {
  query: string;
  variables?: Record<string, any>;
  timeoutMs?: number;
}
