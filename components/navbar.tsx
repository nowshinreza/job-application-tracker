"use client";

import { Briefcase } from "lucide-react";
import Link from "next/link";

import { useSession } from "@/lib/auth/auth-client";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import SignOutButton from "./sign-out-btn";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Briefcase className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-bold tracking-tight text-gray-950 sm:text-lg">
              Job Tracker
            </p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Organize your career
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {session?.user ? (
            <>
              <Button
                nativeButton={false}
                render={<Link href="/dashboard" />}
                variant="ghost"
                className="h-9 rounded-lg px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-950 sm:px-4"
              >
                Dashboard
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full p-0 transition hover:bg-gray-100"
                      aria-label="Open profile menu"
                    >
                      <Avatar className="h-9 w-9 border border-gray-200 shadow-sm">
                        <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                          {session.user.name?.[0]?.toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                />

                <DropdownMenuContent
                  className="w-64 rounded-xl border-gray-200 p-2 shadow-xl"
                  align="end"
                  sideOffset={8}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="rounded-lg px-3 py-3 font-normal">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 shrink-0 border border-gray-200">
                          <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                            {session.user.name?.[0]?.toUpperCase() ?? "U"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="truncate text-sm font-semibold leading-none text-gray-950">
                            {session.user.name}
                          </p>

                          <p className="truncate text-xs leading-none text-muted-foreground">
                            {session.user.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <div className="my-1 h-px bg-gray-100" />

                    <SignOutButton />
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                nativeButton={false}
                render={<Link href="/sign-in" />}
                variant="ghost"
                className="h-9 rounded-lg px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-950 sm:px-4"
              >
                Log In
              </Button>

              <Button
                nativeButton={false}
                render={<Link href="/sign-up" />}
                className="h-9 rounded-lg bg-primary px-3 text-sm font-semibold shadow-sm transition-all hover:bg-primary/90 hover:shadow-md sm:px-4"
              >
                <span className="sm:hidden">Sign Up</span>
                <span className="hidden sm:inline">Start for free</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}