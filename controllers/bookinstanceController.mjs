import { default as BookInstance } from '../models/bookinstance.mjs';

// Display list of all BookInstances.
export function bookinstance_list(req, res) {
	BookInstance.find()
		.populate('book')
		.exec(function (err, list_bookinstances) {
			if (err) {
				return next(err);
			}
			// Successful, so render
			res.render('bookinstance_list', {
				title: 'Book Instance List',
				bookinstance_list: list_bookinstances,
			});
		});
}

// Display detail page for a specific BookInstance.
export function bookinstance_detail(req, res, next) {
	BookInstance.findById(req.params.id)
		.populate('book')
		.exec((err, bookinstance) => {
			if (err) {
				return next(err);
			}
			if (bookinstance == null) {
				// No results.
				const err = new Error('Book copy not found');
				err.status = 404;
				return next(err);
			}
			// Successful, so render.
			res.render('bookinstance_detail', {
				title: `Copy: ${bookinstance.book.title}`,
				bookinstance,
			});
		});
}

// Display BookInstance create form on GET.
export function bookinstance_create_get(req, res) {
	res.send(`NOT IMPLEMENTED: BookInstance create GET`);
}

// Handle BookInstance create on POST.
export function bookinstance_create_post(req, res) {
	res.send(`NOT IMPLEMENTED: BookInstance create POST`);
}

// Display BookInstance delete form on GET.
export function bookinstance_delete_get(req, res) {
	res.send(`NOT IMPLEMENTED: BookInstance delete GET`);
}

// Handle BookInstance delete on POST.
export function bookinstance_delete_post(req, res) {
	res.send(`NOT IMPLEMENTED: BookInstance delete POST`);
}

// Display BookInstance update form on GET.
export function bookinstance_update_get(req, res) {
	res.send(`NOT IMPLEMENTED: BookInstance update GET`);
}

// Handle BookInstance update on POST.
export function bookinstance_update_post(req, res) {
	res.send(`NOT IMPLEMENTED: BookInstance update POST`);
}
