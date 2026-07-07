import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
      <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-balance">
        Discover Meaningful <br className="hidden sm:block" />
        <span className="text-muted-foreground">Open Source Contributions</span>
      </h1>
      <p className="mt-6 text-xl text-muted-foreground max-w-[42rem] text-balance">
        OpenForge helps you find the right projects based on engineering growth, learning impact, and maintainer friendliness.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link 
          href="/recommendations" 
          className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Get Recommendations
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        <Link 
          href="/repositories"
          className="inline-flex h-12 items-center justify-center rounded-xl border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Explore Repositories
        </Link>
      </div>
    </div>
  )
}
