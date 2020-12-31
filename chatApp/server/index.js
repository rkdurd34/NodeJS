const morgan = require('morgan');
const express = require('express')
const socketio = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser')
// const cors = require('cors');
// const corsOptions = {
//   origin: "http://localhost:3000",
//   credentials: true
// }

const app = express()
// app.use(cors())
// app.use(cors(corsOptions))
const server = http.createServer(app);
const io = socketio(server)

const { addUser, removeUser, getUser, getUserInRoom } = require('./services/user.services')


io.on('connection', (socket) => {
  console.log("we have new connection")
  // 클라이언트에서 emi을 할 때 callback 함수도 같이 보내서 받고, 
  //로직 처리하고 callback으로 이후에 어떻게 할지 설정해주기
  socket.on('join', ({ name, room }, callback) => {
    //둘중에 하나만 넘아옴
    const { error, user } = addUser({ id: socket.id, name, room })

    if (error) return callback(error)
    //admin generated ('message') from "backend" to "frontend"-emit(여기서만 그럼 어쨌든 보내는게 emit)
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` })
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` })
    socket.join(user.room)

    callback()
  })
  //user generated ('message')  on!!!-> 기다리는것 front에서 emit을 기다림 
  // on은항상 콜백을 받음
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id)
    console.log(user)
    //decide which room to send what message after recognize who the message from
    io.to(user.room).emit('message', { user: user.name, text: message })
    callback()
  })
  socket.on('disconnect', () => {
    removeUser(socket.id)
  })
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'))


const chatRoutes = require('./routes/chat.routes')
// app.use('/chat', chatRoutes)


const PORT = 5000
server.listen(PORT, () => console.log(`Server on port ${PORT}`))