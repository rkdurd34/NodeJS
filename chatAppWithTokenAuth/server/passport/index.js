
const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const passport = require("passport");
const { ExtractJwt, Strategy: JWTStrategy } = require('passport-jwt');
const LocalStrategy = require("passport-local").Strategy;
const db = require('../database');
require('dotenv').config();

const LocalConfig = {
  usernameField: 'email',
  passwordField: 'password'
};
const localVerify = async (email, password, done) => {
  try {
    const [user] = await db.query(`SELECT * FROM registeration WHERE email = ?`, [email]);

    if (!user[0]) {
      return done(null, false, { reason: '존재하지 않는 사용자입니다.' });
    }

    const isSamePassword = await compareSync(password, user[0].password.toString('utf8'));

    if (!isSamePassword)
      return done(null, false, { reason: '비밀번호가 맞지 않습니다.' });

    done(null, user[0], { reason: '인증완료' });
  } catch (e) {
    done(e);
  }
};

const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_SECRET_KEY,
};
const JWTVerify = async (jwtPayload, done) => {
  try {
    // payload의 id값으로 유저의 데이터 조회
    console.log(jwtPayload, '냠냠냠');
    // jwt.verify(token, config.jwt.privateKey, { algorithm: config.jwt.algorithm, issuer: config.jwt.issuer })
    const [user] = await db.query(`SELECT * FROM registeration WHERE id = ? `, [jwtPayload.id]);
    // 유저 데이터가 있다면 유저 데이터 객체 전송
    // console.log(user);
    if (user) {
      done(null, user);
      return;
    }
    // 유저 데이터가 없을 경우 에러 표시
    done(null, false, { reason: '올바르지 않은 인증정보 입니다.' });
  } catch (err) {
    done(err);
  }
};

const GoogleConfig = {
  clientID: 'GOOGLE_CLIENT_ID',
  clientSecret: 'GOOGLE_CLIENT_SECRET',
  callbackURL: "http://www.example.com/auth/google/callback"
};
const GoggleVerify = async (accessToken, refreshToken, profile, done) => {

};

module.exports = () => {
  passport.use('local', new LocalStrategy(LocalConfig, localVerify));
  passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify));
};