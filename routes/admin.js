var express = require('express');
var router = express.Router();
const adminController = require('../controller/adminController')
const adminAuth = require('../auth/adminAuth')
const suController = require('../controller/superuserController')
const suAuth = require('../auth/superuser')


/* GET home. */
router.get('/',adminAuth.adminAuthentication,adminController.home)

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

/* GET today's absentees(table). */
router.get('/absenteestable',adminAuth.adminAuthentication,adminController.absenteestable)

/* GET today's absentees(batch wise). */
router.get('/absentbatch/:id',adminAuth.adminAuthentication,adminController.absentbatch)

/* GET more info. */
router.get('/details/:id',adminAuth.adminAuthentication,adminController.details)

/* GET logout */
router.get('/logout',adminAuth.adminAuthentication,adminController.logout)



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
