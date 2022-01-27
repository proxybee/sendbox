import db from './index';

const queryText = ` DROP TABLE IF EXISTS parcels;
                    DROP TABLE IF EXISTS users;`;
db.query(queryText)
  .then(() => {
    console.log('tables dropped');
  })
  .catch((err) => {
    console.log(err, 'error occurred while dropping tables', db);
    // db.end();
  });
