import Discord, { Intents, Collection } from "discord.js";
import path from "path";
import SetupHandler, { IOptions } from "./SetupHandler";
import fs from "fs";
import YAML from "yaml";

(async () => {
  // Global obj to store important information
  const bot: any = {};

  try {
    // Load config.yml into memory
    const configFile = fs.readFileSync(`${process.env.DOCKER ? "/config/config.yml" : `${path.join(__dirname, "./config.yml")}`}`, "utf8");
    bot.config = await YAML.parse(configFile);

    let acceptedTermKeys = ["term", "response", "embed", "regex"];

    bot.config.terms.forEach((term: any) => {
      Object.keys(term).forEach((key) => {
        if (!acceptedTermKeys.includes(key)) {
          console.log("There was an error whilst loading your terms");
          return process.exit(1);
        }
      });
    });
  } catch (err) {
    console.log(err);
  }

  // Check if Discord Token has been provided
  if (!bot.config.token || bot.config.token === "") {
    console.log("Please Provide a valid Discord Token");
    process.exit();
  }

  if (!bot.config.guilds || bot.config.guilds === 0) {
    console.log("Please Provide at least one guild id");
    process.exit();
  }

  // Instantiate a Discord Client with Guild and Messages Intent
  const client = new Discord.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  });

  // Load Global Maps
  bot.slashCommands = new Collection();

  client.on("ready", () => {
    const Options: IOptions = {
      eventsDir: `${path.join(__dirname, "events")}`,
      commandsDir: `${path.join(__dirname, "cmds")}`,
      guilds: [...bot.config.guilds],
    };

    // Load Commands & Events
    new SetupHandler(client, Options, bot);

    console.log(`Ready`);
  });

  client.login(bot.config.token);
})();
