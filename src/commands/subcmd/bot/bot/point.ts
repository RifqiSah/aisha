module.exports = {
    name: 'point',
    func: async (client: any, message: any, args: any) => {
        const user = message.mentions.users.first();
        
        if (!user && !args[2]) {
            return message.channel.send('Mohon mention user dan masukkan nominal point!').then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
                client.logger.error(err);
            });
        }

        if (args[2] == 'delete') {
            client.pointsvc.deletePoint(user.id);

            return message.channel.send(`Berhasil menghapus semua point milik ${user.tag}!`).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
                client.logger.error(err);
            });
        }

        const point = parseInt(args[2]);
        client.pointsvc.addPoint(user.id, point);
        
        return message.channel.send(`Berhasil menambahkan point sebesar \`${point}\` kepada \`${user.tag}\`!`).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
            client.logger.error(err);
        });
    }
};