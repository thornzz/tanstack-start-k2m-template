import { HeadContent, Link, Outlet, Scripts, createRootRoute, useRouter } from '@tanstack/react-router'

import appCss from '../styles/app.css?url'
import { authClient } from '../lib/auth-client'
import { NotFoundComponent } from '@/components/NotFoundComponent'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  component: RootComponent,
  notFoundComponent: NotFoundComponent,
})

function RootComponent() {
  // Use better-auth client for session display (reactive)
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Sign out from better-auth (handles cookie cleanup via tanstackStartCookies plugin)
      await authClient.signOut()
      // Navigate to login page
      router.navigate({ to: '/login' })
    } catch (error) {
      console.error('Logout error:', error)
      // Still try to navigate even if there's an error
      router.navigate({ to: '/login' })
    }
  }

  return (
    <html lang="tr">
      <head>
        <HeadContent />
      </head>
      <body>
        <nav className="p-2 flex gap-2 text-lg border-b items-center justify-between bg-slate-50">
          <div className="flex gap-4">
            <Link to="/" className="[&.active]:font-bold hover:text-cyan-600 transition-colors">
              Home
            </Link>
            {!isPending && session && (
              <Link to="/users" className="[&.active]:font-bold hover:text-cyan-600 transition-colors">
                Users
              </Link>
            )}
            {/* Only show Login link when we're sure there's no session */}
            {!isPending && !session && (
              <Link to="/login" className="[&.active]:font-bold hover:text-cyan-600 transition-colors">
                Login
              </Link>
            )}
          </div>
          {/* Only show user info when session is loaded and exists */}
          {!isPending && session && (
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <div className="font-bold">{session.user.name}</div>
                <div className="text-gray-500">{session.user.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
