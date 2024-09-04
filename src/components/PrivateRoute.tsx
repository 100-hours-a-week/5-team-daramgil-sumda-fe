// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    // 로그인되지 않았으면 로그인 페이지로 리다이렉트
    return <Navigate to="/login" />;
  }

  // 로그인 상태라면 자식 컴포넌트를 렌더링
  return children;
};

export default PrivateRoute;
