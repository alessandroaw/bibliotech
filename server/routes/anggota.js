const express = require('express');
const router = express.Router();
const {Anggota} = require('../models/anggota');
const {Buku} = require('../models/buku');
// const {Anggota} = require('../models/anggota');
const path = require('path');
const _ = require('lodash');
var {authenticate} = require('../middleware/authenticate');
var {notAuthenticate} = require('../middleware/authenticate');
// express().use(express.static(path.join(__dirname, '../public')));
// GET route for reading data
router.get('/login', (req, res, next) =>{
  // if(req.session){
  //   res.redirect('/buku')
  // }
  res.render('loginanggota.hbs');
});

router.get('/signup', (req, res, next) => {
  // res.send('hello world')
  // return res.sendFile(path.join(__dirname, '../templateLogReg/index.html'));
  res.render('signup.hbs');
});

router.post('/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  if(body.email && body.password){
    Anggota.findByCredentials(body.email, body.password).then((anggota) => {
      req.session.userId = anggota._id;
      return res.redirect('/buku');
    }).catch((e) => {
      e = 'Anggota tidak ditemukan :(';
      res.status(400).render('error.hbs',{e});
    });

  } else {

    res.redirect('/anggota/login');
  }
});


//POST route for updating data
router.post('/signup', (req, res, next) => {
  // confirm that anggota typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var e = 'passwords tidak sama :(';
    res.status(400).render('error.hbs',{e});
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

    Anggota.create(userData, (error, anggota) => {
      if (error) {
        res.send(error)
        return next(error);
      } else {
        req.session.userId = anggota._id;
        return res.redirect('/anggota/profile');
      }
    });

  } else {
    var e = 'All fields required.';
    res.status(400).render('error.hbs',{e});
  }
})

// GET route after registering
router.get('/profile', authenticate, (req, res, next) => {
  res.redirect('/buku');
  // return res.send('<h1>Name: </h1>' + anggota.nama + '<h2>Mail: </h2>' + anggota.email + '<br><a type="button" href="/anggota/logout">Logout</a>')
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
    res.status(400).send('<h1>You are not logged in yet, you need to log in to log out</h1>')
  }
});

module.exports = router;
