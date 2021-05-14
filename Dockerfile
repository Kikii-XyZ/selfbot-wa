FROM kikii-XyZ/selfbot-wa

RUN git clone $GITHUB_REPO_URL /root/selfbot-wa
WORKDIR /root/selfbot-wa/
ENV TZ=Europe/Istanbul
RUN npm install 
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm install \
    && apk del build-dependencies
RUN npm install

CMD ["node", "m.js"]
