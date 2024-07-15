const express = require("express");
const router = express.Router();
const userController = require('../controller/userController');
const adminController = require('../controller/adminController');
const nocache = require('nocache');

router.use(nocache());

//User
router.get("/", userController.toLogin);
router.get('/login', userController.fromUserLogin);
router.post('/login', userController.checkLogin);
router.get('/userHome', userController.fromUserHome);
router.get("/userLogout", userController.onUserLogout);
router.get("/signup", userController.toUserSignup);
router.post("/signup", userController.checkUserSignup);

//Admin
router.get("/adminLogin", adminController.fromAdminLogin);
router.post('/adminLogin', userController.checkLogin);
router.get("/adminHome", adminController.fromAdminHome);
router.post("/addUser", adminController.addUser);
router.post("/editUser/:id", adminController.editUser);
router.post("/deleteUser/:id", adminController.deleteUser);
router.get("/adminLogout", adminController.adminLogout);

module.exports = router;