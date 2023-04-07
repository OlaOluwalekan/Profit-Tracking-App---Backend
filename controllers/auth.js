const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('../utility/error')

const createUser = async (req, res) => {
  try {
    const existingEmail = await User.find({ email: req.body.email })
    const existingUsername = await User.find({ username: req.body.username })

    if (existingEmail.length > 0 || existingUsername.length > 0) {
      return res.status(401).json({
        status: 'failure',
        message:
          existingEmail.length > 0
            ? `The email ${req.body.email} already exist`
            : `The username ${req.body.username} is already taken`,
      })
    }

    const salt = await bcrypt.genSalt(10)
    const harshPass = await bcrypt.hash(req.body.password, salt)

    const newUser = await new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: harshPass,
    })
    newUser.save()
    const { password, ...rest } = newUser._doc

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_TOKEN)
    res.cookie('user_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'none',
      secure: true,
    })

    res.status(201).json({
      status: 'success',
      message: 'user registration successful',
      data: rest,
    })
  } catch (error) {
    console.log(error)
  }
}

const loginUser = async (req, res, next) => {
  try {
    const user =
      (await User.findOne({ email: req.body.email })) ||
      (await User.findOne({ username: req.body.username }))

    if (!user) {
      return next(
        createError(
          401,
          req.body.email ? `email does not exist` : `username does not exist`
        )
      )
    }

    const match = await bcrypt.compare(req.body.password, user.password)

    if (!match) {
      return next(
        createError(
          401,
          req.body.email
            ? `incorrect email or password`
            : `incorrect username or password`
        )
      )
    }

    const { password, ...rest } = user._doc

    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN)
    res.cookie('user_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'none',
      secure: true,
    })

    res.status(200).json({
      status: 'success',
      message: 'login successful',
      data: rest,
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = { createUser, loginUser }
