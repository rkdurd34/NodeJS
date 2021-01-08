const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth.controller');

router.route('/test')
  .get(authController.test)
router.route('/login')
  .post(authController.login)
router.route('/logout')
  .delete(authController.logout)
router.route('/register')
  .post(authController.register)


module.exports = router;
