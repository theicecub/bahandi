'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { writeOff } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

async function getUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user
}

export async function createWriteOff(data: {
  outletName: string
  productName: string
  quantity: number
  deductionType: string
  deductedEmployeeName?: string
  reason: string
  photoUrl?: string
}) {
  const userId = await getUserId()
  await db.insert(writeOff).values({ ...data, userId })
  revalidatePath('/')
}

export async function getMyWriteOffs() {
  const userId = await getUserId()
  return db.select().from(writeOff).where(eq(writeOff.userId, userId)).orderBy(desc(writeOff.createdAt))
}

export async function getAllWriteOffs() {
  const user = await getUser()
  if ((user as { role?: string }).role !== 'reviewer') throw new Error('Forbidden')
  return db.select().from(writeOff).orderBy(desc(writeOff.createdAt))
}

export async function reviewWriteOff(id: number, status: 'approved' | 'rejected', reviewerNote?: string) {
  const userId = await getUserId()
  const user = await getUser()
  if ((user as { role?: string }).role !== 'reviewer') throw new Error('Forbidden')
  await db
    .update(writeOff)
    .set({ status, reviewerId: userId, reviewerNote: reviewerNote ?? null, reviewedAt: new Date() })
    .where(eq(writeOff.id, id))
  revalidatePath('/reviewer')
}
