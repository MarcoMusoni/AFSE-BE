var express = require('express');
var cors = require('cors');
var cookieParser = require('cookie-parser');

var { dbInit } = require('./data/mongo');

const app = express();

// CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// mongodb initializion
dbInit().catch(err => {
  console.log(err);
});

/*
 * Endpoints
 */
var userRouter = require('./routes/user');
var heroesRouter = require('./routes/heroes');
var creditRouter = require('./routes/credit');
var bartersRouter = require('./routes/barters');
var cardsRouter = require('./routes/cards');

app.use('/user', userRouter);
app.use('/heroes', heroesRouter);
app.use('/credit', creditRouter);
app.use('/barters', bartersRouter);
app.use('/cards', cardsRouter);

app.listen(3000);
console.log('Listening on: http://localhost:3000');
