const express = require('express');
const flash = require('express-flash')
const database = require('./Database/database');
const bodyParser = require('body-parser'); 
const abc = require('./Database/getreveiws')

const cookieparser = require('cookie-parser');
const ejs = require('ejs');
const session = require('express-session')
 require('dotenv').config();
const cors = require('cors');
const app = express();

//Socket working
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
//const io1 = new Server(server);
const multer = require('multer');
const fs = require('fs');
const oracledb = require('oracledb');
const upload = multer({ dest: 'uploads/' }); // Destination folder for file uploads
// Serve static files from the public directory
app.use(express.static('public'));
app.use(express.static('images'));

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.options('*',cors());
app.use(express.json());
app.use(flash());
app.use('/public',express.static('public'));
app.use(session({ 
  secret: 'dsff',
  saveUninitialized:true,
  resaveL:false,
  cookie:{secure:false}
}));

// routers
const landing = require('./Routes/landing');
const consultation  = require('./Routes/consultation');
const doctors = require('./Routes/selecteddoctor');
const login = require('./Routes/login')
const signup = require('./Routes/signup')
const docsignup = require('./Routes/docsignup')
const appoinments = require('./Routes/appoinments');
const errorHandler = require('./Middlewares/errorHandler');
const diagnosticCentersRouter = require('./Routes/diagnosticCenters');
const deleteAppointmentRouter = require('./Middlewares/deleteAppointment');
const getpatientprofile = require('./Routes/ptntprofile.js');
const getadmin = require('./Routes/admin.js');
const updateptntprofile = require('./Routes/updateprofile.js')
const deleteRoutes = require('./Database/adminDelete.js');
const allpatients = require('./Database/adminPtnt.js');
const alldoctors = require('./Database/adminDoc.js');
const alldeletedappointments = require('./Database/deletedappointment.js');
const docprofile = require('./Database/docprofile.js');

io.on('connection', (socket) => {
  //update booked slot
  socket.on('time',(time) => {
    console.log(time);
    io.emit('update', time);
  })

});


// Use the delete appointment router
app.use('/', deleteAppointmentRouter);
app.use('/landing',landing);
app.use('/appointments',appoinments)
//Consultation page rendering
app.use('/consultation',consultation);
//Doctors info page rendering
app.use('/doctors',doctors)
//login page rendering
app.use('/login',login)
//signup page rendering
app.use('/signup',signup);
app.use('/docsignup',docsignup);
app.use(errorHandler);
app.use(diagnosticCentersRouter);
app.get('/patient/:patientid',getpatientprofile.fetchPatientProfile);
app.get('/admin',getadmin.adminpanel);
app.use(updateptntprofile);
app.use('/api', deleteRoutes);
app.use('/allpatients', allpatients.allpatients);
app.use('/alldoctors', alldoctors.alldoctors);
app.use('/alldeletedappointments', alldeletedappointments.DeletedAppointments);
app.use('/docprofile/:doctorId', docprofile.fetchdocProfile);


const dbConfig = {
  user: 'c##bookstore',
  password: 'bookstore',
  connectString: 'localhost:1521/ORCL'
};

// Route to render the upload page
app.get('/aa/:appointmentid', (req, res) => {
  console.log(req.params.appointmentid);
  res.render('upload.ejs', { imageUrl: null,appointmentid: req.params.appointmentid});
});

