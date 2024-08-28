# 1. 베이스 이미지 선택
FROM node:18

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 패키지 파일을 복사하고, 의존성 설치
COPY package*.json ./

RUN npm install --production

# 4. 애플리케이션 소스 코드 복사
COPY . .

# 5. 애플리케이션 포트 설정
EXPOSE 3000

# 6. 애플리케이션 시작 명령어
CMD ["npm", "start"]
