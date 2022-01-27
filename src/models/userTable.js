import db from './index';

const userQuery = `CREATE TABLE IF NOT EXISTS
      users(
        id UUID PRIMARY KEY,
        firstName VARCHAR(128) NOT NULL,
        lastName VARCHAR(128) NOT NULL,
        otherNames VARCHAR(128),
        email VARCHAR(128) UNIQUE NOT NULL,
        username VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
        registered DATE,
        lastLogin DATE,
        updatedDate DATE,
        isVerified BOOLEAN,
        isAdmin BOOLEAN
      )`;
(() => {
  db.query(userQuery)
    .then(() => {
      console.log('users table created!');
    })
    .catch((err) => {
      console.log('An error occurred while creating users:', err);
    });
})();
