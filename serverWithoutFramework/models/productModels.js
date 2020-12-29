const products = require("../data/products")
const db = require('../database')
const { v4: uuidv4 } = require('uuid')
const { writeDataToFile } = require('../utils')


async function findAll() {
  const [result] = await db.query('select * from products')
  return result
}

async function findById(id) {
  const [result] = await db.query('select * from `products` where id = ?', [id])
  return result
}

async function create(product) {
  const { name, description, price } = product
  const [result] = await db.query('INSERT INTO `PRODUCTS` (name, description, price) VALUES (?,?,?)', [name, description, price], function (err, results, fields) {
    if (err) {
      throw err;
    } else {
      console.log(results) // SQL 쿼리를 통해 추출된 데이터 배열, 배열 안에는 JSON의 형태로 필드는 키, 데이터는 값의 형태로 담겨 있다.  
      console.log(fields) //추출된 데이터의 필드명 및 기타 데이터가 담겨 있다. 
    }
  })
  return result
}

async function update(id, product) {
  const { name, description, price } = product
  const [result] = await db.query('UPDATE `products` SET name = ?, description = ?, price = ? WHERE id = ?', [name, description, price, id])
  return result
}

async function remove(id, product) {
  const [result] = await db.query('DELETE FROM `products` where id = ?', [id])
  return result
}


module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
}