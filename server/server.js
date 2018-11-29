//initialize library
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3000;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// local configuration
const {ObjectID} = require('mongodb');
const {mongoose} =  require('./db/mongoose');
var {Buku} = require('./models/buku');
var {Anggota} = require('./models/anggota');
var {authenticate} = require('./middleware/authenticate');
var app = express();

// route
const pustakawanRoute = require('./routes/pustakawan');
const anggotaRoute = require('./routes/anggota');
const bukuRoute = require('./routes/buku');
// const transaksiRoute = require('./routes/anggota');

//connect to MongoDB
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	// we're connected!
});

//use sessions for tracking logins
app.use(session({
	secret: 'work hard',
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: db
	})
}));

// return value is function
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//hbs initialization
hbs.registerPartials(path.join(__dirname, '../views/partials'));
hbs.registerHelper('getCurrentYear', () => {return new Date().getFullYear()});
hbs.registerHelper('toDateString', (date) => {return date.toDateString()});
hbs.registerHelper('gz', (value) => {return (value > 0)});
hbs.registerHelper('each_upto', function(ary, max, options) {
    if(!ary || ary.length == 0)
        return options.inverse(this);

    var result = [ ];
    for(var i = 0; i < max && i < ary.length; ++i)
        result.push(options.fn(ary[i]));
    return result.join('');
});

// set view engine
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '../public')));
// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// server logger
app.use((req,res, next) => {
	var now = new Date().toString();
	var log = `${now} : ${req.method} ${req.url}`;
	fs.appendFile('server.log', log, (err) => {
		if(err){
			console.log(`${now} : unable to append log`);
		}
	})
	next();
});

// public page

//home
app.get('/', (req, res) => {
	res.render('home.hbs', {
		pageTitle:'Home Page'
	});
});

//about
app.get('/about', (req, res) => {
	res.render('about.hbs', {
		pageTitle:'About Page',
	});
});
//
// app.get('login', (req,res) => {
// 	res.redirect('/anggota/login')
// });


// route
app.use('/anggota', anggotaRoute);
app.use('/pustakawan', pustakawanRoute);
app.use('/buku', bukuRoute);





// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
