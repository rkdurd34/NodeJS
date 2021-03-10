const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const { signAccessToken, signRefreshToken } = require('../utils/auth.utils');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const db = require('../database');
const passport = require('passport');

require('dotenv').config();

module.exports = {
  login: async (req, res, next) => {
    try {
      const body = req.body;
      const [result] = await db.query(`select * from users where email = ?`, [body.email]);
      if (result[0].length == 0) {
        throw createError.Unauthorized('이메일이 없습니당ㅠ');
      }
      const userId = result[0].id;
      const accountValid = compareSync(body.password, result[0].password.toString('utf8'));
      if (accountValid) {
        const accessToken = await signAccessToken(userId);
        const refreshToken = await signRefreshToken(userId);
        const [userHasRefreshToken] = await db.query(`select * from tokens where user_id = ?`, [userId]);
        if (!userHasRefreshToken[0]) {
          await db.query(`INSERT into tokens (refresh_token, user_id) values (?,?)`, [refreshToken, userId]);
        } else {
          await db.query(`UPDATE tokens SET refresh_token = ?, user_id = ? where user_id`, [refreshToken, userId, userHasRefreshToken[0].user_id]);
        }
        res.cookie('refreshToken', refreshToken, { httpOnly: false, maxAge: 1000 * 60 * 60 * 24 });
        res.cookie('accessToken', accessToken, { httpOnly: false, maxAge: 1000 * 60 * 60 });
        return res.json({
          success: 1,
          message: "login successfully",
          accessToken,
          refreshToken
        });
      } else {
        throw createError.Unauthorized('이메일과 비밀번호르 확인해주세용');
      }
    } catch (err) {
      next(err);
    }
  },

  register: async (req, res, next) => {
    try {
      const data = req.body;
      const salt = genSaltSync(10);
      if (!data.email || !data.password || !data.firstName || !data.lastName || !data.gender) {
        throw createError.BadRequest("회원가입 형식을 지켜주세요");
      }
      data.password = hashSync(data.password, salt);
      const result = await db.query(
        `INSERT INTO users (first_name, last_name, gender, email, password)
          VALUES (?,?,?,?,?)`,
        [
          data.firstName,
          data.lastName,
          data.gender,
          data.email,
          data.password
        ],
        (err, result) => {
          if (err) {
            throw createError.Unauthorized('DB에러');
          }
        });

      return res.status(200).json({
        message: 'created successfully',
      });
      // 원래 이메일이 디비에 있는지 확인 409 에러
      // 이메일 형식두 확인 해야댐 형식 잘못보태면 422 에러
    } catch (err) {
      next(err);
    }
  },
  logout: async (req, res, next) => {
    try {
      const { accesstoken, refreshToken } = req.cookies;
      await db.query(`delete from tokens where refresh_token = ?`, [refreshToken],
        (err, results) => {
          return createError.Conflict('DB에 리프레시 토큰이 없어유');
        });
      res.status(200).send(
        { message: 'deleted successfuly' }
      );
    } catch (err) {
      next(err);
    }
  },
  loginWithPassport: async (req, res, next) => {
    try {
      passport.authenticate('local', { session: false }, (passportError, user, info) => {
        if (passportError || !user) return next({ status: 401, message: info.reason });

        //login()은 굳이 req에다가 필요한 객체르 넣을 필요 없이
        // passport verify에서 디비 긁은 정보(파라미터 user)를 그대로 객체형태로 req에 저장해줌
        const accessToken = jwt.sign(
          { id: user.id },
          process.env.ACCESS_SECRET_KEY,
          { expiresIn: "3m" }
        );
        const refreshToken = jwt.sign(
          {},
          process.env.REFRESH_SECRET_KEY,
          { expiresIn: "30m" }
        );
        res.cookie('accessToken', accessToken, { maxAge: 1000 * 60 * 60 });
        res.cookie('refreshToken', refreshToken, { maxAge: 1000 * 60 * 60 });
        res.json({ token: accessToken });

        // req.login(user, { session: false }, (loginError) => {
        //   if (loginError) {
        //     // return res.json(loginError);
        //     throw createError.Unauthorized('로그인 에러');
        //   }
        //   const token = jwt.sign(
        //     { id: user.id },
        //     process.env.ACCESS_SECRET_KEY,
        //     { expiresIn: "30s" }
        //   );
        //   console.log('user확인', req.user);
        //   res.cookie('accessToken', token, { maxAge: 1000 * 60 * 60 });
        //   res.json({ token });
        // });

      })(req, res);
    } catch (err) {
      next(err);
    }
  }
};