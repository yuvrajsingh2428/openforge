export const SEARCH_QUERY = `
  query Search($query: String!, $type: SearchType!, $first: Int!, $after: String) {
    search(query: $query, type: $type, first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          __typename
        }
      }
    }
  }
`;
