"use strict";

(function(window, Logger, $){
    var Logger = new Logger({});
    Logger.install();
    var x = [2];
    //x.opt();
    $.ajax({
        url:'http://www.jabong.com/pe/hair-care/.ulenscale.320x320.jpg',
        success :function(){console.log("hello")},
        error: function(err, b, c){console.log('AjaxError', err, b, c)}
    });
})(window, Logger, jQuery);