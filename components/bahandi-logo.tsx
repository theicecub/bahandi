import { cn } from '@/lib/utils'

type BahandiLogoProps = {
  className?: string
  size?: 'sm' | 'md'
}

export function BahandiLogo({ className, size = 'md' }: BahandiLogoProps) {
  const isSmall = size === 'sm'

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center bg-[#00533f] text-white shadow-sm ring-1 ring-black/10',
        isSmall ? 'h-8 w-[116px] rounded-md px-2.5' : 'h-12 w-[172px] rounded-lg px-4',
        className,
      )}
      aria-label="Bahandi"
      role="img"
    >
      <span
        className={cn(
          'block shrink-0 rounded-full bg-[#f2a51f]',
          isSmall ? 'h-1.5 w-4' : 'h-2 w-6',
        )}
      />
      <span
        className={cn(
          'mx-2 font-black leading-none tracking-[0.08em]',
          isSmall ? 'text-[15px]' : 'text-[22px]',
        )}
      >
        BAHANDI
      </span>
      <span
        className={cn(
          'block shrink-0 rounded-full bg-[#f2a51f]',
          isSmall ? 'h-1.5 w-4' : 'h-2 w-6',
        )}
      />
    </div>
  )
}
