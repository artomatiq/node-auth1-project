const express = require('express')
const Auth = require('./auth-middleware')
const Users = require('../users/users-model')
const bcrypt = require('bcryptjs')


const router = express.Router()

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

router.post('/login', Auth.checkUsernameExists, async (req, res, next) => {
  try {
    if (bcrypt.compareSync(req.body.password, req.existing.password)) {
      req.session.user = req.existing
      res.status(200).json({message: `welcome ${req.existing.username}`})
    }
    else {
      res.status(401).json({message: 'Invalid credentials'})
    }
  }
  catch (error) {
    next(error)
  }
})


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

router.get('/logout', async (req, res, next) => {
  if (req.session.user) {
    req.session.destroy(error => {
      if (error) {
        res.json({message: 'you shall not leave'})
      }
      else res.status(200).json({message: 'logged out'})
    })
  }
  else {
    res.set('Set-cookie', 'chocolatechip=; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00')
    res.status(200).json({message: 'no session'})
  }
})


module.exports = router
