import { readdirSync } from 'fs';
import { resolve } from 'path';

module.exports = (client: any) => {
    console.log('  [-] Initialize events');
    const load = () => {
        const events = readdirSync(resolve(__dirname, '../events')).filter((f) => f.endsWith('.js'));
        
        for (const file of events) {
            const evt = require(resolve(__dirname, `../events/${file}`));
            const ename = file.split('.')[0];

            console.log(`    + '${file}' added.`);

            client.bot.on(ename, evt.bind(null, client));
        }
    };

    load();
    console.log('  [V] Done!');
};