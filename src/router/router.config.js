const router = require('express').Router();
const UserRouter = require('../modules/users/users.router')
const authRouter = require('../modules/auth/auth.router');
const BannerRouter = require('../modules/banner/banner.router')
const CollectionRouter = require('../modules/collection/collection.router');
const ProductRouter = require('../modules/products/Product.router');



router.use("/user",UserRouter)
router.use("/auth",authRouter)
router.use("/banner",BannerRouter)
router.use("/collection",CollectionRouter)
router.use("/products",ProductRouter)

module.exports = router