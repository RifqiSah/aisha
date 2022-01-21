import { Sequelize, DataTypes } from 'sequelize';

const Globals = {
    name: 'globals',
    define: {
        key: {
            type: DataTypes.STRING,
        },
        value: {
            type: DataTypes.STRING,
        },
    },
    options: {
        timestamps: true,
    }
};

module.exports = (sequelize: Sequelize) => {
    const { name, define, options } = Globals;
    return sequelize.define(name, define, options);
};