const Sequelize = require('sequelize');
const sequelize = require('../util/dataB');

const Chat = sequelize.define('messages', {
    message: Sequelize.STRING,
});

module.exports = Chat;