"use strict";

(function(window, Logger, $){
    var Logger = new Logger({url : 'http://localhost:1337/error'});
    Logger.install();
    var x = [2];
    //x.opt();
    for(var i=0; i < 10; i++) {
        $.ajax({
            url:'http://www.jabong.com/pe/hair-care/.ulenscale.320x320.jpg',
            success :function(){console.log("hello")},
            error: function(err, b, c){console.log('AjaxError', err, b, c)}
        });
    }
//    setInterval(function(){
//        y=10;
//    },1000);
})(window, Logger, jQuery);