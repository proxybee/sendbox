import dotenv from 'dotenv';
import moment from 'moment';
import { v4 as uuid4 } from 'uuid';
import db from '../models/index';
import sendUpdateEmail from '../helpers/updateNotification';
import {
  createParcelsSchema,
  destinationSchema,
  // changeCurrentLocation,
  currentLocationSchema,
  changeStatusSchema,
} from '../helpers/validator';

dotenv.config();
const tDate = new Date();
const updatedDate = moment(tDate).format('MM/DD/YYYY, HH:MM');

class Parcels {
  static create(req, res) {
    const newOrder = {
      id: uuid4(),
      senderId: req.user,
      weight: req.body.weight,
      weightMetric: 'kg',
      status: 'pending',
      fromAddress: req.body.fromAddress,
      toAddress: req.body.toAddress,
      currentLocation: req.body.fromAddress,
      itemName: req.body.itemName,
      recipient: req.body.recipient,
      postDate: moment(tDate).format('MM/DD/YYYY, HH:MM'),
    };
    console.log(new Date());
    const fieldError = createParcelsSchema(newOrder);
    if (fieldError) {
      return res
        .status(400)
        .json({ status: res.statusCode, message: fieldError });
    }
    const createQuery = `INSERT INTO parcels (id,senderId,weight,weightMetric,status,fromAddress,toAddress,currentLocation,itemName,recipient,postDate) 
                  VALUES('${newOrder.id}','${newOrder.senderId}','${newOrder.weight}','${newOrder.weightMetric}','${newOrder.status}','${newOrder.fromAddress}'
                  ,'${newOrder.toAddress}','${newOrder.currentLocation}','${newOrder.itemName}','${newOrder.recipient}','${newOrder.postDate}') returning *`;
    db.query(createQuery)
      .then((result) => {
        let Msg;
        if (result.rowCount === 0) {
          Msg = res
            .status(500)
            .json({
              status: res.statusCode,
              Message:
                'An error occurred while trying to save your order ensure that weight is a valid number and Address are not empty',
            });
        } else if (result.rowCount >= 1) {
          Msg = res.status(201).json({
            status: res.statusCode,
            message: 'New parcel added successfully',
            data: result.rows[0],
            rows: result.rowCount,
          });
        }
        return Msg;
      })
      .catch((error) => {
        res
          .status(500)
          .json({
            status: res.statusCode,
            error: `An error occurred while trying to save your order ${error}`,
          });
      });
    return false;
  }

  static getAll(req, res) {
    if (!req.adminStatus) {
      const query = `SELECT * FROM parcels where placedBy ='${req.user}'`;
      db.query(query)
        .then((result) => {
          let Msg;
          if (result.rowCount === 0) {
            Msg = res
              .status(204)
              .json({
                status: res.statusCode,
                error: 'You have not created any parcels',
              });
          }
          if (result.rowCount >= 1) {
            Msg = res.status(200).json({
              status: res.statusCode,
              rows: result.rowCount,
              data: result.rows,
            });
          }
          return Msg;
        })
        .catch((error) => {
          res
            .status(500)
            .json({
              status: res.statusCode,
              'Could not get parcels from database': error,
            });
        });
    } else {
      const query = 'SELECT * FROM parcels';
      db.query(query)
        .then((result) => {
          let Msg;
          if (result.rowCount === 0) {
            Msg = res
              .status(204)
              .json({ status: res.statusCode, error: 'No Parcels' });
          }
          if (result.rowCount >= 1) {
            Msg = res.status(200).json({ status: res.statusCode, data: result.rows });
          }
          return Msg;
        })
        .catch((error) => {
          res
            .status(500)
            .json({
              status: res.statusCode,
              'Could not get parcels from database': error,
            });
        });
    }
  }

  static getOne(req, res) {
    const { id } = req.params;
    if (!req.adminStatus) {
      const query = `SELECT * FROM parcels WHERE id='${id}' AND placedBy='${req.user}'`;
      db.query(query)
        .then((result) => {
          let Msg;
          if (result.rowCount === 0) {
            Msg = res
              .status(400)
              .json({
                status: res.statusCode,
                error: 'You do not own such parcel delivery order',
              });
          }
          if (result.rowCount >= 1) {
            res
              .status(200)
              .json({ status: res.statusCode, data: result.rows[0] });
          }
          return Msg;
        })
        .catch((error) => {
          res
            .status(500)
            .json({
              status: res.statusCode,
              'Could not get parcels from database': error,
            });
        });
    } else {
      const query = `SELECT * FROM parcels WHERE ID='${id}'`;
      db.query(query)
        .then((result) => {
          let Msg;
          if (result.rowCount === 0) {
            Msg = res
              .status(204)
              .json({ status: res.statusCode, error: 'No such parcel' });
          }
          if (result.rowCount >= 1) {
            res
              .status(200)
              .json({ status: res.statusCode, data: result.rows[0] });
          }
          return Msg;
        })
        .catch((error) => {
          res
            .status(500)
            .json({
              status: res.statusCode,
              'Internal server error, please try again later': error,
            });
        });
    }
  }

