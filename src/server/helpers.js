exports.getUserData = function (user) {
    return {
        id: user.id,
        name: user.name
    }
};

exports.getUsersList = function (users) {
    return Object.keys(users).map(function(key) {
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

exports.sortByName = function(a, b){
    var aName = a.name.toLowerCase();
    var bName = b.name.toLowerCase();
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
};