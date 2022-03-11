const Router = require("express")
const { body } = require('express-validator')
const router = new Router()
const dietController = require('../controllers/dietController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const AuthMiddleware = require('../middleware/authMiddleware')

router.post('/', body("name").isLength({min:4, max: 24}), dietController.create)
router.get('/:id', dietController.getOne)
router.get('/', dietController.getAll)
router.put('/', body("name").isLength({min:4, max: 24}), dietController.update)

module.exports = router