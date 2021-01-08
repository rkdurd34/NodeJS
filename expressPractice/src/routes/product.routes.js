const express = require('express')
const router = express.Router()

const productController = require('../controllers/product.controller');

router.route('/')
  .get(productController.getProductList)
  .post(productController.createProduct)

router.route('/:id')
  .get(productController.getProductById)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct)
router.route('/test')
  .post(productController.test)
module.exports = router;
