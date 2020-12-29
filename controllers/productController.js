const Product = require('../models/productModels')
const { getPostData } = require('../utils')

// @desc Gets All products
// @route GET /api/products
async function getProducts(req, res) {
  try {
    const products = await Product.findAll()

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(products))
  } catch (error) {
    console.log(error)
  }
};

// @desc Gets Single products
// @route GET /api/products/:id
async function getProduct(req, res, id) {
  try {
    const products = await Product.findById(id)

    if (!products) {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: "Product Not Found " }))
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(products))
    }

  } catch (error) {
    console.log(error)
  }
};


// @desc Create a Product
// @route POST /api/products
async function createProduct(req, res) {
  try {
    console.log(req)

    const body = await getPostData(req);
    console.log(body)
    const { title, description, price } = JSON.parse(body)

    const product = {
      title,
      description,
      price
    }

    const newProduct = await Product.create(product)
    res.writeHead(201, { 'Content-Type': 'application/json' })
    console.log(res)
    return res.end(JSON.stringify(newProduct))


  } catch (error) {
    console.log(error)
  }
};

// @desc Update a Product
// @route PUT  /api/products/:id
async function updateProduct(req, res, id) {
  try {
    const product = await Product.findById(id);
    if (!product) {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: "Product Not Found " }))
    } else {
      const body = await getPostData(req);

      const { title, description, price } = JSON.parse(body)

      const productData = {
        title: title || product.title,
        description: description || product.description,
        price: price || product.price
      }

      const updProduct = await Product.update(id, productData)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify(updProduct))

    }

  } catch (error) {
    console.log(error)
  }
};

async function deleteProduct(req, res, id) {
  try {
    const product = await Product.findById(id);

    if (!product) {
      res.writeHead(404, { "Content-Type": "application/json" })
      res.end(JSON.stringify({ message: "Product Not Found" }))
    }
    else {
      const deletedProduct = await Product.remove(id, product)
      res.writeHead(200, { "Content-Type": 'application/json' })
      return res.end(JSON.stringify(deletedProduct))
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
}