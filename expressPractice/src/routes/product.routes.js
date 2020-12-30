const express = require('express')
const router = express.Router()

const productController = require('../controllers/product.controller');

router.use(function testMiddleware(req, res, next) {
  // console.log('product라우터에 오면 항상 들리는 프로덕트 미들웨어!')
  next()
})

//주로 어떻게 쓰이는지!? 이거 아니면 밑에꺼 ?
//router.get('/:id', productController.getProductById)

router.route('/')
  .get(productController.getProductList)
  .post(productController.createProduct)

router.route('/:id')
  .get(productController.getProductById)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct)

module.exports = router;
