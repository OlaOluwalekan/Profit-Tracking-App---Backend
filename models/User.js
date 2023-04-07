const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    required: [true, 'username is required'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
})

module.exports = model('User', userSchema)
