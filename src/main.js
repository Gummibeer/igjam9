var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var colors = require('colors');
var helpers = require('./server/helpers.js');

var user = require('./server/models/user.js');
var item = require('./server/models/item.js');
var question = require('./server/models/question.js');

console.log(helpers.prefix() + 'starting game server');

var port = 63350; //63350;
var users = {};
var matches = {};

colors.setTheme({
    info: 'cyan',
    warn: 'yellow',
    debug: 'gray',
    error: 'red'
});

// SOCKETS
io.on('connection', function (socket) {
    users[socket.id] = new user.model(socket, 0, '');
    users[socket.id].id = socket.id;
    users[socket.id].socket = socket;
    console.log(helpers.prefix() + colors.info('user connected %s'), socket.id);
    console.log(helpers.prefix() + colors.debug('now are %s users on the server'), Object.keys(users).length);

    socket.on('disconnect', function () {
        socket.leave('lobby');
        delete users[socket.id];
        io.to('lobby').emit('userList', {usersList: helpers.getUsersList(users)});
        console.log(helpers.prefix() + colors.magenta('user disconnected %s'), socket.id);
        console.log(helpers.prefix() + colors.debug('now are %s users on the server'), Object.keys(users).length);
    });

    socket.on('joinLobby', function (name) {
        socket.join('lobby');
        console.log(helpers.prefix() + colors.green('user joined lobby %s - %s'), socket.id, name);
        users[socket.id].name = name;
        users[socket.id].status = 1;
        io.to('lobby').emit('userList', {usersList: helpers.getUsersList(users)});
    });

    socket.on('requestGame', function (id) {
        console.log(helpers.prefix() + colors.debug('user %s has requested a game against %s'), socket.id, id);
        users[id].socket.emit('gameRequest', {userData: helpers.getUserData(users[socket.id])});
    });

    socket.on('abortRequest', function (id) {
        console.log(helpers.prefix() + colors.debug('user %s has aborted the game requested from %s'), socket.id, id);
        users[id].socket.emit('requestAborted', {userData: helpers.getUserData(users[socket.id])});
    });

    socket.on('acceptRequest', function (id) {
        console.log(helpers.prefix() + colors.debug('user %s has accepted the game requested from %s'), socket.id, id);

        var room = 'match-' + Date.now();
        socket.join(room);
        users[id].socket.join(room);
        console.log(helpers.prefix() + colors.debug('match-room created %s for: %s vs %s'), room, socket.id, id);

        users[socket.id].status = 2;
        users[id].status = 2;
        io.to('lobby').emit('userList', {usersList: helpers.getUsersList(users)});

        var user1Items = [
            item.collection.random(),
            item.collection.random(),
            item.collection.random(),
            item.collection.random()
        ];
        var user2Items = [
            item.collection.random(),
            item.collection.random(),
            item.collection.random(),
            item.collection.random()
        ];
        var itemIds = [].concat(user2Items.map(function (item) {
            return ''+item.id;
        }), user1Items.map(function (item) {
            return ''+item.id;
        }));
        console.log(itemIds);

        matches[room] = {
            ready: 0, // number of ready users - if it's 2 we can start a round
            success: false,
            responded: [],
            users: [id, socket.id],
            items: itemIds,
            questions: {}
        };

        io.to(room).emit('initGame', {
            match: room, // matchname
            user1: helpers.getUserData(users[socket.id]), // accepted
            user1Items: user1Items,
            user2: helpers.getUserData(users[id]), // requester
            user2Items: user2Items
        });
    });

    socket.on('waitingForRound', function (matchId) {
        matches[matchId].ready++;
        if (matches[matchId].ready == 2) {
            matches[matchId].ready = 0;
            // TODO: send the questions
            io.to(matchId).emit('startRound', true);
            console.log(helpers.prefix() + colors.debug('start new round in match %s'), matchId);
            setTimeout(function () {
                if (matches[matchId].responded < 2) {
                    matches[matchId].success = false;
                }
                io.to(matchId).emit('endRound', matches[matchId].success);
                console.log(helpers.prefix() + colors.debug('round ended [%s] in match %s'), matches[matchId].success, matchId);
            }, 5000);
        }
    });

    socket.on('itemSelected', function (data) {
        matches[data.match].responded.push(socket.id);
        console.log(helpers.prefix() + colors.debug('user %s from match %s has used item #%s'), socket.id, data.match, data.itemId);
        matches[data.match].items.splice(matches[data.match].items.indexOf(''+data.itemId), 1);
        // TODO: check for right item
        var newItem = item.collection.random();
        matches[data.match].items.push(''+newItem.id);
        console.log(matches[data.match].items);
        socket.emit('newItem', {item: newItem});
    });
});

