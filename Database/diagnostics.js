// database/diagnostics.js

const oracledb = require('oracledb');

const dbConfig = {
    user: 'c##bookstore',
    password: 'bookstore',
    connectString: 'localhost:1521/ORCL'
  };

async function connect() {
  try {
    return await oracledb.getConnection(dbConfig);
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

module.exports = { connect };
