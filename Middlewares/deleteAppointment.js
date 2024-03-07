const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');

const dbConfig = {
    user: 'c##bookstore',
    password: 'bookstore',
    connectString: 'localhost:1521/ORCL'
};

// Route to handle appointment deletion
// Route to handle appointment deletion
router.delete('/deleteAppointment/:appointmentId', async (req, res) => {
    try {
        const appointmentId = parseInt(req.params.appointmentId); // Ensure appointmentId is converted to a number
        const connection = await oracledb.getConnection(dbConfig);

        // Call the stored procedure to delete the appointment
        const procedureName = 'delete_appointment';
        const procedureParams = { p_appointment_id: { dir: oracledb.BIND_IN, val: appointmentId, type: oracledb.NUMBER } };
        await connection.execute(`BEGIN ${procedureName}(:p_appointment_id); END;`, procedureParams);
console.log("delete appointment");
        await connection.close();
        res.status(200).send({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        // Send error response
        res.status(500).send({ error: 'Error deleting appointment' });
    }
});

module.exports = router;
