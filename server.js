'use strict'

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
require('ejs');

// app.use(cors());

const app = express();
const PORT = process.env.PORT || 3001;

const client = new pg.Client(process.env.DATABASE_URL)

//added line below in case it's needed later
client.on('err', err => { throw err; });
////////////////////////////////////////////

app.use(express.urlencoded({ extended: true }));
//added line below for when it's needed later
app.set('view engine', 'ejs');
////////////////////////////////////////////

app.use(express.static('./public'));
app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    // look in urlencoded POST bodies and delete it
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}));

app.get('/', homePage);
app.get('/search', searchHandler);
// app.get('/searches', newSearch);

app.get('/aboutUS', aboutUS);

app.post('/events', addEvent);
app.get('/events/:event_id', getOneEvent);
app.get('/saved', getEvents);
app.delete('/delete/:event_id', deleteEvent);

app.use('*', notFoundHandler);
app.use(errorHandler);





function homePage(request, response) {
  response.render('pages/index');
}

function aboutUS(request, response) {
  response.render('pages/searches/aboutUS');
}

// function newSearch(req, res) {
//   // renders the search form 'pages/searches/new'
//   res.render('pages/searches/events');
// }

function searchHandler(req, res) {

  console.log('search form entry: ', req.query.search);
  let userSearchKeyword = req.query.search;

  let date = new Date();
  let startDateTime = date.toISOString().split('.')[0] + 'Z';
  let url = `https://app.ticketmaster.com/discovery/v2/events.json?size=6&apikey=${process.env.TICKETMASTER_API_KEY}&city=seattle&startDateTime=${startDateTime}&keyword=${userSearchKeyword}`;


  superagent.get(url)
    .then(data => data.body._embedded.events.map(events => new TicketMaster(events)))
    .then(eventsArr => res.render('pages/searches/events', { eventsArrKey: eventsArr }))
    .catch(() => {
      res.render('pages/error');
    });
}

function TicketMaster(events) {
  this.name = events.name;
  this.date = events.dates.start.localDate;
  this.venue = events._embedded.venues[0].name;
  this.description = events.info;
  this.address_line_1 = events._embedded.venues[0].address.line1;
  this.address_line_2 = events._embedded.venues[0].address.line2;

  this.address_line_3 = `${events._embedded.venues[0].city.name}, ${events._embedded.venues[0].state.stateCode} ${events._embedded.venues[0].postalCode}`;

  this.img_url = events.images[0].url;
  // console.log('venues at 0: ', events._embedded.venues[0]);
}

/////////

function addEvent(req, res) {
  console.log('saving that event to the database...', req.body, req.params);

  let { name, date, venue, description, address_line_1, address_line_2, address_line_3, img_url } = req.body;

  // save book to database
  let sql = 'INSERT INTO my_events (name, date, venue, description, address_line_1, address_line_2, address_line_3, img_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);';

  let safeValues = [name, date, venue, description, address_line_1, address_line_2, address_line_3, img_url];

  // select that book back from the DB with the id
  client.query(sql, safeValues)
    .then(res.redirect('/saved'));
}

function getEvents(req, res) {
  let SQL = 'SELECT * FROM my_events;';
  return client.query(SQL)
    .then(results => {
      // console.log(results);
      return res.render('pages/searches/savedEvents', { results: results.rows })
    })
    .catch(() => {
      res.render('pages/error');
    })
  // res.render('pages/index');
}

function getOneEvent(req, res) {
  console.log('req.params: ', req.params);
  let SQL = 'SELECT * FROM my_events WHERE id=$1;';
  let values = [req.params.event_id];

  return client.query(SQL, values)
    .then(result => {
      return res.render('pages/searches/eventDetail', { event: result.rows[0] });
    })
    .catch(err => console.error(err));
}

function deleteEvent(request, response) {
  // console.log('delete me ', request.body)
  // console.log('delete me ', request.params.id)
  // need SQL to update the specific task that we were on
  let SQL = `DELETE FROM my_events WHERE id=$1;`;
  let id = request.body.id;
  client.query(SQL, [id])
    .then(response.redirect('/saved'))
    .catch(err => console.error(err));
}

/////////////////////////
// *** Other functions will go here
/////////////////////////

function notFoundHandler(req, res) {
  res.status(404).send('Page does not exist');
}

function errorHandler(error, req, res) {
  res.status(500).send(error);
}

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on ${PORT}`);
    })
  })
  .catch(err => {
    throw `PG startup error ${err.message}`;
  })

