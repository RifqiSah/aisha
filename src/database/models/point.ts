import { Sequelize, DataTypes } from 'sequelize';

const Point = {
    name: 'point',
    define: {
        userId: {
            type: DataTypes.STRING,
            required: true,
        },
        point: {
            type: DataTypes.INTEGER,
            required: true,
        },
        updated: {
            type: DataTypes.DATE,
            required: true,
        }
    },
    options: {
        timestamps: true,
    }
};

module.exports = (sequelize: Sequelize) => {
    const { name, define, options } = Point;
    return sequelize.define(name, define, options);
};