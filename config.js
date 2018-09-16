// config.js
module.exports = {
  'secret': process.env.SECRET || 'mysupersecret',
  'mongodb_conn': process.env.MONGODB || 'mongodb://localhost:27017/opencap-server'
};