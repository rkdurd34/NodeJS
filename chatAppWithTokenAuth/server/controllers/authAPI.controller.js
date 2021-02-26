const createError = require('http-errors');
const db = require('../database');
require('dotenv').config();

module.exports = {
  test: (req, res, next) => {
    try {
      console.log(req.user);
      console.log('인증된 사용자만 사용 가능한 API 접속 성공!');
      res.status(200).send({
        message: '엑세스 토큰 보유한 사용자만 리스폰스 받을 수 있는 API',
        username: req.user
      });
    } catch (err) {
      next(err);
    }
  }

};