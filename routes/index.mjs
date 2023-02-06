import e from 'express';
const indexRouter = e.Router();

/* GET home page. */
indexRouter.get('/', function (req, res) {
	res.redirect('/catalog');
});

export default indexRouter;
