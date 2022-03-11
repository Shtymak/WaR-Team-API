const Router = require("express")
const router = new Router()
const userRouter = require('./userRouter')
const dietRouter = require('./dietRouter')

router.use('/user', userRouter)
router.use('/diet', dietRouter)

module.exports = router
