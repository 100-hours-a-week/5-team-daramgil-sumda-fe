// src/stores/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SquirrelData {
  squirrelId: number;
  type: string;
  level: number;
  feed: number;
  userAcorns: number;
}

interface AuthState {
  isLoggedIn: boolean;
  jwtToken: string | null;
  squirrelData: SquirrelData | null;
  setSquirrelData: (data: SquirrelData) => void;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      jwtToken: null,
      squirrelData: null,
      setSquirrelData: (data) => set({ squirrelData: data }),
      login: (token) => set({ isLoggedIn: true, jwtToken: token }),
      logout: () =>
        set({ isLoggedIn: false, jwtToken: null, squirrelData: null }),
      checkAuth: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/auth/check`,
            {
              method: "GET",
              credentials: "include", // 쿠키를 포함하여 요청
            }
          );

          if (response.ok) {
            set({ isLoggedIn: true });
          } else {
            set({ isLoggedIn: false });
          }
        } catch (error) {
          console.error("Authentication check failed:", error);
          set({ isLoggedIn: false });
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;

// 모듈로 인식되도록 빈 export 추가
export {};
