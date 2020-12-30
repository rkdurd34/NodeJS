const morgan = require('morgan');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const productRoutes = require('./src/routes/product.routes')

// parse request data content type application/x-www-form-rulencoded
// extended:true로 설정해놓을경우 모든 type 다받고
// false로 해놓을경우 string 또는 배열
app.use(bodyParser.urlencoded({ extended: false }));

// parse request data content type application/json
app.use(bodyParser.json());
app.use(morgan('dev'))


// import product routes
app.use('/api/products', productRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`server on port ${PORT}`))