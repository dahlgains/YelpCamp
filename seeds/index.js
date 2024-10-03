const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      // YOUR USER ID
      author: '66bdc34df8b40aac30654910',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: [
        {
          url: 'https://res.cloudinary.com/djgs1gg2g/image/upload/v1724312950/YelpCamp/xofdmkavx6kdoh1apwwr.png',
          filename: 'YelpCamp/xofdmkavx6kdoh1apwwr',
        },
        {
          url: 'https://res.cloudinary.com/djgs1gg2g/image/upload/v1724312950/YelpCamp/uuyac2xixmxvrczgsqmr.png',
          filename: 'YelpCamp/uuyac2xixmxvrczgsqmr',
        },
      ],
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Assumenda dolores libero quo, aliquid ipsum numquam error aperiam quaerat id exercitationem possimus corporis quia officiis dignissimos, qui incidunt ratione doloremque quas!',
      price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
