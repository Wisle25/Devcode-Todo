FROM node:gallium-stretch-slim


WORKDIR /app

COPY package.json /app/

RUN node --version
COPY . /app/

EXPOSE 3030

CMD [ "sh", "-c", "export NODE_ENV=production ; node_modules/.bin/sequelize db:migrate ; yarn start" ]