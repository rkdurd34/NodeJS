require('dotenv').config()
const morgan = require('morgan');
const express = require('express')
const bodyParser = require('body-parser')
const createError = require('http-errors')
const app = express()

const userRoutes = require('./src/routes/user.routes')
const authRoutes = require('./src/routes/auth.routes');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'))

// import product routes
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

app.use((req, res, next) => {
  next(createError.NotFound())
})
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.messaage,
    }
  })
})
  ;

const PORT = process.env.PORT || process.env.APP_PORT
app.listen(PORT, () => console.log(`server on port ${PORT}`))