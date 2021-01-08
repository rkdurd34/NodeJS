const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const { signAccessToken, signRefreshToken } = require('../utils/auth.utils')

const createError = require('http-errors');
const db = require('../database');
require('dotenv').config()

module.exports = {
  login: async (req, res, next) => {
    try {
      const body = req.body

      const [result] = await db.query(`select * from registeration where email = ?`, [body.email])
      const userId = result[0].id
      const accountValid = compareSync(body.password, result[0].password.toString('utf8'))

      if (accountValid) {
        const accessToken = await signAccessToken(userId)
        const refreshToken = await signRefreshToken(userId)

        const [userHasRefreshToken] = await db.query(`select * from tokens where user_id = ?`, [userId])

        if (!userHasRefreshToken[0]) {
          await db.query(`INSERT into tokens (refresh_token, user_id) values (?,?)`, [refreshToken, userId])

        } else {
          await db.query(`UPDATE tokens SET refresh_token = ?, user_id = ? where user_id`, [refreshToken, userId, userHasRefreshToken[0].user_id])
        }

        res.cookie('refreshToken', refreshToken, { httpOnly: false, maxAge: 1000 * 60 * 60 * 24 })
        res.cookie('accessToken', accessToken, { httpOnly: false, maxAge: 1000 * 60 * 60 })
        return res.json({
          success: 1,
          message: "login successfully",
          accessToken,
          refreshToken
        })
      } else {
        throw createError.Unauthorized('이메일과 비밀번호르 확인해주세용')
      }
    } catch (err) {
      next(err)
    }
  },

  register: async (req, res, next) => {
    try {
      const data = req.body;

      const salt = genSaltSync(10);
      if (!data.email || !data.password || !data.firstName || !data.lastName || !data.number || !data.gender) {
        throw createError.BadRequest("회원가입 형식을 지켜주세요")
      }
      data.password = hashSync(data.password, salt)

      const result = await db.query(
        `INSERT INTO REGISTERATION (FIRSTNAME, LASTNAME, GENDER, EMAIL, PASSWORD, NUMBER)
          VALUES (?,?,?,?,?,?)`,
        [
          data.firstName,
          data.lastName,
          data.gender,
          data.email,
          data.password,
          data.number
        ],
        (err, result) => {
          if (err) {
            throw createError.Unauthorized('DB에러')
          }
        })

      return res.status(200).json({
        message: 'created successfully',
      })
      // 원래 이메일이 디비에 있는지 확인 409 에러
      // 이메일 형식두 확인 해야댐 형식 잘못보태면 422 에러
    } catch (err) {
      next(err)
    }
  },
  logout: async (req, res, next) => {
    try {
      const { accesstoken, refreshToken } = req.cookies
      await db.query(`delete from tokens where refresh_token = ?`, [refreshToken],
        (err, results) => {
          return createError.Conflict('DB에 리프레시 토큰이 없어유')
        })
      res.status(200).send(
        { message: 'deleted successfuly' }
      )
    } catch (err) {
      next(err)
    }
  },
  test: (req, res) => {
    try {
      const token = req.cookies
      // console.log(token.accessToken, token.refreshToken)
      res.status(200).send({
        message: "뇸!"
      })
    } catch (err) {
      console.log(err)
    }
  }

}