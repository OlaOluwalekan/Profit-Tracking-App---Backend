const mongoose = require('mongoose')

const connect = (uri) => {
  return mongoose.connect(uri, console.log(`connected to database`))
}

module.exports = connect
