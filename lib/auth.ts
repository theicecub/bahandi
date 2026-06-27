import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

const baseURL =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.V0_RUNTIME_URL ?? 'http://localhost:3000')

const trustedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://100.64.25.89:3000',
  process.env.V0_RUNTIME_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined,
].filter(Boolean) as string[]

export const auth = betterAuth({
  baseURL,
  trustedOrigins,
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  emailAndPassword: { enabled: true },
  user: { additionalFields: { role: { type: 'string', defaultValue: 'employee' } } },
  ...(process.env.NODE_ENV === 'development' && {
    advanced: { defaultCookieAttributes: { sameSite: 'none', secure: true } },
  }),
})
