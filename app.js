const express = require('express');
const path = require('path');
const session = require('express-session'); // 세션 설정
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport'); // 여기와

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f88', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

require('dotenv').config();
require('./controllers/auth/passport')();

// CORS
const whitelist = [process.env.ADMIN_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) callback(null, true)
    else callback(new Error('Not allowed by CORS'))
  }
}
app.use(cors(corsOptions));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

module.exports = app;
