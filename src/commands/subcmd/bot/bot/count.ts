import { sendAndDelete } from '../../../../helpers/bot';

module.exports = {
    name: 'count',
    func: async (client: any, message: any, args: any) => {
        const type: string = args[1];
        let count = 0;

        if (!type) {
            return sendAndDelete(message, 'Mohon masukkan type!', 5000);
        }

        if (type === 'guild') {
            count = await client.guildsvc.count();
        } else {
            count = await client.chsvc.count();
        }

        return sendAndDelete(message, `Aisha telah masuk kedalam \`${count}\` ${type}!`, 5000);
    }
};