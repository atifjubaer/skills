# The build script resolves `skills/` as `../../skills` from the package root,
# so the image keeps the repo layout rather than flattening it.
FROM node:22-alpine AS build
WORKDIR /app/servers/lemonsqueezy-developer
COPY servers/lemonsqueezy-developer/package.json servers/lemonsqueezy-developer/package-lock.json ./
RUN npm ci
COPY servers/lemonsqueezy-developer/tsconfig.json ./
COPY servers/lemonsqueezy-developer/src ./src
COPY servers/lemonsqueezy-developer/scripts ./scripts
COPY skills/lemonsqueezy-developer /app/skills/lemonsqueezy-developer
RUN npm run build

FROM node:22-alpine
WORKDIR /app/servers/lemonsqueezy-developer
ENV NODE_ENV=production
COPY servers/lemonsqueezy-developer/package.json servers/lemonsqueezy-developer/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/servers/lemonsqueezy-developer/dist ./dist
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8080)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/http.js"]
