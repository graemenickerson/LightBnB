const properties = require('./json/properties.json');
const users = require('./json/users.json');

// Set up database
const { Pool } = require('pg');
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

// / Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const sqlStatment = `
    SELECT *
    FROM users
    WHERE LOWER(email) = LOWER($1);
  `;
  return pool.query(sqlStatment, [email])
    .then(res => res.rows[0])
    .catch((err) => {return null});
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const sqlStatment = `
    SELECT *
    FROM users
    WHERE id = $1;
  `;
  return pool.query(sqlStatment, [id])
    .then(res => res.rows[0])
    .catch((err) => {return null});
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  const values = [user.name, user.email, user.password];
  const sqlStatment = `
    INSERT INTO users (name, email, password)
    VALUES ( $1, $2, $3)
    RETURNING id;
  `;
  return pool.query(sqlStatment, values)
    .then(res => res.rows)
    .catch((err) => {return null});
};
exports.addUser = addUser;

// / Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const values = [guest_id, limit];
  const sqlStatment = `
    SELECT properties.*, reservations.*, avg(rating) as average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id 
    WHERE reservations.guest_id = $1
    AND start_date <> NOW() OR end_date <> NOW()
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date DESC
    LIMIT $2;
  `;
  return pool.query(sqlStatment, values)
    .then(res => res.rows)
    .catch((err) => {return null});
}
exports.getAllReservations = getAllReservations;

// / Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  return pool.query(`
  SELECT * FROM properties
  LIMIT $1
  `, [limit])
  .then(res => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
