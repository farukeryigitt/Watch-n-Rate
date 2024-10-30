const jwt = require('jsonwebtoken');

exports.identifier = (req, res, next) => {
  let token;
  if (req.headers.client === 'not-browser') {
    token = req.headers.authorization;
  } else {
    token = req.cookies['Authorization'];
  }
  if (!token) {
    res.status(403).json({ succes: false, message: 'you are unauthorized.' });
  }
  try {
    const userToken = token.split(' ')[1];
    const jwtverify = jwt.verify(userToken, process.env.JWT_KEY);
    if (jwtverify) {
      req.user = jwtverify;
      next();
    } else {
      throw new Error('error in token verify');
    }
  } catch (error) {
    console.log(error);
  }
};
