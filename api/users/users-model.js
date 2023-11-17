const db = require('../../data/db-config')

  function find() {
  return db('users')
    .select('user_id', 'username')
}
async function findBy(filter) {
  return await db('users')
    .where(filter)
    .first()
}

function findById(user_id) {
  return db('users')
    .select('user_id', 'username')
    .where('user_id', user_id)
    .first()
}

async function add(user) {
  const [userId] = await db('users')
    .insert(user)

  return findById(userId)
}

module.exports = {
  find, findBy, findById, add
}
