
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'nive@0605',
  database: 'costanalyzer'
});

module.exports = db;
