// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const express = require('express')
const Auth = require('./auth-middleware')
const Users = require('../users/users-model')
const bcrypt = require('bcryptjs')


const router = express.Router()
/**
  1 [POST] /register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */
router.post('/register', Auth.checkPasswordLength, Auth.checkUsernameFree, async (req, res, next) => {
  try {
    const {username, password} = req.body
    const hash = await bcrypt.hashSync(password, 8)
    const newUser = {username, password: hash}
    const registeredUser = await Users.add(newUser)
    res.status(201).json(registeredUser)
  }
  catch (error) {
    next(error)
  }
})



/**
  2 [POST] /login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */


/**
  3 [GET] /logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router
