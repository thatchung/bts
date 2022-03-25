FROM node:16.13.0 as strapi
WORKDIR /app/node
COPY ./strapi .
RUN pwd && ls
RUN echo "====== BUILD APPS ======"
RUN yarn
RUN yarn build
CMD [ "yarn", "start" ]

FROM node:16.13.0 as build
WORKDIR /app
COPY ./vant .
RUN npm install
RUN npm run build

FROM nginx:1.21.6 as vant
RUN rm /etc/nginx/conf.d/default.conf
ADD ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html