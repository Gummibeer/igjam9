var IggjEventHandler = function () {
    var mySubscriber = new Object();
    this.subscribe = function (event, callback) {
        mySubscriber.subscribe(event,callback);
    };
    this.publish = function (event) {
        mySubscriber.trigger(event)
    };
    this.unsubscribe = function (event, callback) {
        mySubscriber.unsubscribe(event, callback)
    }
};