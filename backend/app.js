const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const sequelize = require('./util/dataB');
const User = require('./models/users');

app.use(bodyParser.json());
app.use(express.static('frontend'));

const userRoutes = require('./routes/user');

app.use('/user', userRoutes);

sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log(`App started`);
    });
}).catch(err => {
    console.error('Error syncing database:', err);
});