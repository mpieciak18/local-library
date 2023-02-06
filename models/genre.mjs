import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Genre = Schema({
	name: {
		type: String,
		minLength: 3,
		maxLength: 100,
		required: true,
	},
});

Genre.virtual('url').get(function () {
	return `/catalog/genre/${this._id}`;
});

export default mongoose.model('Genre', Genre);
