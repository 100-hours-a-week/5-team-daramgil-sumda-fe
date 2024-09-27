import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

interface MissionRouteProps {
  children: React.ReactElement;
}

const MissonRoute: React.FC<MissionRouteProps> = ({ children }) => {
  const { isLoggedIn, jwtToken, reissueToken, login } = useAuthStore();

  useEffect(() => {
    const checkAndReissueToken = async () => {
      // JWT 토큰이 있지만 로그인 상태가 아니면 로그인 상태로 설정
      if (jwtToken && !isLoggedIn) {
        login(jwtToken);
      }

      // JWT 토큰이 있더라도 만료된 토큰일 수 있으므로 재발급을 시도
      if (jwtToken) {
        try {
          // 토큰 재발급 시도
          await reissueToken();
        } catch (error) {
          console.error("토큰 재발급 오류:", error);
          // 토큰 재발급 실패 시 로그아웃 처리
          useAuthStore.getState().logout();
        }
      }
    };

    checkAndReissueToken();
  }, [isLoggedIn, jwtToken, login, reissueToken]);

  // 로그인 상태가 아니면 /non_daily로 리다이렉트
  if (!jwtToken) {
    return <Navigate to="/non_daily" />;
  }

  // JWT 토큰이 있고 로그인 상태이면 자식 컴포넌트 렌더링 (즉, 일일미션 페이지)
  return children;
};

export default MissonRoute;
