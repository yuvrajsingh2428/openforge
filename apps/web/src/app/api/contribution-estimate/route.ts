import { NextResponse } from 'next/server';
import { ContributionEstimator } from '@openforge/issue-engine';
import { getIssue } from '@openforge/github-client';

const estimator = new ContributionEstimator();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  const numberStr = searchParams.get('number');

  if (!owner || !repo || !numberStr) {
    return NextResponse.json({ error: 'owner, repo, and number are required' }, { status: 400 });
  }

  const number = parseInt(numberStr, 10);
  if (isNaN(number)) {
    return NextResponse.json({ error: 'issue number must be a valid integer' }, { status: 400 });
  }

  try {
    const data = await getIssue(owner, repo, number);
    
    if (!data) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    const { issue } = data;
    const labels = issue.labels?.nodes?.map((l: any) => l.name) || [];
    const ageDays = Math.floor((new Date().getTime() - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    
    const input = {
      labels,
      bodyLength: issue.body?.length || 0,
      commentsCount: issue.comments?.totalCount || 0,
      issueAgeDays: ageDays,
      repositoryMaturityScore: 80, // deterministic mock for repo maturity
      assigneesCount: issue.assignees?.nodes?.length || 0,
    };

    const estimate = estimator.estimate(input);

    return NextResponse.json(estimate, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error('Error estimating contribution:', error);
    return NextResponse.json({ error: 'Failed to estimate contribution size' }, { status: 500 });
  }
}
