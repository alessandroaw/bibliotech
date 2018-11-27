const validator = require('validator');
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var AnggotaSchema = new mongoose.Schema({
	nama:{
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	email:{
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate:{
			validator:validator.isEmail,
			message:"{VALUE} is not a valid email"
		}
	},
	password:{
			type: String,
			required: true,
			minlength: 6,
	},
	passwordConf:{
			type: String,
			required: true,
			minlength: 6,
	},
});

AnggotaSchema.methods.toJSON = function(){
	var anggota = this;
	var userObject = anggota.toObject();

	return _.pick(userObject, ['_id','nama', 'email']);
};

AnggotaSchema.statics.findByCredentials = function (email, password){
	var Anggota = this;
	return Anggota.findOne({email}).then((anggota) => {

		if(!anggota){
			return Promise.reject();
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, anggota.password, (err,res) => {
			  if(res){
					resolve(anggota);
				} else {
					reject();
				}
			});
		});
	})
};

AnggotaSchema.pre('save', function (next) {
	var anggota = this;
	if (anggota.isModified('password')){
		bcrypt.genSalt(10, (error, salt) => {
			bcrypt.hash(anggota.password, salt, (err, hash) => {
		    anggota.password = hash;
				next();
		  });
		});
	} else {
		next();
	}
});

var Anggota = mongoose.model('anggota', AnggotaSchema);
module.exports = {Anggota};
