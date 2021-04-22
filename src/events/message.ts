/* eslint-disable max-len */
module.exports = async (client: any, message: any) => {
    // public guild
    const guildObject = await client.guildsvc.getGuild(message.guild.id);
    if (!guildObject) {
        client.logger.error(`Cannot get guild ID of ${message.guild.id}`);
        return;
    }

    const guildPrefix = await client.configsvc.getConfig(guildObject.guildId, 'prefix');
    if (guildPrefix) client.config.BOT_PREFIX = guildPrefix.value;

    if (message.author.bot || message.channel.type === 'dm') {
        return;
    }

    // local
    // if (client.config.ENV === 'local') {
    //     if (!message.member.roles.cache.has('433870492378595329')) {
    //         return;
    //     }
    // }

    if (message.mentions.has(client.bot.user)) {
        const text = message.content;

        const request = client.apiai.textRequest(text, {
            sessionId: 'aisha-api-ai-session',
        });

        request.on('response', (response: any) => {
            message.channel.send(response.result.fulfillment.speech);
        });

        request.on('error', (error: any) => {
            message.reply('Oops! Aku pusing :(');
        });

        request.end();
        return;
    }

    let regex = null;
    let args = null;
    let command = null;

    // informate only
    if (guildObject.guildId === '306617555332628480') {
        const users = message.mentions.users.map((user: any) => {
            if (user.presence.status === 'offline') { return `**${user.tag}** sedang offline.`; }
            if (user.presence.status === 'idle') { return `**${user.tag}** sedang away.`; }
            if (user.presence.status === 'dnd') { return `**${user.tag}** sedang tidak dapat diganggu.`; }
        }).filter((user: any) => !!user);

        if (users.length) {
            message.channel.send(users).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => client.logger.error(err));
        }

        if (message.channel.id === '372926591849988096') { // peraturan
            if (!message.content.startsWith('.setuju')) {
                client.logger.info('-> Pesan baru terdeteksi pada channel #peraturan dan akan segera dihapus!');

                message.delete();
            }
        }
    }

    // random
    if (Math.round(Math.random())) {
        await client.pointsvc.addPoint(message.author.id, 1);
    }

    // Cek regex
    if (message.content.indexOf(client.config.BOT_PREFIX) !== 0){
        regex = message.content.match(client.regexList);
        if (regex) {
            command = regex[0]; // Isi command dengan hasil regexnya
        } else {
            return; // Jika tidak selesaikan
        }
    } else {
        args = message.content.slice(client.config.BOT_PREFIX.length).trim().split(/ +/g); // Mensplit string dengan " " agar didapatkan argumen
        command = args.shift().toLowerCase(); // Mengambil command
    }

    // check server configuration
    const step1 = await client.configsvc.getConfig(guildObject.guildId, 'role-master');
    const step2 = await client.configsvc.getConfig(guildObject.guildId, 'role-organizer');
    const step3 = await client.configsvc.getConfig(guildObject.guildId, 'channel-bot');
    const step4 = await client.configsvc.getConfig(guildObject.guildId, 'channel-news');
    const step5 = await client.configsvc.getConfig(guildObject.guildId, 'prefix');

    if (!['bot', 'config'].includes(command)) {
        if (!step1 && !step2 && !step3 && !step4 && !step5) {
            message.delete().catch((err: any) => client.logger.error(err));
            return message.channel.send(`Konfigurasi untuk __**${guildObject.guildName}**__ tidak ditemukan!\n\nSilahkan gunakan command \`${client.config.BOT_PREFIX}config\` untuk memulai konfigurasi.`).then((msg: any) => msg.delete({ timeout: 60000 })).catch((err: any) => client.logger.error(err));
        }
    }
    // end config

    if (!['bot', 'config'].includes(command)) {
        if (message.author.id !== client.config.BOT_OWNER) {
            if (message.channel.id !== step3.value) {
                message.delete().catch((err: any) => client.logger.error(err));
                return message.channel.send(`Mohon selalu gunakan <#${step3.value}> untuk Aisha!`).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => client.logger.error(err));
            }
        }
    }

    const commandfile = client.cmds.get(command) || client.cmds.get(client.cmdsalias.get(command)); // Cari file command yang ditunjuk
    if (!commandfile) {
        return;
    }

    // Cooldown?
    if (commandfile.cooldown > 0) {
        if (client.cmdcd.has(message.author.id)) {
            return message.reply(`Anda harus menunggu selama \`${commandfile.cooldown} detik\` sebelum menggunakan command \`${commandfile.name}\` kembali!`).then((msg: any) => msg.delete({ timeout: 10000 })).catch((err: any) => client.logger.error(err));
        }

        client.cmdcd.add(message.author.id);

        setTimeout(() => {
            client.cmdcd.delete(message.author.id);
        }, commandfile.cooldown * 1000);
    }

    client.logger.info(`-> Command '${commandfile.name}' dijalankan oleh '${message.author.tag}' pada guild '${guildObject.guildName}' (${guildObject.guildId})! (Regex: ${(regex ? 'YES' : 'NO')})`);

    // Aktif?
    if (!commandfile.enable) {
        message.delete().catch((err: any) => client.logger.error(err));
        return message.channel.send(`Command \`${commandfile.name}\` sedang tidak aktif!`).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => client.logger.error(err));
    }

    // public?
    if (!commandfile.public && guildObject.guildId !== '306617555332628480') {
        message.delete().catch((err: any) => client.logger.error(err));
        return message.channel.send(`Maaf, command \`${commandfile.name}\` hanya dapat digunakan pada **Informate Community Discord**!`).then((msg: any) => msg.delete({ timeout: 10000 })).catch((err: any) => client.logger.error(err));
    }

    // Command mempunyai role?
    if (commandfile.role.length > 0) {
        // bypass
        if (commandfile.name === 'config') {
            // apakah master role sudah ada?
            if (step1) {
                // cek apakah user tersebut ada pada master role?
                if (message.member.roles.cache.has(step1.value)) {
                    await client.pointsvc.addPoint(message.author.id, 5);
                    return commandfile.func(client, message, args);
                } else {
                    message.delete().catch((err: any) => client.logger.error(err));
                    return message.channel.send(`Anda tidak mempunyai ijin untuk menggunakan command \`${commandfile.name}\`!`).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => client.logger.error(err));
                }
            } else {
                // jika tidak ada, jalankan saja
                await client.pointsvc.addPoint(message.author.id, 5);
                return commandfile.func(client, message, args);
            }
        }

        if (message.member.roles.cache.some((role: any) => commandfile.role.includes(role.id))) {
            await client.pointsvc.addPoint(message.author.id, 5);
            return commandfile.func(client, message, args);
        } else {
            message.delete().catch((err: any) => client.logger.error(err));
            return message.channel.send(`Anda tidak mempunyai ijin untuk menggunakan command \`${commandfile.name}\`!`).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => client.logger.error(err));
        }
    }

    await client.pointsvc.addPoint(message.author.id, 5);
    return commandfile.func(client, message, args);
};