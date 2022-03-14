const Router = require('express');
const { body } = require('express-validator');
const router = new Router();
const recipeController = require('../controllers/recipeController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');
const AuthMiddleware = require('../middleware/authMiddleware');

router.post(
    '/',
    body('name').isLength({ min: 4, max: 24 }),
    body('description').isLength({ min: 25, max: 5000 }),
    recipeController.create
);
router.get('/:id', recipeController.getOne);

module.exports = router;
