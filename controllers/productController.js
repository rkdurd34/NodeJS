 const Product = require('../models/productModels')

 // @desc Gets All products
// @route GET /api/products
 async function getProducts(req,res){
   try{
    const products = await Product.findAll()

    res.writeHead(200,{'Content-Type': 'application/json'})
    res.end(JSON.stringify(products))
   }catch(error){
     console.log(error)
   }
 };

// @desc Gets Single products
// @route GET /api/products
async function getProduct(req,res, id){
  try{
   const products = await Product.findById(id)
    if (!products){
      res.writeHead(404, {'Content-Type': 'application/json'})
      res.end(JSON.stringify({message: "Product Not Found "}))
    }else{
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.end(JSON.stringify(products))
    }
   
  }catch(error){
    console.log(error)
  }
};


// @desc Create a Product
// @route POST /api/products
async function createProduct(req,res){
  try{
    const product = {
      title: "Test  Product",
      description: "this is my product",
      price: 100
    }
    const newProduct = await Product.create(product)
    res.writeHead(201, {'Content-Type' : 'application/json'})
    return res.end(JSON.stringify(newProduct))
  }catch(error){
    console.log(error)
  }
};
 module.exports = {
   getProducts,
   getProduct,
   createProduct
 }