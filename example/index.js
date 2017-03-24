"use strict";

(function(window, Logger, $){
    var Logger = new Logger({url : 'http://localhost:1337/error'});
    Logger.install();
    var x = [2];
    //x.opt();
    for(var i=0; i < 6; i++) {
        $.ajax({
            url:'/asd',
            success :function(){console.log("hello")},
            error: function(err, b, c){console.log('AjaxError', err, b, c)}
        });
    }
//    setInterval(function(){
//        y=10;
//    },1000);
//
//    setInterval(function(){
//        x.opt();
//    },1000);
})(window, Logger, jQuery);