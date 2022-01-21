const { GlobalsModel } = require('../models');

module.exports = {
    async count() {
        return await GlobalsModel.count();
    },

    async getAllGlobals() {
        return await GlobalsModel.findAll();
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

        }, {
            where: {
                key: key,
            },
        });
    },
};
