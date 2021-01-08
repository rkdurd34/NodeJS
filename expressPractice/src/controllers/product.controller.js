const db = require('../../database')

// @desc Gets All products
// @route GET /api/products
getProductList = async (req, res) => {
  // console.log(req)
  try {
    const [result] = await db.query('select * from products');
    res.status(200).json(result)
  } catch {
    next(err)
  }
}
// @desc Gets specific product
// @route GET /api/products/:id
getProductById = async (req, res) => {
  const id = req.params.id
  try {
    const [result] = await db.query('select * from products where id = ?', id)
    res.status(200).send(result)
  } catch (err) {
    next(err)
  }
}
// @desc create product
// @route POST /api/products
createProduct = async (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({ message: 'some fields are missing' })
  } else {
    try {
      const newProductData = req.body
      const [result] = await db.query('insert into products set ?', newProductData)
      res.sendStatus(201)
    } catch (err) {
      next(err)
    }
  }
};
// @desc update specific product
// @route PUT /api/products/:id
updateProduct = async (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({ message: 'some fields are missing' })
  } else {
    try {
      const id = req.params.id
      const { name, description, price } = req.body

      // let [product] = await db.query('select * from products where id = ?', id)
      // const productData = [
      //   name || product[0].name,
      //   product[0].description || description,
      //   price || product[0].price,
      //   id
      // ]

      const [result] = await db.query('UPDATE `products` SET name = ?, description = ?, price = ? WHERE id = ?', [name, description, price, id])
      res.sendStatus(204)
    } catch (err) {
      next(err)
    }
  }
};
// @desc delete specific product
// @route DELETE /api/products/:id
deleteProduct = async (req, res) => {
  const id = req.params.id
  try {
    const newProductData = req.body
    const [result] = await db.query('delete from products where id = ?', id)
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
};
// 204는 뒤에 메세지나 개체 없고 200은 개체가 뒤에 있음
module.exports = {
  getProductList,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}