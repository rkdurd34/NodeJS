const express = require('express');
const router = express.Router();
const passport = require("passport");
const authAPIController = require('../controllers/authAPI.controller');
const createError = require('http-errors');
const { verifyAccessToken, verifyRefreshToken, testMiddleware } = require('../middlewares/auth.middleware');

// router.use(
//   verifyAccessToken,
//   verifyRefreshToken
// )
router.use(passport.authenticate("jwt", { session: false }, (passportError, user, info) => {
  console.log(user, info, '여기확인');
  if (user) next();
  throw createError.Unauthorized('토큰 파규ㅣ');
})
);

router.route('')
  .get(authAPIController.test);


module.exports = router;
