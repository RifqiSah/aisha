import { sendAndDelete } from '../../../../helpers/bot';

module.exports = {
    name: 'reboot',
    func: async (client: any, message: any, args: any) => {
        try {
            await sendAndDelete(message, 'Tunggu sebentar!', 5000);
            process.exit();
        } catch (e: any) {
            message.channel.send(`ERROR: ${e.message}`);
        }
    }
};