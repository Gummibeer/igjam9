exports.getUserData = function (user) {
    return {
        id: user.id,
        name: user.name
    }
};

exports.getUsersList = function (users) {
    return users.map(function (user) {
        if (user.status == 1) {
            return exports.getUserData(user);
        } else {
            return null;
        }
    }).filter(function (item) {
        return !(item === null);
    });
};