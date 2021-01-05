const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const { signAccessToken, signRefreshToken } = require('../middlewares/auth.middleware')
const { getUserByUserEmail, create } = require('../services/auth.services')

const createError = require('http-errors')
require('dotenv').config()

module.exports = {
  login: async (req, res) => {

    const body = req.body
    getUserByUserEmail(body.email, async (err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          success: 0,
          message: "Database Connection error"
        });
      }
      if (!results) {
        return res.status(409).json({
          success: 0,
          data: 'invalid email or password'
        })
      }

      const result = compareSync(body.password, results.password.toString('utf8'))
      if (result) {
        const accessToken = await signAccessToken(req.body.email)
        const refreshToken = await signRefreshToken(req.body.email)
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 60 * 60 * 24 * 365 })
        res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 60 * 60 * 24 * 365 })
        return res.json({
          success: 1,
          message: "login successfully",
          accessToken,
          refreshToken
        });
      } else {
        return res.status(409).json({
          success: 0,
          data: "invalid email or password"
        })
      }
    })
  },
  register: async (req, res, next) => {

    try {
      const body = req.body;
      const salt = genSaltSync(10);
      // if (!body.email || !body.password) {
      //   throw createError.BadRequest()
      // }
      body.password = hashSync(body.password, salt)
      create(body, async (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database Connection error"
          });
        }
        const accessToken = await signAccessToken(req.body.email)
        const refreshToken = await signRefreshToken(req.body.email)

        return res.status(200).json({
          success: 1,
          message: 'created successfully',
          accessToken,
          refreshToken
        })
      })

      // 원래 이메일이 디비에 있는지 확인 409 에러
      // 이메일 형식두 확인 해야댐 형식 잘못보태면 422 에러

    } catch (err) {
      next(err)
    }
  },
  sendNewAccessToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) throw createError.BadRequest()
      const userEmail = await verifyRefreshToken(refreshToken)

      const newAccessToken = await signAccessToken(userEmail)
      const newRefreshToken = await signRefreshToken(userEmail)
      res.send({ newAccessToken, newRefreshToken })
    } catch (err) {

    }
  },
  test: (req, res) => {
    try {
      const token = req.cookies
      console.log(token.accessToken, token.refreshToken)
      res.status(200).send({
        token,
      })
    } catch (err) {
      console.log(err)
    }
  }

}