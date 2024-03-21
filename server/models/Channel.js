const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    sparse: true,
  },
  description: {
    type: String,
    required: true,
  },
  messageNumbers: {
    GE: {
      type: Number,
      required: true,
      default: 0,
    },
    RA: {
      type: Number,
      required: true,
      default: 0,
    },
    TF: {
      type: Number,
      required: true,
      default: 0,
    },
  }
});

module.exports = Channel = mongoose.model('channels', ChannelSchema);
