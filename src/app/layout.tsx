import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Daily Focus",
  description: "A simple daily todo list for productivity.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html data-theme="retro" lang="en" className={`${GeistSans.variable}`}>
      <body>
        <nav className="navbar container mx-auto">
          <div className="flex-1">
            <Link href={'/'} className="btn btn-ghost text-xl">
              Daily Focus
            </Link>
          </div>

          <div className="flex-none">
            <Link href={'/signin'} className="btn btn-ghost">Sign in</Link>
            <Link href={'/signup'} className="btn btn-ghost">Sign up</Link>
          </div>
        </nav>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
