const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    message: {
        type: String,
        required: true,
    },
    sender_name: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now, 
    },
    user: {
        name: {
          type: String,
          required: true
        },
        userId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'User'
        }
    },
    group: {
        name: {
          type: String,
          required: false
        },
        groupId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Group'
        }
    }
});

module.exports = mongoose.model('Chat', chatSchema);
