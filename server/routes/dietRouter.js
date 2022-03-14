const Router = require('express');
const { body } = require('express-validator');
const router = new Router();
const dietController = require('../controllers/dietController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');
const AuthMiddleware = require('../middleware/authMiddleware');

router.post(
    '/',
    body('name').isLength({ min: 4, max: 24 }),
    /*checkRoleMiddleware("ADMIN"),*/ dietController.create
);
router.get('/:id', dietController.getOne);
router.get('/:id/recipes', dietController.getRecipes);
router.get('/', dietController.getAll);
router.put(
    '/',
    body('name').isLength({ min: 4, max: 24 }),
    /* checkRoleMiddleware("ADMIN"),*/ dietController.update
);
router.post('/add', dietController.addRecepie);

module.exports = router;
