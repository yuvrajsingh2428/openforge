export const GET_REPOSITORIES_QUERY = `
  query GetRepositories($query: String!, $first: Int!, $after: String) {
    search(query: $query, type: REPOSITORY, first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      repositoryCount
      edges {
        node {
          ... on Repository {
            id
            name
            nameWithOwner
            description
            url
            homepageUrl
            stargazerCount
            forkCount
            updatedAt
            owner {
              login
              avatarUrl
            }
            primaryLanguage {
              name
              color
            }
            licenseInfo {
              name
              spdxId
            }
            repositoryTopics(first: 10) {
              nodes {
                topic {
                  name
                }
              }
            }
            openIssues: issues(states: OPEN) {
              totalCount
            }
          }
        }
      }
    }
  }
`;
