var app = require('express')();
var http = require('http').Server(app);

var port = 666;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/../../index.html');
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});