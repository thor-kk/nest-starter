# 使用官方 Node.js 镜像作为基础镜像（建议使用 LTS 版本）
FROM node:20-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml（如果使用的是 pnpm v7+，锁文件名为 pnpm-lock.yaml）
COPY package.json pnpm-lock.yaml ./

# 安装依赖（只安装生产依赖 + 构建所需依赖）
RUN pnpm install --frozen-lockfile --prod=false

# 复制源代码
COPY . .

# 构建应用
RUN pnpm run build

# 生产阶段
FROM node:20-alpine AS production

# 安装 pnpm（可选，如果仅运行应用可不装，但推荐保留便于调试）
RUN npm install -g pnpm

WORKDIR /app

# 从 builder 阶段复制 node_modules 和构建产物
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# 只复制生产环境所需的 package.json（可选，用于启动脚本）
COPY package.json ./

# 应用默认端口（根据你的 Nest 应用配置调整）
EXPOSE 3000

# 启动命令
CMD ["pnpm", "start:prod"]