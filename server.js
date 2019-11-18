'use strict'

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pg = require('pg');
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

app.get('/search', newSearch);
app.use('*', notFoundHandler);
app.use(errorHandler);


function newSearch(req, res) {
  let url = `https://app.ticketmaster.com/discovery/v2/events.json?size=6&apikey=${process.env.TICKETMASTER_API_KEY}&city=seattle&startDateTime=2019-11-18T17:00:00Z`;

  superagent.get(url)
    .then(data => {
      const ticketMasterEvent = data.body._embedded.events.map( events => {
        return new TicketMaster(events);
      });
      res.status(200).json(ticketMasterEvent);
    })
    .catch(() => {
      errorHandler(`So sorry, something went wrong`, req, res);
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
  console.log('venues at 0: ', events._embedded.venues[0]);
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

