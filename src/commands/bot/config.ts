/* eslint-disable max-len */
import { editAndDelete } from '../../helpers/bot';

const questions = [
    '```1. Aisha dapat mengirim pesan kedalam server Discord ini secara otomatis.\n2. Aisha dapat dikeluarkan oleh pembuat (gunakan command .botinfo untuk informasi) jika terdapat pelanggaran / eksploitasi dalam penggunaan Aisha.\n3. Info selanjutnya dapat dikirim melalui peraturan pertama.```\nSetelah ini, Anda akan diminta untuk memasukkan beberapa pengaturan agar Aisha dapat bekerja. Balas `YA` untuk melanjutkan.\n\n* Anda akan diberikan waktu 1 menit dalam menjawab setiap pertanyaan.',
    'Mention sebuah role untuk seorang **Admin**. Hati-hati dalam memberikan role Admin, karena seorang Admin dapat menjalankan command-command yang **berbahaya**!',
    'Mention sebuah role untuk seorang **Pengurus**.',
    'Mention sebuah channel untuk **Bot Spam**, digunakan untuk melakukan "spam" command-command kepada bot',
    'Mention sebuah channel untuk **Informasi**, digunakan untuk mengirim informasi dari dan untuk semua member pada server',
    'Masukkan sebuah prefix untuk Aisha',
];

const configDatas = [
    'role-master',
    'role-organizer',
    'channel-bot',
    'channel-news',
    'prefix',
];

const exitMessage = 'Jawaban tidak sesuai, silahkan ulang kembali.';
const timeoutTime = 60000; // 1 min
const timeoutMessage = 'Waktu habis, silahkan ulang kembali.';

module.exports = {
    name: 'config',
    desc: 'Pengaturan untuk Aisha.',
    enable: true,
    regex: false,
    help: false,
    public: true,
    role: ['admin'],
    aliases: [],
    usage: '',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        const chid = message.channel.id;
        const guildId = message.guild.id;

        message.delete();
        // eslint-disable-next-line prefer-const
        let msg: any = await message.channel.send('Mohon tunggu ...');

        const a = await client.configsvc.getConfig(guildId, 'role-master');
        const b = await client.configsvc.getConfig(guildId, 'role-organizer');
        const c = await client.configsvc.getConfig(guildId, 'channel-bot');
        const d = await client.configsvc.getConfig(guildId, 'channel-news');
        const e = await client.configsvc.getConfig(guildId, 'prefix');

        const answer: string[] = [];

        let qNumber = 1;
        let cancel = false;

        if (a && b && c && d && e) {
            return editAndDelete(msg, 'Anda sudah melakukan konfigurasi untuk server ini!', 5000);
        }

        for(const q in questions) {
            const question = questions[q];
            if (cancel) break;

            await msg.edit(`__**Pertanyaan #${qNumber++}**__\n\n${question}\n\n* Jawab \`quit\` untuk keluar.`).then(async () => {
                await message.channel.awaitMessages((res: any) => message.content, {
                    max: 1,
                    time: qNumber === 1 ? timeoutTime * 3 : timeoutTime,
                    errors: ['time']
                }).then((collected: any) => {
                    const ans = collected.first().content.trim();
                    collected.first().delete();

                    if (qNumber === 1) {
                        if (!isNaN(ans) || ans.toString().toUpperCase() !== 'YA') {
                            editAndDelete(msg, exitMessage, 5000);
                            cancel = true;
                        }
                    }

                    if (ans === 'quit') cancel = true;

                    answer.push(ans);
                }).catch((collected: any) => {
                    editAndDelete(msg, timeoutMessage, 5000);
                    cancel = true;
                });
            }).catch((err: any) => client.logger.error(err));
        }

        if (cancel) {
            answer.length = 0;
            return editAndDelete(msg, 'Konfigurasi dibatalkan!', 5000);
        }

        // buang jawaban pertama
        answer.shift();

        console.log('Jawaban:', answer);

        answer.forEach(async (ans: string, i: any) => {
            const config = configDatas[i];

            const canMention = ans.startsWith('<') && ans.endsWith('>');
            const value = canMention ? ans.replace(/\D/g, '') : ans;
            const desc = canMention ? ans.length > 2 && ans[1] === '@' ? message.guild.roles.cache.get(value).name : message.guild.channels.cache.get(value).name : '-';

            await client.configsvc.addConfig(guildId, config, value.toString(), desc);
        });

        return editAndDelete(msg, 'Terima kasih sudah menggunakan Aisha, konfigurasi Anda telah disimpan.', 10000);
    },
};
