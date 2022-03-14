const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const dietRouter = require('./dietRouter');
const ingredientRouter = require('./ingredientRouter');
const recipeRouter = require('./recipeRouter');
router.use('/user', userRouter);
router.use('/diet', dietRouter);
router.use('/ingredient', ingredientRouter);
router.use('/recipe', recipeRouter);

module.exports = router;
