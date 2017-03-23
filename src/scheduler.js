"use strict";

import Factory from './error-factory';
let factory = new Factory();

export default class Scheduler{

    constructor(options) {
        this.loggingUrl = options.url;
        this.maxChunkSize = options.maxChunkSize || 5;
        this.errors = [];
        this.window = options.window;
        this.navigator = typeof navigator !== 'undefined' ? navigator : undefined;
        this.setHost();
        this.setBrowser();
    }

    setBrowser() {
        var ua= navigator.userAgent, tem,
            M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+(tem[1] || '');
        }
        if(M[1]=== 'Chrome'){
            tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
            if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
        this.browser =  M.join(' ');
    }

    setHost() {
        if (this.window) {
            this.host = this.window.location.host;
        }
    }

    entropy(instance) {
        if(this.errors.length === this.maxChunkSize) {
            this.send(this.errors.splice(0, this.maxChunkSize));
        }
        this.errors.push(instance);
    }
    send() {

    }
    error(stackInfo, options) {
        let instance = factory.getInstance(stackInfo, options);
        instance.host = this.host;
        instance.browser = this.browser;
        this.entropy(instance)
    }
}