const mongoose = require('mongoose');
const Campground = require('./campground');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  title: String,
  description: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Review', reviewSchema);
