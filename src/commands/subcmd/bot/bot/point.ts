import { sendAndDelete } from '../../../../helpers/bot';

module.exports = {
    name: 'point',
    func: async (client: any, message: any, args: any) => {
        const user = message.mentions.users.first();

        if (!user && !args[2]) {
            return sendAndDelete(message, 'Mohon mention user dan masukkan nominal point!', 5000);
        }

        if (args[2] == 'delete') {
            client.pointsvc.deletePoint(user.id);

            return sendAndDelete(message, `Berhasil menghapus semua point milik ${user.tag}!`, 5000);
        }

        const point = parseInt(args[2]);
        client.pointsvc.addPoint(user.id, point);

        return sendAndDelete(message, `Berhasil menambahkan point sebesar \`${point}\` kepada \`${user.tag}\`!`, 5000);
    }
};