import mysql from 'mysql';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123123',
  database: 'opentutorials',
});
db.connect();

export default db;
