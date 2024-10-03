const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

// We made ImageSchema so we can create a mongoose virtual on that specific Schema

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

// https://res.cloudinary.com/djgs1gg2g/image/upload/v1724312950/YelpCamp/uuyac2xixmxvrczgsqmr.png

// The reason we use a virtual, is because we don't need to store this "w_200" anywhere. We are just changing something in the response.
// So in our edit.ejs -> We should now have a property <%= img.thumbnail => and not just <%= img.url =>
ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_150');
});

// Essentially what we did is create a property on the Schema/Model that is not stored in the database.

const CampgroundSchema = new Schema(
  {
    title: String,
    image: [ImageSchema],
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String }}`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  opts
);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0, 50)}...</p>`;
});

// This is a query middleware that runs after the press of the delete button request has been sent. hence the "post"

CampgroundSchema.post('findOneAndDelete', async function (campground) {
  if (campground) {
    await Review.deleteMany({
      _id: {
        $in: campground.reviews,
      },
    });
  }
});

module.exports = mongoose.model('Campground', CampgroundSchema);
