import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getUsers, getUserById } from '../functions/users'
import { QUERY_KEYS } from '../constants'
import type { AppUser } from '../types'

/**
 * TanStack Start'ta custom hook oluşturma örneği
 * 
 * Bu hook, kullanıcı verilerini yönetmek için kullanılır.
 * Server functions ile TanStack Query'yi birleştirir.
 * 
 * NOT: Query options için src/queries/users.ts dosyasını kullanabilirsiniz.
 */

// Query Keys - Centralized constants'tan alınır
// Legacy uyumluluk için export ediliyor
export const userQueryKeys = QUERY_KEYS.users

/**
 * Tüm kullanıcıları getiren hook
 * 
 * Kullanım:
 * ```tsx
 * const { users, isLoading, error, refetch } = useUsers()
 * ```
 */
export function useUsers(page: number = 1, pageSize: number = 50, search: string = '') {
    const query = useQuery({
        queryKey: [...userQueryKeys.all, { page, pageSize, search }],
        queryFn: () => getUsers({ data: { page, pageSize, search } }),
        refetchInterval: 60 * 1000,
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
    })

    return {
        users: query.data?.users ?? [],
        meta: query.data?.meta,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
        refetch: query.refetch,
        isError: query.isError,
        isSuccess: query.isSuccess,
    }
}

/**
 * Belirli bir kullanıcıyı ID'ye göre getiren hook
 */
export function useUserById(userId: string | undefined) {
    const query = useQuery({
        queryKey: userQueryKeys.detail(userId ?? ''),
        queryFn: () => getUserById({ data: { userId: userId! } }),
        enabled: !!userId,
    })

    return {
        user: query.data,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
        refetch: query.refetch,
        isError: query.isError,
        isSuccess: query.isSuccess,
    }
}

/**
 * Kullanıcı oluşturma/güncelleme/silme işlemleri için mutation hook
 */
export function useUserMutations() {
    const queryClient = useQueryClient()

    const invalidateUsers = () => {
        queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
    }

    const updateUserCache = (userId: string, updates: Partial<AppUser>) => {
        // Optimistic update logic would need adjustment for paginated cache structure
        // simplified invalidation is safer for now
        invalidateUsers()
    }

    return {
        invalidateUsers,
        updateUserCache,
    }
}

/**
 * Kullanıcı listesi hook'u - Sayfalama ve Arama
 */
export function useUserSearch() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(50)
    const [searchTerm, setSearchTerm] = useState('')

    // Debounce search term could be added here, but for now direct value
    const { users, meta, isLoading, error } = useUsers(page, pageSize, searchTerm)

    // Reset page when search changes
    useMemo(() => {
        if (searchTerm) setPage(1)
    }, [searchTerm])

    return {
        users, // Current page users
        meta, // Pagination info
        searchTerm,
        setSearchTerm,
        page,
        setPage,
        pageSize,
        setPageSize,
        isLoading,
        error,
    }
}

// React'tan gerekli importlar (yukarıdaki useUserSearch için)
import { useState, useMemo } from 'react'
