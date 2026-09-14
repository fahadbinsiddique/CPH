import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'
import GoBackButton from '@/components/shared/GoBackButton'

export const metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist or has been moved.',
}

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 -left-28 h-96 w-96 rounded-full bg-teal-100/40 blur-3xl" />
        <div className="absolute -bottom-48 -right-24 h-[28rem] w-[28rem] rounded-full bg-emerald-100/50 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-md text-center">
        {/* 404 number */}
        <p className="font-heading text-[8rem] font-extrabold leading-none tracking-tighter text-teal-600/15 select-none md:text-[10rem]">
          404
        </p>

        {/* Heading */}
        <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight text-stone-900 md:text-3xl">
          Page not found
        </h1>

        {/* Description */}
        <p className="mt-3 text-base leading-relaxed text-stone-500">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
          It may have been moved or doesn&apos;t exist.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-primary">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <GoBackButton />
        </div>
      </div>
    </div>
  )
}
