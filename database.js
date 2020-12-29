
const mysql = require('mysql2')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: "db_test"
});

const promisePool = pool.promise()
// async function test() {
//   const result = await promisePool.query('select * from product')
//   await pool.end()
// }
// test()
module.exports = promisePool