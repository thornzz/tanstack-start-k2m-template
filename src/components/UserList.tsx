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
        users, // changed from filteredUsers
        searchTerm,
        setSearchTerm,
        page,
        setPage,
        pageSize,
        setPageSize,
        meta,
        isLoading,
        error,
    } = useUserSearch()

    if (error) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                Hata: {error.message}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Arama ve Sayfalama Üst Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
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

                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Sayfa başına:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="bg-slate-800 border-slate-700 text-white rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-cyan-500/50 outline-none"
                    >
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={250}>250</option>
                        <option value={500}>500</option>
                    </select>
                </div>
            </div>

            {/* Kullanıcı listesi */}
            <div className="min-h-[300px]">
                {users.length === 0 && !isLoading ? (
                    <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
                        <p className="text-slate-400">
                            {searchTerm ? 'Aradığınız kriterlere uygun kullanıcı bulunamadı.' : 'Henüz kullanıcı yok.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {users.map((user: any) => (
                            <div
                                key={user.id}
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
                                                params={{ userId: String(user.id) }}
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

            {/* Pagination Info & Controls */}
            {meta && (
                <div className="flex items-center justify-between border-t border-slate-700/50 pt-4">
                    <div className="text-sm text-slate-400">
                        Top <span className="text-white font-medium">{meta.total}</span> kullanıcıdan <span className="text-white font-medium">{((page - 1) * pageSize) + 1}</span> - <span className="text-white font-medium">{Math.min(page * pageSize, meta.total)}</span> arası gösteriliyor
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || isLoading}
                            className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                        >
                            Önceki
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= (meta.totalPages || 1) || isLoading}
                            className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                        >
                            Sonraki
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

