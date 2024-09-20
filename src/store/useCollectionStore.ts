import { create } from "zustand";
import useAuthStore from "./useAuthStore"; // AuthStore를 불러와 상태를 공유

// 다람쥐 데이터 타입 정의
interface Squirrel {
  sqrType: string; // 다람쥐 종류
  startDate: string; // 분양 날짜
  endDate: string; // 독립 날짜
}

// 상태와 액션 타입 정의
interface CollectionStore {
  squirrels: Squirrel[];
  error: string | null;
  fetchCollection: () => Promise<void>;
}

// Zustand 상태 관리
const useCollectionStore = create<CollectionStore>((set) => ({
  squirrels: [],
  error: null,

  // API를 호출하여 다람쥐 컬렉션 데이터를 가져오는 함수
  fetchCollection: async () => {
    const { jwtToken, isLoggedIn, reissueToken } = useAuthStore.getState(); // Auth 상태 가져오기

    // 로그인 여부 확인
    if (!isLoggedIn) {
      set({
        squirrels: [],
        error: "로그인되지 않았습니다.",
      });
      return; // 로그인되지 않았으면 종료
    }

    try {
      let response = await fetch(
        `${process.env.REACT_APP_API_URL}/squirrel/collection`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Zustand에서 가져온 JWT 토큰 사용
            "Content-Type": "application/json",
          },
          credentials: "include", // 쿠키를 포함하여 요청
        }
      );

      // 토큰 만료 시 재발급 요청
      if (response.status === 401) {
        await reissueToken(); // 토큰 재발급
        const { jwtToken: newToken } = useAuthStore.getState(); // 새로운 토큰으로 다시 요청
        response = await fetch(
          `${process.env.REACT_APP_API_URL}/squirrel/collection`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${newToken}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
      }

      // 응답 처리
      if (!response.ok) {
        if (response.status === 404) {
          const data = await response.json();
          set({
            squirrels: [],
            error: data.message || "독립 시킨 다람쥐가 없습니다.", // "독립 시킨 다람쥐가 없습니다." 처리
          });
        } else {
          throw new Error("다람쥐 컬렉션을 불러오는 중 오류가 발생했습니다.");
        }
      } else {
        const data = await response.json();
        set({
          squirrels: data.data || [], // 가져온 다람쥐 데이터 설정
          error: null,
        });
      }
    } catch (error: any) {
      // 기타 오류 처리
      set({
        squirrels: [],
        error:
          error.message ||
          "다람쥐 컬렉션을 불러오는 중 알 수 없는 오류가 발생했습니다.",
      });
    }
  },
}));

export default useCollectionStore;
