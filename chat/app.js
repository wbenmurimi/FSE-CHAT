var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql')
var port = 3700;
var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

var io = require('socket.io').listen(app.listen(port));
// var server = require('http').createServer(app); 
// var io = require('socket.io')(server);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({secret:'benson'}));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', routes.home);
app.get('/login', routes.login);
app.get('/chatroom', routes.chat);
app.get('/logout', routes.logout);
app.post('/register', routes.addUser);
app.post('/chat-message', routes.sendMessage);
app.post('/user-login',  function(req, res, next) {
	
	req.session.userName = req.body.name;
	if ( req.session.userName) {
		console.log(req.session.userName+' logged in');
		res.render('/login', {  u_session : req.session.userName });

	}
	else{
		console.log('Not logged in. Please joinn the chatroom');
		res.render('/login', {  u_session : 'Not logged in. Please join the chatroom'});
	}
	
});


io.sockets.on('connection', function (socket) {
    socket.emit('message', 'You are connected!');
    socket.broadcast.emit('message', 'Another client has just connected!');
    console.log('Another client has just connected!');
    socket.on('send', function (data) {
    	io.sockets.emit('message', data);
        console.log('A client is speaking to me! They\'re saying: ' + data.message);
    }); 
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// app.listen(port);
// console.log("Listening on port " + port);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
