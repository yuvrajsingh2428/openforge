'use client';

import { Network, Cpu, Compass, Layers, CheckCircle } from "lucide-react";

interface Props {
  graph: any;
  dependencies: any[];
  architecture: any[];
  journey: any[];
  repoMap: any;
}

export function RepositoryIntelligenceCards({ graph, dependencies, architecture, journey, repoMap }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Technology Stack & Architecture Card */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-col space-y-1.5">
          <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            Architecture & Technologies
          </h3>
        </div>
        <div className="p-6 pt-0 space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Detected Architectures</h4>
            {architecture.length > 0 ? (
              <div className="space-y-2">
                {architecture.map((arch) => (
                  <div key={arch.name} className="flex justify-between items-center p-2 bg-muted rounded-md text-sm">
                    <span className="font-medium">{arch.name}</span>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                      {(arch.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No matching architectures detected.</p>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Technologies</h4>
            <div className="flex flex-wrap gap-1.5">
              {dependencies.slice(0, 10).map((dep) => (
                <span key={dep.name} className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-input bg-background hover:bg-accent hover:text-accent-foreground">
                  {dep.name} ({dep.category})
                </span>
              ))}
              {dependencies.length > 10 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{dependencies.length - 10} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dependency Analysis Card */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-col space-y-1.5">
          <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Dependencies
          </h3>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-3">
            {["AI", "Testing", "Build", "Database"].map(cat => {
              const deps = dependencies.filter(d => d.category === cat);
              if (deps.length === 0) return null;
              return (
                <div key={cat}>
                  <h5 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">{cat}</h5>
                  <div className="flex flex-wrap gap-1">
                    {deps.map(d => (
                      <span key={d.name} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        {d.name} ({d.version})
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contributor Journey Card */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm md:col-span-2">
        <div className="p-6 flex flex-col space-y-1.5">
          <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            Contributor Journey
          </h3>
        </div>
        <div className="p-6 pt-0">
          <div className="relative border-l-2 border-primary/20 pl-6 space-y-6">
            {journey.map((step, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[31px] top-1 bg-background border-2 border-primary rounded-full p-1 text-primary">
                  <CheckCircle className="h-3 w-3" />
                </span>
                <h4 className="text-sm font-semibold">{step.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                {step.nodeId && (
                  <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-primary mt-1.5 inline-block">
                    {step.nodeId.split("/").pop()}
                  </code>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Repository Map Card */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm md:col-span-2">
        <div className="p-6 flex flex-col space-y-1.5">
          <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Repository Map
          </h3>
        </div>
        <div className="p-6 pt-0 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-1">Primary Directories</h4>
            <div className="flex flex-wrap gap-1.5">
              {repoMap.directories.map((dir: string) => (
                <code key={dir} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                  {dir}
                </code>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-1">Core Modules & Entrypoints</h4>
            <div className="flex flex-wrap gap-1.5">
              {repoMap.coreModules.map((mod: string) => (
                <span key={mod} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  Module: {mod}
                </span>
              ))}
              {repoMap.entryPoints.map((ep: string) => (
                <span key={ep} className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-input bg-background hover:bg-accent hover:text-accent-foreground">
                  Entry: {ep}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
