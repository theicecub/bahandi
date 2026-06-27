'use client'

import Image from 'next/image'

function getPhotoUrls(photoUrl: string | null) {
  if (!photoUrl) return []

  try {
    const parsed = JSON.parse(photoUrl)
    if (Array.isArray(parsed)) return parsed.filter((url): url is string => typeof url === 'string' && url.length > 0)
  } catch {
    // Old records store a single URL as plain text.
  }

  return [photoUrl]
}

export function PhotoGrid({ photoUrl, compact = false }: { photoUrl: string | null, compact?: boolean }) {
  const urls = getPhotoUrls(photoUrl)
  if (urls.length === 0) return null

  return (
    <div className={`grid gap-2 ${urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {urls.map((url, index) => (
        <div key={`${url}-${index}`} className={`relative rounded-lg overflow-hidden bg-muted ${compact ? 'h-28' : 'h-40'}`}>
          <Image src={url} alt="Фото" fill className="object-cover" />
        </div>
      ))}
    </div>
  )
}
