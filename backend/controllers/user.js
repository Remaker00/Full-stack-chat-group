const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.insertusers = async (req, res) => {
    const { name, email, password } = req.body;
    try{
        const hashpass = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashpass });
        res.status(201).send('User LoggedIn successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error Logging user.');
    }
};

exports.checkusers = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({where: { email } });

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const token = jwt.sign({ userId: user.id }, 'your4secret4key');
                res.status(200).json({ message: `Login successful}`, token});
            } else {
                res.status(401).send('Invalid credentials.');
            }
        } else {
            res.status(401).send('Invalid credentials.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error Logging user.');
    }
};

exports.findAllusers = async (req, res) => {
    try {
        const currentUserID = req.user.id;
        const people = await User.findAll({
            where: {
                id: {
                    [Sequelize.Op.not]: currentUserID // Exclude the current user
                }
            }
        });
        console.log("><><><", currentUserID)
        res.status(200).json(people);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching peoples.');
    }
};