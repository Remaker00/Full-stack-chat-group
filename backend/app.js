const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const sequelize = require('./util/dataB');
const User = require('./models/users');
const Chat = require('./models/chat');
const Group = require('./models/groups')

app.use(bodyParser.json());
app.use(express.static('frontend'));

const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/chat');
const groupRoutes = require('./routes/groups');
const adminRoutes = require('./routes/admin');
const passwordRoutes = require('./routes/password')
const resetpasswordRoutes = require('./routes/resetpassword')

app.use('/user', userRoutes);
app.use('/message', messageRoutes);
app.use('/group', groupRoutes);
app.use('/admin', adminRoutes);
app.use('/password', passwordRoutes);
app.use('/resetpassword', resetpasswordRoutes);

User.hasMany(Chat);
Chat.belongsTo(User);

User.hasMany(Group);
Group.belongsTo(User);

Group.hasMany(Chat);
Chat.belongsTo(Group);

Group.hasMany(User);
User.belongsTo(Group);


io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (message) => {
      io.emit('message', message);
  });

  socket.on('disconnect', () => {
      console.log('A user disconnected');
  });
});


sequelize.sync().then(() => {
    server.listen(4000, () => {
        console.log(`App started`);
    });
}).catch(err => {
    console.error('Error syncing database:', err);
});