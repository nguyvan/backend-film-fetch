FROM node:16

WORKDIR /usr/src/app-backend

ARG USERNAME=fatcouple
ARG UID=1000
ARG GID=1000

RUN groupadd -g ${GID} -o ${USERNAME}
RUN useradd -m -u ${UID} -g ${GID} -o -s /bin/bash ${USERNAME}
RUN chown ${UID}:${GID} .
RUN chown ${USERNAME} .

USER ${USERNAME}

COPY package*.json ./

RUN npm ci --env=dev

COPY --chown=${USERNAME} . .

RUN npm run build

EXPOSE 5000

CMD npm run start