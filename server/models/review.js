const mongoose = require('mongoose');

var ReviewSchema = new mongoose.Schema({
  _idAnggota:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'anggota',
    required: true
	},
  _idBuku:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'buku',
    required: true
  },
  review: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    default: 10
  }
});

var Review = mongoose.model('review', ReviewSchema);

module.exports = {Review};
