exports.collection = {
    items: {},
    getById: function (id) {
        if (this.items[id] !== undefined) {
            return this.items[id];
        } else {
            return false;
        }
    },
    add: function (id, name, img) {
        this.items[id] = {
            id: id,
            name: name,
            img: img
        };
    },
    random: function () {
        var result;
        var count = 0;
        for (var prop in this.items)
            if (Math.random() < 1 / ++count)
                result = prop;
        return this.items[result];
    }
};