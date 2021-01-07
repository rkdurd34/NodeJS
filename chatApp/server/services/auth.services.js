
const jwt = require('jsonwebtoken')
const db = require('../database')
require('dotenv').config()
module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {

        iss: 'kang',
        aud: userId
      }
      const option = {
        expiresIn: 5,
      }
      const secret = process.env.ACCESS_SECRET_KEY
      jwt.sign(payload, secret, option, (err, token) => {
        if (err) {
          return reject(createError.InternalServerError())
        }
        resolve(token)
      })
    })
  },
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {

        issuer: 'kang',
        audience: userId
      }
      const option = {
        expiresIn: 10,
      }
      const secret = process.env.REFRESH_SECRET_KEY
      jwt.sign(payload, secret, option, (err, token) => {
        if (err) {
          return reject(createError.InternalServerError())
        }
        return resolve(token)
      })
    })
  },
}