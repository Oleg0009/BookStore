const mongoose = require('mongoose')

const bcrypt = require('bcrypt'); 

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email:String,
  role: {
    type: String,
    enum: ['admin', 'user'], // Define allowed roles
    default: 'user', // Set a default role
  },
})

userSchema.methods.validPassword = function (password) {
  return password === this.password
};

module.exports = mongoose.model("User" ,userSchema) 