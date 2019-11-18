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
  res.render('search');
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

