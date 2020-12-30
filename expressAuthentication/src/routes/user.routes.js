const express = require('express')
const router = express.Router()

const userController = require('../controllers/user.controller');

router.use(function testMiddleware(req, res, next) {
  next()
})

module.exports = router;
