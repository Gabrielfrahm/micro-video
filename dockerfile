FROM node:18.14-slim

RUN npm install -g @nestjs/cli@9.2.0
USER node

WORKDIR /home/node/app

CMD ["sh", "-c", "npm install && tail -f /dev/null"]
