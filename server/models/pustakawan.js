const validator = require('validator');
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var PustakawanSchema = new mongoose.Schema({
	nama:{
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	username:{
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
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

PustakawanSchema.methods.toJSON = function(){
	var pustakawan = this;
	var userObject = pustakawan.toObject();

	return _.pick(userObject, ['_id','nama', 'username']);
};

PustakawanSchema.statics.findByCredentials = function (username, password){
	var Pustakawan = this;
	return Pustakawan.findOne({username}).then((pustakawan) => {

		if(!pustakawan){
			return Promise.reject();
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, pustakawan.password, (err,res) => {
			  if(res){
					resolve(pustakawan);
				} else {
					reject();
				}
			});
		});
	})
};

PustakawanSchema.pre('save', function (next) {
	var pustakawan = this;
	if (pustakawan.isModified('password')){
		bcrypt.genSalt(10, (error, salt) => {
			bcrypt.hash(pustakawan.password, salt, (err, hash) => {
		    pustakawan.password = hash;
				next();
		  });
		});
	} else {
		next();
	}
});

var Pustakawan = mongoose.model('pustakawan', PustakawanSchema);
module.exports = {Pustakawan};
