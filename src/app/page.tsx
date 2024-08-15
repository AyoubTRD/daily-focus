import Link from "next/link";
import Image from "next/image"

export default async function Home() {
  return (
    <div className="container mx-auto py-8 flex-1 flex flex-col justify-center">
      <div className="flex justify-between items-center gap-8">
        <div className="max-w-2xl gap-2 flex flex-col">
          <h1 className="font-extrabold text-5xl md:text-7xl text-primary-content">Master Your Day with <span className="text-primary">Daily Focus</span></h1>
          <p className="text-secondary-content">Daily Focus empowers you to take control of your day with ease.
            Plan your tasks, set your priorities, and kickstart your workday with a clear, focused mind.</p>

          <div className="flex gap-4 pt-4">
            <Link className="btn btn-neutral btn-lg" href={'/pricing'}>Pricing</Link>
            <Link className="btn btn-primary btn-lg" href={'/auth/signup'}>Get started for free</Link>
          </div>
        </div>

        <div className="w-fit h-fit relative">
          <Image src={'/hero.webp'} alt="" width={800} height={800} className="rounded-lg" />
          <div className="absolute left-0 w-full h-full top-0 bg-gradient-to-r to-transparent from-base-100 opacity-90 z-10"
          />
        </div>
      </div>
    </div>
  );
}
