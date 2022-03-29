FROM node:16.13.0 as build
WORKDIR /app
COPY ./app .
RUN npm install
RUN npm run build

FROM nginx:1.21.6
RUN rm /etc/nginx/conf.d/default.conf
ADD ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html