import { convexAuth } from "@convex-dev/auth/server";
import { CustomPassword } from "./CustomPassword";

// CustomPassword provider'ı kullan - ConvexError ile hata kodları client'a gönderilir
const PasswordProvider = CustomPassword({
    profile(params) {
        return {
            email: params.email as string,
            name: params.name as string || "",
        };
    },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [PasswordProvider],
});
