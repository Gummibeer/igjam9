var ItemHolder =  function() {

    var $shelf = null;

    var _init = function() {
        $shelf = $('<div id="game-itemholder"></div>');
        $shelf.append($('<div class="shelf-item"></div>').attr('data-empty',true));
        $shelf.append($('<div class="shelf-item"></div>').attr('data-empty',true));
        $shelf.append($('<div class="shelf-item"></div>').attr('data-empty',true));
        $shelf.append($('<div class="shelf-item"></div>').attr('data-empty',true));
    };

    this.$getShelf = function() {
        return $shelf;
    };

    this.addItem = function(item) {
        if(item) {
            var $newItem = $shelf.find('[data-empty]').first();
            console.log($newItem);
            $newItem.css('background-Image', 'url('+item.img+')');
            $newItem.attr('item-id', item.id);
            $newItem.removeAttr('data-empty');
            $newItem.on('click', _onItemClick);
            $shelf.append($newItem);
        }
    };

    var _onItemClick = function() {
        console.log('removing item with id', $(this).attr('item-id'));
        $(this).attr('data-empty', true);
        $(this).css('background-Image', 'none');
        $(this).removeAttr('item-id');
        $(this).off('click', _onItemClick);
        //tell server wich item has bin clicked
    };

    _init();
};