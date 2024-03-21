const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  channels: [
    {
      channel: {
        type: Schema.Types.ObjectId,
        ref: 'channels',
      },
      name: {
        type: String,
        sparse: true,
      },
    },
  ],
});

module.exports = Organization = mongoose.model(
  'organizations',
  OrganizationSchema
);
