import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const pool = new Pool({
  connectionString: process.env.DB_URL,
});
pool.connect((err) => {
  if (err) {
    console.log('could not connect to postgres:', err);
  }
  pool.query('SELECT NOW() AS "theTime"', (error, result) => {
    if (error) {
      console.log('error running query:', error);
    } else {
      console.log(result.rows[0].theTime);
    }
  });
  // pool.end();
});

export default {
  query(text, params) {
    return new Promise((resolve, reject) => {
      pool.query(text, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
