FROM        node:21.6.1-alpine as builder

COPY        package.json /srv/ms_budisuryadi_betest/
WORKDIR     /srv/ms_budisuryadi_betest/

RUN         yarn install --production

COPY        .babelrc /srv/ms_budisuryadi_betest/
COPY        .eslintrc.json /srv/ms_budisuryadi_betest/
COPY        app.js /srv/ms_budisuryadi_betest/
COPY        adapters /srv/ms_budisuryadi_betest/adapters/
COPY        application /srv/ms_budisuryadi_betest/application/
COPY        config /srv/ms_budisuryadi_betest/config/
COPY        frameworks /srv/ms_budisuryadi_betest/frameworks/
COPY        src /srv/ms_budisuryadi_betest/src/

RUN         yarn build

FROM        node:21.6.1-alpine


ENV         HTTP_MODE http
ARG         NODE_PROCESSES=2
ENV         NODE_PROCESSES=$NODE_PROCESSES

# Install pm2
RUN         npm install -g pm2

# Copy over code
WORKDIR     /srv/api/
COPY        --from=builder /srv/ms_budisuryadi_betest/build /srv/api/build
COPY        --from=builder /srv/ms_budisuryadi_betest/package.json /srv/api/package.json

RUN         deluser --remove-home node \
            && addgroup -S node -g 9999 \
            && adduser -S -G node -u 9999 node

CMD         ["npm", "start"]

USER        node