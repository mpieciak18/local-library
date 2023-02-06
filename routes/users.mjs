import e from 'express';
const usersRouter = e.Router();

/* GET users listing. */
usersRouter.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

export default usersRouter;
