import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction, roleMention } from 'discord.js';

import Command from '../../classes/command';
import { searchAutoCompleteFromArray } from '../../helpers/function';
import config from '../../lib/config';
import { commands, interactionCommands } from '../../vars';

export default class Help extends Command {
    constructor() {
        super({
            name: 'Daftar command yang dapat digunakan pada Aisha.',
            command: 'help',
            usage: '[command]',
            registerSlashCommand: true,
            hasAutocomplete: true,
            slashCommandOptions: [
                {
                    name: 'command',
                    description: 'Nama Command',
                    type: ApplicationCommandOptionType.String,
                    autocomplete: true,
                },
            ],
        });
    }

    async interact(interaction: CommandInteraction): Promise<void> {
        try {
            const data = [];

            const commandName = interaction.options.get('command')?.value;
            const command: Command = commands.get(commandName) as Command || interactionCommands.get(commandName) as Command;

            data.push(`Informasi mengenai command \`${command.command}\`:\n`);

            if (command.name) data.push(`\`Deskripsi\` : ${command.name}`);
            if (command.registerSlashCommand) data.push(`\`Slash Command\` : ${command.registerSlashCommand ? 'Yes' : 'No'}`);
            if (command.usage) data.push(`\`Penggunaan\` : ${command.registerSlashCommand ? '/' : config.BOT_PREFIX}${commandName} ${command.usage}`);
            if (command.roles) data.push(`\`Role\` : ${command.roles.length ? command.roles.map((i: any) => roleMention(i)).join(', ') : '-'}`);

            data.push(`\`Cooldown\` : ${command.cooldown || 0} detik`);

            data.push('\nAnda dapat menggunakan `/help` untuk mendapatkan informasi dari semua command yang tersedia.');

            await interaction.reply({ content: data.join('\n'), ephemeral: true });
        } catch (err) {
            console.error(err);
        }
    }

    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        if (interaction.commandName !== this.command) return;

        let search = [];

        let allCommands = commands.concat(interactionCommands);
        allCommands = allCommands.sort((a: any, b: any) => {
            if (a.command < b.command) return -1;
            if (a.command > b.command) return 1;

            return 0;
        });

        const commandMap = allCommands.map((command: any) => {
            return { name: command.command, value: command.command };
        });

        const keyword = interaction.options.get('command')?.value as string ?? '';
        if (keyword.length) {
            search = await searchAutoCompleteFromArray(commandMap, ['name'], keyword);
            search = search.map((e: any) => ({ name: e.item.name, value: e.item.value }));
        } else {
            search = commandMap;
        }

        await interaction.respond(search.slice(0, 25));
    }
}