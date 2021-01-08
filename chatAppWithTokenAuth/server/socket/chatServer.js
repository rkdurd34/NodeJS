
const { addUser, removeUser, getUser, getUserInRoom, getUsersInRoom } = require('./user.services')
const cookie = require('cookie');
const socketioJwt = require('socketio-jwt')
const jwt = require('jsonwebtoken');
const { verifyRefreshToken, signAccessToken, signRefreshToken } = require('../middlewares/auth.middleware');
require('dotenv').config()

module.exports = {
  ioHandle: (io) => {
    io.on('connection', (socket) => {

      console.log(`we have new connection ${socket.id}`)
      
      socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room })
        if (error) return callback(error)
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` })
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` })
        socket.join(user.room)
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })
        callback()
      })

      socket.on('sendMessage', async ({ message, cookies }, callback) => {
        // const { accessToken, refreshToken } = cookie.parse(cookies)
        // console.log(accessToken, refreshToken)
        // let { accessToken, refreshToken } = cookie.parse(socket.request.headers.cookies
        // if (!accessToken) {
        //   try {
        //     const userEmail = await verifyRefreshToken(refreshToken)
        //     if (!userEmail) {
        //       console.log('invalid user')
        //       throw new Error('invalid refresh Token ')
        //     }
        //     const newAccessToken = await signAccessToken(userEmail)
        //     const newRefreshToken = await signRefreshToken(userEmail)
        //     socket.emit('newTokens', { accessToken: newAccessToken, refreshToken: newRefreshToken })
        //   } catch (err) {
        //     console.log(err)
        //   }
        // }
        // decodeJWT = await jwt.verify(parsed_cookie, process.env.ACCESS_SECRET_KEY)
        // console.log(decodeJWT)
        const user = getUser(socket.id)
        io.to(user.room).emit('message', { user: user.name, text: message })
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })
        callback()
      })

      socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
          io.to(user.room).emit('message', { user: "admin", text: `${user.name} has left` })
        }
      })
    })
  }
}