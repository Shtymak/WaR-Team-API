const Router = require('express');
const { body } = require('express-validator');
const router = new Router();
const userController = require('../controllers/userController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');
const AuthMiddleware = require('../middleware/authMiddleware');

router.post(
    '/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 21 }),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/all', checkRoleMiddleware('ADMIN'), userController.getUsers);
router.get('/:id', userController.getOne);
router.put(
    '/update',
    body('height').isNumeric().isLength({ min: 2, max: 3 }),
    body('weight').isNumeric().isLength({ min: 2, max: 3 }),
    body('dateOfBirth').isDate(),
    AuthMiddleware,
    userController.update
);
module.exports = router;
