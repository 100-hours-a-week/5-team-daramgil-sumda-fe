# 1단계: React 애플리케이션 빌드
FROM node:14 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# 빌드 환경 설정을 위해 CI 변수 및 .env 파일 생성
RUN echo "REACT_APP_API_URL=$REACT_APP_API_URL" > .env
RUN echo "SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN" >> .env
RUN echo "SENTRY_ORG=$SENTRY_ORG" >> .env
RUN echo "SENTRY_PROJECT=$SENTRY_PROJECT" >> .env

# React 애플리케이션 빌드
RUN npm run build

# 2단계: Nginx 설정을 통해 정적 파일 서빙
FROM nginx:alpine

# 빌드 단계에서 생성된 파일들을 Nginx의 HTML 디렉토리로 복사
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 설정 파일을 컨테이너 내부로 복사 (필요시 사용자 정의 설정을 포함)
COPY nginx.conf /etc/nginx/nginx.conf

# 80번 포트를 노출
EXPOSE 80

# Nginx를 실행
CMD ["nginx", "-g", "daemon off;"]
