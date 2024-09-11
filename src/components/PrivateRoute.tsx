import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isLoggedIn, jwtToken } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn && jwtToken) {
      // 만약 JWT 토큰이 있지만 로그인 상태가 아니라면 로그인 상태로 설정
      useAuthStore.getState().login(jwtToken);
    }
  }, [isLoggedIn, jwtToken]);

  if (!jwtToken) {
    // JWT 토큰이 없으면 로그인 페이지로 리다이렉트
    return <Navigate to="/login" />;
  }

  // JWT 토큰이 존재하고 로그인 상태이면 자식 컴포넌트 렌더링
  return children;
};

export default PrivateRoute;
