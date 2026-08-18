// The single conversion point of the marketing site: the app is the product,
// so every CTA ends here.
//
// Store URLs come from env rather than being hardcoded because the app is not
// published yet. With neither set, the badges render as a "coming soon" state
// instead of dead links — shipping the real links later is an env change on
// Vercel, not a code change.
//
// NOTE: at launch, swap the inline marks below for Apple's and Google's
// official badge artwork — both require their own artwork in store listings
// and promotional material.

const IOS_URL = process.env.NEXT_PUBLIC_IOS_APP_URL
const ANDROID_URL = process.env.NEXT_PUBLIC_ANDROID_APP_URL

type Props = {
  /** `dark` sits on the pantry-green sections, `light` on the chalk cards. */
  tone?: 'dark' | 'light'
  size?: 'default' | 'compact'
  className?: string
}

export function StoreBadges({ tone = 'dark', size = 'default', className = '' }: Props) {
  const live = Boolean(IOS_URL || ANDROID_URL)

  const pad = size === 'compact' ? 'px-4 py-2' : 'px-6 py-3'
  const text = size === 'compact' ? 'text-[13px]' : 'text-sm'
  const icon = size === 'compact' ? 14 : 17

  if (!live) {
    // Deliberately not a link and not a <button>: there is nowhere to go yet,
    // and a control that does nothing on click is worse than a plain label.
    const mutedTone =
      tone === 'dark'
        ? 'border-[#f5f6f1]/20 text-[#a3b4a7]'
        : 'border-[var(--border)] text-[var(--text-muted)]'

    return (
      <div className={`flex flex-col items-start gap-2 ${className}`}>
        <span
          className={`inline-flex items-center gap-2.5 rounded-full border border-dashed ${pad} ${text} ${mutedTone} font-mono-ticket tracking-[0.08em]`}
        >
          <AppleMark size={icon} />
          <PlayMark size={icon} />
          COMING SOON
        </span>
        <span
          className={`text-xs ${tone === 'dark' ? 'text-[#a3b4a7]' : 'text-[var(--text-muted)]'}`}
        >
          iOS and Android — landing shortly.
        </span>
      </div>
    )
  }

  const primary =
    tone === 'dark'
      ? 'bg-[#cdf23e] text-[#17180f]'
      : 'bg-[var(--text-primary)] text-[var(--bg)]'
  const secondary =
    tone === 'dark'
      ? 'border border-[#f5f6f1]/25 text-[#f5f6f1] [@media(hover:hover)]:hover:bg-white/5'
      : 'border border-[var(--text-primary)] text-[var(--text-primary)] [@media(hover:hover)]:hover:bg-[var(--surface-2)]'

  // Press feedback (scale(0.97) on :active) applies on any pointer, unlike
  // the lift/tint hovers above which are gated to real pointers only —
  // touch devices fire :hover on tap and get stuck there otherwise.
  const pressable = 'transition-transform duration-150 ease-out active:scale-[0.97]'

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      {IOS_URL && (
        <a
          href={IOS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-2 rounded-full font-bold [@media(hover:hover)]:hover:-translate-y-0.5 ${pressable} ${pad} ${text} ${primary}`}
        >
          <AppleMark size={icon} />
          App Store
        </a>
      )}
      {ANDROID_URL && (
        <a
          href={ANDROID_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-2 rounded-full font-medium ${pressable} ${pad} ${text} ${
            IOS_URL ? secondary : primary
          }`}
        >
          <PlayMark size={icon} />
          Google Play
        </a>
      )}
    </div>
  )
}

function AppleMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

function PlayMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 20.5V3.5c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.25-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.59.68.59 1.19s-.25.92-.59 1.19l-2.29 1.32-2.5-2.51 2.5-2.51 2.29 1.32zM6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z" />
    </svg>
  )
}
