const oracledb = require('oracledb');

// Oracle database configuration
const dbConfig = {
  user: 'c##bookstore',
  password: 'bookstore',
  connectString: 'localhost:1521/ORCL'
};

async function allpatients(req, res) {
    try {
      const query1 = `
        SELECT * FROM PATIENT order by PATIENTID ASC`;
      const options1 = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true
      };
      // Establish a connection to the database
      const connection = await oracledb.getConnection(dbConfig);
  
      // Execute the queries
      const result1 = await connection.execute(query1,{}, options1);
     
      const allpatient = result1.rows; 
     
      // Render the template with patient data
     //console.log(allpatient);
      res.render('delPatient.ejs', { allpatient } );
      // Release the connection
      await connection.close();
    } catch (error) {
      console.error('Error fetching patient data:', error);
      res.status(500).send('An error occurred while fetching patient data');
    }
  }

// Export the allpatients function and dbConfig object
module.exports = {
  allpatients,
  dbConfig
};
