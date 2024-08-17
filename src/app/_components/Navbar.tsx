import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Navbar() {
  return (

    <nav className="navbar container mx-auto">
      <div className="flex-1">
        <Link href={'/'} className="btn btn-ghost text-xl">
          Daily Focus
        </Link>
      </div>

      <div className="flex-none">
        <SignedOut>
          <Link href={'/auth/login'} className="btn btn-ghost">Sign in</Link>
          <Link href={'/auth/signup'} className="btn btn-ghost">Sign up</Link>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  )
}
