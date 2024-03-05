const oracledb = require('oracledb');

// Oracle database configuration
const dbConfig = {
  user: 'c##bookstore',
  password: 'bookstore',
  connectString: 'localhost:1521/ORCL'
};

// Define the function for fetching the patient profile
async function fetchPatientProfile(req, res) {
  try {
    const patientId = req.params.patientid;

    // SQL query to fetch patient profile data with health records
    const query = `
      SELECT
        T.PATIENTID,
        T.FIRSTNAME,
        T.LASTNAME,
        (T.FIRSTNAME || ' ' || T.LASTNAME) AS FULLNAME,
        TO_CHAR(T.DATEOFBIRTH, 'DD-MON-YYYY') AS FORMATTED_DATEOFBIRTH,
        T.GENDER,
        T.CONTACTNUMBER,
        T.ADDRESS,
        T.EMAILADDRESS,
        T.BLOODGROUP,
        T.PASSWORD,
        H.WEIGHT,
        H.HEIGHT,
        H.VACCINATIONHISTORY,
        H.BLOODPRESSURE,
        H.BMI,
        H.HEARTRATE
      FROM
        PATIENT T
      JOIN
        HEALTHRECORDS H ON (T.PATIENTID = H.PATIENTID)
      WHERE
        T.PATIENTID = :patientId`;

    const options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true
    };

    // Establish a connection to the database
    const connection = await oracledb.getConnection(dbConfig);

    // Execute the query
    const result = await connection.execute(query, { patientId }, options);
    const patient = result.rows[0]; // Assuming only one patient is returned

    // Render the template with patient data
    res.render('profile.ejs', { patient,patientId });

    // Release the connection
    await connection.close();
  } catch (error) {
    console.error('Error fetching patient data:', error);
    res.status(500).send('An error occurred while fetching patient data');
  }
}

// Export the fetchPatientProfile function and dbConfig object
module.exports = {
  fetchPatientProfile,
  dbConfig
};
