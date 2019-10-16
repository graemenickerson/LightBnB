-- 4_most_visited_cities.sql
-- Greame Nickerson
-- October 2019

SELECT city, count(res.*) as total_reservations
FROM properties
JOIN reservations res ON properties.id = property_id
GROUP BY city
ORDER BY total_reservations DESC;