const oracledb = require('oracledb');

// Oracle database configuration
const dbConfig = {
  user: 'c##bookstore',
  password: 'bookstore',
  connectString: 'localhost:1521/ORCL'
};

// Define the function for fetching the patient profile
async function fetchdocProfile(req, res) {
  try {
    //const patientId = req.params.patientid;
    const doctorId = req.params.doctorId;

    // SQL query to fetch patient profile data with health records
    const query = `
    SELECT a.*,b.*,c.* from DOCTOR a JOIN DoctorsExperience b on(a.DOCTORID=b.DOCTORID) JOIN QUALIFICATION c on (a.DOCTORID=c.DOCTORID) WHERE a.DOCTORID=:doctorId`;

    const options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true
    };

    // Establish a connection to the database
    const connection = await oracledb.getConnection(dbConfig);

    // Execute the query
    const result = await connection.execute(query, { doctorId }, options);
    const doctor = result.rows[0]; // Assuming only one patient is returned
console.log(doctor);
    // Render the template with patient data
    res.render('docprofile.ejs', { doctor,doctorId});

    // Release the connection
    await connection.close();
  } catch (error) {
    console.error('Error fetching patient data:', error);
    res.status(500).send('An error occurred while fetching patient data');
  }
}

// Export the fetchPatientProfile function and dbConfig object
module.exports = {
  fetchdocProfile,
  dbConfig
};
