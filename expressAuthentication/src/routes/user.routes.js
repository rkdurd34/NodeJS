const express = require('express')
const router = express.Router()

const userController = require('../controllers/user.controller');

router.use(function testMiddleware(req, res, next) {
  next()
})
router.route('/')
  .post(userController.createUser)

module.exports = router;
