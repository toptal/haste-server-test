ARG NODE_IMAGE=node:16-slim

#
# Base image
#
FROM ${NODE_IMAGE} AS base

ENV YARN_CACHE_FOLDER=.yarn-cache

RUN mkdir /app

RUN yarn global add turbo@latest --prefix /usr/local

ARG USER_ID=429
RUN id containeruser || useradd --uid=${USER_ID} containeruser -m --home-dir=/app

RUN chown -R containeruser:containeruser /app

USER containeruser:containeruser

WORKDIR /app

#
# Prune Stage
#
FROM base AS pruner

COPY . .
RUN turbo prune --scope=hastebin-server --docker

#
# Build Stage
#
FROM base AS build

USER containeruser:containeruser

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock

RUN yarn install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

RUN turbo run build --filter=hastebin-server

#
# Release image
#

FROM base AS release

USER containeruser:containeruser

ENV NODE_ENV production

COPY --chown=containeruser:containeruser --from=build /app /app

WORKDIR /app/apps/server

CMD ["yarn", "start"]
