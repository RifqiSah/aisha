import {
    Message,
    CommandInteraction,
    PermissionResolvable,
    ApplicationCommandData,
    ApplicationCommandOptionData,
    AutocompleteInteraction,
} from 'discord.js';
import { replyAndDelete } from '../helpers/bot';
import globalConfig from '../lib/config';
import { logger } from '../lib/logger';

const commandCooldown = new Set();

export default abstract class Command {
    static commands: ApplicationCommandData[] = [];
    static serverOnlyCommands: ApplicationCommandData[] = [];

    name: string;
    command: string;
    permission?: PermissionResolvable;
    ownerOnly?: boolean;
    registerSlashCommand?: boolean;
    onlyInformate?: boolean;
    hasAutocomplete?: boolean;
    cooldown?: number;

    constructor(config: {
        name: string;
        command: string;
        permission?: PermissionResolvable;
        ownerOnly?: boolean;
        registerSlashCommand?: boolean;
        onlyInformate?: boolean;
        hasAutocomplete?: boolean;
        slashCommandOptions?: ApplicationCommandOptionData[];
        cooldown?: number;
    }) {
        this.name = config.name;
        this.command = config.command;
        this.permission = config.permission;
        this.ownerOnly = config.ownerOnly;
        this.registerSlashCommand = config.registerSlashCommand;
        this.onlyInformate = config.onlyInformate;
        this.hasAutocomplete = config.hasAutocomplete;
        this.cooldown = config.cooldown;

        if (config.registerSlashCommand === true) {
            if (config.onlyInformate === true) {
                Command.serverOnlyCommands.push({
                    name: this.command,
                    description: this.name,
                    options: config.slashCommandOptions,
                });
            } else {
                Command.commands.push({
                    name: this.command,
                    description: this.name,
                    options: config.slashCommandOptions,
                });
            }
        }
    }

    check(message: Message): any {
        if (!message.content.startsWith(`${globalConfig.BOT_PREFIX}${this.command}`)) return;
        if (
            this.permission !== undefined &&
            message.member !== null &&
            this.ownerOnly === true &&
            message.author.id !== globalConfig.BOT_OWNER &&
            !message.member.permissions.has(this.permission)
        ) {
            return;
        }

        logger.info(`-> Command '${this.command}' dijalankan oleh '${message.author.tag}'`);

        if (this.cooldown) {
            if (commandCooldown.has(message.author.id)) {
                return replyAndDelete(message, `Anda harus menunggu selama \`${this.cooldown} detik\` sebelum menggunakan command \`${this.command}\` kembali!`, 10000);
            }

            commandCooldown.add(message.author.id);

            setTimeout(() => {
                commandCooldown.delete(message.author.id);
            }, this.cooldown * 1000);
        }

        const args = message.content.substring(`${globalConfig.BOT_PREFIX}${this.command}`.length + 1);
        return this.run(message, args);
    }

    checkInteraction(interaction: CommandInteraction): void {
        if (interaction.commandName !== this.command) return;
        void this.interact(interaction);
    }

    async run(message: Message, args: string): Promise<void> {
        return await Promise.reject(new Error('not implemented'));
    }

    async interact(interaction: CommandInteraction): Promise<void> {
        return await Promise.reject(new Error('not implemented'));
    }

    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        if (interaction.commandName !== this.command) return;

        return await Promise.reject(new Error('not implemented'));
    }
}