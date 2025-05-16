FROM node:18

WORKDIR /app

RUN npm install -g pnpm@10.11.0

# 의존성 설치 (선 캐싱)
COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

CMD ["node", "dist/main"]