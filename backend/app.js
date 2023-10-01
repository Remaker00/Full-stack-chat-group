const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.use(cors());

app.use(bodyParser.json());
app.use(express.static('../frontend'));

const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/chat');
const groupRoutes = require('./routes/groups');
const adminRoutes = require('./routes/admin');
const passwordRoutes = require('./routes/password');
const resetpasswordRoutes = require('./routes/resetpassword');

app.use('/user', userRoutes);
app.use('/message', messageRoutes);
app.use('/group', groupRoutes);
app.use('/admin', adminRoutes);
app.use('/password', passwordRoutes);
app.use('/resetpassword', resetpasswordRoutes);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    server.listen(4000, () => {
      console.log('App started');
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
