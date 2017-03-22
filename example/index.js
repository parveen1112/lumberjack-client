(function(window, Logger, $){
    var Logger = new Logger();
    Logger.install();
    try {
        var x = 1;
        x.opt();
    } catch (e) {
        Logger.captureError(e);
    }
    //x.opt();
    $.ajax({
        url:'/asd'
    })
})(window, Logger, jQuery);