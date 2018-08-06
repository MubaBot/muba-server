const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Admin = require('./admin');

module.exports = () => {
  passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
    done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
  });

  passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
    done(null, user); // 여기의 user가 req.user가 됨
  });

  passport.use(new LocalStrategy({ // local 전략을 세움
    usernameField: 'ID',
    passwordField: 'PW',
    session: true,
    passReqToCallback: false,
  }, (ID, password, done) => {
    if (!/^(.)\|/.match(ID)) {
      return done(null, false, { message: '잘못된 접근입니다.' });
    }

    const type = ID.split('|')[0];
    const id = ID.split('|')[1];

    if (!/^(O|U|A)$/.match(type)) {
      return done(null, false, { message: '잘못된 접근입니다.' });
    }

    var idMode = true;
    if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.match(id)) {
      idMode = false;
    }

    switch (type) {
      case 'A': // Admin
        return Admin.existUser(id, idMode).then(user => {
          console.log(user);
          return Admin.comparePassword(id, password, (passError, isMatch) => {
            if (isMatch) return done(null, user);
            return done(null, false, { message: '비밀번호가 틀렸습니다' });
          });
        });
    };
  }));
};