-- 2_avg_length_res.sql
-- Graeme Nickerson
-- October 2019

SELECT AVG(end_date - start_date) as average_duration
FROM reservations;