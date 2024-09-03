// src/stores/useAuthStore.ts
import create from "zustand";
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
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      jwtToken: null,
      squirrelData: null,
      setSquirrelData: (data) => set({ squirrelData: data }),
      login: (token) => set({ isLoggedIn: true, jwtToken: token }),
      logout: () =>
        set({ isLoggedIn: false, jwtToken: null, squirrelData: null }),
    }),
    {
      name: "auth-storage", // 로컬 스토리지에 저장될 키 이름
    }
  )
);

export default useAuthStore;

// 모듈로 인식되도록 빈 export 추가
export {};
