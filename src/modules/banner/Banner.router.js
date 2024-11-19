const BannerRouter = require("express").Router();

const { UserTypes } = require("../../config/constants");
const checklogin = require("../../middlewares/auth.middleware");
const allowUser = require("../../middlewares/rbac.middleware");
const { setPath, uploader } = require("../../middlewares/uploader.middleware");
const { bodyValidator } = require("../../middlewares/validator.middleware");
const BannerCTRL = require("./Banner.controller");
const { BannerCreateDTO } = require("./Banner.request");


BannerRouter.get('/list-home', BannerCTRL.listForHome)

BannerRouter.route('/')
	.post(checklogin,allowUser(UserTypes.ADMIN),setPath('/Banner'),uploader.single('image'), bodyValidator(BannerCreateDTO),BannerCTRL.createBanner)

	.get(checklogin,allowUser(UserTypes.ADMIN),BannerCTRL.index)

BannerRouter.route('/:id')
	.get(checklogin,allowUser(UserTypes.ADMIN),BannerCTRL.show)

	.put(checklogin,allowUser(UserTypes.ADMIN),setPath('/Banner'),uploader.single('image'),bodyValidator(BannerCreateDTO),BannerCTRL.update)

	.delete(checklogin,allowUser(UserTypes.ADMIN),BannerCTRL.delete)


module.exports = BannerRouter;