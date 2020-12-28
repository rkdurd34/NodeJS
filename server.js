const http =  require('http')
const { getProducts, getProduct, createProduct } = require('./controllers/productController')

const server = http.createServer(function(req,res){
  if(req.url === '/api/products' && req.method === "GET"){
    getProducts(req, res)
    //math param 받아오는 방법
  }else if ( req.url.match(/\/api\/products\/([0-9]+)/) && req.method === "GET" ){
    const id = req.url.split('/')[3]
    getProduct(req, res, id)
  }else if(req.url === "/api/products" && req.method === 'POST') {
    createProduct(req, res)
  }
  else {
    // 404 page not found 처리 
    res.writeHead(404,{'Content-Type': 'text/html'})
    res.end(JSON.stringify({message: "Route Not Founnd "}))
    
  }
})

const PORT = process.env.PORT || 3000


server.listen(PORT, () => console.log(`server on port ${PORT}`))