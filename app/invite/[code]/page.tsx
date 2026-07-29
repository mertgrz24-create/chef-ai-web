import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { StoreBadges } from '@/components/marketing/store-badges'

// Referral landing page. It replaces the old /signup?ref=CODE route, which
// worked by stashing the code in localStorage — useless now that signup
// happens in the native app, since web localStorage never reaches it.
//
// So this page does not try to be clever: it shows the code, and the invitee
// types it into the app after installing. No account, no state, no tracking.

// Codes are minted as `CHEF-XXXX` in GET /api/profile.
const CODE_PATTERN = /^CHEF-[A-Z0-9]{4,12}$/

export const metadata: Metadata = {
  title: "You've been invited to ChefAI",
  description: 'Cook what you already have. Use your invite code when you sign up.',
}

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params
  const code = decodeURIComponent(raw).toUpperCase()

  // Validating the shape keeps this from rendering arbitrary text at a
  // shareable URL — the page is public and its content comes from the path.
  if (!CODE_PATTERN.test(code)) notFound()

  return (
    <div className="min-h-screen bg-[#1e3a2f] px-6 py-16 text-[#f5f6f1]">
      <div className="mx-auto max-w-md">
        <Link href="/" className="font-display text-2xl font-bold">
          Chef<span className="text-[#cdf23e]">AI</span>
        </Link>

        <p className="font-mono-ticket mt-12 text-[11px] tracking-[0.2em] text-[#cdf23e]">
          YOU&apos;VE BEEN INVITED
        </p>

        <h1 className="font-display mt-3 text-[34px] font-semibold leading-[1.05]">
          A friend thinks you&apos;re throwing out too much food.
        </h1>

        <p className="mt-4 text-[15px] leading-relaxed text-[#c3c8ba]">
          They&apos;re probably right. ChefAI reads what&apos;s in your fridge and tells you
          what to cook with it — before it goes bad.
        </p>

        {/* the code — the one thing that has to survive the trip */}
        <div className="mt-10 rounded-2xl border border-dashed border-[#cdf23e]/40 bg-black/20 px-6 py-7 text-center">
          <p className="font-mono-ticket text-[10px] tracking-[0.18em] text-[#8fa093]">
            YOUR INVITE CODE
          </p>
          <p className="font-mono-ticket mt-3 text-[26px] font-bold tracking-[0.2em] text-[#cdf23e]">
            {code}
          </p>
        </div>

        <ol className="mt-8 space-y-3 text-sm text-[#c3c8ba]">
          <li className="flex gap-3">
            <span className="font-mono-ticket text-[#cdf23e]">1</span>
            Install ChefAI below.
          </li>
          <li className="flex gap-3">
            <span className="font-mono-ticket text-[#cdf23e]">2</span>
            Create your account in the app.
          </li>
          <li className="flex gap-3">
            <span className="font-mono-ticket text-[#cdf23e]">3</span>
            Enter this code under Profile → Invite friends.
          </li>
        </ol>

        <div className="mt-8">
          <StoreBadges />
        </div>
      </div>
    </div>
  )
}
