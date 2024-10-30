const { hash, compare } = require('bcryptjs');
const { createHmac } = require('crypto');

exports.dohash = (value, saltvalue) => {
  const result = hash(value, saltvalue);
  return result;
};

exports.comparehash = (value, hashedValue) => {
  const result = compare(value, hashedValue);
  return result;
};

exports.hmac = (value, key) => {
  const result = createHmac('sha256', key).update(value).digest('hex');
  return result;
};
