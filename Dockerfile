# Etapa 1: compila o site (tsc + vite build) em /app/dist
FROM node:24-alpine AS build
WORKDIR /app

# O Playwright é só para capturas locais; não precisa baixar navegadores na imagem.
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2: serve os arquivos estáticos com Nginx
FROM nginx:1.28-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -q --spider http://127.0.0.1/ || exit 1
