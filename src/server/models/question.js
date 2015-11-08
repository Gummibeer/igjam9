exports.collection = {
    items: {},
    getById: function (id) {
        if (this.items[id] !== undefined) {
            return this.items[id];
        } else {
            return false;
        }
    },
    add: function (id, msg, item) {
        this.items[id] = {
            id: id,
            message: msg,
            itemId: item
        };
    },
    getByItem: function (itemId) {
        for (var key in this.items) {
            if (this.items[key].itemId == itemId) {
                return this.items[key];
            }
        }
    }
};