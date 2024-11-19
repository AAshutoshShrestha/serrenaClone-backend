const ProductRouter = require("express").Router();

const { UserTypes } = require("../../config/constants");
const checklogin = require("../../middlewares/auth.middleware");
const allowUser = require("../../middlewares/rbac.middleware");
const { setPath, uploader } = require("../../middlewares/uploader.middleware");
const { bodyValidator } = require("../../middlewares/validator.middleware");
const ProductCTRL = require("./Product.controller");
const { ProductCreateDTO } = require("./Product.request");


ProductRouter.get('/:Slug/datail',ProductCTRL.getBySlug)

ProductRouter.route('/')
	.post(checklogin,allowUser(UserTypes.ADMIN),setPath('/Product'),uploader.single('image'), bodyValidator(ProductCreateDTO),ProductCTRL.createProduct)

	.get(checklogin,allowUser(UserTypes.ADMIN),ProductCTRL.index)

ProductRouter.route('/:id')
	.get(checklogin,allowUser(UserTypes.ADMIN),ProductCTRL.show)

	.patch(checklogin,allowUser(UserTypes.ADMIN),setPath('/Product'),uploader.single('image'),bodyValidator(ProductCreateDTO),ProductCTRL.update)

	.delete(checklogin,allowUser(UserTypes.ADMIN),ProductCTRL.delete)


module.exports = ProductRouter;