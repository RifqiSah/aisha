module.exports = async (client: any, message: any) => {
    if (message.author.bot || message.channel.type === 'dm') {
        return;
    }
    
    if (client.config.ENV === 'local') {
        if (!message.member.roles.cache.has('433870492378595329')) {
            return;
        }
    }

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

    const users = message.mentions.users.map((user: any) => {
        if (user.presence.status === 'offline') { return `**${user.tag}** sedang offline.`; }
        if (user.presence.status === 'idle') { return `**${user.tag}** sedang away.`; }
        if (user.presence.status === 'dnd') { return `**${user.tag}** sedang tidak dapat diganggu.`; }
    }).filter((user: any) => !!user);

    if (users.length) {
        message.channel.send(users).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => client.logger.error(err));
    }

    let regex = null;
    let args = null;
    let command = null;

    if (message.channel.id === '372926591849988096') { // peraturan
        if (!message.content.startsWith('.setuju')) {
            client.logger.info('-> Pesan baru terdeteksi pada channel #peraturan dan akan segera dihapus!');

            message.delete();
        }
    }

    // Cek regex
    if (message.content.indexOf(client.config.BOT_PREFIX) !== 0) {
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

    if (command !== 'bot') {
        const isexist = await client.chsvc.getChannel(message.channel.id);
        if (isexist) {
            return;
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

    client.logger.info(`-> Command '${commandfile.name}' dijalankan oleh '${message.author.tag}'! (Regex: ${(regex ? 'YES' : 'NO')})`);

    // Aktif?
    if (!commandfile.enable) {
        message.delete().catch((err: any) => client.logger.error(err));
        return message.channel.send(`Command \`${commandfile.name}\` sedang tidak aktif!`).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => client.logger.error(err));
    }

    // Command mempunyai role?
    if (commandfile.role.length > 0) {
        if (message.member.roles.cache.some((role: any) => commandfile.role.includes(role.id))) {
            client.pointsvc.addPoint(message.author.id, 10);
            return commandfile.func(client, message, args);
        } else {
            message.delete().catch((err: any) => client.logger.error(err));
            return message.channel.send(`Anda tidak mempunyai ijin untuk menggunakan command \`${commandfile.name}\`!`).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => client.logger.error(err));
        }
    }
    
    client.pointsvc.addPoint(message.author.id, 10);
    return commandfile.func(client, message, args);
};
