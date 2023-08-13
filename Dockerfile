FROM node:18-buster

WORKDIR /app

COPY . .

RUN npm i

RUN npm i pm2 -g

RUN npm run build 

RUN npm run migration:run

EXPOSE 8080

COPY .env /app/dist

ENTRYPOINT ["pm2-runtime", "start", "/app/dist/main.js", "-i", "max"]