# [Choice] Alpine version: 3.12, 3.11, 3.10
# ARG VARIANT=3.12
# FROM mcr.microsoft.com/vscode/devcontainers/base:alpine-${VARIANT}

FROM node:lts-alpine

LABEL maintainer="Chris Gross <cghome [at] cFlat-inc.org>"

# Set timezone to UTC by default
RUN ln -sf /usr/share/zoneinfo/Etc/UTC /etc/localtime

RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
   && apk update \
   && apk add --no-cache \
      zsh \
      bash \
      wget \ 
      curl \
      git \
      hub    

# Installs a set of common command line utilities
COPY library-scripts/*.sh /tmp/library-scripts/
RUN ash /tmp/library-scripts/common-alpine.sh \
   && rm -rf /tmp/library-scripts

# Install node-packages
RUN npm install -g \
      npm-check-updates \
      homey \
      eslint \
      prettier 

# WORKDIR /app

# Node.js debugger port
EXPOSE 9229     
VOLUME [ "/workspaces" ]
