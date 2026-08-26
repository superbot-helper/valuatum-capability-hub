FROM node:22-alpine AS build
WORKDIR /app/mcp
COPY mcp/package*.json ./
RUN npm ci
COPY mcp/tsconfig.json ./
COPY mcp/src ./src
RUN npm run build

FROM node:22-alpine
WORKDIR /app/mcp
ENV NODE_ENV=production PORT=8080 MOCK_DATA_PATH=/app/mock-data/companies.json
COPY mcp/package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/mcp/dist ./dist
COPY mock-data /app/mock-data
EXPOSE 8080
CMD ["node","dist/server.js"]

