const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  _id: { type: String }
});

module.exports = model('User', UserSchema, 'User');
