# 1단계: React 애플리케이션 빌드
FROM node:14 AS build

WORKDIR /app

COPY package*.json ./

# GitHub Actions에서 전달된 SENTRY_AUTH_TOKEN을 환경 변수로 설정
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

# npm 설치 및 확인
RUN npm install && ls -la node_modules/react-scripts

COPY . .

# React 애플리케이션 빌드
RUN npm run build

# 2단계: Nginx 설정을 통해 정적 파일 서빙
FROM nginx:alpine

# 빌드 단계에서 생성된 파일들을 Nginx의 HTML 디렉토리로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 80번 포트를 노출
EXPOSE 80

# Nginx를 실행
CMD ["nginx", "-g", "daemon off;"]
