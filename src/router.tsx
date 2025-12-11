import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { NotFoundComponent } from './components/NotFoundComponent'

// Default error component for all routes
import { DefaultErrorComponent } from './components/DefaultErrorComponent'

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Shown when an error bubbles to the router
    defaultErrorComponent: DefaultErrorComponent,
    defaultNotFoundComponent: NotFoundComponent,
  })

  return router
}
