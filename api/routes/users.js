const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secrets = require('../../config/secrets');
const mw = require('../middleware/middleware');

const Users = require('../models/user-model');

const router = express.Router();

router.post('/register', mw.checkRegInfo, async (req, res) => {
  try {
    req.user.password = getHash(req.user.password);
  
    const user = await Users.add(req.user);
    res.status(200).json(user);
  }
  catch(err) {
    res.status(500).json({ error: 'There was an error adding user to the server' });
  }
});

router.post('/login', mw.checkLoginInfo, (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
          .first()
          .then(user => {
            if(user && bcrypt.compareSync(password, user.password)) {
              const token = getToken(user);
              res.status(200).json({
                username : user.username,
                department: user.department,
                token
              });
            } else {
              res.status(401).json({ error: 'Invalid Credentials' });
            }
          })
          .catch( err => {
            res.status(500).json({ error: 'There was an error with login' });
          })
});

router.get('/users', mw.restricted, async (req, res) => {
  try{
    const { department } = req.user;
    const users = await Users.findBy({ department });
    console.log(users);
    if(users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "There are no users in your department" });
    }
  }
  catch(err) {
    res.status(500).json({ error: 'There was an error trying to retrieve users' });
  }
});

function getHash(toHash) {
  return bcrypt.hashSync(toHash, 14);
}

function getToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department
  };
  const options = { expiresIn: '1h' };

  return jwt.sign(payload, secrets.jwtSecrets, options);
}

module.exports = router;