const express = require('express')
const request = require('request');
const cors = require('cors');

const app = express();
const mongoose = require('mongoose');
require("dotenv").config()

app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})




// Connect to MongoDB 
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(express.json());

// CORS Management
app.use(cors());
app.options('*', cors())
// app.use(cors({
//     origin: 'https://localhost:8080/*',
//     methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
// }));

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

const eventsRouter = require('./routes/events');
app.use('/events', eventsRouter);

const roomsRouter = require('./routes/rooms');
app.use('/rooms', roomsRouter);

const testsRouter = require('./routes/tests');
app.use('/tests', testsRouter);

const customersRouter = require('./routes/customers');
app.use('/customers', customersRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port ' + process.env.PORT || 3000);
});