  static cancel(req, res) {
    const { id } = req.params;
    const newStatus = 'canceled';
    const query = `UPDATE parcels SET status='${newStatus}',updatedDate='${updatedDate}' WHERE id='${id}' AND senderId='${req.user}' AND status NOT IN ('delivered','canceled') returning *`;
    db.query(query)
      .then((result) => {
        let Msg;
        if (result.rowCount === 0) {
          Msg = res
            .status(400)
            .json({
              status: 400,
              error: 'Ensure you are the owner of the parcel, and it not yet delivered or canceled',
            });
        }
        if (result.rowCount >= 1) {
          Msg = res
            .status(200)
            .json({
              status: 200,
              message: 'Your parcel delivery order has been canceled ',
              data: result.rows[0],
            });
        }
        return Msg;
      })
      .catch((error) => res
        .status(500)
        .json({ status: 500, 'Internal server error, please try again later': error }));
  }

  static changeDestination(req, res) {
    const { id } = req.params;
    const editedBy = req.user;
    const fieldError = destinationSchema(req.body);
    if (fieldError) {
      return res.status(400).json({ status: 400, error: fieldError });
    }
    const newDestination = req.body.toAddress;
    const query = `UPDATE parcels SET toAddress='${newDestination}',updatedDate='${updatedDate}' WHERE id='${id}' AND senderId='${editedBy}' AND status NOT IN ('delivered','canceled') returning *`;
    db.query(query)
      .then((result) => {
        let Msg;
        if (result.rowCount === 0) {
          Msg = res
            .status(400)
            .json({
              status: 400,
              Message: 'Bad request, ensure that you own the parcel and it is not yet delivered or canceled',
            });
        }
        if (result.rowCount >= 1) {
          Msg = res
            .status(200)
            .json({
              status: 200,
              Message: 'The destination has been changed successfully ',
            });
        }
        return Msg;
      })
      .catch((error) => res
        .status(500)
        .json({
          status: 500,
          'An error ocurred while trying to change the parcel Destination, try again': error,
        }));
    return false;
  }

  static changeCurrentLocation(req, res) {
    if (req.adminStatus) {
      const { id } = req.params;
      const fieldError = currentLocationSchema(req.body);
      if (fieldError) {
        return res.status(400).json({ status: 400, error: fieldError });
      }
      const { currentLocation } = req.body;
      const query = `UPDATE parcels SET currentLocation='${currentLocation}',updatedDate='${updatedDate}' WHERE id='${id}' AND (status != 'canceled' AND status != 'canceled') returning *`;
      db.query(query)
        .then((result) => {
          let Msg;
          if (result.rowCount === 0) {
            Msg = res
              .status(400)
              .json({ status: 400, error: 'No such parcel' });
          }
          if (result.rowCount >= 1) {
            res
              .status(200)
              .json({
                status: 200,
                Message:
                  'The current location of the order has been updated successfully ',
              });
          }
          return Msg;
        })
        .catch((error) => {
          res
            .status(500)
            .json({
              status: 500,
              'Internal server error, please try again later': error,
            });
        });
    } else {
      res.json({ Message: 'Only Admins can access this route' });
    }
    return false;
  }

  static changeStatus(req, res) {
    if (req.adminStatus) {
      const { id } = req.params;

      const fieldError = changeStatusSchema(req.body);
      if (fieldError) {
        return res
          .status(400)
          .json({ status: res.statusCode, error: fieldError });
      }
      const { status } = req.body;
      const query = `UPDATE parcels SET status='${status}',updatedDate='${updatedDate}' WHERE id='${id}' AND status NOT IN ('delivered','canceled')`;
      db.query(query)
        .then((result) => {
          let Msg;
          if (result.rowCount === 0) {
            Msg = res
              .status(400)
              .json({
                status: 400,
                error:
                'Could not find the parcel in database',
              });
          }
          if (result.rowCount >= 1) {
            sendUpdateEmail(req.email);
            res
              .status(200)
              .json({
                status: 200,
                Message:
                  'The status of the parcel has been changed successfully ',
              });
          }
          return Msg;
        })
        .catch((error) => {
          res
            .status(500)
            .json({
              status: 500,
              'Internal server error, please try again later': error,
            });
        });
    } else {
      res.json({ Message: 'Only Admins can access this route' });
    }
    return false;
  }
}

export default Parcels;
