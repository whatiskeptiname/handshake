var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema(
    {
        uid: String,
        gibberish: Array,
        infected: {type: Boolean, default: false},
        contaminated: {type: Boolean, default: false}

    }
);

module.exports = mongoose.model('User', user); 
