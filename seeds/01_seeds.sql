--  ALL PASWORDS: $2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.

-- Users
INSERT INTO users (name, email, password) VALUES ('Harry', 'harry@hogwarts.co.uk', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (name, email, password) VALUES ('Ron', 'ron@hogwarts.co.uk', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (name, email, password) VALUES ('Nevil', 'nevil@hogwarts.co.uk', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

-- Properties
INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Tower Room', 'A room in a tower', 'https://imgc.artprintimages.com/img/print/castle-tower-massaret-france_u-l-f88tkc0.jpg','https://imgc.artprintimages.com/img/print/castle-tower-massaret-france_u-l-f88tkc0.jpg', 200, 0, 0, 1, 'UK', 'Hogsmead', 'Hogsmead','Hogsmead','Hogsmead', true),
(2, 'A House In The Contry', 'A quaint house in the English country side. Comes with ghoul in the attic for that at home feel.', 'https://imgc.artprintimages.com/img/print/castle-tower-massaret-france_u-l-f88tkc0.jpg','https://imgc.artprintimages.com/img/print/castle-tower-massaret-france_u-l-f88tkc0.jpg', 250, 0, 0, 1, 'UK', 'Hogsmead', 'Hogsmead','Hogsmead','Hogsmead', true),
(3, 'Tower Basment', 'A room in a tower basement', 'https://imgc.artprintimages.com/img/print/castle-tower-massaret-france_u-l-f88tkc0.jpg','https://imgc.artprintimages.com/img/print/castle-tower-massaret-france_u-l-f88tkc0.jpg', 100, 0, 0, 1, 'UK', 'Hogsmead', 'Hogsmead','Hogsmead','Hogsmead', true);

-- Reservations
INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2019-04-15', '2019-04-18', 1, 3),
('2018-04-20', '2018-05-01', 2, 3),
('2019-10-01','2019-10-05',1, 2);

-- Property-Reviews
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) 
VALUES (3,1,1,5,'message'),
(3,2,2,5,'message'),
(2,1,3,5,'message');