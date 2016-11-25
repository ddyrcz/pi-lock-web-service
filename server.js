var app = require('express')(),
    bodyParser = require('body-parser'),
    auth = require('./lib/routers/auth'),
    users = require('./lib/routers/cupboard'),
    mongoose = require('mongoose'),
    config = require('config'),
    cupboards = require('./lib/routers/cupboard'),
    morgan = require('./lib/common/morgan_resolver');

mongoose.connect(config.database);

app.use(bodyParser.json());
app.use(morgan());

app.use('/', auth);
app.use('/api/cupboards', cupboards);
app.use('/api/users', users);

app.listen(8000);