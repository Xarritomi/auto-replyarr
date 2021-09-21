import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";

export interface IOptions {
  eventsDir: string;
  commandsDir: string;
  guilds: Array<string>;
}

interface ICommandOptions {
  name: string;
  description: string;
  type: any;
  options: Array<{
    type: any;
    name: string;
    description: string;
    required: boolean;
    choices: {
      name: string;
      value: string | number;
    };
  }>;
}

export interface ICommand {
  options: ICommandOptions;
  permissions: Array<string | bigint>;
  execute(client: Client, bot: any, interaction: any, options: any): void;
}

export default class SetupHandler {
  private _client: Client;
  constructor(client: Client, options: IOptions, cache: any) {
    this._client = client;
    this.setUpEvents(client, options, cache);
    this.setUpCommands(client, options, cache);
  }

  setUpEvents(client: Client, options: IOptions, cache: any) {
    readdirSync(options.eventsDir)
      .filter(function (file) {
        return file.substr(-3) === ".ts";
      })
      .forEach((file) => {
        try {
          const { run } = require(join(options.eventsDir, file));
          client.on(file.split(".")[0], (...args) => {
            run(client, cache, ...args);
          });
          console.log(`Event > ${file} has been registered`);
        } catch (e) {
          console.log(`Event > ${file} failed`);
          // console.log(e);
        }
      });
  }

  setUpCommands(client: Client, options: IOptions, cache: any) {
    if (!this._client) throw new Error("Please provide a valid Discord Client");
    const commands = options.guilds.length > 0 ? client.guilds.cache.get(options.guilds[0])?.commands : client.application?.commands;
    readdirSync(options.commandsDir)
      .filter(function (file) {
        return file.substr(-3) === ".ts";
      })
      .forEach((file) => {
        try {
          const command = require(`${join(options.commandsDir, file)}`);
          commands?.create({ ...command.default.options.options });
          cache.slashCommands.set(command.default.options.name, command.default);
          console.log(`Command > ${file} has been registered`);
        } catch (e) {
          console.log(e);
        }
      });
  }
}
