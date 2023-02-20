import { default as Genre } from '../models/genre.mjs';
import { default as Book } from '../models/book.mjs';
import async from 'async';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';

// Display list of all Genres.
export function genre_list(req, res) {
	Genre.find()
		.sort([['name', 'ascending']])
		.exec(function (err, list_genres) {
			if (err) {
				return next(err);
			}
			//Successful, so render
			res.render('genre_list', {
				title: 'Genre List',
				genre_list: list_genres,
			});
		});
}

// Display detail page for a specific Genre.
export function genre_detail(req, res, next) {
	const id = mongoose.Types.ObjectId(req.params.id);
	async.parallel(
		{
			genre(callback) {
				Genre.findById(id).exec(callback);
			},

			genre_books(callback) {
				Book.find({ genre: id }).exec(callback);
			},
		},
		(err, results) => {
			if (err) {
				return next(err);
			}
			if (results.genre == null) {
				// No results.
				const err = new Error('Genre not found');
				err.status = 404;
				return next(err);
			}
			// Successful, so render
			res.render('genre_detail', {
				title: 'Genre Detail',
				genre: results.genre,
				genre_books: results.genre_books,
			});
		}
	);
}

// Display Genre create form on GET.
export const genre_create_post = [
	// Validate and sanitize the name field.
	body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// There are errors. Render the form again with sanitized values/error messages.
			res.render('genre_form', {
				title: 'Create Genre',
				genre,
				errors: errors.array(),
			});
			return;
		} else {
			// Data from form is valid.
			// Check if Genre with same name already exists.
			Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
				if (err) {
					return next(err);
				}
				if (found_genre) {
					// Genre exists, redirect to its detail page.
					res.redirect(found_genre.url);
				} else {
					// Create a genre object with escaped and trimmed data.
					const genre = new Genre({ name: req.body.name });
					genre.save((err) => {
						if (err) {
							return next(err);
						}
						// Genre saved. Redirect to genre detail page.
						res.redirect(genre.url);
					});
				}
			});
		}
	},
];

// Handle Genre create on POST.
export function genre_create_get(req, res) {
	res.render('genre_form', { title: 'Create Genre' });
}

// Display Genre delete form on GET.
export function genre_delete_get(req, res, next) {
	async.parallel(
		{
			genre(callback) {
				Genre.findById(req.params.id).exec(callback);
			},
			genre_books(callback) {
				Book.find({ genre: req.params.id }).exec(callback);
			},
		},
		(err, results) => {
			if (err) return next(err);
			if (results.genre === null) {
				// No results.
				res.redirect('/catalog/genres');
			}
			// Successfull, so render.
			res.render('genre_delete', {
				title: 'Delete Genre',
				genre: results.genre,
				genre_books: results.genre_books,
			});
		}
	);
}

// Handle Genre delete on POST.
export function genre_delete_post(req, res, next) {
	async.parallel(
		{
			genre(callback) {
				Genre.findById(req.body.authorid).exec(callback);
			},
			genre_books(callback) {
				Book.find({ author: req.body.genreid }).exec(callback);
			},
		},
		(err, results) => {
			if (err) return next(err);
			// Success
			if (results.genre_books.length > 0) {
				// Genre has books. Render in same way as for GET route.
				res.render('genre_delete', {
					title: 'Delete Genre',
					genre: results.genre,
					genre_books: results.genre_books,
				});
				return;
			}
			// Genre has no books. Delete object and redirect to the list of genres.
			Genre.findByIdAndRemove(req.body.genreid, (err) => {
				if (err) return next(err);
				// Success - go to author list
				res.redirect('/catalog/genres');
			});
		}
	);
}

// Display Genre update form on GET.
export function genre_update_get(req, res) {
	res.send(`NOT IMPLEMENTED: Genre update GET`);
}

// Handle Genre update on POST.
export function genre_update_post(req, res) {
	res.send(`NOT IMPLEMENTED: Genre update POST`);
}
