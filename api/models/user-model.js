const db = require('../../config/config');

module.exports = {
  add,
  find,
  findBy,
  findById,
};

function find() {
  return db('users');
}

function findBy(filter) {
  console.log('findBy',filter);
  return db('users')
            .where(filter)
            .select('id','username','department');
}

function findById(id) {
  return db('users')
            .where({id})
            .select('id','username','department')
            .first();
};

function add(userCreds) {
  return db('users')
            .insert(userCreds, 'id')
            .then(ids => {
              const [id] = ids;
              return findById(id);
            });
};