const express = require('express');
const router = express.Router();
const passport = require("passport");
const authAPIController = require('../controllers/authAPI.controller');
const { verifyAccessToken, verifyRefreshToken, testMiddleware } = require('../middlewares/auth.middleware');
const { accessTokenAuthenticate, refreshTokenAuthenticate } = require('../passport/tokenFlow');

// router.use(
//   verifyAccessToken,
//   verifyRefreshToken
// )
router.use(
  accessTokenAuthenticate
  //  refreshTokenAuthenticate
);


router.route('')
  .get(authAPIController.test);


module.exports = router;
