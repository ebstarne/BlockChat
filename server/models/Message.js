const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'channels',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  organization: {
    type: String,
    required: true,
  },
  messageNumber: {
    type: Number,
    required: true,
  },
});

MessageSchema.index({ username: 1, organization: 1, messageNumber: 1, channel: 1}, { unique: true });

module.exports = Message = mongoose.model('message', MessageSchema);
