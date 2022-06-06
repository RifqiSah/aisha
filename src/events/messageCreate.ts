import config from '../lib/config';

module.exports = async (client: any, message: any) => {
    // if (message?.guildId !== config.INFORMATE_ID) return;
    if (message.member === null) return;
    if (message.member.user.bot) return;

    const text = message.content;
    if (text === null) return;

    for (const command of [...client.commands.values()]) {
        command.check(message);
    }
};