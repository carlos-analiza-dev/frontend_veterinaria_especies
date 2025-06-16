import { authCheckStatus, authLogin } from "@/core/auth/accions/auth-accion";
import { User } from "@/core/auth/interfaces/user";
import { SecureStorageAdapter } from "@/helpers/adapters/secure-storage.adaoter";

import { create } from "zustand";

export type AuthStatus = "authenticated" | "unauthenticated" | "checking";

interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;

  login: (email: string, password: string) => Promise<AuthResponse | null>;
  checkStatus: () => Promise<AuthResponse | null>;
  logout: () => Promise<void>;
  changeStatus: (token?: string, user?: User) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: "checking",
  token: undefined,
  user: undefined,

  changeStatus: async (token?: string, user?: User) => {
    if (!token || !user) {
      set({ status: "unauthenticated", token: undefined, user: undefined });
      await SecureStorageAdapter.deleteItem("token");
      return false;
    }

    set({
      status: "authenticated",
      token,
      user,
    });

    await SecureStorageAdapter.setItems("token", token);
    return true;
  },

  login: async (email: string, password: string) => {
    try {
      const resp = await authLogin(email, password);

      if (!resp) {
        return null;
      }

      if (!resp.token || !resp.user) {
        return null;
      }

      const success = await get().changeStatus(resp.token, resp.user);

      return success ? resp : null;
    } catch (error) {
      return null;
    }
  },

  checkStatus: async () => {
    try {
      const resp = await authCheckStatus();
      if (!resp) {
        await get().changeStatus();
        return null;
      }

      await get().changeStatus(resp.token, resp.user);
      return resp;
    } catch (error) {
      return null;
    }
  },

  logout: async () => {
    await SecureStorageAdapter.deleteItem("token");
    set({ status: "unauthenticated", token: undefined, user: undefined });
  },
}));
