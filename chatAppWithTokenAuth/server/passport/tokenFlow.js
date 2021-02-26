const passport = require("passport");
const db = require('../database');
require('dotenv').config();

module.exports = {
  accessTokenAuthenticate: (req, res, next) =>
    passport.authenticate('access', { session: false }, (err, userId, info) => {
      if (userId) next();
      
      // req.login(user, { session: false });
      return next();
    }
    )(req, res, next),


  refreshTokenAuthenticate: (req, res, next) => {
    passport.authenticate('refresh', { session: false }, (err, refreshToken, info) => {
      if (req.accessToken) return next();
      if (!refreshToken) next({ status: 401, message: 'refresh,access 모두 만료 다시 로그인 필요' });

      const [result] = db.query(`
        SELECT *
        FROM tokens
        WHERE 
        refresh_token = ? 
      `, [refreshToken]);
      if (!result[0]) next({ status: 401, message: '비정상적인 접근' });


    })(req, res, next);
  }
};