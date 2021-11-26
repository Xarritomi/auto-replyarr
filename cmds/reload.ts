import { ICommand } from "../SetupHandler";
import fs from "fs";
import path, { join } from "path";
import YAML from "yaml";
import { Client, Permissions } from "discord.js";

export default {
  options: {
    name: "reload",
    description: "Reload the config.yml file",
  },
  execute(client: Client, bot: any, interaction: any, options: any) {
    const configFile = fs.readFileSync(join(__dirname, process.env.DOCKER ? join(__dirname, "../config.yml") : "/config/config.yml"), "utf8");
    bot.config = YAML.parse(configFile);
    interaction.reply({
      content: "Successfully reloaded",
      ephemeral: true,
    });
  },
  permissions: [Permissions.FLAGS.ADMINISTRATOR],
} as ICommand;
