import { Channel } from '../models/channel-model';

module.exports = {
    // Get all data
    getAllChannel() {
        Channel.find({}, (e, ch) => {
            if (e) return console.log(e);

            return ch;
        });
    },

    getChannel(ID: String) {
        return Channel.findOne({ id: ID });
    },

    // Add data
    addChannel(ID: String) {
        const channel = new Channel({ id: ID, status: true });
        channel.save((e, ch) => {
            if (e) return console.log(e);

            console.log(`${ID} saved!`);
        });
    },

    // Delete data
    deleteChannel(ID: String) {
        Channel.findOneAndDelete({ id: ID }, (e, deleted) => {
            if (e) return console.log(e);

            const msg = deleted ? 'deleted!' : 'not found!';
            console.log(`${ID} ${msg}`);
        });
    },

    // Update data
    updateChannel(ID: String, data: any) {
        Channel.findOneAndUpdate({ id: ID }, data, (e, ch) => {
            if (e) return console.log(e);

            const msg = ch ? 'deleted!' : 'not found!';
            console.log(`${ID} ${msg}`);
        });
    },
};
