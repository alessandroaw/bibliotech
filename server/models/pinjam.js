const mongoose = require('mongoose');

var PinjamSchema = new mongoose.Schema({
  _idAnggota:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'anggota',
    required: true
	},
  _idBuku:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'buku',
    required: true
	},
  tanggalPinjam: {
    type: Date,
    required: true
  },
  tanggalPengembalian: {
    type: Date,
    default: null
  },
  isDikembalikan: {
    type: Boolean,
    default: false
  }
});

var Pinjam = mongoose.model('pinjam', PinjamSchema);

module.exports = {Pinjam};
