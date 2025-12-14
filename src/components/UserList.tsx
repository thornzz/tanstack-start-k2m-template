import { Link } from '@tanstack/react-router'
import { useUserSearch } from '../hooks/useUsers'
import { Button } from './ui/button'
import { useMemo } from 'react'

/**
 * Kullanıcı listesi componenti - Tablo formatı ve gelişmiş pagination
 */
export function UserList() {
    const {
        users,
        searchTerm,
        setSearchTerm,

        pageIndex,
        pageSize,
        setPageSize,
        totalCount,

        nextPage,
        prevPage,
        canNext,
        canPrev,

        isLoading,
        isFetching,
        error,
    } = useUserSearch()

    // Sayfa hesaplamaları
    const totalPages = useMemo(() => Math.ceil(totalCount / pageSize), [totalCount, pageSize])
    const startItem = pageIndex * pageSize + 1
    const endItem = Math.min((pageIndex + 1) * pageSize, totalCount)

    // Sayfa numaralarını hesapla (max 5 sayfa göster)
    const pageNumbers = useMemo(() => {
        const pages: (number | 'ellipsis')[] = []
        const maxVisible = 5
        const current = pageIndex + 1

        if (totalPages <= maxVisible) {
            // Tüm sayfaları göster
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // İlk sayfa her zaman
            pages.push(1)

            if (current > 3) {
                pages.push('ellipsis')
            }

            // Mevcut sayfa etrafındaki sayfalar
            const start = Math.max(2, current - 1)
            const end = Math.min(totalPages - 1, current + 1)

            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            if (current < totalPages - 2) {
                pages.push('ellipsis')
            }

            // Son sayfa her zaman
            if (totalPages > 1) {
                pages.push(totalPages)
            }
        }

        return pages
    }, [pageIndex, totalPages])

    // Sayfa geçişi için helper
    const goToPage = (page: number) => {
        const diff = page - (pageIndex + 1)
        if (diff > 0) {
            for (let i = 0; i < diff; i++) {
                nextPage()
            }
        } else if (diff < 0) {
            for (let i = 0; i < Math.abs(diff); i++) {
                prevPage()
            }
        }
    }

    if (error) {
        return (
            <div className="p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Hata: {error instanceof Error ? error.message : "Bilinmeyen hata"}
                </div>
            </div>
        )
    }

    const pageSizeOptions = [10, 25, 50, 100, 250];

    return (
        <div className="space-y-4">
            {/* Top Bar: Search */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                {/* Search */}
                <div className="relative w-full lg:w-96">
                    <input
                        type="text"
                        placeholder="İsim veya e-posta ile ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/50 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        {(isLoading || isFetching) ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-500 border-t-transparent" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        )}
                    </div>
                </div>

                {/* Page Size Selector */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Göster:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="bg-slate-800/80 border border-slate-700/50 text-white rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none cursor-pointer hover:border-slate-600 transition-colors"
                    >
                        {pageSizeOptions.map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="relative rounded-xl border border-slate-700/50 overflow-hidden bg-slate-800/30">
                {/* Loading overlay for page transitions */}
                {isFetching && !isLoading && (
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-full border border-slate-700">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-500 border-t-transparent" />
                            <span className="text-cyan-400 text-sm font-medium">Yükleniyor...</span>
                        </div>
                    </div>
                )}

                {/* Initial loading state */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-cyan-500 border-t-transparent" />
                            <span className="text-slate-400 text-sm">Kullanıcılar yükleniyor...</span>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {(!users || users.length === 0) && !isLoading && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
                            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <p className="text-slate-400">
                            {searchTerm ? 'Aradığınız kriterlere uygun kullanıcı bulunamadı.' : 'Henüz kullanıcı yok.'}
                        </p>
                    </div>
                )}

                {/* Table */}
                {!isLoading && users && users.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-800/80 border-b border-slate-700/50">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ad Soyad</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">E-posta</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Rol</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Durum</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30">
                                {users?.map((user: any, index: number) => (
                                    <tr
                                        key={user._id}
                                        className={`hover:bg-slate-700/30 transition-colors ${index % 2 === 0 ? 'bg-slate-800/20' : 'bg-transparent'
                                            }`}
                                    >
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                                    {user.name?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <span className="font-medium text-white truncate max-w-[200px]">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-slate-400 text-sm truncate block max-w-[250px]">{user.email}</span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span
                                                className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${user.role === 'Admin'
                                                    ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/30'
                                                    : user.role === 'Editor'
                                                        ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30'
                                                        : 'bg-slate-700/50 text-slate-400 ring-1 ring-slate-600/30'
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.status === 'Aktif'
                                                    ? 'bg-green-500/10 text-green-400'
                                                    : 'bg-red-500/10 text-red-400'
                                                    }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Aktif' ? 'bg-green-400' : 'bg-red-400'}`} />
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/50 text-xs"
                                            >
                                                <Link
                                                    to="/users/$userId"
                                                    params={{ userId: user._id }}
                                                >
                                                    Detay →
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Enhanced Pagination */}
            {!isLoading && totalCount > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                    {/* Info Text */}
                    <div className="text-sm text-slate-500">
                        <span className="text-white font-medium">{startItem.toLocaleString()}</span>
                        {' - '}
                        <span className="text-white font-medium">{endItem.toLocaleString()}</span>
                        {' arası gösteriliyor, toplam '}
                        <span className="text-cyan-400 font-semibold">{totalCount.toLocaleString()}</span>
                        {' kullanıcı'}
                    </div>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {/* First page button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => goToPage(1)}
                            disabled={pageIndex === 0 || isLoading}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30"
                            title="İlk Sayfa"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </Button>

                        {/* Previous button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={prevPage}
                            disabled={!canPrev || isLoading}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30"
                            title="Önceki Sayfa"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Button>

                        {/* Page numbers */}
                        <div className="flex items-center gap-1 mx-2">
                            {pageNumbers.map((page, idx) => (
                                page === 'ellipsis' ? (
                                    <span key={`ellipsis-${idx}`} className="px-2 text-slate-500">...</span>
                                ) : (
                                    <Button
                                        key={page}
                                        variant={pageIndex + 1 === page ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => goToPage(page)}
                                        disabled={isLoading}
                                        className={`h-8 min-w-[32px] px-2 text-sm font-medium transition-all ${pageIndex + 1 === page
                                            ? 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-500/25'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                            }`}
                                    >
                                        {page}
                                    </Button>
                                )
                            ))}
                        </div>

                        {/* Next button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={nextPage}
                            disabled={!canNext || isLoading}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30"
                            title="Sonraki Sayfa"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Button>

                        {/* Last page button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => goToPage(totalPages)}
                            disabled={pageIndex + 1 >= totalPages || isLoading}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30"
                            title="Son Sayfa"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
