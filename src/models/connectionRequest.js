const mongoose = require('mongoose');
const user = require('./user');

const connectionRequestSchema = new mongoose.Schema({
    fromUserID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: user
    },
    toUserID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: user
    },
    status: {
        type: String,
        required: true,
        enum: ['pending','ignored','interested', 'accecpted', 'rejected'],
        default: 'pending',
        message: `{VALUE} is not supported`
    }
},
{ timestamps: true }
)  

module.exports = mongoose.model('connectionRequest', connectionRequestSchema);