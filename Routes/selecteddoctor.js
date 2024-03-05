const express = require('express');
const doctors = require('../Middlewares/selecteddoctor')
const doclogin = require('../Middlewares/doctorlogin')
const docdashboard = require('../Middlewares/doctordashboard')
const appoinmens = require('../Middlewares/appoinments');
const router = express.Router(); 
router.get('/login',doclogin.doclogincontroller)
router.get('/dashboard',docdashboard.dashboardloading)
router.get('/dashboard/schedule',docdashboard.SetSchedule)
router.post('/dashboard/schedule/set',docdashboard.setnextschedule)
router.get('/dashboard/upcomingappointments',docdashboard.upcoming_appointmentcontroller)
router.post('/login/logincheck',doclogin.docauth);
router.get('/:id',doctors);
router.get('/appoinments/:id',appoinmens);

module.exports = router;