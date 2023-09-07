const Sequelize = require('sequelize');
const sequelize = require('../util/dataB');

const Group = sequelize.define('groups', {
    name: Sequelize.STRING,
    member_names :Sequelize.STRING
});

module.exports = Group;