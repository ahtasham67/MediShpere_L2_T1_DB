//const db_signup = require('../Database/docsignup')
const oracledb = require('oracledb')
const dbConfig = {
    user: 'c##bookstore',
    password: 'bookstore',
    connectString: 'localhost:1521/ORCL', // Format: 'hostname:port/service_name'
};
const docsignup = async (req, res) => {
    try {
        // Connect to Oracle Database
        const connection = await oracledb.getConnection(dbConfig);
console.log("new doctor hitted");
        // Create a user
        const newDoc = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            dateOfBirth: req.body.dateOfBirth,
            gender: req.body.gender,
            contactNumber: req.body.contactNumber,
            address: req.body.address,
            emailaddress: req.body.emailaddress,
            chamberAddress: req.body.chamberAddress,
            hospitalName: req.body.hospitalName,
            consultationFee: req.body.consultationFee,
            followupFee: req.body.followupFee,
            password: req.body.password
        };
console.log(newDoc);
        const result = await connection.execute(
            `INSERT INTO DOCTOR
            (firstname, lastname, dateOfBirth, gender, contactNumber, address, emailaddress,chamberAddress,hospitalName,consultationFee,followupFee,password) 
            VALUES 
            (:firstname, :lastname, TO_DATE(:dateOfBirth, 'YYYY-MM-DD'), :gender, :contactNumber, :address, :emailaddress, :chamberAddress,:hospitalName,:consultationFee, :followupFee, :password)`,
            {
                firstname: newDoc.firstname,
                lastname: newDoc.lastname,
                dateOfBirth: newDoc.dateOfBirth,
                gender: newDoc.gender,
                contactNumber: newDoc.contactNumber,
                address: newDoc.address,
                emailaddress: newDoc.emailaddress,
                chamberAddress: newDoc.chamberAddress,
                hospitalName: newDoc.hospitalName,
                consultationFee: newDoc.consultationFee,
                followupFee: newDoc.followupFee,
                password: newDoc.password
            }
        );
        

        // Commit the transaction
        await connection.commit();

        // Release the connection
        await connection.close();

        //res.status(201).json({ message: 'User signed up successfully!' });
        res.redirect('/landing');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports = docsignup;