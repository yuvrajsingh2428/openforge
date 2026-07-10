'use client';

import { 
  BookOpen, 
  CheckSquare, 
  AlertTriangle, 
  HelpCircle, 
  TrendingUp, 
  Code, 
  Bug, 
  Compass 
} from "lucide-react";
import type { MentorSession } from "@openforge/engineering-mentor";

interface Props {
  session: MentorSession;
}

export function MentorDashboard({ session }: Props) {
  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
            <Compass className="h-5 w-5 text-primary" />
            Repository Overview
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {session.repositoryOverview}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-primary" />
            Issue Understanding
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {session.issueUnderstanding}
          </p>
        </div>
      </div>

      {/* Reading Order Timeline */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5 text-primary" />
          Reading Order & Journey Timeline
        </h3>
        <div className="relative border-l-2 border-primary/20 pl-6 space-y-6">
          {session.readingOrder.map((item, idx) => (
            <div key={idx} className="relative">
              <span className="absolute -left-[31px] top-1 bg-background border-2 border-primary rounded-full p-1 text-primary">
                <Code className="h-3 w-3" />
              </span>
              <h4 className="text-sm font-semibold font-mono text-primary break-all">
                {item.path}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {item.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Implementation Strategy */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-primary" />
          Implementation Strategy Steps
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {session.strategySteps.map((step) => (
            <div key={step.stepNumber} className="p-4 rounded-lg bg-muted border text-sm flex gap-3">
              <span className="h-6 w-6 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                {step.stepNumber}
              </span>
              <div>
                <h4 className="font-semibold mb-1">{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.guidelines}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Debugging Guide */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
          <Bug className="h-5 w-5 text-primary" />
          Debugging & Verification
        </h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold text-muted-foreground mb-1.5 uppercase text-xs tracking-wider">Likely Root Causes</h4>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {session.debugGuide.rootCauses.map((rc, i) => <li key={i}>{rc}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-muted-foreground mb-1.5 uppercase text-xs tracking-wider">Verification Steps</h4>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {session.debugGuide.verificationSteps.map((vs, i) => <li key={i}>{vs}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Checklist, Learning, and Warnings */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Checklist */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-md font-bold flex items-center gap-2 mb-4">
            <CheckSquare className="h-5 w-5 text-primary" />
            Review Checklist
          </h3>
          <ul className="space-y-3 text-xs">
            {session.reviewChecklist.map((item) => (
              <li key={item.id} className="p-2.5 rounded bg-muted/50 border">
                <span className="font-bold text-primary mr-1">[{item.category}]</span>
                <span className="text-muted-foreground">{item.description}</span>
                <div className="text-[10px] text-muted-foreground font-mono mt-1 border-t pt-1">
                  Verify: {item.verificationMethod}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Learning Card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-md font-bold flex items-center gap-2 mb-4">
            <Compass className="h-5 w-5 text-primary" />
            Learning Outcomes
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-xs text-muted-foreground">
            {session.learningOutcomes.map((out, i) => <li key={i}>{out}</li>)}
          </ul>
        </div>

        {/* Warnings & Mistakes */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-md font-bold flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Warnings & Pitfalls
          </h3>
          <div className="space-y-4 text-xs">
            {session.warnings.length > 0 && (
              <div>
                <h4 className="font-bold text-destructive mb-1">Alerts</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {session.warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}
            {session.commonMistakes.length > 0 && (
              <div>
                <h4 className="font-bold text-muted-foreground mb-1">Common Mistakes</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {session.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
