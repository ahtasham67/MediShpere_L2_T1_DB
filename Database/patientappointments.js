

oracledb = require('oracledb')

// function to get id from email
const dbConfig = {
   user: 'c##bookstore',
   password: 'bookstore',
   connectString: 'localhost:1521/ORCL'
 };





async function getupcomingappointments(id){
   connection = await oracledb.getConnection(dbConfig);
   const sql = `
 
SELECT 
(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULLNAME,
DSPE.NAME AS SPECIALITY,
TO_CHAR(DS.DAY,'DD-MM-YYYY') AS APPOINTMENT_DATE, -- Changed alias name from DATE to APPOINTMENT_DATE
DS.STARTTIME AS STARTTIME,
DS.ENDTIME AS ENDTIME,
A.APPOINTMENTID,
DS.PATIENT AS SERIALNO, -- Assuming DS.PATIENT is the correct reference, otherwise replace DS with the appropriate table alias
D.CONSULTATIONFEE
FROM 
APPOINTMENT A 
JOIN DOCTORSCHEDULE DS ON A.SCHEDULEID = DS.SCHEDULEID 
JOIN DOCTOR D ON D.DOCTORID = DS.DOCTORID 
JOIN DOCTORSPECIALTY DSPE ON DSPE.DOCTORID = D.DOCTORID
WHERE 
A.PATIENTID = :id 
AND A.STATUS = 0
`;
  const binds = {
   id:id

}
const options = {
   outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
   autoCommit: true, // Automatically commit the transaction
 };
   // Execute the query with binds and options
   const result = await connection.execute(sql, binds, options);
   return result;
}

async function pastAppointment(id,appoinmentid){
   connection = await oracledb.getConnection(dbConfig);
   const sql = `
 
SELECT 
(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULLNAME,
DSPE.NAME AS SPECIALITY,
TO_CHAR(DS.DAY,'DD-MM-YYYY') AS APPOINTMENT_DATE, -- Changed alias name from DATE to APPOINTMENT_DATE
DS.STARTTIME AS STARTTIME,
DS.ENDTIME AS ENDTIME,
A.APPOINTMENTID,
DS.PATIENT AS SERIALNO, -- Assuming DS.PATIENT is the correct reference, otherwise replace DS with the appropriate table alias
D.CONSULTATIONFEE
FROM 
APPOINTMENT A 
JOIN DOCTORSCHEDULE DS ON A.SCHEDULEID = DS.SCHEDULEID 
JOIN DOCTOR D ON D.DOCTORID = DS.DOCTORID 
JOIN DOCTORSPECIALTY DSPE ON DSPE.DOCTORID = D.DOCTORID
WHERE 
A.PATIENTID = :id 
AND A.STATUS = 1
`;
//console.log(sql);
  const binds = {
   id:id,
   //appoinmentid:appoinmentid
}
const options = {
   outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
   autoCommit: true, // Automatically commit the transaction
 };
   // Execute the query with binds and options
   const result = await connection.execute(sql, binds, options);
   console.log(result);
   return result;
}


module.exports = {getupcomingappointments,pastAppointment}