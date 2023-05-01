var express = require('express');
var router = express.Router();
const userController = require("../controller/userConroller")
const userAuth = require("../auth/userAuth")
const multer = require('../helpers/multerHelper')


/* GET login page. */
router.get('/login',userController.login);

/* POST login page. */
router.post('/login_submit',userController.postlogin);

/* GET signup page. */
router.get('/signup',userController.signup);

/* POST signup page. */
router.post('/signup_submit',userController.postsignup);
/* POST UPLOAD IMAGE*/ 
router.post('/upload',multer.single('photo'),userController.upload)



/* GET home page. */
router.get('/',userAuth.userAuthentication,userController.homepage); 

/* GET check-in page. */
router.get('/checkin',userAuth.userAuthentication,userController.checkin);

/* GET check-out page. */
router.get('/checkout',userAuth.userAuthentication,userController.checkout);


/* POST link device page. */
router.post('/linkdevice',userAuth.userAuthentication,userController.linkdevice);

/* POST link device page. */
router.post('/getfingerprint',userAuth.userAuthentication,userController.getfingerprint);

/* GET logout. */
router.get('/logout',userAuth.userAuthentication,userController.logout);


module.exports = router;
