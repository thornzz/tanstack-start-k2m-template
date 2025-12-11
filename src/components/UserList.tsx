import { useUserSearch } from '../hooks/useUsers'

/**
 * Kullanıcı listesi componenti - Hook kullanım örneği
 * 
 * Bu component, custom hook'ların nasıl kullanılacağını gösterir.
 */
export function UserList() {
    const {
        filteredUsers,
        searchTerm,
        setSearchTerm,
        isLoading,
        error,
        resultCount,
        totalCount,
    } = useUserSearch()

    if (error) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                Hata: {error.message}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Arama kutusu */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Kullanıcı ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                {searchTerm && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        {resultCount} / {totalCount}
                    </span>
                )}
            </div>

            {/* Yükleniyor durumu */}
            {isLoading && (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
                </div>
            )}

            {/* Kullanıcı listesi */}
            {!isLoading && (
                <div className="grid gap-3">
                    {filteredUsers.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">
                            {searchTerm ? 'Sonuç bulunamadı' : 'Henüz kullanıcı yok'}
                        </p>
                    ) : (
                        filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {user.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {user.email}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full ${user.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {user.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
