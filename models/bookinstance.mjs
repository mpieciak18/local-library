import mongoose from 'mongoose';
import { DateTime } from 'luxon';

const Schema = mongoose.Schema;

const BookInstanceSchema = Schema({
	// reference to the associated book
	book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
	imprint: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
		enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
		default: 'Maintenance',
	},
	due_back: { type: Date, default: Date.now },
});

// Virtual for bookinstance's URL
BookInstanceSchema.virtual('url').get(function () {
	// We don't use an arrow function as we'll need the this object
	return `/catalog/bookinstance/${this._id}`;
});

// Virtual for bookinstance's due back date
BookInstanceSchema.virtual('due_back_formatted').get(function () {
	return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

// Export model
export default mongoose.model('BookInstance', BookInstanceSchema);
