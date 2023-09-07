const Chat = require('../models/chat');

exports.insertchats = async (req, res) => {
    const token_group_id = req.header('Group-ID');
    const { message} = req.body;
    await Chat.create({  message, userId: req.user.id, groupId:  token_group_id }).then(message => {
        return res.status(201).json({message, success: true } );
    }).catch(err => {
        return res.status(403).json({success : false, error: err})
    })
};

exports.getAllchats = async (req, res) => {
    const token_group_id = req.header('Group-ID');
    try {
        const message = await Chat.findAll({
            where: {
                groupId: token_group_id
            }
        });
        res.status(200).json(message);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching messages.');
    }
};


exports.deletechats = async (req, res) => {
    const messageId = req.params.id; 
    try {
        const message = await Chat.findByPk(messageId);
        if (!message) {
            res.status(404).send('Message not found.');
            return;
        }
        await message.destroy();
        res.status(200).send('Message deleted successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting message.');
    }
};
