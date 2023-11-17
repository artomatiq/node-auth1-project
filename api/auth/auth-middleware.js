const Users = require('../users/users-model')

function restricted(req, res, next) {
  if (req.session) {
    next()
  }
  else {
    next({status: 401, message: 'You shall not pass!'})
  }
}

async function checkUsernameFree(req, res, next) {
  try {
    const exists = await Users.findBy({username: req.body.username})
    if(!exists) next()
    else next({status: 422, message: 'Username taken'})
  }
  catch (error) {
    next(error)
  }
}

async function checkUsernameExists(req, res, next) {
  try {
    const existing = await Users.findBy({username: req.body.username})
    if (!existing) res.status(401).json({message: 'Invalid credentials'})
    else {
      req.existing = existing
      next()
    }
  }
  catch (error) {
    next(error)
  }
}

async function checkPasswordLength(req, res, next) {
  if (!req.body.password || req.body.password.length<=3) {
    res.status(422).json({message: 'Password must be longer than 3 chars'})
  }
  else next()
}

module.exports = {restricted, checkUsernameFree, checkUsernameExists, checkPasswordLength}