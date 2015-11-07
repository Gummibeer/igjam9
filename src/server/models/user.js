exports.model = function (socket, status, name) {
    this.id = 0;
    this.name = name;
    this.socket = socket;
    this.status = status; // 0 = connected, 1 = lobby, 2 = game
};