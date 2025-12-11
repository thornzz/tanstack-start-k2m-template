import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles/app.css?url'

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

})

import { authClient } from '../lib/auth-client'
import { useRouter } from '@tanstack/react-router'

function RootComponent() {
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.navigate({ to: '/login' })
        },
        onError: (ctx) => {
          alert("Logout failed: " + ctx.error.message)
        }
      }
    })
  }

  return (
    <html lang="tr">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="p-2 flex gap-2 text-lg border-b items-center justify-between">
          <div className="flex gap-2">
            <a href="/" className="[&.active]:font-bold">Home</a>
            {/* Only show Login link when we're sure there's no session (not during loading) */}
            {!isPending && !session && <a href="/login" className="[&.active]:font-bold">Login</a>}
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
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
