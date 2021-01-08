const jwt = require('jsonwebtoken')
const db = require('../database')
const createError = require('http-errors')
const { signAccessToken, signRefreshToken } = require('../utils/auth.utils')
require('dotenv').config()
module.exports = {
  verifyAccessToken: async (req, res, next) => {
    try {
      const { accessToken, refreshToken } = req.cookies
      if (!refreshToken && !accessToken) throw createError.Unauthorized('로그인을 새로해주세용 토큰 재발급 해주세용')
      jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY, async (err, decoded) => {
        if (err) {
          req.accessTokenValid = false

        } else {
          req.accessTokenValid = true
        }
        next()
      })
    } catch (err) {
      next(err)
    }
  },
  verifyRefreshToken: async (req, res, next) => {
    try {
      if (req.accessTokenValid === true) {
        console.log('엑세스 토큰 이미 존재 / 인증 완료')
        next()
      } else {
        const refreshToken = req.cookies.refreshToken
        const [result] = await db.query(`select * from tokens where refresh_token = ?`, [refreshToken],
          (err, fields, result) => {
            if (err) { throw createError.InternalServerError('DB문제') }

          })
        if (result.length == 0) {
          throw createError.Unauthorized('프론트에서 토큰 지워줘야대요ㅠㅠ이렇게 날라오면 디비에서는 토큰 없는 상태로 요청이 날라오는거임...')
        }
        const userId = result[0].user_id
        jwt.verify(result[0].refresh_token, process.env.REFRESH_SECRET_KEY, async (err, payload) => {
          if (err) {
            console.log('refresh token 만료돼서 리프레시+엑세스 재발급 / 리프레시 죽음ㅜ')
            const newRefreshToken = await signRefreshToken(userId)
            const newAccessToken = await signAccessToken(userId)
            const insertNewRefreshToken = await db.query('UPDATE tokens SET user_id = ?, refresh_token = ?', [userId, newRefreshToken],
              (err, result) => {
                throw createError.InternalServerError('DB 문제')
              })
            res.cookie('accessToken', newAccessToken, { maxAge: 1000 * 60 * 60 })
            res.cookie('refreshToken', newRefreshToken, { maxAge: 1000 * 60 * 60 * 24 })
            next()
          }
          else {
            console.log('리프레시 토큰 인증 완료후 엑세스토큰 재발급 / 리프레시는 아직 살아있음')
            const newAccessToken = await signAccessToken(userId)
            res.cookie('accessToken', newAccessToken, { maxAge: 1000 * 60 * 60 })
            next()
          }
        })
      }
    } catch (err) {
      next(err)
    }
  },

}