const morgan = require('morgan');
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const ioHandler = require('./socket/chatServer');
const createError = require('http-errors');

const passport = require('passport');
const passportConfig = require('./passport/index');

const app = express();

const server = http.createServer(app);
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));

// const io = socketio(server, { path: '/chatSocket' });
ioHandler.ioHandle(socketio(server, { path: '/chatSocket' }));

app.use(passport.initialize());
passportConfig();

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const authAPIRoutes = require('./routes/authAPI.routes');
app.use('/authAPI', authAPIRoutes);

app.use((req, res, next) => {
  next(createError.NotFound('요청하신 페이지를 찾을 수 없습니다.'));
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500);
  res.send({ err });
  // res.send({
  //   // error: {
  //   //   // status: err.status || 500,
  //   //   // message: err.messaage,
  //   //   err
  //   // }
  // });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server on port ${PORT}`));