const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const sequelize = require('./util/dataB');
const User = require('./models/users');
const Chat = require('./models/chat');
const Group = require('./models/groups')

app.use(bodyParser.json());
app.use(express.static('frontend'));

const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/chat');
const groupRoutes = require('./routes/groups');

app.use('/user', userRoutes);
app.use('/message', messageRoutes);
app.use('/group', groupRoutes);

User.hasMany(Chat);
Chat.belongsTo(User);

User.hasMany(Group);
Group.belongsTo(User);

Group.hasMany(Chat);
Chat.belongsTo(Group);

Group.hasMany(User);
User.belongsTo(Group);

sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log(`App started`);
    });
}).catch(err => {
    console.error('Error syncing database:', err);
});