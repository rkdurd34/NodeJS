const { createPool } = require('mysql2/promise');
const db = require('../../database')
const createError = require('http-errors');
const { create } = require('../../../expressAuthentication/src/service/user.service');

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
test = async (req, res, next) => {
  const body = req.body
  const con = await db.getConnection(async conn => conn)
  try {
    //테이블이 다른 경우에 각각 쿼리문이 모두 실행 되어야 하고 하나라도 실행 안되면 다 밀어버려야함
    //중간에 롤백 하면 어쨌든 테이블에 들어갔다 나오는거니까 어쨌든 AI 되어있는 ID는 증가함!!(유의사항)
    con.beginTransaction()
    await con.query(`insert into test_table_1 (test) values(?)`, body.test_1)
    console.log('첫번째 실행 완료')
    await con.query(`insert into test_table_2 (test) values(?)`, body.test_2)
    console.log('두번째 실행 완료')
    await con.query(`insert into test_table_3 (test) values(?)`, body.test_3)
    console.log('세번째 실행 완료')
    con.commit()


    const [result1] = await db.query(`select * from test_table_1`)
    const [result2] = await db.query(`select * from test_table_2`)
    const [result3] = await db.query(`select * from test_table_3`)
    res.status(200).json({
      message: "DB 테스트 잘해냈습니다.",
      test_table_1: result1[0],
      test_table_2: result2[0],
      test_table_3: result3[0],
    })
  } catch (err) {
    con.rollback()

    next(err)
  } finally {
    con.release()
  }
};
// 204는 뒤에 메세지나 개체 없고 200은 개체가 뒤에 있음
module.exports = {
  getProductList,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  test
}