// HTTP
http.listen(port, function () {
    console.log(helpers.prefix() + 'listening on *:%s', port);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/html/index.html');
});
app.get(/src\/(.*)/, function (req, res) {
    res.sendFile(__dirname + '/' + req.params[0]);
});

// CONSOLE
var stdin = process.openStdin();
stdin.addListener('data', function (d) {
    var str = d.toString().trim();
    var parts = str.split(' ');
    parts[0] = parts[0].trim();
    console.log(colors.debug('your command: %s'), str);
    switch (parts[0]) {
        case '/userlist':
            console.log(helpers.c.getUsersNameList(users));
            break;
        case '/userkick':
            parts[1] = parts[1].trim();
            if (Object.keys(users).indexOf(parts[1]) !== -1) {
                users[parts[1]].socket.disconnect();
                console.log(helpers.prefix() + colors.info('kicked user %s'), parts[1]);
            } else {
                console.log(colors.error('es gibt keinen user mit der ID'));
            }
            break;
        case '/matchlist':
            console.log(helpers.c.getOpenMatchesList(matches));
            break;
        case '/kickall':
            for (var id in users) {
                if (users.hasOwnProperty(id)) {
                    users[id].socket.disconnect();
                    console.log(helpers.prefix() + colors.info('kicked user %s'), id);
                }
            }
            break;
        default:
            console.log(colors.error('das ist kein command'));
            break;
    }
});

// ITEMS
item.collection.add(1, 'Item #1', 'src/img/dummy/1.png');
item.collection.add(2, 'Item #2', 'src/img/dummy/2.png');
item.collection.add(3, 'Item #3', 'src/img/dummy/3.png');
item.collection.add(4, 'Item #4', 'src/img/dummy/4.png');
item.collection.add(5, 'Item #5', 'src/img/dummy/5.png');
item.collection.add(6, 'Item #6', 'src/img/dummy/6.png');
item.collection.add(7, 'Item #7', 'src/img/dummy/7.png');
item.collection.add(8, 'Item #8', 'src/img/dummy/8.png');
item.collection.add(9, 'Item #9', 'src/img/dummy/9.png');
item.collection.add(10, 'Item #10', 'src/img/dummy/10.png');
item.collection.add(11, 'Item #11', 'src/img/dummy/11.png');
item.collection.add(12, 'Item #12', 'src/img/dummy/12.png');

// QUESTIONS
question.collection.add(1, 'Wirf Item #1 in den Topf', 1);
question.collection.add(2, 'Wirf Item #2 in den Topf', 2);
question.collection.add(3, 'Wirf Item #3 in den Topf', 3);
question.collection.add(4, 'Wirf Item #4 in den Topf', 4);
question.collection.add(5, 'Wirf Item #5 in den Topf', 5);
question.collection.add(6, 'Wirf Item #6 in den Topf', 6);
question.collection.add(7, 'Wirf Item #7 in den Topf', 7);
question.collection.add(8, 'Wirf Item #8 in den Topf', 8);
question.collection.add(9, 'Wirf Item #9 in den Topf', 9);
question.collection.add(10, 'Wirf Item #10 in den Topf', 10);
question.collection.add(11, 'Wirf Item #11 in den Topf', 11);
question.collection.add(12, 'Wirf Item #12 in den Topf', 12);