const Sequelize = require('sequelize');
const sequelize = require('../util/dataB');

const Chat = sequelize.define('messages', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    message: Sequelize.STRING
});

module.exports = Chat;