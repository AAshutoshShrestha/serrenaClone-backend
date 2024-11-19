const menuRouter = require("express").Router()
const { UserTypes } = require("../../config/constants");
const checklogin = require("../../middlewares/auth.middleware");
const allowUser = require("../../middlewares/rbac.middleware");
const { setPath, uploader } = require("../../middlewares/uploader.middleware");
const { bodyValidator } = require("../../middlewares/validator.middleware");
const menuController = require("./menu.controller");
const { MenuCreateDTO } = require("./menu.request");


menuRouter.route('/')
.post(checklogin, allowUser([UserTypes.ADMIN]), setPath('/menu'), uploader.single("image"), bodyValidator(MenuCreateDTO), menuController.create)
.get(menuController.index)


menuRouter.route("/:id")
    .get(menuController.show)
    .put(checklogin, allowUser([UserTypes.ADMIN]), setPath('/menu'), uploader.single("image"), bodyValidator(MenuCreateDTO), menuController.update)
    .delete(checklogin, allowUser(UserTypes.ADMIN), menuController.delete)

module.exports = menuRouter;