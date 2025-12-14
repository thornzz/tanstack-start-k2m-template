import { Link } from '@tanstack/react-router'
import { useUserSearch } from '../hooks/useUsers'
import { Button } from './ui/button'

/**
 * Kullanıcı listesi componenti - Hook kullanım örneği
 * 
 * Bu component, custom hook'ların nasıl kullanılacağını gösterir.
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

    if (error) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                Hata: {error instanceof Error ? error.message : "Bilinmeyen hata"}
            </div>
        )
    }

    const pageSizeOptions = [25, 50, 100, 250, 500, 1000];

    return (
        <div className="space-y-6">
            {/* Top Bar: Search & Page Size & Count */}
            <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
                {/* Search */}
                <div className="relative w-full xl:w-96">
                    <input
                        type="text"
                        placeholder="İsim veya e-posta ile ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-sm"
                    />
                    {isLoading ? (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500" />
                        </div>
                    ) : (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">

                    {/* Total Count Display */}
                    {!searchTerm && (
                        <div className="text-slate-400 text-sm font-medium px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            Toplam: <span className="text-cyan-400">{totalCount}</span> Kullanıcı
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400 hidden sm:inline">Sayfa Başına:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="bg-slate-800 border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none cursor-pointer hover:bg-slate-700 transition-colors"
                        >
                            {pageSizeOptions.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={prevPage}
                            disabled={!canPrev || isLoading}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Button>

                        <div className="px-3 min-w-[3rem] text-center font-mono text-sm font-bold text-white">
                            {pageIndex + 1}
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={nextPage}
                            disabled={!canNext || isLoading}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Kullanıcı listesi */}
            <div className="min-h-[300px] relative">
                {/* Loading overlay for page transitions */}
                {isFetching && !isLoading && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
                            <span className="text-cyan-400 text-sm font-medium">Yükleniyor...</span>
                        </div>
                    </div>
                )}

                {/* Initial loading state */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500" />
                            <span className="text-slate-400">Kullanıcılar yükleniyor...</span>
                        </div>
                    </div>
                )}

                {(!users || users.length === 0) && !isLoading ? (
                    <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
                        <p className="text-slate-400">
                            {searchTerm ? 'Aradığınız kriterlere uygun kullanıcı bulunamadı.' : 'Henüz kullanıcı yok.'}
                        </p>
                    </div>
                ) : !isLoading && (
                    <div className="grid gap-3">
                        {users?.map((user: any) => (
                            <div
                                key={user._id}
                                className="group p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-500/30 rounded-xl transition-all duration-200"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-semibold text-white truncate">
                                                {user.name}
                                            </h3>
                                            <span
                                                className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${user.role === 'Admin'
                                                    ? 'bg-purple-500/20 text-purple-400'
                                                    : user.role === 'Editor'
                                                        ? 'bg-blue-500/20 text-blue-400'
                                                        : 'bg-slate-700 text-slate-400'
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-400 truncate">
                                            {user.email}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span
                                            className={`px-3 py-1 text-xs rounded-full font-medium ${user.status === 'Aktif'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                                }`}
                                        >
                                            {user.status}
                                        </span>

                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950"
                                        >
                                            <Link
                                                to="/users/$userId"
                                                params={{ userId: user._id }}
                                            >
                                                Detay &rarr;
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Pagination Info */}
            <div className="text-center text-xs text-slate-500 border-t border-slate-800 pt-4">
                {searchTerm ? 'Arama Sonuçları' : 'Tüm Kullanıcılar'} &bull; Sayfa {pageIndex + 1}
            </div>
        </div>
    )
}
