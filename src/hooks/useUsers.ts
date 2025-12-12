import { useQuery, useQueryClient } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import { QUERY_KEYS } from '../constants'
import type { Id } from '../../convex/_generated/dataModel'
import { useState, useMemo } from 'react'

/**
 * Convex API ile kullanıcı verileri için custom hook'lar
 */

// Query Keys - Centralized constants'tan alınır
// Legacy uyumluluk için export ediliyor
export const userQueryKeys = QUERY_KEYS.users

// App User type for Convex
export type ConvexAppUser = {
    _id: Id<"appUsers">
    _creationTime: number
    name: string
    email: string
    role: string
    status: string
    createdAt: number
    updatedAt: number
}

/**
 * Tüm kullanıcıları getiren hook
 */
export function useUsers(page: number = 1, pageSize: number = 50, search: string = '') {
    const query = useQuery({
        ...convexQuery(api.users.get, { page, pageSize, search }),
        refetchInterval: 60 * 1000,
        placeholderData: (previousData: any) => previousData,
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
        ...convexQuery(api.users.getById, { id: userId as Id<"appUsers"> }),
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
 * Kullanıcı cache işlemleri için hook
 */
export function useUserMutations() {
    const queryClient = useQueryClient()

    const invalidateUsers = () => {
        queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
    }

    return {
        invalidateUsers,
    }
}

/**
 * Kullanıcı listesi hook'u - Sayfalama ve Arama
 */
export function useUserSearch() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(50)
    const [searchTerm, setSearchTerm] = useState('')

    const { users, meta, isLoading, error } = useUsers(page, pageSize, searchTerm)

    // Reset page when search changes
    useMemo(() => {
        if (searchTerm) setPage(1)
    }, [searchTerm])

    return {
        users,
        meta,
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
