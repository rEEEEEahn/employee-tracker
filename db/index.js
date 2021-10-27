// module.exports = require('mysql2').createConnection('mysql://root:Data123Password!%40#@localhost:3306/employee_db')
module.exports = require('mysql2').createConnection({
  host: 'localhost',
  user: 'root',
  database: 'employee_db',
  password: 'password'
})