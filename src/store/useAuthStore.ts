// src/stores/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios"; // Axios를 이용한 API 요청

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
  loginAttempted: boolean;
  squirrelData: SquirrelData | null;
  setSquirrelData: (data: SquirrelData) => void;
  login: (token: string) => void;
  attemptLogin: () => void;
  logout: () => void;
  reissueToken: () => Promise<void>; // 액세스 토큰 재발급 함수 추가
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      jwtToken: null,
      loginAttempted: false,
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
        set({ loginAttempted: true });
      },

      logout: () => {
        set({
          jwtToken: null,
          isLoggedIn: false,
          loginAttempted: false,
          squirrelData: null,
        });
        localStorage.removeItem("jwtToken");
      },

      // JWT 토큰 재발급 함수
      reissueToken: async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/auth/reissue`,
            {
              withCredentials: true, // refresh_token을 쿠키에서 자동으로 전송
            }
          );

          const { data } = response.data;
          console.log("새로운 액세스 토큰:", data.access_token);

          if (response.status === 200) {
            get().login(data.access_token); // 새로 발급받은 액세스 토큰을 상태에 저장
          } else {
            console.error("액세스 토큰 재발급 실패:", data);
            get().logout(); // 재발급 실패 시 로그아웃 처리
          }
        } catch (error) {
          console.error("액세스 토큰 재발급 오류:", error);
          get().logout(); // 오류 발생 시 로그아웃 처리
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
