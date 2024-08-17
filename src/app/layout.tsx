import "~/styles/globals.css";
import "react-toastify/ReactToastify.min.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "./_components/Navbar";
import { ToastContainer } from "react-toastify";

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
        <body className="flex min-h-screen w-full flex-col">
          <Navbar />

          <TRPCReactProvider>{children}</TRPCReactProvider>

          <ToastContainer hideProgressBar />
        </body>
      </html>
    </ClerkProvider>
  );
}
