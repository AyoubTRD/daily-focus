import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import Link from "next/link";
import { ClerkProvider, SignedIn, SignedOut, SignOutButton, UserButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Daily Focus",
  description: "A simple daily todo list for productivity.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html data-theme="retro" lang="en" className={`${GeistSans.variable}`}>
        <body className="flex flex-col w-full min-h-screen">
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
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
