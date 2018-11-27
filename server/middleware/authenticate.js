var {Anggota} = require('./../models/anggota');
var authenticate = (req, res, next) => {
	Anggota.findById(req.session.userId)
	.then((anggota) => {
		req.namaAnggota = anggota.nama;
		next();
	}).catch((e) => {
		next();
		res.redirect('/anggota/login');
		res.status(401).send();
	});
}

var notAuthenticate = (req, res, next) => {
	if (req.session == null) {
		return next();
	} else {
		return res.redirect('/buku')
	}
}


module.exports = {authenticate, notAuthenticate};
