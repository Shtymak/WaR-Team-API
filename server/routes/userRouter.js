const Router = require("express")
const {body} = require('express-validator')
const router = new Router()
const userController = require('../controllers/userController')


router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 21}),
    userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', userController.getUsers)
router.get('/user/:id', userController.getOne)
module.exports = router
