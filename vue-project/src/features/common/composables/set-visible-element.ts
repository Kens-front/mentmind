import { useAuthStore } from "@/features/auth/store"
import type { RoleList } from "@/features/users/types";




export const useSetVisibleElement = () => {
    const authStore = useAuthStore();

    const role = authStore.userData.user?.role;

    const setVisibleElement = (roles: RoleList[]) => {
        if (!role) {
            return;
        }

        return roles.includes(role)
    }

    return {
        setVisibleElement
    }
}