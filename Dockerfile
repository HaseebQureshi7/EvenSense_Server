FROM node:20-bullseye-slim

COPY src /server/
COPY package.json /server/
COPY tsconfig.json /server/
COPY .env /server/

WORKDIR /server

RUN npm install
RUN npm run build

CMD ["npm", "run", "prod"]