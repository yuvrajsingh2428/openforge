"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/repositories", label: "Repositories" },
  { href: "/issues", label: "Issues" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
]

export function NavMenu() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <nav aria-label="Main Navigation" className="hidden md:flex items-center space-x-6 text-sm font-medium">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === item.href ? "text-foreground font-semibold" : "text-foreground/60"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Hamburger Toggle Button */}
      <div className="flex md:hidden items-center">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
          aria-expanded={mobileOpen}
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="absolute top-14 left-0 right-0 bg-background border-b border-border p-4 flex flex-col space-y-3 md:hidden z-50 shadow-lg"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-foreground",
                pathname === item.href ? "bg-accent text-foreground font-semibold" : "text-foreground/70"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  )
}
