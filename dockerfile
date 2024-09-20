# Node.js 20.17.0 이미지 사용
FROM node:20.17.0-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 파일을 복사
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm ci

# 소스 파일 복사
COPY . .

# 환경 변수 설정 (Sentry 관련)
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

# 빌드 수행
RUN npm run build

# Sentry sourcemap 업로드 (SENTRY_AUTH_TOKEN이 설정된 경우에만 수행)
RUN if [ "$SENTRY_AUTH_TOKEN" != "" ]; then npm run sentry:sourcemaps; fi

# 빌드된 파일은 /app/build 폴더에 저장됨
