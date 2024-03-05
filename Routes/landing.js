// route.js
const express = require('express');
const router = express.Router();
const landingcontroller = require('../Middlewares/landingcontroller')
const dashboardcontroller = require('../Middlewares/dashboardcontroller')
//Home page randering
router.get('/', landingcontroller);
router.get('/dashboard',dashboardcontroller.dashboardcontroller);
router.get('/dashboard/upappointment',dashboardcontroller.upcoming_appointmentcontroller)
router.get('/dashboard/pastAppointment',dashboardcontroller.past_appointmentcontroller)
router.post('/dashboard/feedback',dashboardcontroller.feedback)
module.exports = router;