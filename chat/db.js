var mysql = require('mysql');




//connect to DB
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chat_room'
});

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
});