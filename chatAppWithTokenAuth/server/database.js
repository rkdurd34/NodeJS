require('dotenv').config();
const mysql = require('mysql2/promise');


const db = mysql.createPool(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.MYSQL_DB,
    connectionLimit: 20,
    multipleStatements: true
  }
);

module.exports = db;
