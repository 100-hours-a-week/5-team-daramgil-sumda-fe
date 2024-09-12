import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
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
          // 재발급 시도
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

  if (!jwtToken) {
    // JWT 토큰이 없으면 로그인 페이지로 리다이렉트
    return <Navigate to="/login" />;
  }

  // JWT 토큰이 존재하고 로그인 상태이면 자식 컴포넌트 렌더링
  return children;
};

export default PrivateRoute;
