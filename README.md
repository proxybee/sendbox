# sendbox

A dispatch/delivery API which helps users deliver parcels to different destinations. Sendbox provides courier quotes based on weight categories.

## Table of Content
* [Featuress](#feature)
* [Core Technologies Used](#core-technologies-used)
* [Link to API Endpoints](#link-to-api-endpoints)
* [API Endpoints](#api-endpoints)
* [How to clone the project](#how-to-clone-the-project)
* [Author](#author)

### Feature
* There are two types of users admin and regular user
* Users can Register if they have no account or login otherwise
* Users can post a new parcel delivery order by adding required fields
* Users can change the destination of their parcels
* Users can cancel a parcel delivery order as long as it is not already canceled or delivered
* Users can get a list of delivery orders they have made if they have made any
* User can view a delivery order they have made
* Admin can get all delivery orders
* Admin can change the status of a delivery order
* Admin can update the current location of a parcel delivery order

### Core Technologies Used
* Nodejs: an open source server framework that allows you to run JavaScript on the server.
* Postgresql: open source object-relational database system
* Eslint: ESLint is a code analysis tool for identifying problematic patterns found in JavaScript
* Babel: JavaScript transcompiler that is mainly used to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript that can be run by older JavaScript engines

View package.json for more

### Link to API endpoints 
To be updated


### API endpoints
| Description     | Endpoint |
| ----------- | ----------- |
| Register new user      | /api/v1/auth/signup  |
| Login existing user      | /api/v1/auth/login  |
| Post a new order      | /api/v1/parcels  |
| Get all parcel delivery orders      | /api/v1/parcels  |
| Get one parcel delivery order      | /api/v1/parcels/:id  |
| Change parcel Destination      | /api/v1/parcels/:id/destination  |
| Change current location      | /api/v1/parcels/:id/location  |
| Update a parcel status     | /api/v1/parcels/:id/status  |
| Cancel a parcel delivery order      | /api/v1/parcels/:id/cancel  |
| Get all users   | /api/v1/users   |
| Get a single user      | /api/v1/users/:id |
| Make a User Admin      | /api/v1/users/:id/makeadmin  |
| Get parcels belonging to user      | /api/v1/users/:id/parcels  |


### How to clone the project:

To clone this repository: 

* Ensure you have git installed

* git clone git@github.com:proxybee/sendbox.git

* Run npm install

* Run npm start to start the server


### Author

* **Elizabeth Agoyi** - https://github.com/proxybee
