// var express = require('express');
// var router = express.Router();
// var db = require('../db.js')

var mysql = require('mysql');


//connect to DB
var conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'chat_room'
});

conn.connect(function(err) {
	if (err) throw err
		console.log('Connected to DB ....')
});


/* GET home page. */
exports.home= function(req, res, next) {
	res.render('pages/index', { title: 'Cool FSE Chat Application' });
};

exports.login= function(req, res, next) {
	res.render('pages/login', { title: 'Cool FSE Chat Application', u_session : '' });
};

exports.logout =function(req, res, next) {

	if ( req.session.userName) {
		req.session.destroy();
		console.log(' logged out');
		res.render('pages/logout', { u_session : 'You left the chat. Login to join the chatroom'});
	}		
};


exports.chat= function(req, res, next) {
	my_ses="Kindly join the chat";
	if (req.session.userName) {
		my_ses= req.session.userName;
	}
	
	conn.query('SELECT * FROM messages', function(err, rows){

		res.render('pages/chatroom', { title: 'Cool Chat Application', messages : rows,u_session : my_ses });
	});
}

exports.addUser= function(req, res, next) {

	conn.query('INSERT INTO users SET ?', req.body, function(err, result){

		if (err) throw err;

		res.send('User added to database successfully ID: ' + result.insertId);
	});
}


exports.sendMessage= function(req, res, next) {

	if ( req.session.userName) {

	conn.query('INSERT INTO messages SET ?', req.body, function(err, result){

		if (err) throw err;

		res.send('Message sent ');
	});
}
}


exports.userLogin= function(req, res, next) {
	
   req.session.userName = req.body.name;

   res.render('pages/chatroom', {  u_session : req.session.userName });
  // res.redirect('/');
	
}






// module.exports = router;
