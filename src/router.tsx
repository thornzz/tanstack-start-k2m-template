import { ConvexQueryClient } from '@convex-dev/react-query'
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { createRouter } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'


// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { NotFoundComponent } from './components/NotFoundComponent'

// Default error component for all routes
import { DefaultErrorComponent } from './components/DefaultErrorComponent'

// Create a new router instance with Convex + React Query integration
export const getRouter = () => {
  const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL!
  if (!CONVEX_URL) {
    console.error('missing envar VITE_CONVEX_URL')
  }

  const convexQueryClient = new ConvexQueryClient(CONVEX_URL)
  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  })
  convexQueryClient.connect(queryClient)

  const router = routerWithQueryClient(
    createRouter({
      routeTree,
      scrollRestoration: true,
      defaultPreload: 'intent',
      defaultPreloadStaleTime: 0,
      context: { queryClient },
      // Shown when an error bubbles to the router
      defaultErrorComponent: DefaultErrorComponent,
      defaultNotFoundComponent: NotFoundComponent,
      Wrap: ({ children }) => (
        <ConvexAuthProvider client={convexQueryClient.convexClient}>
          {children}
        </ConvexAuthProvider>
      ),
    }),
    queryClient,
  )

  return router
}
