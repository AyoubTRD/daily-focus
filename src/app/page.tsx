import Link from "next/link";

import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold">Hello world</h1>
    </div>
  );
}
