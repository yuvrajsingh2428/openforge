'use client';

import { useEffect, useState } from 'react';
import { HealthScore } from '@openforge/repository-intelligence';
import { ContributionEstimate } from '@openforge/issue-engine';
import { RepositoryHealthBadge } from '@/features/repositories/components/repository-health-badge';
import { ContributionSizeBadge } from '@/features/issues/components/contribution-size-badge';
import { Loader2 } from 'lucide-react';

interface RecommendationExtraStatsProps {
  owner: string;
  repo: string;
  issueNumber: number;
}

export function RecommendationExtraStats({ owner, repo, issueNumber }: RecommendationExtraStatsProps) {
  const [health, setHealth] = useState<HealthScore | null>(null);
  const [estimate, setEstimate] = useState<ContributionEstimate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const [healthRes, estRes] = await Promise.all([
          fetch(`/api/repository-health?owner=${owner}&repo=${repo}`),
          fetch(`/api/contribution-estimate?owner=${owner}&repo=${repo}&number=${issueNumber}`)
        ]);

        if (!mounted) return;

        if (healthRes.ok) {
          const h = await healthRes.json();
          setHealth(h);
        }
        
        if (estRes.ok) {
          const e = await estRes.json();
          setEstimate(e);
        }
      } catch (e) {
        // Silently fail for informational badges
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [owner, repo, issueNumber]);

  if (loading) {
    return <div className="flex gap-2 items-center text-xs text-muted-foreground mt-2"><Loader2 className="h-3 w-3 animate-spin" /> Loading stats...</div>;
  }

  if (!health && !estimate) return null;

  return (
    <div className="flex items-center gap-2 mt-3 flex-wrap">
      {health && <RepositoryHealthBadge score={health.totalScore} />}
      {estimate && <ContributionSizeBadge size={estimate.size} />}
    </div>
  );
}
