const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

router.route('/login')
  .post(authController.login);
router.route('/logout')
  .delete(authController.logout);

router.route('/register')
  .post(authController.register);

router.route('/login/passport')
  .post(authController.loginWithPassport);


module.exports = router;
