const oracledb = require('oracledb');

// Oracle database configuration
const dbConfig = {
  user: 'c##bookstore',
  password: 'bookstore',
  connectString: 'localhost:1521/ORCL'
};

async function alldoctors(req, res) {
    try {
      const query1 = `
        SELECT * FROM DOCTOR ORDER BY DOCTORID ASC`;
      
      const options1 = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true
      };
      // Establish a connection to the database
      const connection = await oracledb.getConnection(dbConfig);
  
      // Execute the queries
      const result1 = await connection.execute(query1,{}, options1);
     
      const alldoctors = result1.rows; 
     
      // Render the template with patient data
    // console.log(alldoctors[0]);
      res.render('alldoctors.ejs', { alldoctors } );
      // Release the connection
      await connection.close();
    } catch (error) {
      console.error('Error fetching alldoctors data:', error);
      res.status(500).send('An error occurred while fetching alldoctors data');
    }
  }

// Export the allpatients function and dbConfig object
module.exports = {
    alldoctors,
  dbConfig
};
