import { default as Author } from '../models/author.mjs';
import async from 'async';
import { default as Book } from '../models/book.mjs';
import { body, validationResult } from 'express-validator';

// Display list of all Authors.
export function author_list(req, res) {
	Author.find()
		.sort([['family_name', 'ascending']])
		.exec(function (err, list_authors) {
			if (err) {
				return next(err);
			}
			//Successful, so render
			res.render('author_list', {
				title: 'Author List',
				author_list: list_authors,
			});
		});
}

// Display detail page for a specific Author.
export function author_detail(req, res) {
	async.parallel(
		{
			author(callback) {
				Author.findById(req.params.id).exec(callback);
			},
			authors_books(callback) {
				Book.find({ author: req.params.id }, 'title summary').exec(
					callback
				);
			},
		},
		(err, results) => {
			if (err) {
				// Error in API usage.
				return next(err);
			}
			if (results.author == null) {
				// No results.
				const err = new Error('Author not found');
				err.status = 404;
				return next(err);
			}
			// Successful, so render.
			res.render('author_detail', {
				title: 'Author Detail',
				author: results.author,
				author_books: results.authors_books,
			});
		}
	);
}

// Display Author create form on GET.
export function author_create_get(req, res, next) {
	res.render('author_form', { title: 'Create Author' });
}

// Handle Author create on POST.
export const author_create_post = [
	// Validate and sanitize fields.
	body('first_name')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('First name must be specified.')
		.isAlphanumeric()
		.withMessage('First name has non-alphanumeric characters.'),
	body('family_name')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Family name must be specified.')
		.isAlphanumeric()
		.withMessage('Family name has non-alphanumeric characters.'),
	body('date_of_birth', 'Invalid date of birth')
		.optional({ checkFalsy: true })
		.isISO8601()
		.toDate(),
	body('date_of_death', 'Invalid date of death')
		.optional({ checkFalsy: true })
		.isISO8601()
		.toDate(),
	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			res.render('author_form', {
				title: 'Create Author',
				author: req.body,
				errors: errors.array(),
			});
			return;
		} else {
			// Data from form is valid.
			// Check if Author with same name already exists.
			Author.findOne({
				first_name: req.body.first_name,
				family_name: req.body.family_name,
				date_of_birth: req.body.date_of_birth,
				date_of_death: req.body.date_of_death,
			}).exec((err, found_author) => {
				if (err) {
					return next(err);
				}
				if (found_author) {
					// Author exists, redirect to its detail page.
					res.redirect(found_author.url);
				} else {
					// Create an Author object with escaped and trimmed data.
					const author = new Author({
						first_name: req.body.first_name,
						family_name: req.body.family_name,
						date_of_birth: req.body.date_of_birth,
						date_of_death: req.body.date_of_death,
					});
					author.save((err) => {
						if (err) {
							return next(err);
						}
						// Successful - redirect to new author record.
						res.redirect(author.url);
					});
				}
			});
		}
	},
];

// Display Author delete form on GET.
export function author_delete_get(req, res) {
	res.send(`NOT IMPLEMENTED: Author delete GET`);
}

// Handle Author delete on POST.
export function author_delete_post(req, res) {
	res.send(`NOT IMPLEMENTED: Author delete POST`);
}

// Display Author update form on GET.
export function author_update_get(req, res) {
	res.send(`NOT IMPLEMENTED: Author update GET`);
}

// Handle Author update on POST.
export function author_update_post(req, res) {
	res.send(`NOT IMPLEMENTED: Author update POST`);
}
