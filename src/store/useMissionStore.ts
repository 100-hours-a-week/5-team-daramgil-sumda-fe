import { create } from "zustand";
import { persist } from "zustand/middleware";
import useAuthStore from "./useAuthStore"; // AuthStore를 불러와 상태를 공유

interface MissionState {
  completeDailyAttendance: () => Promise<void>;
  completeDailyAir: () => Promise<void>;
  completeDailyQuiz: () => Promise<void>;
  completeSquirrelChatMission: () => Promise<void>; // 다람쥐와 대화하기 미션 추가
}

const useMissionStore = create<MissionState>()(
  persist(
    (set, get) => ({
      completeDailyAttendance: async () => {
        const { jwtToken, isLoggedIn, squirrelData, setSquirrelData } =
          useAuthStore.getState(); // Auth 상태 사용
        console.log(jwtToken);

        // 회원이 아닌 경우 미션 로직을 실행하지 않음
        if (!isLoggedIn) {
          return; // 로그인되지 않은 경우, 그냥 함수 종료
        }

        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/mission/attendance`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${jwtToken}`, // JWT 토큰을 헤더에 포함
                "Content-Type": "application/json",
              },
              credentials: "include", // 쿠키를 포함하여 요청
            }
          );
          const data = await response.json();
          console.log(data);

          // 서버에서 반환된 데이터의 상태가 SUCCESS일 경우 미션 완료 처리
          if (response.ok && data.data.status === "SUCCESS") {
            setSquirrelData({
              ...squirrelData!,
              userAcorns: data.data.userAcorns,
            });
            alert("출석 미션을 완료했습니다! 도토리 1개가 지급됩니다.");
          } else if (data.data.status === "ERROR") {
            console.log("이미 완료된 미션입니다. (출석체크)");
          }
        } catch (error) {
          console.error("출석 미션 처리 실패:", error);
        }
      },

      completeDailyAir: async () => {
        const { jwtToken, isLoggedIn, squirrelData, setSquirrelData } =
          useAuthStore.getState();

        // 회원이 아닌 경우 미션 로직을 실행하지 않음
        if (!isLoggedIn) {
          return; // 로그인되지 않은 경우, 그냥 함수 종료
        }

        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/mission/air`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${jwtToken}`, // JWT 토큰을 헤더에 포함
                "Content-Type": "application/json",
              },
              credentials: "include", // 쿠키를 포함하여 요청
            }
          );
          const data = await response.json();

          // 서버에서 반환된 데이터의 상태가 SUCCESS일 경우 미션 완료 처리
          if (response.ok && data.data.status === "SUCCESS") {
            setSquirrelData({
              ...squirrelData!,
              userAcorns: data.data.userAcorns,
            });
            alert(
              "대기오염 조회 미션을 완료했습니다! 도토리 1개가 지급됩니다."
            );
          } else if (data.data.status === "ERROR") {
            console.log("이미 완료된 미션입니다. (대기정보조회)");
          }
        } catch (error) {
          console.error("대기오염 조회 미션 처리 실패:", error);
        }
      },

      completeDailyQuiz: async () => {
        const { jwtToken, isLoggedIn, squirrelData, setSquirrelData } =
          useAuthStore.getState();

        // 회원이 아닌 경우 미션 로직을 실행하지 않음
        if (!isLoggedIn) {
          return; // 로그인되지 않은 경우, 그냥 함수 종료
        }

        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/mission/quiz`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${jwtToken}`, // JWT 토큰을 헤더에 포함
                "Content-Type": "application/json",
              },
              credentials: "include", // 쿠키를 포함하여 요청
            }
          );
          const data = await response.json();

          // 서버에서 반환된 데이터의 상태가 SUCCESS일 경우 미션 완료 처리
          if (response.ok && data.data.status === "SUCCESS") {
            setSquirrelData({
              ...squirrelData!,
              userAcorns: data.data.userAcorns,
            });
            alert("OX퀴즈 미션을 완료했습니다! 도토리 1개가 지급됩니다.");
          } else if (data.data.status === "ERROR") {
            console.log("이미 완료된 미션입니다. (OX퀴즈)");
          }
        } catch (error) {
          console.error("OX퀴즈 미션 처리 실패:", error);
        }
      },

      completeSquirrelChatMission: async () => {
        const { jwtToken, isLoggedIn, squirrelData, setSquirrelData } =
          useAuthStore.getState();

        // 회원이 아닌 경우 미션 로직을 실행하지 않음
        if (!isLoggedIn) {
          return; // 로그인되지 않은 경우, 그냥 함수 종료
        }

        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/mission/talk`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${jwtToken}`, // JWT 토큰을 헤더에 포함
                "Content-Type": "application/json",
              },
              credentials: "include", // 쿠키를 포함하여 요청
            }
          );
          const data = await response.json();

          // 서버에서 반환된 데이터의 상태가 SUCCESS일 경우 미션 완료 처리
          if (response.ok && data.data.status === "SUCCESS") {
            setSquirrelData({
              ...squirrelData!,
              userAcorns: data.data.userAcorns,
            });
            alert(
              "다람쥐와 대화하기 미션을 완료했습니다! 도토리 1개가 지급됩니다."
            );
          } else if (data.data.status === "ERROR") {
            console.log("이미 완료된 미션입니다. (다람쥐와 대화)");
          }
        } catch (error) {
          console.error("다람쥐와 대화 미션 처리 실패:", error);
        }
      },
    }),
    {
      name: "mission-storage",
    }
  )
);

export default useMissionStore;
