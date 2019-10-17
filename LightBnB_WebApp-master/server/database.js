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

// Builds SELECT statement for searching database
const buildQuery = (options, limit) => {
  let paramAdd = '';
  let paramFirst = true;
  const queryParams = [];
  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    LEFT JOIN property_reviews ON properties.id = property_id
  `;

  if(options.owner_id) {
    paramFirst ? paramAdd = 'WHERE' : paramAdd = 'AND';
    queryParams.push(options.owner_id);
    queryString += `${paramAdd} owner_id = $${queryParams.length} `;
    paramFirst = false;
  }
  if (options.city) {
    paramFirst ? paramAdd = 'WHERE' : paramAdd = 'AND';
    queryParams.push(`%${options.city}%`);
    queryString += `${paramAdd} LOWER(city) LIKE LOWER($${queryParams.length}) `;
    paramFirst = false;
  }
  if (options.minimum_price_per_night) {
    paramFirst ? paramAdd = 'WHERE' : paramAdd = 'AND';
    queryParams.push(options.minimum_price_per_night);
    queryString += `${paramAdd} cost_per_night >= $${queryParams.length} `;
    paramFirst = false;
  }
  if (options.maximum_price_per_night) {
    paramFirst ? paramAdd = 'WHERE' : paramAdd = 'AND';
    queryParams.push(options.maximum_price_per_night);
    queryString += `${paramAdd} cost_per_night <= $${queryParams.length} `;
    paramFirst = false;
  }

  queryString += `GROUP BY properties.id `;

  if (options.minimum_rating) {
    // paramFirst ? paramAdd = 'WHERE' : paramAdd = 'AND';
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
    paramFirst = false;
  }

  queryParams.push(limit);
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;
  return [queryString, queryParams];
};
/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = buildQuery(options, limit);
  return pool.query(queryParams[0], queryParams[1])
  .then(res => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const values = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
    property.country,
    property.street,
    property.city,
    property.province,
    property.post_code
  ];
  const sqlStatment = `
    INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;
  return pool.query(sqlStatment, values)
    .then(res => res.rows[0])
    .catch((err) => {return null});
};
exports.addProperty = addProperty;


