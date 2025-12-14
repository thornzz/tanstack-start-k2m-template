import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2, Upload, File as FileIcon } from 'lucide-react'
import { formatBytes } from '@/lib/utils'

export const Route = createFileRoute('/_authed/files')({
    component: FilesPage,
})

function FilesPage() {
    const generateUploadUrl = useMutation(api.files.generateUploadUrl)
    const saveFile = useMutation(api.files.saveFile)
    const deleteFile = useMutation(api.files.deleteFile)
    const files = useQuery(api.files.getFiles)

    const imageInput = useRef<HTMLInputElement>(null)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    async function handleUpload(event: React.FormEvent) {
        event.preventDefault()
        if (!selectedImage) return

        setIsUploading(true)
        try {
            // Step 1: Get a short-lived upload URL
            const postUrl = await generateUploadUrl()

            // Step 2: POST the file to the URL
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": selectedImage.type },
                body: selectedImage,
            })

            if (!result.ok) {
                throw new Error(`Upload failed: ${result.statusText}`)
            }

            const { storageId } = await result.json()

            // Step 3: Save the newly allocated storage id to the database
            await saveFile({
                storageId,
                name: selectedImage.name,
                type: selectedImage.type,
                size: selectedImage.size,
            })

            setSelectedImage(null)
            if (imageInput.current) {
                imageInput.current.value = ""
            }
        } catch (error) {
            console.error("Upload failed:", error)
            alert("Dosya yüklenirken bir hata oluştu.")
        } finally {
            setIsUploading(false)
        }
    }

    const handleDelete = async (id: any) => {
        if (confirm('Bu dosyayı silmek istediğinize emin misiniz?')) {
            try {
                await deleteFile({ id });
            } catch (error) {
                console.error("Delete failed:", error)
                alert("Dosya silinirken bir hata oluştu.")
            }
        }
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">Dosyalar</h1>
                <p className="text-slate-400">Dosyalarınızı yönetin, yükleyin ve paylaşın.</p>
            </div>

            {/* Upload Section */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-cyan-400" />
                    Dosya Yükle
                </h2>
                <form onSubmit={handleUpload} className="flex items-center gap-4">
                    <input
                        type="file"
                        ref={imageInput}
                        onChange={(event) => setSelectedImage(event.target.files?.[0] || null)}
                        className="block w-full text-sm text-slate-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-cyan-500/10 file:text-cyan-400
              hover:file:bg-cyan-500/20
              cursor-pointer"
                        disabled={isUploading}
                    />
                    <Button
                        type="submit"
                        disabled={!selectedImage || isUploading}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white min-w-[120px]"
                    >
                        {isUploading ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Upload className="w-4 h-4 mr-2" />
                        )}
                        {isUploading ? 'Yükleniyor' : 'Yükle'}
                    </Button>
                </form>
            </div>

            {/* Files List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files === undefined ? (
                    // Loading Skeletons
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-64 bg-slate-900/50 rounded-xl animate-pulse border border-slate-800" />
                    ))
                ) : files.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        Henüz dosya yüklenmemiş.
                    </div>
                ) : (
                    files.map((file) => (
                        <div key={file._id} className="group bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-colors">
                            <div className="aspect-video bg-slate-950 relative flex items-center justify-center border-b border-slate-800 overflow-hidden">
                                {file.type.startsWith('image/') && file.url ? (
                                    <img
                                        src={file.url}
                                        alt={file.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <FileIcon className="w-12 h-12 text-slate-600" />
                                )}
                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    {file.url && (
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-slate-800 text-white rounded-full hover:bg-cyan-500 transition-colors"
                                            title="Görüntüle"
                                        >
                                            <FileIcon className="w-4 h-4" />
                                        </a>
                                    )}
                                    <button
                                        onClick={() => handleDelete(file._id)}
                                        className="p-2 bg-slate-800 text-white rounded-full hover:bg-red-500 transition-colors"
                                        title="Sil"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h3 className="font-medium text-slate-200 truncate" title={file.name}>{file.name}</h3>
                                </div>
                                <div className="flex text-xs text-slate-500 justify-between items-center">
                                    <span>{file.author}</span>
                                    <span>{new Date(file.createdAt).toLocaleDateString("tr-TR")}</span>
                                </div>
                                {file.size && (
                                    <div className="mt-2 text-xs text-slate-600">
                                        {formatBytes(file.size)}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}


