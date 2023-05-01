var express = require('express');
var router = express.Router();
const adminController = require('../controller/adminController')
const adminAuth = require('../auth/adminAuth')
const suController = require('../controller/superuserController')
const suAuth = require('../auth/superuser')


/* GET home. */
router.get('/',adminAuth.adminAuthentication,adminController.home)

/* GET custom details. */
router.get('/customreport',adminAuth.adminAuthentication,adminController.customreport)

/* POST getcustom details. */
router.post('/getcustom',adminAuth.adminAuthentication,adminController.getcustom)

/* GET batch table. */
router.get('/getcustombatch/:id',adminAuth.adminAuthentication,adminController.custombatch)


/* GET login. */
router.get('/login',adminController.login)

/* POST login. */
router.post('/login_submit',adminController.postlogin)

/* GET signup. */
router.get('/signup',adminController.signup)

/* POST signup. */
router.post('/signup_submit',adminController.postsignup)

/* GET students. */
router.get('/students',adminAuth.adminAuthentication,adminController.students)

/* GET attendees table to pdf. */
router.get('/attendeestable',adminAuth.adminAuthentication,adminController.attendeestable)

/* GET today's absentees(batch wise). */
router.get('/absentbatch/:id',adminAuth.adminAuthentication,adminController.absentbatch)

/* GET more info. */
router.get('/details/:id',adminAuth.adminAuthentication,adminController.details)

/* GET logout */
router.get('/logout',adminAuth.adminAuthentication,adminController.logout)

/* GET attendees. */
router.get('/attendees',adminAuth.adminAuthentication,adminController.attendees)

/* POST getcustomattendees. */
router.post('/getcustomattendees',adminAuth.adminAuthentication,adminController.getcustomattendees)

/* POST getcustomattendees. */
router.get('/attendeesgrid/:id',adminAuth.adminAuthentication,adminController.attendeesgrid)




///////////////
//superUser///
/////////////




/* GET home. */
router.get('/superuser',suAuth.adminAuthentication,suController.home)

/* GET login. */
router.get('/superuser/login',suController.login)

/* POST login. */
router.post('/superuser/login_submit',suController.postlogin)

/* GET students. */
router.get('/superuser/students',suAuth.adminAuthentication,suController.students)

/* GET admins. */
router.get('/superuser/admins',suAuth.adminAuthentication,suController.admins)

/* GET unblock admin. */
router.get('/superuser/unblockadmin/:id',suAuth.adminAuthentication,suController.unblockadmin)

/* GET block admin. */
router.get('/superuser/blockadmin/:id',suAuth.adminAuthentication,suController.blockadmin)

/* GET more info. */
router.get('/superuser/details/:id',suAuth.adminAuthentication,suController.details)







module.exports = router;
