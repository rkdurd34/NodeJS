
const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: "db_test"
});
// mysql2/promise를 사용할경우 이거는 필요없음!
// const promisePool = pool.promise()

module.exports = pool

