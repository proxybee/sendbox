import db from './index';

const parcelQuery = `CREATE TABLE IF NOT EXISTS
      parcels(
        id UUID PRIMARY KEY,
        weight FLOAT NOT NULL, 
        weightMetric VARCHAR NOT NULL,
        sentOn TIMESTAMP,
        deliveredOn DATE,
        status VARCHAR NOT NULL,
        fromAddress VARCHAR NOT NULL,
        toAddress VARCHAR NOT NULL,
        currentLocation VARCHAR,
        itemName VARCHAR(120),
        recipient VARCHAR(120),
        postDate DATE,
        updatedDate DATE,
        senderId VARCHAR NOT NULL
      )`;
setTimeout(() => {
  db.query(parcelQuery)
    .then(() => {
      console.log('parcels table created!');
    })
    .catch((err) => {
      console.log('An error occurred while creating parcels table: ', err);
    });
}, 100);
