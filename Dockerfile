FROM node:slim

ENV USER=hikari

# make hikari user
RUN useradd --create-home --home /home/${USER} -ms /bin/bash ${USER}

# install pnpm
RUN npm install -g pnpm

# install ffmpeg, python
RUN apt-get update && \
	apt-get install -y \
	git \
	ffmpeg \
	python3 \
	build-essential \
	make && \
	apt-get purge -y --auto-remove && \
	rm -rf /var/lib/apt/lists/*

# set python aliases for distube(youtube-dl)
RUN ln -s /usr/bin/python3 /usr/bin/python

# setup workdir
USER ${USER}
WORKDIR /home/hikari
COPY --chown=${USER}:${USER} . .

# set SHELL env for dokdo
ENV SHELL="/bin/bash"

# install dependencies
RUN pnpm install

VOLUME [ "/home/hikari" ]

ENTRYPOINT [ "pnpm", "start" ]
