FROM node:20-alpine

RUN mkdir -p /app
WORKDIR /app

COPY ./client ./client/
COPY ./shared ./shared/

WORKDIR /app/client
RUN npm i 

ENV HOST=0.0.0.0
EXPOSE 5173

CMD ["npm","run", "--", "--host", "0.0.0.0"]