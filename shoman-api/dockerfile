FROM node:12

RUN mkdir -p /src/

WORKDIR /src/

COPY package.json ./

COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD [ "npm", "start" ]
