export const GET_ISSUES_QUERY = `
  query GetIssues($query: String!, $first: Int!, $after: String) {
    search(query: $query, type: ISSUE, first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      issueCount
      edges {
        node {
          ... on Issue {
            id
            number
            title
            body
            state
            url
            createdAt
            updatedAt
            closedAt
            author {
              login
              avatarUrl
            }
            labels(first: 10) {
              nodes {
                name
                color
              }
            }
            comments {
              totalCount
            }
            reactions {
              totalCount
            }
            assignees(first: 5) {
              nodes {
                login
                avatarUrl
              }
            }
            milestone {
              title
            }
            repository {
              name
              nameWithOwner
              owner {
                login
                avatarUrl
              }
              primaryLanguage {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ISSUE_QUERY = `
  query GetIssue($owner: String!, $name: String!, $number: Int!) {
    repository(owner: $owner, name: $name) {
      issue(number: $number) {
        id
        number
        title
        body
        state
        url
        createdAt
        updatedAt
        closedAt
        author {
          login
          avatarUrl
        }
        labels(first: 20) {
          nodes {
            name
            color
          }
        }
        comments {
          totalCount
        }
        reactions {
          totalCount
        }
        assignees(first: 10) {
          nodes {
            login
            avatarUrl
          }
        }
        milestone {
          title
        }
      }
      name
      nameWithOwner
      owner {
        login
        avatarUrl
      }
      primaryLanguage {
        name
        color
      }
    }
  }
`;

export const GET_REPOSITORY_ISSUES_QUERY = `
  query GetRepositoryIssues($owner: String!, $name: String!, $first: Int!, $after: String, $states: [IssueState!]) {
    repository(owner: $owner, name: $name) {
      name
      nameWithOwner
      owner {
        login
        avatarUrl
      }
      primaryLanguage {
        name
        color
      }
      issues(first: $first, after: $after, states: $states, orderBy: {field: CREATED_AT, direction: DESC}) {
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
        nodes {
          id
          number
          title
          body
          state
          url
          createdAt
          updatedAt
          closedAt
          author {
            login
            avatarUrl
          }
          labels(first: 10) {
            nodes {
              name
              color
            }
          }
          comments {
            totalCount
          }
          reactions {
            totalCount
          }
          assignees(first: 5) {
            nodes {
              login
              avatarUrl
            }
          }
          milestone {
            title
          }
        }
      }
    }
  }
`;
