const mysql = require('mysql2/promise')
const config = require('./config/db.config.js')

const db = mysql.createPool(config)
module.exports = db