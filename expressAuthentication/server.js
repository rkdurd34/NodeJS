require('dotenv').config()
const morgan = require('morgan');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const userRoutes = require('./src/routes/user.routes')


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'))



// import product routes
app.use('/api/user', userRoutes)

const PORT = process.env.PORT || process.env.APP_PORT
app.listen(PORT, () => console.log(`server on port ${PORT}`))