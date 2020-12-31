require('dotenv').config()
const morgan = require('morgan');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const userRoutes = require('./src/routes/user.routes')

// parse request data content type application/x-www-form-rulencoded
// extended:true로 설정해놓을경우 모든 type 다받고
// false로 해놓을경우 string 또는 배열
app.use(bodyParser.urlencoded({ extended: false }));

// parse request data content type application/json
app.use(bodyParser.json());
app.use(morgan('dev'))



// import product routes
app.use('/api/user', userRoutes)

const PORT = process.env.PORT || process.env.APP_PORT
app.listen(PORT, () => console.log(`server on port ${PORT}`))