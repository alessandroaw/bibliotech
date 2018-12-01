var mongoose = require('mongoose');

// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Bibliotech';
const MONGODB_URI = 'mongodb://asisten:bibliotech3@ds123444.mlab.com:23444/bibliotech';

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI);

module.exports = {mongoose};
