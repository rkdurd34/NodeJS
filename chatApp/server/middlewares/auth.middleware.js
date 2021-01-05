const jwt = require('jsonwebtoken')
const createError = require('http-errors')
require('dotenv').config()
module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get('authorization') || req.cookies.accessToken
    // req.headers['authorization] 으로 가져오는 방법도 있음
    token = req.cookies.accessToken
    if (token) {
      // token = token.slice(7)
      // token = token.split(' ')[1]
      jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
        if (err) {
          // if (err.name === 'JsonWebTokenError') {
          //   return next(createError.Unauthorized())
          //   //err.message 는 invalid signature라고 나옴
          // } else {
          //   return next(createError.Unauthorized(err.message))
          // }
          const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message
          return next(createError.Unauthorized(message))
          // res.json({
          //   success: 0,
          //   message: "Invalid Token"
          // })
        } else {
          
          next()
        }
      })
    } else {
      res.json({
        success: 0,
        message: 'Access Denied: Unauthorized user'
      })
    }
  },
  signAccessToken: (userEmail) => {
    return new Promise((resolve, reject) => {
      const payload = {
      }
      const secret = process.env.ACCESS_SECRET_KEY
      const options = {
        expiresIn: "1d",
        issuer: 'kang',
        audience: userEmail
      }
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          // return reject(err)
          return reject(createError.InternalServerError())
        }
        resolve(token)
      })
    })
  },
  signRefreshToken: (userEmail) => {
    return new Promise((resolve, reject) => {
      const payload = {

      }
      const secret = process.env.REFRESH_SECRET_KEY
      const options = {
        expiresIn: "1y",
        issuer: 'kang',
        audience: userEmail
      }
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          // return reject(err)
          return reject(createError.InternalServerError())
        }
        resolve(token)
      })
    })
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, payload) => {
        if (err) return reject(createError.Unauthorized())
        const userEmail = payload.aud

        resolve(userEmail)
      })
    })
  }

}