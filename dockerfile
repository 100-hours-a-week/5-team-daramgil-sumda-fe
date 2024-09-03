# 1단계: React 애플리케이션 빌드
FROM node:14 AS build

WORKDIR /app

COPY package*.json ./

# npm 설치 및 확인
RUN npm install && ls -la node_modules/react-scripts

COPY . .

# React 애플리케이션 빌드
RUN npm run build
