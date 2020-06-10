module.exports = async (client: any, message: any) => {
    if (message.author.bot || message.channel.type === 'dm') return; // Jangan hiraukan chat dari sesama bot dan pastikan chat berasal dari guild

    // == Awal pengecekan mention BOT ==
    if (message.mentions.has(client.bot.user)) {
        const text = message.content;

        // Parse text ke DialogFlow
        const request = client.apiai.textRequest(text, {
            sessionId: 'aisha-api-ai-session',
        });

        // Dapatkan respon dari DialogFlow
        request.on('response', (response: any) => {
            message.channel.send(response.result.fulfillment.speech);
        });

        // Error listener
        request.on('error', (error: any) => {
            message.reply('Oops! Aku pusing :(');
        });

        request.end(); // Akhiri request untuk menghemat memory
        return;
    }
    // == Akhir pengecekan mention BOT ==

    // == Awal pengecekan user ==
    const users = message.mentions.users.map((user: any) => {
        if (user.presence.status === 'offline') return `**${user.tag}** sedang offline.`;
        if (user.presence.status === 'idle') return `**${user.tag}** sedang away.`;
        if (user.presence.status === 'dnd') return `**${user.tag}** sedang tidak dapat diganggu.`;
    });

    if (users.length > 0) message.channel.send(users).then((msg: any) => { msg.delete({ timeout: 5000 }); }).catch();
    // == Akhir pengecekan user ==

    let regex = null;
    let args = null;
    let command = null;

    // == Monitor main channel ==
    if (message.channel.id === '372926591849988096') { // peraturan
        if (!message.content.startsWith('.setuju')) {
            console.log('-> Pesan baru terdeteksi pada channel #peraturan dan akan segera dihapus!');

            message.delete();
        }
    }
    // == End monitor main channel ==

    // == Awal regex checker ==
    // Cek apakah diawali prefix
    if (message.content.indexOf(client.config.PREFIX) !== 0) {
        // Apakah ada di regex?
        regex = message.content.match(client.regexList);
        if (regex) command = regex[0]; // Isi command dengan hasil regexnya
        else return; // Jika tidak selesaikan
    } else {
        // Jika ya
        args = message.content.slice(client.config.PREFIX.length).trim().split(/ +/g); // Mensplit string dengan " " agar didapatkan argumen
        command = args.shift().toLowerCase(); // Mengambil command
    }
    // == Akhir regex checker ==

    if (command !== 'bot') {
        const isexist = await client.chsvc.getChannel(message.channel.id);
        if (isexist) return;
    }

    // == Awal command manager ==
    const commandfile = client.cmds.get(command) || client.cmds.get(client.cmdsalias.get(command)); // Cari file command yang ditunjuk
    if (commandfile) {
        // Cek apakah command ada cooldownnya
        if (commandfile.cooldown > 0) {
            // Cek dulu apakah user sudah menjalankan command sebelumnya?
            if (client.cmdcd.has(message.author.id)) return message.reply(`Anda harus menunggu selama \`${commandfile.cooldown} detik\` sebelum menggunakan command \`${commandfile.name}\` kembali!`).then((msg: any) => { msg.delete({ timeout: 10000 }); }).catch();

            // Kalau tidak
            client.cmdcd.add(message.author.id); // Tambahkan user kedalam list cooldown

            // Hapus user setelah timeout habis
            setTimeout(() => {
                client.cmdcd.delete(message.author.id);
            }, commandfile.cooldown * 1000);
        }

        console.log(`-> Command '${commandfile.name}' executed! (Regex: ${(regex ? 'YES' : 'NO')})`);

        // Cek apakah command sedang aktif atau tidak
        if (commandfile.enable) {
            // Apakah command mempunya role (role != null)
            if (commandfile.role.length > 0) {
                // Apakah role pengguna ada pada command ini?
                if (message.member.roles.cache.some((role: any) => commandfile.role.includes(role.id))) {
                    // Jalankan
                    commandfile.func(client, message, args);
                } else {
                    // Tidak ada? Tampilkan pesan error
                    message.delete().catch(() => {});
                    message.channel.send(`Anda tidak mempunyai ijin untuk menggunakan command \`${commandfile.name}\`!`).then((msg: any) => { msg.delete({ timeout: 5000 }); }).catch();
                }
            // Jika role tidak ada jalankan saja
            } else {
                commandfile.func(client, message, args);
            }
        } else {
            // Command tidak aktif
            message.delete().catch(() => {});
            message.channel.send(`Command \`${commandfile.name}\` sedang tidak aktif!`).then((msg: any) => { msg.delete({ timeout: 5000 }); }).catch();
        }
    }
    // == Akhir command manager ==
};
