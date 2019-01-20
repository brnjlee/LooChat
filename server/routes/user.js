const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

const User = require('../models/User');

router.post('/register', function(req, res){

  const {errors, isValid} = validateRegisterInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({$or:[
          {email: req.body.email},
          {username: req.body.username}
        ]}).then(user => {
    if(user && user.email === req.body.email){ //just add if statement to find if the user has matching username or email
        return res.status(400).json({
            email: 'Email already exists'
        });
    } else if(user && user.username === req.body.username){
        return res.status(400).json({
            username: 'Username already exists'
        });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      //User.find({}, ['_id', 'name', 'avatar'], (err, users) => { //get all users and add them to the new users friend list (test purpose)
          const newUser = new User({
              name: req.body.name,
              email: req.body.email,
              username: req.body.username,
              password: req.body.password,
              acc_connections: [],
              pnd_connections: [],
              req_connections: [],
              avatar
          });
          bcrypt.genSalt(10, (err,salt) => {
              if(err) console.error('There was an error', err);
              else {
                  bcrypt.hash(newUser.password, salt,(err,hash) => {
                      if(err) console.error('There was an error', err);
                      else {
                          newUser.password = hash;
                          newUser
                              .save()
                              .then(user => {
                                  res.json(user)
                              });
                      }
                  });
              }
          });
      //});
    }
  });
});

router.post('/login', (req, res) => {
  const {errors, isValid } = validateLoginInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username})
    .then(user => {
      if(!user){
        errors.username = 'User not found';
        return res.status(404).json(errors);
      }
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch) {
            const payload = {
              id: user.id,
              name: user.name,
              username: user.username,
              avatar: user.avatar
            }
            jwt.sign(payload, 'secret', {
              expiresIn: 999999
            }, (err, token) => {
              if (err) console.error('There was an error in generating the token',err);
              else {
                res.json({
                  success: true,
                  token: `Bearer ${token}`
                });
              }
            });
          }
          else {
            errors.password = 'Incorrect Password';
            return res.status(400).json(errors);
          }
        });
    });
});

router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    pnd_connections: req.user.pnd_connections,
    connections: req.user.acc_connections
  });
});

router.get('/get_pnd_connections', passport.authenticate('jwt', {session: false}), (req, res) => {
    User.find({ username: {$in: req.user.pnd_connections}},
        ['_id', 'name', 'username', 'avatar'],
        (err, users) => {
            if(err) {
                res.send({error: 'Failed to fetch pnd_connections'})
            }
            return res.status(200).json(users)
    });
})

router.get('/get_acc_connections', passport.authenticate('jwt', {session: false}), (req, res) => {
    User.find({ username: {$in: req.user.acc_connections}},
        ['_id', 'name', 'username', 'avatar'],
        (err, users) => {
            if(err) {
                res.status(400).json({success: false, error: err})
            }
            return res.status(200).json(users)
    });
})

router.get('/get_user/:userId', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    User.find({ 
      $and: [
        {username: new RegExp(`^${req.params.userId}[^s]*`)},
        {username: {$ne:req.user.username}}
      ]},
        ['id', 'name', 'username', 'avatar', 'pnd_connections', 'acc_connections', 'req_connections'],
        {
            limit: 5,
            sort: {
                username: 1
            }
        },
        (err, users) => {
        if(err) {
            res.send({error: 'Failed to fetch users'}); 
            return next(err);
        }

        res.status(200).json(users);

    })
});

router.post('/add_user/:userId', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    User.updateOne({username: req.params.userId}, {
        $addToSet:{pnd_connections: req.user.username}
    }).then(() => {
        User.updateOne({username: req.user.username}, {
          $addToSet:{req_connections: req.params.userId}
        }).then(res => {
            res.status(200).json({success: true})
        }).catch(err => {
            
        })
    })
    
});

router.post('/confirm_user/pull/:userId', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    User.updateOne({username: req.user.username}, {
        $pullAll:{pnd_connections: [req.params.userId]},
        $addToSet:{acc_connections: req.params.userId}
    }).then(res => {

    }).catch(err => {

    });
    User.updateOne({username: req.params.userId}, {
        $pullAll:{req_connections: [req.user.username]},
        $addToSet:{acc_connections: req.user.username}
    }).then(res => {

    }).catch(err => {

    });
});

module.exports = router;
