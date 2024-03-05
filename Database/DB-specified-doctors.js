

oracledb = require('oracledb')

// function to get id from email
const dbConfig = {
   user: 'c##bookstore',
   password: 'bookstore',
   connectString: 'localhost:1521/ORCL'
 };


async function getdoctorsbyspecialiy(speciality){
   connection = await oracledb.getConnection(dbConfig
   );
   const sql = `
   SELECT 
      D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
      E.NAME,
      D.CHAMBERADDRESS,
      D.CONSULTATIONFEE
  FROM DOCTOR D JOIN DOCTORSPECIALTY E ON(D.DOCTORID = E.DOCTORID)
  WHERE UPPER(E.NAME) = UPPER(:speciality)`;
  const binds = {
   speciality:speciality
}
const options = {
   outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
   autoCommit: true, // Automatically commit the transaction
 };
   // Execute the query with binds and options
   const result = await connection.execute(sql, binds, options);
   return result;
}


async function getdoctorsbyid(id){
  connection = await oracledb.getConnection(dbConfig
  );
  const sql = `
  SELECT 
  D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
  E.NAME AS NAME,
  D.CHAMBERADDRESS,
  D.CONSULTATIONFEE
FROM DOCTOR D JOIN DOCTORSPECIALTY E ON(D.DOCTORID = E.DOCTORID)
WHERE D.DOCTORID = :id`;
 const binds = {
  id:id,

}
const options = {
  outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
  autoCommit: true, // Automatically commit the transaction
};
  // Execute the query with binds and options
  const result = await connection.execute(sql, binds, options);
  return result;
}
module.exports = {getdoctorsbyspecialiy,getdoctorsbyid};