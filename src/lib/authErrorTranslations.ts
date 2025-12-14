/**
 * Convex Auth hata çevirisi
 * 
 * ConvexError ile gelen hata mesajlarını çıkarır.
 * CustomPassword provider zaten Türkçe mesaj gönderiyor,
 * bu fonksiyon sadece mesajı çıkarıp fallback sağlıyor.
 */

/**
 * Convex Auth hata mesajını çıkarır
 * @param error - Hata objesi
 * @returns Kullanıcı dostu hata mesajı (Türkçe)
 */
export function translateAuthError(error: unknown): string {
    // ConvexError.data yapısı
    if (typeof error === "object" && error !== null && "data" in error) {
        const data = (error as { data: unknown }).data;

        // data.message varsa direkt döndür (CustomPassword Türkçe mesaj gönderiyor)
        if (typeof data === "object" && data !== null && "message" in data) {
            return (data as { message: string }).message;
        }

        // data string ise direkt döndür
        if (typeof data === "string") {
            return data;
        }
    }

    // Error objesi ise
    if (error instanceof Error) {
        // Server Error fallback
        if (error.message.includes("Server Error")) {
            return "İşlem başarısız. Lütfen tekrar deneyin.";
        }
        return error.message || "Bir hata oluştu.";
    }

    // String ise
    if (typeof error === "string") {
        return error;
    }

    return "Bilinmeyen bir hata oluştu.";
}
