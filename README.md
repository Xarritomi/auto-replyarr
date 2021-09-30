<h1 align="center">Auto Replyarr 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
</p>

A simple discord bot written in discord.js which allows you to easily define terms that the bot will look for and respond with a predefined response

> Supports
>
> - Text Validation
> - Raw Text Validation. I.E from hastebin.com
> - Image Validation. Will attempt to extract text from an image

## Install

clone this repo and `cd` into the directory,

Then copy config.sample.yml to config.yml. Edit the config file to match what you want

```sh
cp config.sample.yml config.yml
```

> ## Discord Token
>
> You will need to generate a Discord token in the Discord Developer Portal
> _[Generate Token Guide](https://www.writebots.com/discord-bot-token/)_

```yml
token: # Your Discord Token
prefix: "!" # Discord Prefix, currently not being used
guilds:# An array of guild id's that this bot will register its commands to.
  # - 387534987237461378

terms: # An array of terms the bot will use when matching user content
  # If you have terms that are similar - place the one you want prioritised at the higher in the array
  - term: This is a test term
    response: Test response
    embed: true # Specify if you would like the response to be in a embed
    # Regex can also be used, but make sure to add the regex flag
  - term: (\A|\b|\s)(tha+nks?( you)?|\bt(a+|y|hn?x+)((s|v)m)?\b|che+rs|da+nke+)(\z|\b|\s)
    response: # For multi line messages
      - Hello
      - This will print
      - On multiple line
      - "**You can also use Discord formatting**" # Wrap text in quotes
    regex: true # <-- Here
paste: # A list of pastes, such as pastebin or hastebin
  urls:
    - url: https://hastebin.com/ # Code will only be extracted if at the end of the URL
      refactored: https://hastebin.com/raw/{{code}} # Raw text is required
    - url: https://pastebin.com/
      refactored: https://pastebin.com/raw/{{code}}
reactions: # The reaction on images and pastes
  image: 👀
  paste: 👀
```

```sh
npm i -g ts-node
npm install
npm run start
```

# Docker

Auto Replyarr does have an official docker image on [Dockerhub](https://hub.docker.com/repository/docker/xaritomi/auto-replyarr) however you can build the image yourself using the **Dockerfile** in the root directory of this repo.

```bash
docker run -v /opt/auto-replyarr:/config:rw --restart always xaritomi/auto-replyarr:latest
```

# Docker Compose

a docker-compose.yml file has also been provided in the root of this repo

```yml
version: "3.3"
services:
  auto-replyarr:
    volumes:
      - "/opt/auto-replyarr:/config:rw"
    restart: unless-stopped
    image: "xaritomi/auto-replyarr:latest"
```

## Author

👤 **Xaritomi**

- Website: https://bflick.dev
- Github: [@Xarritomi](https://github.com/Xarritomi)

## Show your support

Give a ⭐️ if this project helped you!

---
