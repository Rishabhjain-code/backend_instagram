const mysql = require("mysql");
// const { HOST, USER, PASSWORD, DB_NAME } = require("../config/secrets");
const HOST = process.env.HOST,
  USER = process.env.USER,
  PASSWORD = process.env.PASSWORD,
  DB_NAME = process.env.DB_NAME;

//database connection

// breaks on no use

// const connection = mysql.createConnection({
//   host: HOST,
//   user: USER,
//   password: PASSWORD,
//   database: DB_NAME,
// });
// connection.connect();

const connection = mysql.createPool({
  connectionLimit: 200,
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DB_NAME,
});

connection.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
  if (error) throw error;
  console.log("The solution is: ", results[0].solution);
});

// console.log("DB Connected !!");
module.exports = connection;
