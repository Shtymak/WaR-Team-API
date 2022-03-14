const Router = require('express');
const { body } = require('express-validator');
const router = new Router();
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');
const AuthMiddleware = require('../middleware/authMiddleware');
const ingredientController = require('../controllers/ingredientController');

router.post(
    '/',
    body('name').isLength({ min: 4, max: 16 }),
    /*checkRoleMiddleware("ADMIN"),*/ ingredientController.create
);

module.exports = router;
