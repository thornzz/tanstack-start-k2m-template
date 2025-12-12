// TODO: Replace with Convex Auth integration
// The better-auth setup with Drizzle adapter has been temporarily disabled
// for the Convex DB migration. Re-implement with Convex Auth adapter.
//
// Original implementation used:
// - betterAuth from "better-auth"
// - drizzleAdapter from "better-auth/adapters/drizzle"
// - tanstackStartCookies from "better-auth/tanstack-start"
// - localization from "better-auth-localization"
//
// See: https://docs.convex.dev/auth for Convex Auth documentation

export const auth = null

// Placeholder exports to prevent import errors
export type Session = {
    user: {
        id: string
        name: string
        email: string
        emailVerified: boolean
        image: string | null
    } | null
}
