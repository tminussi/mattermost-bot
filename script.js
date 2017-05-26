var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var api = require('./acelerato-api');

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/baseconhecimento', api.busca);

app.listen(3000, '0.0.0.0', function () {
    console.log('The server is up and running. Now, stop starring at me and go work on your bot, please.');
});