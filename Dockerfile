FROM mcr.microsoft.com/playwright:v1.33.0-jammy AS playwright

RUN npm i -g pnpm

WORKDIR /tmp/app
