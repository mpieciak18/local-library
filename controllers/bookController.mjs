import { default as Book } from '../models/book.mjs';
import { default as Author } from '../models/author.mjs';
import { default as BookInstance } from '../models/bookinstance.mjs';
import { default as Genre } from '../models/genre.mjs';
import async from 'async';
import { body, validationResult } from 'express-validator';

export function index(req, res) {
	// res.send('NOT IMPLEMENTED: Site Home Page');
	async.parallel(
		{
			book_count(callback) {
				Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
			},
			book_instance_count(callback) {
				BookInstance.countDocuments({}, callback);
			},
			book_instance_available_count(callback) {
				BookInstance.countDocuments({ status: 'Available' }, callback);
			},
			author_count(callback) {
				Author.countDocuments({}, callback);
			},
			genre_count(callback) {
				Genre.countDocuments({}, callback);
			},
		},
		(err, results) => {
			res.render('index', {
				title: 'Local Library Home',
				error: err,
				data: results,
			});
		}
	);
}

// Display list of all Books.
export function book_list(req, res) {
	Book.find({}, 'title author')
		.sort({ title: 1 })
		.populate('author')
		.exec(function (err, list_books) {
			if (err) {
				return next(err);
			}
			//Successful, so render
			res.render('book_list', {
				title: 'Book List',
				book_list: list_books,
			});
		});
}

// Display detail page for a specific Book.
export function book_detail(req, res) {
	async.parallel(
		{
			book(callback) {
				Book.findById(req.params.id)
					.populate('author')
					.populate('genre')
					.exec(callback);
			},
			book_instance(callback) {
				BookInstance.find({ book: req.params.id }).exec(callback);
			},
		},
		(err, results) => {
			if (err) {
				return next(err);
			}
			if (results.book == null) {
				// No results.
				const err = new Error('Book not found');
				err.status = 404;
				return next(err);
			}
			// Successful, so render.
			res.render('book_detail', {
				title: results.book.title,
				book: results.book,
				book_instances: results.book_instance,
			});
		}
	);
}

// Display Book create form on GET.
export function book_create_get(req, res, next) {
	// Get all authors and genres, which we can use for adding to our book.
	async.parallel(
		{
			authors(callback) {
				Author.find(callback);
			},
			genres(callback) {
				Genre.find(callback);
			},
		},
		(err, results) => {
			if (err) return next(err);
			res.render('book_form', {
				title: 'Create Book',
				authors: results.authors,
				genres: results.genres,
			});
		}
	);
}

// Handle Book create on POST.
export const book_create_post = [
	// Convert the genre to an array.
	(req, res, next) => {
		if (!Array.isArray(req.body.genre)) {
			req.body.genre =
				typeof req.body.genre === undefined ? [] : [req.body.genre];
		}
		next();
	},

	// Validate and sanitize fields.
	body('title', 'Title must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('author', 'Author must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('summary', 'Summary must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('isbn', 'ISBN must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('genre.*').escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		// Create a Book object with escaped and trimmed data.
		const book = new Book({
			title: req.body.title,
			author: req.body.author,
			summary: req.body.summary,
			isbn: req.body.isbn,
			genre: req.body.genre,
		});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages...
			// Get all authors and genres for form.
			async.parallel(
				{
					authors(callback) {
						Author.find(callback);
					},
					genres(callback) {
						Genre.find(callback);
					},
				},
				(err, results) => {
					if (err) return next(err);
					// Mark our selected genres as checked.
					for (const genre of results.genres) {
						if (book.genre.includes(genre._id)) {
							// Current genre is selected. Set "checked" flag.
							genre.checked = 'true';
						}
					}
					res.render('book_form', {
						title: 'Create Book',
						authors: results.authors,
						genres: results.genres,
						book,
						errors: errors.array(),
					});
				}
			);
			return;
		}

		// Data from form is valid. Save book.
		book.save((err) => {
			if (err) return next(err);
			// Successful: redirect to new book record.
			res.redirect(book.url);
		});
	},
];

// Display Book delete form on GET.
export function book_delete_get(req, res) {
	res.send(`NOT IMPLEMENTED: Book delete GET`);
}

// Handle Book delete on POST.
export function book_delete_post(req, res) {
	res.send(`NOT IMPLEMENTED: Book delete POST`);
}

// Display Book update form on GET.
export function book_update_get(req, res) {
	res.send(`NOT IMPLEMENTED: Book update GET`);
}

// Handle Book update on POST.
export function book_update_post(req, res) {
	res.send(`NOT IMPLEMENTED: Book update POST`);
}
