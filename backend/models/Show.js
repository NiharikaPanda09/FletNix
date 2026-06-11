const mongoose = require('mongoose');

const ShowSchema = new mongoose.Schema({
  show_id: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String, // Movie or TV Show
    required: true
  },
  title: {
    type: String,
    required: true
  },
  director: {
    type: String,
    default: ''
  },
  cast: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  date_added: {
    type: String,
    default: ''
  },
  release_year: {
    type: Number,
    required: true
  },
  rating: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: ''
  },
  listed_in: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Show', ShowSchema);
