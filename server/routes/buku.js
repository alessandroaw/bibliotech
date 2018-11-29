const express = require('express');
const router = express.Router();
const {Anggota} = require('../models/anggota');
const {Buku} = require('../models/buku');
const {Review} = require('../models/review');
const {Pinjam} = require('../models/pinjam');
// const {Anggota} = require('../models/anggota');
const path = require('path');
const _ = require('lodash');
var {authenticate} = require('../middleware/authenticate');
// express().use(express.static(path.join(__dirname, '../public')));
var query;
var notFound;

router.get('/', authenticate, (req, res) => {

  if (query != null) {
    var keyword = new RegExp(".*"+query.keyword+".*","i");
    switch (query.category) {
      case 'judul':
        Buku.find( {judul: keyword}).then((books) => {
          res.render('search.hbs', { books });
        })
        .catch((e) => {
          res.render('search.hbs', { books });
        });
        break;
      case 'author':
        Buku.find( {author: keyword}).then((books) => {
          res.render('search.hbs', { books });
        })
        .catch((e) => {
          res.render('search.hbs', { books });
        });
        break;
      default:
        Buku.find( {genre: keyword}).then((books) => {
          res.render('search.hbs', { books });
        })
        .catch((e) => {
          res.render('search.hbs', { books });
        });
      }
  } else {
    res.render('search.hbs');
  }
  query = null;
});

router.post('/', authenticate, (req, res) => {
  // var keyword = new RegExp(".*"+"kimba"+".*","i");
  query = _.pick(req.body,['keyword','category']);
  res.redirect('/buku');
});

router.get('/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var nama = req.namaAnggota;
  var reviewer = [];

  Buku.findById(id).then((book) => {
    Review.find({_idBuku: id})
    .populate('_idAnggota')
    .then((reviews) => {
      res.render('databuku.hbs', {book, nama, reviews});
    });
  }).catch((e) => {
    res.status(400).send(e);
  });
});

router.post('/:id/pinjam', authenticate, (req, res) => {
  var pinjam = new Pinjam({
    _idAnggota:req.session.userId,
    _idBuku:req.params.id,
    tanggalPinjam: new Date(),
  });

  pinjam.save().then((doc) => {
    Buku.findByIdAndUpdate(
      doc._idBuku,
      {
        $inc:{stok:-1}
      },{
      returnOriginal:false
    }).then((buku) => {
    });
    res.redirect(`/buku/${req.params.id}`);
  }).catch((e) => {
    res.status(400).send(e);
  });

});

router.post('/:id/review', authenticate, (req, res) => {
  var review = new Review({
    _idAnggota: req.session.userId,
    _idBuku:req.params.id,
    review:req.body.review,
    rating: 8
  });

  review.save().then((doc) => {
    res.redirect(`/buku/${req.params.id}`);
  }).catch((e) => {
    res.status(400).send();
  });

});

module.exports = router;
