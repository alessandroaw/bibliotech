const express = require('express');
const router = express.Router();
const {Pustakawan} = require('../models/pustakawan');
const {Buku} = require('../models/buku');
const {Pinjam} = require('../models/pinjam');
const path = require('path');
const _ = require('lodash');
// express().use(express.static(path.join(__dirname, '../public')));
  // GET route for reading data
  router.get('/login', (req, res) =>{
    res.render('loginpust.hbs');
  // if(req.session){
    // res.redirect('/buku')
  // }
  console.log('apakah ini');
});

// router.get('/signup', (req, res, next) => {
//   // res.send('hello world')
//   // return res.sendFile(path.join(__dirname, '../templateLogReg/index.html'));
//   res.render('signup.hbs');
// });
//
router.post('/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  // console.log(1);
  if(body.email && body.password){
    // console.log(2);
    // console.log(body);
    Pustakawan.findByCredentials(body.email, body.password).then((pustakawan) => {
      // console.log(3);
      req.session.userId = pustakawan._id;
      // res.send('<h1>Success</h1>')
      res.redirect('/pustakawan/observe');
      // return res.redirect('pustakawan/profile');
    }).catch((e) => {
      // console.log(4);
      res.status(400).send();
    });

  } else {

    res.redirect('/pustakawan/login');
  }
});
//
//
//POST route for updating data
router.post('/signup', (req, res, next) => {
  // confirm that pustakawan typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.nama &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      nama: req.body.nama,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }


    Pustakawan.create(userData, (error, pustakawan) => {
      if (error) {
        res.send(error)
        return next(error);
      } else {
        // req.session.userId = pustakawan._id;
        res.send(pustakawan)
        // return res.redirect('/pustakawan/profile');
      }
    });

  } else {
    // var err = new Error('All fields required.');
    // err.status = 400;
    // return next(err);
    res.status(400).send('All fields required');
  }
})
//
// // GET route after registering

router.get('/profile', (req, res) => {
  res.send('<h1>Success</h1>');
});

// GET OBSERVE
router.get('/observe', (req, res) => {

  Pinjam.find({isDikembalikan:false})
  .populate('_idBuku')
  .populate('_idAnggota')
  .then((pinjam) => {
    console.log(pinjam);
    res.render('pemantauan.hbs', {pinjam});
  }).catch((e) => {
    res.status(400).send();
  });
});

router.post('/return/:id', (req, res) => {
  var id = req.params.id;
  console.log('ID Buku = ',id);
  date = new Date();
  Pinjam.findByIdAndUpdate(
    id,{
    $set:{
      isDikembalikan:true,
      tanggalPengembalian: date
    }
  },{returnOriginal:false}).then((doc) => {
    console.log(doc._idBuku);
    Buku.findByIdAndUpdate(doc._idBuku,{$inc:{stok:1}}).then((buku) => {
      console.log(buku);
    });
    console.log('ini ', doc);
    res.redirect('/pustakawan/observe');
  }).catch((e) => {
    res.status(400).send(e);
  });

});

// GET for logout logout
router.get('/logout', (req, res, next) => {
  if (req.session) {
    // delete session object
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  } else {
    res.statis(400).send('<h1>You are not logged in yet, you need to log in to log out</h1>')
  }
});

module.exports = router;
