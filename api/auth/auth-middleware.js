const Users = require('../users/users-model')
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  if (req.session) {
    next()
  }
  else {
    next({status: 401, message: 'You shall not pass'})
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
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

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  try {
    const exists = await !checkUsernameFree()
    if (!exists) res.status(401).json({message: 'Invalid credentials'})
  }
  catch (error) {
    next(error)
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
async function checkPasswordLength(req, res, next) {
  if (!req.body.password || req.body.password.length<=3) {
    res.status(422).json({message: 'Password must be longer than 3 chars'})
  }
  else next()
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {restricted, checkUsernameFree, checkUsernameExists, checkPasswordLength}