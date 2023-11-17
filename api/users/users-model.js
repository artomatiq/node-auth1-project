const db = require('../../data/db-config')
/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
  function find() {
  return db('users')
    .select('user_id', 'username')
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
async function findBy(filter) {
  return await db('users')
    .where(filter)
    .first()
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
function findById(user_id) {
  return db('users')
    .select('user_id', 'username')
    .where('user_id', user_id)
    .first()
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
  const [userId] = await db('users')
    .insert(user)

  return findById(userId)
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  find, findBy, findById, add
}
