const { GlobalsModel } = require('../models/aisha');

module.exports = {
    async count() {
        return await GlobalsModel.count();
    },

    async findAll(opt: any = {}) {
        return await GlobalsModel.findAll(opt);
    },

    async getGlobals(key: string) {
        return await GlobalsModel.findOne({
            where: {
                key: key,
            },
        });
    },

    async addGlobals(key: string, value: string) {
        await GlobalsModel.create({
            key: key,
            value: value,
        });
    },

    async deleteGlobals(key: string) {
        await GlobalsModel.destroy({
            where: {
                key: key,
            },
        });
    },

    async updateGlobals(key: string, value: any) {
        await GlobalsModel.update({
            value,
        }, {
            where: {
                key: key,
            },
        });
    },
};
