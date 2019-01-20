const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId, ref: 'users'
    }],
},
{
    timestamps: true
});

module.exports = mongoose.model('conversations', ConversationSchema);
