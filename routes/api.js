var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var Account = require('../models/account');

/* GET users listing. */
router.get('/addresses', function(req, res, next) {
  Account.findOne({
    'address': req.query.alias
  })
  .exec(function (err, account) {
    if (err || !account) {
      // Not found
      res.status(404).end();
      return;
    }
    res.json(account.addresses);
  });
});

router.post('/users', function(req, res, next) {
  Account.findOne({
    'address': req.body.username
  }, function (err, account) {
    if (err || account){
      res.status(400).end();
      return
    }

    var account = new Account();
    account.address = req.body.username;

    account.save(function (err) {
      if (err) {
        console.log("API - Error saving account", err);
        res.status(400).end();
      } else {
        res.status(200).end();
      }
    });
  });

});

module.exports = router;
