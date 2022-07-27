FROM node:16.13.0 as strapi
WORKDIR /app/node
COPY . .
RUN pwd && ls
RUN echo "====== BUILD APPS ======"
RUN yarn
RUN yarn build
CMD [ "yarn", "start" ]