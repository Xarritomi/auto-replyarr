import { Client, Message, MessageAttachment, MessageEmbed, MessageEmbedOptions } from "discord.js";
import { createWorker } from "tesseract.js";

const fetch = require("node-fetch");
const extractUrls = require("extract-urls");

interface IUrl {
  url: string;
  currUrl: string;
  refactored: string;
}

interface IPasteUrl {
  url: string;
  refactored: string;
}

interface Iterm {
  term: string;
  response: string | Array<string>;
  regex: boolean;
  embed: boolean;
}

interface LooseObject {
  [key: string]: any;
}

interface ICheckTermsOptions {
  found: boolean;
  url: string;
}

export const run = async (client: Client, bot: any, message: Message) => {
  const checkTerms = (message: Message, content: string, termOptions: ICheckTermsOptions) => {
    let foundTerm: Iterm | any = {};
    for (const term of bot.config.terms) {
      if (term.regex) {
        try {
          if (content.match(term.term)) {
            foundTerm = term;
            break;
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        if (content.toLowerCase().includes(term.term.toLowerCase())) {
          foundTerm = term;
          break;
        }
      }
    }

    if (isEmptyObject(foundTerm)) return;

    if (foundTerm) {
      const options: MessageEmbedOptions = {};
      let response: any = foundTerm.response;
      options.description = termOptions.found ? `I have found the following for: \`${termOptions.url}\`\n\n` : "";
      if (response instanceof Array) {
        options.description += response.map((msg: string) => msg.replace("{{user}}", `<@${message.author.id}>`)).join("\n");
      } else {
        options.description += response.replace("{{user}}", `<@${message.author.id}>`);
      }
      if (foundTerm.embed) {
        options.color = "RANDOM";
        const embed = new MessageEmbed(options);
        message.channel.send({ embeds: [embed] });
      } else {
        message.channel.send({ content: options.description });
      }
      bot.userRateLimit.set(message.author.id, true);
      setTimeout(() => {
        bot.userRateLimit.delete(message.author.id);
      }, bot.config.userRateLimit);
    }
  };

  if (message.author.bot) return;

  if (Object.keys(bot.config).includes("channels")) {
    if (bot.config.channels !== null && bot.config.channels.length > 0 && !bot.config.channels.includes(parseInt(message.channel.id))) return;
  }

  if (bot.userRateLimit.has(message.author.id)) return;
  let url: boolean = isValidURL(message.content);
  let filteredUrl: Array<IUrl> = [];

  if (url) {
    const extractedUrl = extractUrls(message.content)[0] || [];
    bot.config.paste.urls.forEach((URL: IPasteUrl) => {
      if (extractedUrl.includes(URL.url)) {
        filteredUrl.push({
          ...URL,
          currUrl: extractedUrl,
        });
      }
    });
    if (filteredUrl.length >= 1) message.react(bot.config.reactions.paste);
  }

  if (filteredUrl.length >= 1) {
    try {
      let code = filteredUrl[0].currUrl.split("/").slice(-1)[0];
      let url = filteredUrl[0].refactored.replace("{{code}}", code);
      let paste = await fetch(url);
      let text = await paste.text();
      return checkTerms(message, text, { found: true, url: filteredUrl[0].currUrl });
    } catch (e) {
      console.log(e);
    }
  }

  if (message.attachments.size > 0) {
    message.react(bot.config.reactions.image);
    const url: MessageAttachment = message.attachments.first()!;
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(url.url);
    await worker.terminate();
    return checkTerms(message, text, { found: true, url: url.url });
  }

  checkTerms(message, message.content, { found: false, url: "" });
};

const isValidURL = (string: string) => {
  let url = string.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/);
  return url !== null;
};

function isEmptyObject(obj: any) {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      return false;
    }
  }
  return true;
}
