/// <reference types="vite/client" />
import { useState } from 'react'
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
//import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
//import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import appCss from '../styles/app.css?url'
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
        title: 'K2m Tanstack Start',
      },
    ],
    links: [
      // Google Fonts - Roboto (Google tarafından geliştirilmiş kurumsal font)
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
      },
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
  // SSR için her request'te yeni QueryClient oluştur
  // staleTime: 60 saniye - SSR sonrası client'ta hemen refetch yapılmasını önler
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 dakika
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="tr">
        <head>
          <HeadContent />
        </head>
        <body>
          <Outlet />
          {/* <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools buttonPosition="bottom-left" /> */}
          <Scripts />
        </body>
      </html>
    </QueryClientProvider>
  )
}
