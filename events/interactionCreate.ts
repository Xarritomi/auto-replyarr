import { Client, MessageEmbed } from "discord.js";
import { ICommand } from "../SetupHandler";

export const run = async (client: Client, cache: any, interaction: any) => {
  if (!interaction.isCommand()) return;
  const { commandName, options } = interaction;

  if (cache.slashCommands.has(commandName)) {
    const command: ICommand = cache.slashCommands.get(commandName);
    if (command.permissions && command.permissions.length > 0) {
      const authorPerms = interaction.channel.permissionsFor(interaction.member);
      if (!authorPerms || !command.permissions.every((perm) => authorPerms.has(perm))) {
        const embed: MessageEmbed = new MessageEmbed({
          title: "Permission Error",
          description: `You do not have permission to run command ${command.options.name}.`,
        });

        interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      } else {
        command.execute(client, cache, interaction, options);
      }
    } else {
      command.execute(client, cache, interaction, options);
    }
  }
};
