print('Start #################################################################');

db = db.getSiblingDB('tb_books');
db.createUser(
  {
    user: 'root',
    pwd: 'root',
    roles: [{ role: 'readWrite', db: 'tb_books' }],
  },
);

print('END #################################################################');
