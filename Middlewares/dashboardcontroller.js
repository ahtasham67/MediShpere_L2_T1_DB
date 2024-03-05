const db_profile = require('../Database/dashboard')
const abc = require('../Database/patientappointments');
const { all } = require('../Routes/landing');


oracledb = require('oracledb')

// function to get id from email
const dbConfig = {
   user: 'c##bookstore',
   password: 'bookstore',
   connectString: 'localhost:1521/ORCL'
 };




 const dashboardcontroller = async (req, res) => {
  try {
    const result = await db_profile.getprofile();
    const patient = result.rows[0];
    
    // Check if req.session.user exists and has an id property
    const userId = req.session.user ? req.session.user.id : null;
    //console.log(userId);
    // Pass patient and userId to the render method
    res.render('dashboard', { patient, userId });
  } catch (error) {
    console.error('Error fetching patient details:', error);
    res.status(500).send('Internal Server Error');
  }
}

  const upcoming_appointmentcontroller = async(req,res) => {
    //console.log(req.session.user.id);
    const resul = await abc.getupcomingappointments(req.session.user.id);
   // console.log()
        res.render('ptntupcmngappoint',{
          result:resul.rows
        })
  }
  const past_appointmentcontroller = async(req,res) => {
    //console.log(req.session.user.id);
    const resul = await abc.pastAppointment(req.session.user.id);
   // console.log()
        res.render('ptntpastApppoint',{
          result:resul.rows
        })
  }


  
const feedback = async(req, res) => {
  const rating = req.body.rating;
  const comment = req.body.comment;
  const additionalData1 = req.body.additionalData1;
  // Do something with the feedback data (e.g., save it to a database)
  connection = await oracledb.getConnection(dbConfig);

  const sql = `
  INSERT into review(RATING,COMMENTTEXT,APPOINTMENTID) values(:rating,:cmnt,:appointmentid)
`;
 const binds = {
  rating:rating,
  cmnt:comment,
  appointmentid:additionalData1
 };
 const options = {
  outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
  autoCommit: true, // Automatically commit the transaction
};
  await connection.execute(sql, binds,options);

 // const prescription = await abc.getprescription(additionalData1);
  //const tests = await abc.gettests(additionalData1);
  // res.render('downloadPres',{
  //   image:prescription.rows,
  //   tests:tests.rows,
  //   appointmentid:additionalData1,
  //   feedback:1
  // });
 // res.send('successful');
 res.redirect('/landing');
  //res.render('downloadPres',{image:prescription.rows,tests:tests.rows,appointmentid:additionalData1,feedback:1});
};

  module.exports = 
  {dashboardcontroller,upcoming_appointmentcontroller,past_appointmentcontroller,feedback}