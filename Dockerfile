FROM --platform=linux/amd64 node:16.16-slim as base

ARG npm_token
ARG user node

RUN apt-get update && apt-get install -y openssl libssl-dev libc6 && \
    yarn global add turbo@1.3.1 --prefix /usr/local

RUN id $user || useradd --uid=1000 $user -m --home-dir=/app

RUN mkdir -p /app/apps/next-app \
          /app/node_modules \
          /app/apps/next-app/node_modules \
          /app/apps/server/node_modules \
          /app/apps/server && \
    chown -R $user:$user /app

USER $user
WORKDIR /app

COPY --chown=$user:$user . /app

RUN chmod +x /app/bin/setup.sh

CMD ["yarn", "turbo", "run", "dev", "--filter=./apps/*", "--parallel"]
