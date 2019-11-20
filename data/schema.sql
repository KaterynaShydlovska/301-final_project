DROP TABLE IF EXISTS my_events;

CREATE TABLE my_events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  date VARCHAR(255),
  venue VARCHAR(3000),
  description VARCHAR,
  address_line_1 VARCHAR(255),
  address_line_2 VARCHAR(255),
  address_line_3 VARCHAR(255),
  img_url VARCHAR(255)
);

-- INSERT INTO my_events (
--   name, 
--   date, 
--   venue, 
--   description, 
--   address_line_1, 
--   address_line_2,
--   address_line_3,
--   img_url
-- )
-- VALUES (
--   'test name value', 
--   'test date value', 
--   'test venue value',
--   'test description value',
--   'test address_line_1 value',
--   'test address_line_2 value',
--   'test address_line_3 value',
--   'test img_url value'
-- );