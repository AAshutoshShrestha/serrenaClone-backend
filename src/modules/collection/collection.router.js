const collectionRouter = require("express").Router();
const { UserTypes } = require("../../config/constants");
const checkLogin = require("../../middlewares/auth.middleware");
const allowUser = require("../../middlewares/rbac.middleware");
const {setPath,uploader,uploadToSupabase} = require("../../middlewares/uploader.middleware");
const { bodyValidator } = require("../../middlewares/validator.middleware");
const collectionController = require("./collection.controller");
const { CollectionCreateDTO } = require("./collection.request");

collectionRouter
	.route("/")
	.post(
		checkLogin,
		allowUser([UserTypes.ADMIN]),
		setPath("/collection"),
		uploader.single("image"),
		bodyValidator(CollectionCreateDTO),
		uploadToSupabase, // Upload to Supabase
		collectionController.create
	)
	.get(collectionController.index);

collectionRouter
	.route("/:id")
	.get(collectionController.show)
	.put(
		// checkLogin,
		// allowUser([UserTypes.ADMIN]),
		setPath("/collection"),
		uploader.single("image"),
		bodyValidator(CollectionCreateDTO),
		uploadToSupabase, // Upload to Supabase
		collectionController.update
	)
	.delete(checkLogin, allowUser([UserTypes.ADMIN]), collectionController.delete);

module.exports = collectionRouter;
