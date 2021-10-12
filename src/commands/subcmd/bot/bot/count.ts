module.exports = {
    name: 'count',
    func: async (client: any, message: any, args: any) => {
        const type: string = args[1];
        let count = 0;

        if (!type) {
            return message.channel.send('Mohon masukkan type!').then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
                client.logger.error(err);
            });
        }

        if (type === 'guild') {
            count = await client.guildsvc.count();
        } else {
            count = await client.chsvc.count();
        }

        return message.channel.send(`Aisha telah masuk kedalam \`${count}\` ${type}!`).then((msg: any) => msg.delete({ timeout: 15000 })).catch((err: any) => {
            client.logger.error(err);
        });
    }
};