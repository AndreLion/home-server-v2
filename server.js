var express = require('express');
var vhost = require('vhost');

var app = express();

app.use(vhost('src.dev.misc.im', express().use(express.static('src'))));
app.use(vhost('dev.misc.im', express().use(express.static('dist'))));

app.listen(3000);
