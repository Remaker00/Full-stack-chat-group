const Sequelize = require('sequelize');
const sequelize = require('../util/dataB');

const Chat = sequelize.define('messages', {
    message: Sequelize.STRING,
    sender_name: Sequelize.STRING,
    timestamp: Sequelize.DATE
});

module.exports = Chat;