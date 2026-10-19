# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS builder

SHELL ["/bin/sh", "-e", "-c"]

WORKDIR /app

ENV CI=true \
    PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH"

ARG PNPM_VERSION=11.4.0
ARG PACKAGE_REGISTRY=https://registry.npmjs.org
ENV NPM_CONFIG_REGISTRY=${PACKAGE_REGISTRY}

RUN npm install --global --force "pnpm@${PNPM_VERSION}"

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=perpix-admin-pnpm-store,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm config set registry "${PACKAGE_REGISTRY}" && \
    pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV=production \
    VITE_APP_FONT_BASE_URL=/fonts

ARG VITE_OBJECT_STORAGE_PUBLIC_ENDPOINT
ARG VITE_PERPIX_API_URL
ARG VITE_PERPIX_ADMIN_URL
ARG VITE_PERPIX_APP_URL
ARG VITE_APP_FONT_BASE_URL
ARG VITE_PERPIX_MAIN_URL

ENV VITE_OBJECT_STORAGE_PUBLIC_ENDPOINT=${VITE_OBJECT_STORAGE_PUBLIC_ENDPOINT} \
    VITE_PERPIX_API_URL=${VITE_PERPIX_API_URL} \
    VITE_PERPIX_ADMIN_URL=${VITE_PERPIX_ADMIN_URL} \
    VITE_PERPIX_APP_URL=${VITE_PERPIX_APP_URL} \
    VITE_APP_FONT_BASE_URL=${VITE_APP_FONT_BASE_URL} \
    VITE_PERPIX_MAIN_URL=${VITE_PERPIX_MAIN_URL}

RUN pnpm build

FROM caddy:2-alpine AS runner

# Port 8080 needs no privileged bind capability. Remove the file capability
# so Caddy can execute with Compose's cap_drop: ALL.
RUN setcap -r /usr/bin/caddy

ENV XDG_DATA_HOME=/tmp/data \
    XDG_CONFIG_HOME=/tmp/config

WORKDIR /srv

COPY --chown=nobody:nobody Caddyfile /etc/caddy/Caddyfile
COPY --from=builder --chown=nobody:nobody /app/dist /srv

USER nobody

EXPOSE 8080

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]

