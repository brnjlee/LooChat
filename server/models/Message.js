const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const MessageSchema = new Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  content: {
  	type: String,
  }
},
{
  timestamps: true
});

const Message = mongoose.model('messages', MessageSchema);

module.exports = Message;
