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
  loginAttempted: boolean; // 로그인 시도 여부 상태 추가
  squirrelData: SquirrelData | null;
  setSquirrelData: (data: SquirrelData) => void;
  login: (token: string) => void;
  attemptLogin: () => void; // 로그인 시도 상태 업데이트 함수 추가
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      jwtToken: null,
      loginAttempted: false, // 기본값 false
      squirrelData: null,
      setSquirrelData: (data: SquirrelData) => set({ squirrelData: data }),

      login: (token: string) => {
        set({
          jwtToken: token,
          isLoggedIn: true,
        });
        localStorage.setItem("jwtToken", token);
      },

      attemptLogin: () => {
        set({ loginAttempted: true }); // 로그인 시도 상태를 true로 설정
      },

      logout: () => {
        set({
          jwtToken: null,
          isLoggedIn: false,
          loginAttempted: false, // 로그아웃 시 시도 상태도 초기화
          squirrelData: null,
        });
        localStorage.removeItem("jwtToken");
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
