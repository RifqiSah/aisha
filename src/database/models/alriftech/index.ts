import { Sequelize } from 'sequelize';
// import { createWriteStream  } from 'fs';

// const logStream = createWriteStream('./logs/sql.log', { 'flags': 'a+' });

const sequelize = new Sequelize(process.env.DB2_NAME || '', process.env.DB2_USER || '', process.env.DB2_PASSWORD || '', {
    host: process.env.DB2_HOST,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: process.env.NODE_ENV === 'development',
    // logging: msg => logStream.write(msg + '\r\n'),
});

const db: any = {
    adapter: null,
};

db.adapter = sequelize;

// Models
db.GameServer = require('./gameserver.js')(sequelize);

module.exports = db;