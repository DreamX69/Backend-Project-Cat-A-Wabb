const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  role: { type: String, enum: ['member', 'admin'], default: 'member' }
})

const User = mongoose.model('User', userSchema);

module.exports = User;