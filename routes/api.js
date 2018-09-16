var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Account = require('../models/account');
var config = require('../config');
var verifyToken = require('../auth/verifyToken');

/* GET users listing. */
router.get('/addresses', function(req, res, next) {
  Account.findOne({
    'alias': req.query.alias
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

router.post('/auth', function(req, res, next) {
  Account.findOne({
    'alias': req.body.alias
  }, function (err, account) {
    if (err || !account){
      res.status(400).end();
      return
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, account.password);
    if (!passwordIsValid) return res.status(401).send({ jwt: null });

    // create a token
    var token = jwt.sign({ id: account._id }, config.secret, {
      expiresIn: 86400
    });

    res.status(200).send({ jwt: token });
  });

});

router.post('/users', function(req, res, next) {
  Account.findOne({
    'alias': req.body.alias
  }, function (err, account) {
    if (err){
      console.log("API - New Account", err);
      return res.status(500).end();
    }
    if (account){
      console.log("API - New Account - Already existing", err);
      return res.status(400).end();
    }

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    var account = new Account();
    account.alias = req.body.alias;
    account.password = hashedPassword;

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

router.delete('/users', verifyToken, function(req, res, next) {
  Account.deleteOne({
    '_id': req.userId
  }, function (err) {
    if (err) {
      res.status(400).end();
    } else {
      res.status(200).end();
    }
  });
});

router.put('/addresses', verifyToken, function(req, res, next) {
  Account.findOne({
    '_id': req.userId
  }, function (err, account) {
    if (err) return res.status(500).end();

    if(account.addresses.find(a => a.address_type === req.body.address_type)) return res.status(400).end();
    
    account.addresses.push({
      address_type: req.body.address_type,
      address: req.body.address
    });

    account.save(function (err) {
      if (err) {
        console.log("API - Error saving account", err);
        res.status(500).end();
      } else {
        res.status(200).end();
      }
    });
  });
});

router.delete('/addresses/:address_type', verifyToken, function(req, res, next) {
  Account.findOne({
    '_id': req.userId
  }, function (err, account) {
    if (err) return res.status(500).end();

    var address = account.addresses.find(a => a.address_type === req.params.address_type);

    var addressIndex = account.addresses.indexOf(address);

    account.addresses.splice(addressIndex, 1);

    account.save(function (err) {
      if (err) {
        console.log("API - Error saving account", err);
        res.status(500).end();
      } else {
        res.status(200).end();
      }
    });
  });
});

module.exports = router;
