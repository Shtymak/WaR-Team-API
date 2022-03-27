const Router = require('express');
const { body } = require('express-validator');
const router = new Router();
const dietController = require('../controllers/dietController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post(
    '/',
    body('name').isLength({ min: 4, max: 24 }),
    checkRoleMiddleware('ADMIN'),
    dietController.create
);

router.get('/favorites', authMiddleware, dietController.getFavorites);
router.post('/favorite/add', authMiddleware, dietController.addToFavorite);
router.delete(
    '/favorite/remove',
    authMiddleware,
    dietController.removeFromFavorite
);

router.get('/:id', dietController.getOne);
router.get('/', dietController.getAll);
router.put(
    '/',
    body('name').isLength({ min: 4, max: 24 }),
    checkRoleMiddleware('ADMIN'),
    dietController.update
);

router.get('/:id/recipes', dietController.getRecipes);
router.delete(
    '/remove',
    checkRoleMiddleware('ADMIN'),
    dietController.removeRecipe
);
router.post('/add', checkRoleMiddleware('ADMIN'), dietController.addRecepie);

module.exports = router;
