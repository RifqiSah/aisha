import { userMention } from '@discordjs/builders';
import {
    Message,
    CommandInteraction,
    PermissionResolvable,
    ApplicationCommandData,
    ApplicationCommandOptionData,
    AutocompleteInteraction,
    GuildMemberRoleManager,
} from 'discord.js';
import { replyAndDelete, sendAndDelete } from '../helpers/bot';
import globalConfig from '../lib/config';
import { logger } from '../lib/logger';

const commandCooldown = new Set();

export default abstract class Command {
    static commands: ApplicationCommandData[] = [];
    static serverOnlyCommands: ApplicationCommandData[] = [];

    name: string;
    command: string;
    usage?: string;
    permission?: PermissionResolvable;
    ownerOnly?: boolean;
    registerSlashCommand?: boolean;
    onlyInformate?: boolean;
    hasAutocomplete?: boolean;
    slashCommandOptions?: ApplicationCommandOptionData[];
    cooldown?: number;
    roles?: string[];

    constructor(config: {
        name: string;
        command: string;
        usage?: string;
        permission?: PermissionResolvable;
        ownerOnly?: boolean;
        registerSlashCommand?: boolean;
        onlyInformate?: boolean;
        hasAutocomplete?: boolean;
        slashCommandOptions?: ApplicationCommandOptionData[];
        cooldown?: number;
        roles?: string[];
    }) {
        this.name = config.name;
        this.command = config.command;
        this.usage = config.usage;
        this.permission = config.permission;
        this.ownerOnly = config.ownerOnly;
        this.registerSlashCommand = config.registerSlashCommand;
        this.onlyInformate = config.onlyInformate;
        this.hasAutocomplete = config.hasAutocomplete;
        this.slashCommandOptions = config.slashCommandOptions;
        this.cooldown = config.cooldown;
        this.roles = config.roles || [];

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

        const isOwner = message.author.id === globalConfig.BOT_OWNER;
        if (this.ownerOnly && !isOwner) return;

        if (!isOwner) {
            if (this.onlyInformate) {
                if (message?.guildId !== globalConfig.INFORMATE_ID) {
                    return replyAndDelete(message, 'Command ini hanya dapat dijalankan pada **Informate Community Guild**!', 10000);
                }
            }

            if (this.cooldown) {
                if (commandCooldown.has(message.author.id)) {
                    return replyAndDelete(message, `Anda harus menunggu selama \`${this.cooldown} detik\` sebelum menggunakan command \`${this.command}\` kembali!`, 10000);
                }

                commandCooldown.add(message.author.id);

                setTimeout(() => {
                    commandCooldown.delete(message.author.id);
                }, this.cooldown * 1000);
            }

            if (this.roles?.length) {
                const hasRole = message.member?.roles.cache.some((role: any) => {
                    return this.roles?.includes(role.id) === true;
                });

                if (!hasRole) {
                    message.delete();
                    return sendAndDelete(message, `${userMention(message.author.id)}, Anda tidak mempunyai ijin untuk menggunakan command \`${this.command}\`!`, 5000);
                }
            }
        }

        logger.info(`-> Command '${this.command}' dijalankan oleh '${message.author.tag}'`);

        const args = message.content.substring(`${globalConfig.BOT_PREFIX}${this.command}`.length + 1);
        return this.run(message, args);
    }

    checkInteraction(interaction: CommandInteraction): any {
        if (interaction.commandName !== this.command) return;

        const isOwner = interaction.user.id === globalConfig.BOT_OWNER;
        if (this.ownerOnly && !isOwner) return interaction.reply({ content: 'Anda tidak mempunyai ijin untuk menjalankan perintah ini!', ephemeral: true });

        if (!isOwner) {
            if (this.onlyInformate) {
                if (interaction?.guildId !== globalConfig.INFORMATE_ID) {
                    return interaction.reply({ content: 'Command ini hanya dapat dijalankan pada **Informate Community Guild**!', ephemeral: true });
                }
            }

            // if (this.cooldown) {
            //     if (commandCooldown.has(message.author.id)) {
            //         return replyAndDelete(message, `Anda harus menunggu selama \`${this.cooldown} detik\` sebelum menggunakan command \`${this.command}\` kembali!`, 10000);
            //     }

            //     commandCooldown.add(message.author.id);

            //     setTimeout(() => {
            //         commandCooldown.delete(message.author.id);
            //     }, this.cooldown * 1000);
            // }

            if (this.roles?.length) {
                const hasRole = (interaction.member?.roles as GuildMemberRoleManager).cache.some((role: any) => {
                    return this.roles?.includes(role.id) === true;
                });

                if (!hasRole) {
                    return interaction.reply({ content: 'Anda tidak mempunyai ijin untuk menjalankan perintah ini!', ephemeral: true });
                }
            }
        }

        logger.info(`-> Interaction '${this.command}' dijalankan oleh '${interaction.user.tag}'`);

        return this.interact(interaction);
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