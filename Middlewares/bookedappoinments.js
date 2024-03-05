const appoinments = require('../Database/appointmenttime')
const bookedappoinments =  async(req,res,next) => {
    await appoinments.updatebookedslot(req.body.id,req.body.starttime,req.body.endtime,req.body.status);
    await appoinments.insertinappointmenttable(req.body.schedule,req.body.patientid,req.body.patient);
    console.log(req.body);
    //const user = req.session.user.username;
   // console.log("from server " + req.session.user.username)
    res.redirect('confirmation');

}

module.exports = bookedappoinments;