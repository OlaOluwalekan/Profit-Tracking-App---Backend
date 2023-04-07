const express = require('express')
const connect = require('./utility/connect')
const app = express()
require('dotenv').config()
const authRoutes = require('./routes/auth')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { credentials, corsOptions } = require('./utility/cors')

// EXPRESS MIDDLEWARES
app.use(credentials)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// ROUTER MIDDLEWARE
app.use('/api/v1/auth', authRoutes)

app.use((err, req, res, next) => {
  res
    .status(err.status)
    .json({ status: 'failure', message: err.message || 'something went wrong' })
})

app.get('/', (req, res) => {
  res.status(200).send(`<h1>Home, Welcome</h1>`)
})

const port = process.env.PORT || 9000

const start = async () => {
  try {
    await connect(process.env.MONGO_URI)
    app.listen(port, console.log(`server is listening on port ${port}...`))
  } catch (error) {
    console.log(error)
  }
}

start()
