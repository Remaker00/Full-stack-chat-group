const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    member_names: {
        type: String,
        required: true,
    },
    member_ids: {
        type: [String], 
        default: [],    
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
    }
});

module.exports = mongoose.model('Group', groupSchema);
