/**
 * TanStack Query key constants
 * Centralized query keys for consistent cache management
 */

export const QUERY_KEYS = {
    // User queries
    users: {
        all: ['users'] as const,
        lists: () => [...QUERY_KEYS.users.all, 'list'] as const,
        list: (filters: Record<string, unknown>) => [...QUERY_KEYS.users.lists(), filters] as const,
        details: () => [...QUERY_KEYS.users.all, 'detail'] as const,
        detail: (id: string | number) => [...QUERY_KEYS.users.details(), String(id)] as const,
    },

    // Auth queries
    auth: {
        all: ['auth'] as const,
        session: () => [...QUERY_KEYS.auth.all, 'session'] as const,
        user: () => [...QUERY_KEYS.auth.all, 'user'] as const,
    },
} as const
