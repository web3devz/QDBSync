
var mysql      = require('mysql');


// http://localhost:3000/api/data?table=planes
export default function handler(req, res) {
    // var
    const table_name =req.query.table
    const db = req.query.db
    const host = req.query.host
    const user = req.query.user
    const pwd = req.query.pwd
    
    // connection
    var connection = mysql.createConnection({
      host     : host,
      user     : user,
      password : pwd,
      database : db
    });
  
    // then, connect()
    connection.connect(function(err) {
      if (err) {
        return console.error('error: ' + err.message);
      }
      // console.log('MySQL Connection Successful.');
    });
  

  const user_query = 'SELECT * FROM '+table_name;
  
  connection.query(user_query, function (error, result, fields){
      if (error) throw error;

      res.status(200).json({ data: result})
  })
  connection.end()
}