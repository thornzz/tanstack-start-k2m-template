import { useQuery, useQueryClient } from '@tanstack/react-query'
import { usePaginatedQuery } from 'convex/react'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import { QUERY_KEYS } from '../constants'
import type { Id } from '../../convex/_generated/dataModel'
import { useCallback, useMemo, useEffect } from 'react'
import { useSearch, useNavigate } from '@tanstack/react-router'

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
 * Belirli bir kullanıcıyı ID'ye göre getiren hook
 */
export function useUserById(userId: string | undefined) {
    const query = useQuery({
        ...convexQuery(api.appUsers.getById, { id: userId as Id<"appUsers"> }),
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

// Default pagination - Convex'in default değeri 
const DEFAULT_PAGE_SIZE = 25

/**
 * Kullanıcı listesi hook'u - Convex usePaginatedQuery ile
 * URL search params kullanarak state'i persist eder
 */
export function useUserSearch() {
    // URL'den state al
    const searchParams = useSearch({ from: '/_authed/users/' })
    const navigate = useNavigate({ from: '/users' })

    // URL'den değerleri al (default değerlerle)
    const searchTerm = searchParams.search ?? ''
    const pageSize = searchParams.pageSize ?? DEFAULT_PAGE_SIZE
    const displayPageIndex = searchParams.page ?? 0

    // URL'i güncelle
    const updateUrl = useCallback((updates: { page?: number; pageSize?: number; search?: string }) => {
        navigate({
            search: (prev) => ({
                ...prev,
                ...updates,
            }),
        })
    }, [navigate])

    // Convex usePaginatedQuery - Cursor'ları otomatik yönetir
    // Search varsa search query kullan, yoksa list query
    const listPagination = usePaginatedQuery(
        api.appUsers.list,
        searchTerm ? "skip" : {},
        { initialNumItems: pageSize }
    )

    const searchPagination = usePaginatedQuery(
        api.appUsers.search,
        searchTerm ? { search: searchTerm } : "skip",
        { initialNumItems: pageSize }
    )

    // Aktif pagination'ı seç
    const activePagination = searchTerm ? searchPagination : listPagination

    const { results, status, loadMore } = activePagination

    // Total count (ayrı query)
    const countQuery = useQuery({
        ...convexQuery(api.appUsers.count, { search: searchTerm || undefined }),
    })
    const totalCount = countQuery.data ?? 0

    // Sayfa başına gösterilecek kullanıcıları hesapla
    const startIndex = displayPageIndex * pageSize
    const endIndex = startIndex + pageSize
    const currentPageUsers = useMemo(() => {
        return results.slice(startIndex, endIndex)
    }, [results, startIndex, endIndex])

    // Gerekli verileri önceden yükle
    useEffect(() => {
        // Eğer mevcut sayfa için yeterli veri yoksa yükle
        if (results.length < endIndex && status === "CanLoadMore") {
            const neededItems = endIndex - results.length
            loadMore(Math.max(neededItems, pageSize))
        }
    }, [displayPageIndex, pageSize, results.length, endIndex, status, loadMore])

    // Sonraki sayfa
    const nextPage = useCallback(() => {
        const nextEndIndex = (displayPageIndex + 1) * pageSize + pageSize

        // Eğer sonraki sayfa için yeterli veri yoksa yükle
        if (results.length < nextEndIndex && status === "CanLoadMore") {
            loadMore(pageSize)
        }

        // Sadece daha fazla veri varsa sayfayı değiştir
        if (results.length > endIndex || status === "CanLoadMore") {
            updateUrl({ page: displayPageIndex + 1 })
        }
    }, [displayPageIndex, pageSize, results.length, endIndex, status, loadMore, updateUrl])

    // Önceki sayfa
    const prevPage = useCallback(() => {
        if (displayPageIndex > 0) {
            updateUrl({ page: displayPageIndex - 1 })
        }
    }, [displayPageIndex, updateUrl])

    // Search değiştiğinde sıfırla
    const handleSetSearchTerm = useCallback((term: string) => {
        updateUrl({ search: term, page: 0 })
    }, [updateUrl])

    // PageSize değiştiğinde sıfırla
    const handleSetPageSize = useCallback((size: number) => {
        updateUrl({ pageSize: size, page: 0 })
    }, [updateUrl])

    // canNext: Daha fazla veri var veya yüklenmiş veriler arasında gezinebilir
    const canNext = results.length > endIndex || status === "CanLoadMore"
    // canPrev: İlk sayfada değilsek
    const canPrev = displayPageIndex > 0

    // isLoading durumları
    const isLoading = status === "LoadingFirstPage"
    const isFetching = status === "LoadingMore"

    return {
        users: currentPageUsers,
        searchTerm,
        setSearchTerm: handleSetSearchTerm,

        // Pagination
        pageIndex: displayPageIndex,
        pageSize,
        setPageSize: handleSetPageSize,
        totalCount,

        nextPage,
        prevPage,
        canNext,
        canPrev,

        // Status
        isLoading,
        isFetching,
        status,

        // LoadMore (infinite scroll için)
        loadMore: () => status === "CanLoadMore" && loadMore(pageSize),

        error: null as Error | null
    }
}
