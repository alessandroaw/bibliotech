const mongoose = require('mongoose');
var BukuSchema = new mongoose.Schema({
  ISBN:{
			type: String,
			required: true,
      trim: true,
  		unique: true,
			minlength: 1,
		},
  judul:{
			type: String,
			required: true,
      trim: true,
			minlength: 1,
		},
  author:{
			type: String,
			required: true,
      trim: true,
			minlength: 1,
		},
  genre:{
			type: String,
			default: 'Comedy',
      trim: true,
			minlength: 1,
		},
  stok:{
			type: Number,
      default: 1
      // required: true,
		},
  penerbit:{
			type: String,
			default: 'Penerbit ITB',
      trim: true,
			minlength: 1,
		},
  lokasi:{
			type: String,
      required: true,
			default: 'A-3',
      trim: true,
			minlength: 1,
		}
});
// BukuSchema.statics.findByKeyword = function (category, keyword){
// 	var Buku = this;
//
//   if (category == judul) {
//
//   } else {
//
//   }
//
// 	return Buku.find({email}).then((buku) => {
// 		if(!buku){
// 			return Promise.reject();
// 		}
//     return Promise.resolve(buku);
//
//   })
// };

var Buku = mongoose.model('buku', BukuSchema);

module.exports = {Buku};
