"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/repositories", label: "Repositories" },
  { href: "/issues", label: "Issues" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/about", label: "About" },
]

export function NavMenu() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === item.href ? "text-foreground" : "text-foreground/60"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
