const UserRouter = require("express").Router();

const userCTRL = require("./user.controller");
const checklogin = require("../../middlewares/auth.middleware")
const allowUser = require("../../middlewares/rbac.middleware")

const {setPath,uploader} = require("../../middlewares/uploader.middleware");
const { bodyValidator } = require("../../middlewares/validator.middleware");
const { UserCreateDTO } = require("./user.request");

// UserRouter.use();

UserRouter.route("/")
	// uploader tyoe
	// none = no file upload
	// single('key') = single file upload
	// array('key') = multiple file upload

	.post(checklogin,allowUser('admin'), setPath('/user'),uploader.single('image'),bodyValidator(UserCreateDTO), userCTRL.userCreate)
	.get(userCTRL.getallUsers);

UserRouter.route("/:id")
	.get(userCTRL.userbyID)
	.patch(checklogin,userCTRL.updateUserById)
	.delete(checklogin,userCTRL.deleteUserById);

module.exports = UserRouter;
