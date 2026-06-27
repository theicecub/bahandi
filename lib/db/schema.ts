import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('employee'), // 'employee' | 'reviewer'
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => user.id),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => user.id),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const writeOff = pgTable('write_off', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  outletName: text('outletName').notNull(),
  productName: text('productName').notNull(),
  quantity: integer('quantity').notNull(),
  deductionType: text('deductionType').notNull().default('no_deduction'), // 'no_deduction' | 'with_deduction'
  deductedEmployeeName: text('deductedEmployeeName'),
  reason: text('reason').notNull(),
  photoUrl: text('photoUrl'),
  status: text('status').notNull().default('pending'), // 'pending' | 'approved' | 'rejected'
  reviewerId: text('reviewerId'),
  reviewerNote: text('reviewerNote'),
  reviewedAt: timestamp('reviewedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export type WriteOff = typeof writeOff.$inferSelect
export type User = typeof user.$inferSelect
