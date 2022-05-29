import { sendAndDelete } from '../../../../helpers/bot';
import { loadData } from '../../../../helpers/function';

module.exports = {
    name: 'reload',
    func: async (client: any, message: any, args: any) => {
        const type: string = args[1];

        if (!type) {
            return sendAndDelete(message, 'Mohon masukkan type!', 5000);
        }

        if (type === 'data') {
            await loadData();
        } else {
            return sendAndDelete(message, `Reload ${type} tidak ditemukan!`, 5000);
        }

        return sendAndDelete(message, `Sukses menjalankan reload ${type}!`, 5000);
    }
};