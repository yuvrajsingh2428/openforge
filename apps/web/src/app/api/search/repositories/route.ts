import { NextResponse } from 'next/server';
import { searchRepositories } from '@openforge/github-client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const after = searchParams.get('after');
  
  const language = searchParams.get('language');
  const architecture = searchParams.get('architecture');
  const technology = searchParams.get('technology');
  const testingFramework = searchParams.get('testingFramework');
  const buildTool = searchParams.get('buildTool');
  const packageManager = searchParams.get('packageManager');
  const database = searchParams.get('database');
  const ci = searchParams.get('ci');

  let fullQuery = query;
  if (language) fullQuery += ` language:${language}`;
  if (technology) fullQuery += ` ${technology}`;
  if (testingFramework) fullQuery += ` ${testingFramework}`;
  if (buildTool) fullQuery += ` ${buildTool}`;
  if (packageManager) fullQuery += ` ${packageManager}`;
  if (database) fullQuery += ` ${database}`;
  if (ci) fullQuery += ` ${ci}`;

  if (architecture === "Monorepo") {
    fullQuery += " turbo or lerna or pnpm-workspace";
  }

  if (!fullQuery.trim()) {
    return NextResponse.json({ error: 'Query parameter "q" or filters are required' }, { status: 400 });
  }

  try {
    const results = await searchRepositories(fullQuery.trim(), 20, after || undefined);
    // Add basic Cache-Control for Vercel / browsers
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error: any) {
    console.error('Error searching repositories:', error);
    return NextResponse.json({ error: 'Failed to search repositories' }, { status: 500 });
  }
}
