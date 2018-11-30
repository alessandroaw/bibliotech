var {Pustakawan} = require('./../models/pustakawan');
var authenticatePustakawan = (req, res, next) => {
	Pustakawan.findById(req.session.userId)
	.then((pustakawan) => {
		req.namaAnggota = pustakawan.nama;
		next();
	}).catch((e) => {
		next();
		res.redirect('/pustakawan/login');
		res.status(401).send();
	});
}

var notAuthenticate = (req, res, next) => {
	if (req.session == null) {
		return next();
	} else {
		return res.redirect('/pustakawan/observe')
	}
}


module.exports = {authenticatePustakawan, notAuthenticate};
