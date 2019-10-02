const jwt = require('jsonwebtoken');
const secrets = require('../../config/secrets');

module.exports = {
  checkRegInfo,
  checkLoginInfo,
  restricted
}

function checkRegInfo(req, res, next) {
  const { username, password, department } = req.body;
  let error = 0;

  if( username === undefined || username.trim() === "")     { error++; }
  if( password === undefined || password.trim() === "")     { error = error + 2; }
  if( department === undefined || department.trim() === "") { error = error + 4; }

  switch(error) {
    case 1:
      return res.status(400).json({ message: 'username is required' });
    case 2:
      return res.status(400).json({ message: 'password is required' });
    case 3:
      return res.status(400).json({ message: 'username and password is required' });
    case 4:
      return res.status(400).json({ message: 'department is required' });
    case 5:
      return res.status(400).json({ message: 'username and department is required' });
    case 6:
      return res.status(400).json({ message: 'password and department is required' });
    case 7:
      return res.status(400).json({ message: 'username, password, and department is required' });
    default:
      req.user = { username, password, department };
      next();
  }
}

function checkLoginInfo(req, res, next) {
  const { username, password } = req.body;
  let error = 0;

  if( username === undefined || username.trim() === "") { error++; }
  if( password === undefined || password.trim() === "") { error = error + 2; }

  switch(error) {
    case 1:
      return res.status(400).json({ message: 'username is required' });
    case 2:
      return res.status(400).json({ message: 'password is required' });
    case 3:
      return res.status(400).json({ message: 'username and password is required' });
    default:
      next();
  }
}

function restricted(req, res, next) {
  const token = req.headers.authorization;

  if(token) {
    jwt.verify(token, secrets.jwtSecrets, (err, decodedToken) => {
      if(err) {
        res.status(401).json({ message: 'Not Authorized' });
      } else {
        console.log('decodedToken', decodedToken);
        req.user = {
          username: decodedToken.username,
          department: decodedToken.department
        };
        next();
      }
    });
  } else {
    res.status(400).json({ message: 'Auth token required' });
  }
}