// Route for uploading prescription
app.post('/aa/:appointmentid/upload', upload.single('image'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const appointmentId = req.params.appointmentid;

    // Call the stored function to get the appointment day
    const getAppointmentDayQuery = `BEGIN :day := GET_APPOINTMENT_DAY(:scheduleId); END;`;
    const dayBind = { day: { dir: oracledb.BIND_OUT, type: oracledb.DATE }, scheduleId: null };

    // Get the ScheduleID associated with the appointment
    const appointmentQuery = 'SELECT ScheduleID FROM Appointment WHERE AppointmentID = :appointmentId';
    const appointmentResult = await connection.execute(appointmentQuery, [appointmentId], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    const scheduleId = appointmentResult.rows[0].SCHEDULEID; // Ensure proper case here

    dayBind.scheduleId = scheduleId;

    // Execute the query to get the appointment day
    const result = await connection.execute(getAppointmentDayQuery, dayBind);

    // Extract the appointment day from the result
    const appointmentDate = new Date(result.outBinds.day);

    // Check if appointment day is in the future
    // const currentDate = new Date();
    // if (currentDate < appointmentDate) {
    //   return res.status(400).send('Prescription upload is not allowed before the appointment date');
    // }

    // Proceed with uploading prescription
    const uniqueFilename = Date.now() + '-' + req.file.originalname;
    const destinationPath = 'public/' + uniqueFilename;
    fs.renameSync(req.file.path, destinationPath);
    const imageUrl = 'http://localhost:3300/images/' + uniqueFilename;

    // Call the stored procedure to insert prescription into database
const insertPrescriptionProcedure = 'BEGIN insert_prescription(:url, :appointmentId); END;';
const prescriptionBinds = { url: imageUrl, appointmentId: appointmentId };
await connection.execute(insertPrescriptionProcedure, prescriptionBinds, { autoCommit: true });

    const suggestedTests = JSON.parse(req.body.testsArray);
    if (suggestedTests && suggestedTests.length > 0) {
      const insertTestQuery = 'INSERT INTO suggested_tests (test_name, appointmentid) VALUES (:testName, :appointmentId)';
      for (const test of suggestedTests) {
        console.log('Inserting test:', test);
        const testBinds = [test, req.params.appointmentid];
        await connection.execute(insertTestQuery, testBinds, { autoCommit: true });
      }
    }

    await connection.close();
    // Other code for inserting suggested tests...

    res.render('upload.ejs', { imageUrl, appointmentid: appointmentId });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while processing the upload');
  }
});



// Serve the uploaded images statically
app.use('/images', express.static('public/images'));


app.get('/download/:appointmentid', async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const id = req.session.user.id;
    const appointmentid = req.params.appointmentid;

    // Query to fetch image URLs from the PRESCRIPTION table
    const imageQuery = 'SELECT url FROM PRESCRIPTION p JOIN APPOINTMENT a ON p.APPOINTMENTID = a.APPOINTMENTID WHERE a.PATIENTID = :id AND a.APPOINTMENTID = :appointmentid';
    const imageResult = await connection.execute(imageQuery, { id: id, appointmentid: appointmentid });
    const imageUrls = imageResult.rows.map(row => row[0]);

    // Query to fetch suggested tests from the suggested_test table
    const testQuery = 'SELECT test_name FROM suggested_tests WHERE appointmentid IN (SELECT appointmentid FROM APPOINTMENT WHERE patientid = :id AND appointmentid = :appointmentid)';
    const testResult = await connection.execute(testQuery, { id: id, appointmentid: appointmentid });
    const suggestedTests = testResult.rows.map(row => row[0]);
var diagnosticCenters = [];
//   const suggestedTests = tests.rows.map(row => row[0]);
if(testResult.rows.length > 0){
  const centerQuery = `
  SELECT DISTINCT d.NAME, d.ADDRESS, d.CONTACTNUMBER,d.DIAGNOSTICCENTERID
  FROM DIAGNOSTICCENTER d
  JOIN OFFEREDTEST ot ON d.DIAGNOSTICCENTERID = ot.DIAGNOSTICCENTERID
  WHERE ot.TESTNAME IN (${suggestedTests.map((test, index) => `:test${index}`).join(', ')})
  `;
       const centerResult = await connection.execute(centerQuery, suggestedTests);
       diagnosticCenters = centerResult.rows;
      console.log(diagnosticCenters);
       await connection.close();
}
    res.render('download.ejs', { imageUrls, suggestedTests, diagnosticCenters, id: req.session.user.id, appointmentid: req.params.appointmentid });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while retrieving data');
  }
});

