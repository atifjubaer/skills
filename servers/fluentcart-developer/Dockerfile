# The build script resolves `skills/` as `../../skills` from the package root,
# so the image keeps the repo layout rather than flattening it.
FROM node:22-alpine AS build
WORKDIR /app/servers/fluentcart-developer
COPY servers/fluentcart-developer/package.json servers/fluentcart-developer/package-lock.json ./
RUN npm ci
COPY servers/fluentcart-developer/tsconfig.json ./
COPY servers/fluentcart-developer/src ./src
COPY servers/fluentcart-developer/scripts ./scripts
COPY skills/fluentcart-developer /app/skills/fluentcart-developer
RUN npm run build

FROM node:22-alpine
WORKDIR /app/servers/fluentcart-developer
ENV NODE_ENV=production
COPY servers/fluentcart-developer/package.json servers/fluentcart-developer/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/servers/fluentcart-developer/dist ./dist
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8080)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/http.js"]
