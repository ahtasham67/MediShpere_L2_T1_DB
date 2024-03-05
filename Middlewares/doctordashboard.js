const { options } = require('pdfkit');
const Schedule = require('../Database/SetSchedule')
oracledb = require('oracledb')

// function to get id from email
const dbConfig = {
   user: 'c##bookstore',
   password: 'bookstore',
   connectString: 'localhost:1521/ORCL'
 };
const dashboardloading = async (req, res) => {
    console.log("here in dashboard");
    try {
      const connection = await oracledb.getConnection(dbConfig);
      const options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      };
  
      // Query upcoming appointments where status is 0 (not booked)
      const result = await connection.execute(
        `SELECT * FROM DOCTOR WHERE DOCTORID = 1`,
        {},
        options
      );
      console.log(result.rows);
      connection.close(); // Close connection
  
      // Render the page and pass the fetched appointments data to it
      res.render('docdashboard', { patient: result.rows });
    } catch (err) {
      console.error('ERROR ', err);
      res.status(500).send('Error fetching DOCTORS');
    }
  };

const upcoming_appointmentcontroller =  async (req, res) => {
    try {
      const connection = await oracledb.getConnection(dbConfig);
  
      // Define options with outFormat set to OBJECT
      const options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      };
      console.log("doctor id is")
      console.log(req.session.user.id)
     const binds = {
        id:req.session.user.id
     }
      // Query upcoming appointments where status is 0 (not booked)
      const result = await connection.execute(
        `SELECT 
        A.AppointmentID,
        A.Status,
        DS.ScheduleID,
        DS.DoctorID,
        TO_CHAR(DS.DAY, 'DD-MON-YYYY') AS ScheduleDate,
        DS.STARTTIME AS ScheduleSTARTTime,
        DS.ENDTIME AS ScheduleENDTime,
        P.PatientID,
        (P.FirstName ||' '||P.LASTNAME) AS FULLNAME
    FROM Appointment A JOIN DoctorSchedule DS ON A.ScheduleID = DS.ScheduleID JOIN Patient P ON A.PatientID = P.PatientID
    WHERE A.Status = 0 AND DS.DOCTORID = :id
    GROUP BY 
        A.AppointmentID,A.Status,DS.ScheduleID,DS.DoctorID,DS.DAY,DS.STARTTIME,DS.ENDTIME,P.PatientID,(P.FirstName ||' '||P.LASTNAME)`,
        // Empty array for bind parameters
         // Options object with outFotrmat se
         binds,
        options
      );
  
      console.log(result.rows);
      connection.close(); // Close connection
  
      // Render the page and pass the fetched appointments data to it
      res.render('upcomingappointments', { appointments: result.rows });
    } catch (err) {
      console.error('Error fetching upcoming appointments: ', err);
      res.status(500).send('Error fetching upcoming appointments');
    }
  }


  const SetSchedule = async(req,res) => {
    res.render('UpdateSchedule',{
      id:req.session.user.id
    })
  }

  const setnextschedule = (req,res) => {
    const scheduleData = req.body;
    console.log(scheduleData)
    Schedule.setdoctorschedule(scheduleData)
    
  }
module.exports = {dashboardloading,upcoming_appointmentcontroller,SetSchedule,setnextschedule};