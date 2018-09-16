// load the things we need
var mongoose = require('mongoose');

// define the schema for our model
var addressSchema = mongoose.Schema({
  address_type: Number,
  address: String
});

// define the schema for our model
var accountSchema = mongoose.Schema({
  address: String,
  addresses: [addressSchema]
});

// create the model and expose it to our app
var Account = mongoose.model('Account', accountSchema);

Account.ensureIndexes(function (err) {
  if (err) console.log('Account Model', err);
});

module.exports = Account;