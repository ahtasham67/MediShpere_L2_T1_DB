// route.js
const express = require('express');
const router = express.Router();
const docsignup = require('../Middlewares/docsignup')
const docsignupcontroller = require('../Middlewares/docsignupcontroller')
//Home page randering
router.get('/', docsignupcontroller);
router.post('/',docsignup)
module.exports = router;