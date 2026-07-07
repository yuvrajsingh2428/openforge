export const GET_REPOSITORY_QUERY = `
  query GetRepository($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      name
      nameWithOwner
      description
      url
      homepageUrl
      stargazerCount
      forkCount
      updatedAt
      defaultBranchRef {
        name
      }
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
`;
