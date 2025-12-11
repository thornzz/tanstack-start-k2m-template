import { HeadContent, Link, Outlet, Scripts, createRootRoute, useRouter } from '@tanstack/react-router'

import appCss from '../styles/app.css?url'
import { authClient } from '../lib/auth-client'
import { NotFoundComponent } from '@/components/NotFoundComponent'
import { Button } from '@/components/ui/button'

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
        title: 'K2m Tanstack Start',
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
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      router.navigate({ to: '/login' })
    } catch (error) {
      console.error('Logout error:', error)
      router.navigate({ to: '/login' })
    }
  }

  return (
    <html lang="tr">
      <head>
        <HeadContent />
      </head>
      <body>
        <nav className="p-3 flex gap-2 text-lg border-b border-slate-700 items-center justify-between bg-slate-900/80 backdrop-blur-sm">
          <div className="flex gap-4">
            <Link to="/" className="[&.active]:text-cyan-400 text-gray-300 hover:text-cyan-400 transition-colors font-medium">
              Ana Sayfa
            </Link>
            {!isPending && session && (
              <Link to="/users" className="[&.active]:text-cyan-400 text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                Kullanıcılar
              </Link>
            )}
            {!isPending && !session && (
              <Link to="/login" className="[&.active]:text-cyan-400 text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                Giriş
              </Link>
            )}
          </div>
          {!isPending && session && (
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <div className="font-bold text-white">{session.user.name}</div>
                <div className="text-gray-400">{session.user.email}</div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
              >
                Çıkış
              </Button>
            </div>
          )}
        </nav>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
