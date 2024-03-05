// Import necessary modules
const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');

const dbConfig = {
    user: 'c##bookstore',
    password: 'bookstore',
    connectString: 'localhost:1521/ORCL'
  };
  
// Define the route to render the update profile page
router.get('/patient/:patientid/update', async (req, res) => {
    try {
        const patientId = req.params.patientid;

        // Fetch patient details from the database
        const connection = await oracledb.getConnection(dbConfig);
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
        const result = await connection.execute(query, [patientId], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        const patient = result.rows[0];

        // Render the update page with patient details
        res.render('updateProfile.ejs', { patient, patientId });
    } catch (error) {
        console.error('Error fetching patient details:', error);
        res.status(500).send('An error occurred while fetching patient details');
    }
});

router.post('/patient/:patientid/update', async (req, res) => {
    try {
        const patientId = req.params.patientid;
        const { firstname, lastname, gender, contactnumber, address, password, weight, height, vaccinationhistory, bloodpressure, bmi, heartrate } = req.body;

        // Update patient details using the stored procedure
        const connection = await oracledb.getConnection(dbConfig);
        const procedureName = 'update_patient';
        const binds = {
            p_patient_id: patientId,
            p_firstname: firstname,
            p_lastname: lastname,
            p_gender: gender,
            p_contactnumber: contactnumber,
            p_address: address,
            p_password: password,
            p_weight: weight,
            p_height: height,
            p_vaccinationhistory: vaccinationhistory,
            p_bloodpressure: bloodpressure,
            p_bmi: bmi,
            p_heartrate: heartrate
        };
        const options = {
            autoCommit: true
        };

        await connection.execute(`BEGIN ${procedureName}(:p_patient_id, :p_firstname, :p_lastname, :p_gender, :p_contactnumber, :p_address, :p_password, :p_weight, :p_height, :p_vaccinationhistory, :p_bloodpressure, :p_bmi, :p_heartrate); END;`, binds, options);
        await connection.close();

        // Redirect to the updated profile page
        res.redirect('/patient/' + patientId);
    } catch (error) {
        console.error('Error updating patient profile:', error);
        res.status(500).send('An error occurred while updating patient profile');
    }
});

module.exports = router;
