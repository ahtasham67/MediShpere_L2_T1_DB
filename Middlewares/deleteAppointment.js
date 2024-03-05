// Assuming you have already configured your Express app and set up your Oracle database connection

// Import necessary modules
const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');

const dbConfig = {
    user: 'c##bookstore',
    password: 'bookstore',
    connectString: 'localhost:1521/ORCL'
  };
// Route to handle appointment deletion
router.delete('/deleteAppointment/:appointmentId', async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;
        const connection = await oracledb.getConnection(dbConfig);
        const deleteQuery = 'DELETE FROM APPOINTMENT WHERE APPOINTMENTID = :appointmentId';
        const result = await connection.execute(deleteQuery, [appointmentId]);
        await connection.close();
        res.status(200).send({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        // Send error response
        res.status(500).send({ error: 'Error deleting appointment' });
    }
});

// Export the router
module.exports = router;
