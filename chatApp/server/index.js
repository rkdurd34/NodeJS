const morgan = require('morgan');
const express = require('express')
const socketio = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express()
app.use(cors())

const server = http.createServer(app);
const io = socketio(server, {
  path: '/chatSocket',

});

const { addUser, removeUser, getUser, getUserInRoom, getUsersInRoom } = require('./services/user.services')


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
  socket.on('sendMessage', (message, callback) => {

    const user = getUser(socket.id)

    io.to(user.room).emit('message', { user: user.name, text: message })
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })
    callback()

  })
  socket.on('disconnect', () => {
    socket.leave(socket.id)
    const user = removeUser(socket.id)

    if (user) {
      io.to(user.room).emit('message', { user: "admin", text: `${user.name} has left` })

    }

  })
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'))


const chatRoutes = require('./routes/chat.routes')
// app.use('/chat', chatRoutes)


const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server on port ${PORT}`))