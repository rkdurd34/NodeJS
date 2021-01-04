const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth.controller');
const { checkToken } = require('../middlewares/auth.middleware')

router.route('/login')
  .post(authController.login)
router.route('/logout')
  .post()
router.route('/refresh-token')
  .post(authController.sendNewAccessToken)
router.route('/register')
  .post(authController.register)


module.exports = router;
