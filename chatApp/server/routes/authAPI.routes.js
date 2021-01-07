const express = require('express')
const router = express.Router()

const authAPIController = require('../controllers/authAPI.controller');
const { verifyAccessToken, verifyRefreshToken, testMiddleware } = require('../middlewares/auth.middleware')

router.use(
  verifyAccessToken,
  verifyRefreshToken
)

router.route('')
  .get(authAPIController.test)


module.exports = router;
