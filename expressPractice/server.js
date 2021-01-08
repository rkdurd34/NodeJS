const morgan = require('morgan');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const createError = require('http-errors')

// parse request datsa content type application/x-www-form-rulencoded
// extended:true로 설정해놓을경우 모든 type 다받고
// false로 해놓을경우 string 또는 배열
app.use(bodyParser.urlencoded({ extended: false }));

// parse request data content type application/json
app.use(bodyParser.json());
app.use(morgan('dev'))


// import product routes
const productRoutes = require('./src/routes/product.routes')
app.use('/api/products', productRoutes)

app.use((req, res, next) => {
  next(createError.NotFound('요청하신 페이지를 찾을 수 없습니다.'))
})
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.messaage,
      err
    }
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server on port ${PORT}`))