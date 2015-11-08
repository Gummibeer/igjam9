exports.getUserData = function (user) {
    return {
        id: user.id,
        name: user.name
    }
};

exports.getUsersList = function (users) {
    return Object.keys(users).map(function (key) {
        var user = users[key];
        if (user.status == 1) {
            return exports.getUserData(user);
        } else {
            return null;
        }
    }).filter(function (item) {
        return !(item === null);
    }).sort(exports.sortByName);
};

exports.sortByName = function (a, b) {
    var aName = a.name && a.name.toLowerCase();
    var bName = b.name && b.name.toLowerCase();
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
};

exports.dt = function () {
    var date = new Date();
    return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2) + '.' + ('00' + date.getMilliseconds()).slice(-3);
};

exports.prefix = function () {
    return '[' + exports.dt() + '] ';
};

exports.c = {
    getUsersNameList: function (users) {
        return Object.keys(users).map(function (key) {
            var user = users[key];
            return user.name + ' @ ' + user.id + ' [' + user.status + ']' + '\n';
        }).join('');
    },
    getOpenMatchesList: function (matches) {
        return Object.keys(matches).map(function (key) {
            var match = matches[key];
            return key + ' - ' + match.users.join(' vs ') + '\n';
        }).join('');
    }
};