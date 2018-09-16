// load the things we need
var mongoose = require('mongoose');

// define the schema for our model
var addressSchema = mongoose.Schema({
  address_type: {type: Number, required: true, unique: true},
  address: {type: String, required: true}
});

// define the schema for our model
var accountSchema = mongoose.Schema({
  alias: {type: String, required: true},
  password: {type: String, required: true},
  addresses: [addressSchema]
});

// create the model and expose it to our app
var Account = mongoose.model('Account', accountSchema);

Account.ensureIndexes(function (err) {
  if (err) console.log('Account Model', err);
});

module.exports = Account;