var ItemHolder =  function() {

    var $shelf = null;

    var _init = function() {
        $shelf = $('<div id="game-itemholder"></div>');
    };

    this.$getShelf = function() {
        return $shelf;
    };

    this.addItem = function(item) {
        if(item) {
            var $newItem = $('<div class="shelf-item"></div>');
            $newItem.style.backgroundImage = item.img;
            $newItem.attr('item-id', item.id);
            $shelf.append($newItem)
        }
    };

    this.removeLastItem = function() {
        $shelf.last().remove();
    };

    _init();
};