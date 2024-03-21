const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  organization: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'organizations',
    },
    name: {
      type: String,
      sparse: true,
    },
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = User = mongoose.model('user', UserSchema);