app.get('/allprescription/:userid', async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const userId = req.params.userid;
    // Query to fetch all columns from the PRESCRIPTION, APPOINTMENT, Doctor, and DoctorSchedule tables for the given user ID
    const query = `
      SELECT p.*, a.*, d.*, ds.*
      FROM PRESCRIPTION p
      JOIN APPOINTMENT a ON p.APPOINTMENTID = a.APPOINTMENTID
      JOIN DoctorSchedule ds ON a.ScheduleID = ds.ScheduleID
      JOIN Doctor d ON ds.DoctorID = d.DoctorID
      WHERE a.PATIENTID = :userId
    `;
    const binds = {
      userId: userId
    };
    // Define options for query execution
    const options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
      autoCommit: true // Automatically commit the transaction
    };
//console.log(userId);
    // Execute the query with binds and options
    const result = await connection.execute(query, binds, options);
    const prescriptions = result.rows;
//console.log(result.rows);
    await connection.close();

    res.render('allprescriptions.ejs', { prescriptions, userId: userId });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while retrieving data');
  }
});
//for diagnosis part
app.get('/diagnosis/:userid', async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const userId = req.params.userid;
    // Query to fetch all columns from the PRESCRIPTION, APPOINTMENT, Doctor, and DoctorSchedule tables for the given user ID
    const query = `
    SELECT st.*, ap.*, TO_CHAR(ds.DAY,'DD-MON-YYYY') as day,DS.STARTTIME,DS.ENDTIME,d.*
    FROM SUGGESTED_TESTS st
    JOIN APPOINTMENT ap ON st.APPOINTMENTID = ap.APPOINTMENTID
    JOIN DOCTORSCHEDULE ds ON ds.SCHEDULEID = ap.SCHEDULEID
    JOIN DOCTOR d ON d.DOCTORID = ds.DOCTORID
    WHERE ap.PATIENTID = :userId
    `;
    const binds = {
      userId: userId
    };
    // Define options for query execution
    const options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
      autoCommit: true // Automatically commit the transaction
    };
//console.log(userId);
    // Execute the query with binds and options
    const result = await connection.execute(query, binds, options);
    const diagnoses = result.rows;
console.log(result.rows);
    await connection.close();

    res.render('diagnosis.ejs', { diagnoses, userId: userId });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while retrieving data');
  }
});


app.get('/images/:imageName', (req, res) => {
  try {
    const imageName = req.params.imageName;
    const imagePath = `public/${imageName}`; // Assuming images are stored in the 'public/images' directory
    res.download(imagePath);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while downloading the image');
  }
});

app.post('/reveiws',async (req,res) => {
  console.log("in reveiws ");
  console.log(req.body);
  const result = await abc(req.body.id);
  console.log(result.rows);
 res.send(result.rows);
 })

 // Route to serve admin dashboard page
// Route to serve admin dashboard page
// app.get('/admin-dashboard', (req, res) => {
//   res.render('admin-dashboard');
// });

// // Handle socket connections
// io1.on('connection', async (socket) => {
//   console.log('A user connected');

//   // Listen for log updates and emit to client
//   socket.on('getLogs', async () => {
//       try {
//           const connection = await oracledb.getConnection();

//           // Execute the query to retrieve logs
//           const result = await connection.execute(
//               `SELECT * FROM LOGTABLE ORDER BY CALL_TIMESTAMP DESC`
//           );

//           // Release the database connection
//           await connection.release();

//           // Map the query result to log objects
//           const logs = result.rows.map(row => ({
//               log_id: row[0],
//               procedure_name: row[1],
//               procedure_params: row[2],
//               user_id: row[3],
//               user_name: row[4],
//               call_timestamp: row[5]
//           }));
// console.log(logs);
//           // Emit the logs to the client
//           socket.emit('logsData', logs);
//       } catch (err) {
//           console.error('Error retrieving logs:', err.message);
//           // Emit an error event to the client
//           socket.emit('logsError', 'Error retrieving logs');
//       }
//   });

//   // Disconnect event
//   socket.on('disconnect', () => {
//       console.log('A user disconnected');
//   });
// });

const port = process.env.PORT;
server.listen(port, async() => {
    console.log(`listening on http://localhost:${3300}`);
});
