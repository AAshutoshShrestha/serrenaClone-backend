const router = require("express").Router();
const { setPath, uploader } = require("../../middlewares/uploader.middleware");
const { bodyValidator } = require("../../middlewares/validator.middleware");
const { UserCreateDTO } = require("../users/user.request");
const userCTRL = require("../users/user.controller");
const authController = require("./auth.controller");
const { LoginDTO } = require("./auth.request");
const checklogin = require("../../middlewares/auth.middleware");
const allowUser = require("../../middlewares/rbac.middleware");


router.post("/register",setPath('/register'),uploader.single('image'),bodyValidator(UserCreateDTO),userCTRL.userCreate)

router.post("/login",bodyValidator(LoginDTO),authController.LoginUser)
router.get("/activate/:token",authController.activateuser)
router.get("/resend-token/:token",authController.resendActivationToken)

router.get("/me",checklogin,allowUser(['admin','seller']),authController.getLoggedInUser)

router.post("/logout",checklogin,authController.logout)

module.exports = router