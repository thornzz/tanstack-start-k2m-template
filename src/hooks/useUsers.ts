import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getUsers, getUserById, type AppUser } from '../functions/users'

/**
 * TanStack Start'ta custom hook oluşturma örneği
 * 
 * Bu hook, kullanıcı verilerini yönetmek için kullanılır.
 * Server functions ile TanStack Query'yi birleştirir.
 */

// Query Keys - Tutarlı cache yönetimi için
export const userQueryKeys = {
    all: ['users'] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
}

/**
 * Tüm kullanıcıları getiren hook
 * 
 * Kullanım:
 * ```tsx
 * const { users, isLoading, error, refetch } = useUsers()
 * ```
 */
export function useUsers() {
    const query = useQuery({
        queryKey: userQueryKeys.all,
        queryFn: () => getUsers(),
        refetchInterval: 60 * 1000, // 60 saniyede bir otomatik yenile
    })

    return {
        users: query.data ?? [],
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
 * 
 * Kullanım:
 * ```tsx
 * const { user, isLoading, error } = useUserById('123')
 * ```
 */
export function useUserById(userId: string | undefined) {
    const query = useQuery({
        queryKey: userQueryKeys.detail(userId ?? ''),
        queryFn: () => getUserById({ data: { userId: userId! } }),
        enabled: !!userId, // userId varsa sorguyu çalıştır
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
 * 
 * NOT: Bu örnek, mutation işlemlerinin nasıl yapılacağını gösterir.
 * Gerçek implementasyon için createServerFn ile mutation fonksiyonları oluşturmanız gerekir.
 * 
 * Kullanım:
 * ```tsx
 * const { deleteUser, isDeleting } = useUserMutations()
 * 
 * // Kullanıcı silme
 * deleteUser.mutate('123')
 * ```
 */
export function useUserMutations() {
    const queryClient = useQueryClient()

    // Örnek: Cache'i invalidate etme fonksiyonu
    const invalidateUsers = () => {
        queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
    }

    // Örnek: Cache'i manuel güncelleme (optimistic update)
    const updateUserCache = (userId: string, updates: Partial<AppUser>) => {
        queryClient.setQueryData<AppUser[]>(userQueryKeys.all, (old) => {
            if (!old) return old
            return old.map(user =>
                user.id === Number(userId) ? { ...user, ...updates } : user
            )
        })
    }

    return {
        invalidateUsers,
        updateUserCache,
    }
}

/**
 * Kullanıcı arama hook'u - Filtreleme için
 * 
 * Kullanım:
 * ```tsx
 * const { filteredUsers, setSearchTerm, searchTerm } = useUserSearch()
 * ```
 */
export function useUserSearch() {
    const { users, isLoading, error } = useUsers()
    const [searchTerm, setSearchTerm] = useState('')

    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return users

        const lowerSearch = searchTerm.toLowerCase()
        return users.filter(user =>
            user.name.toLowerCase().includes(lowerSearch) ||
            user.email.toLowerCase().includes(lowerSearch)
        )
    }, [users, searchTerm])

    return {
        users,
        filteredUsers,
        searchTerm,
        setSearchTerm,
        isLoading,
        error,
        resultCount: filteredUsers.length,
        totalCount: users.length,
    }
}

// React'tan gerekli importlar (yukarıdaki useUserSearch için)
import { useState, useMemo } from 'react'
