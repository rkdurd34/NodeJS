const morgan = require('morgan');
const express = require('express')
const socketio = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const proxy = require('http-proxy-middleware');

const app = express()

const server = http.createServer(app);
app.use(cors({ credentials: true, origin: true }))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'))
const authRoutes = require('./routes/auth.routes')
app.use('/api/auth', authRoutes)
const io = socketio(server, { path: '/chatSocket' });
const ioHandler = require('./services/chat.services').ioHandle(io)

const chatRoutes = require('./routes/chat.routes')
// app.use('/chat', chatRoutes)



const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server on port ${PORT}`))