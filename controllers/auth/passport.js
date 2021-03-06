const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const Admin = require("./admin");
const Owner = require("./owner");
const User = require("./user");
const jwt = require("./jwt");

function getAuthMode(mode) {
  switch (mode) {
    case "A":
      return Admin;
    case "O":
      return Owner;
    case "U":
      return User;

    default:
      return null;
  }
}

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "ID",
        passwordField: "PW",
        session: true,
        passReqToCallback: false
      },
      (ID, password, done) => {
        if (!/^(.)\|(.)\|/.test(ID)) {
          return done(null, false, { message: "잘못된 접근입니다." });
        }

        const from = ID.split("|")[0];
        const type = ID.split("|")[1];
        const id = ID.split("|")[2];

        if (!/^(O|U|A)$/.test(from)) {
          return done(null, false, { message: "잘못된 접근입니다." });
        }

        var idMode = "ID";
        if (/^([\w0-9])*\@([\w0-9\.])*$/.test(id)) idMode = "EMAIL";

        if (type !== "L") return done(null, false); // Local test (without SNS)

        var Auth = getAuthMode(from);
        if (Auth === null) return done(null, false, { message: "잘못된 접근입니다." });

        return Auth.existUser(id, idMode).then(exist => {
          if (!exist) return done(null, false, { message: "존재하지 않는 계정입니다." });
          return Auth.getUser(idMode, id).then(user => {
            return Auth.comparePassword(idMode, id, password).then(isMatch => {
              if (isMatch) return done(null, jwt.sign(user));
              return done(null, false, { message: "비밀번호가 틀렸습니다" });
            });
          });
        });
      }
    )
  );
};
