'use strict';

import TraceKit from '../vendor/TraceKit/tracekit';
import Scheduler from './scheduler'

let instance;

function fill(obj, name, replacement, track) {
    var orig = obj[name];
    obj[name] = replacement(orig);
    if (track) {
        track.push([obj, name, orig]);
    }
}

function isFunction(what) {
    return typeof what === 'function';
}

var events = new function() {
    var _triggers = {};

    this.on = function(event,callback) {
        if(!_triggers[event])
            _triggers[event] = [];
        _triggers[event].push( callback );
    }

    this.triggerHandler = function(event,params) {
        if( _triggers[event] ) {
            for(var i in _triggers[event] )
                _triggers[event][i](params);
        }
    }
};

export default class Logger{
    constructor(options){
        if (instance) {
            return instance;
        }
        instance = this;
        // This is to be defensive in environments where window does not exist
        this.window = typeof window !== 'undefined' ? window
            : typeof global !== 'undefined' ? global : undefined;
        options = options || {};
        options.window = this.window;
        this.scheduler = new Scheduler(options, this.window);
    }

    install(){
        TraceKit.report.subscribe((stackInfo) => {
            this._handleOnErrorStackInfo(stackInfo);
        });
        this.subscribeAjaxRequest();
    }

    subscribeAjaxRequest() {
        var self = this;
        events.on('error', (error) => {
            this._handleAjaxErrors(error);
        });
        if ('XMLHttpRequest' in this.window) {
            let xhrproto = XMLHttpRequest.prototype;
            fill(xhrproto, 'open', function(origOpen) {
                return function (method, url) { // preserve arity
                        this.__logger_xhr = {
                            method: method,
                            url: url,
                            status_code: null
                        };
                    return origOpen.apply(this, arguments);
                };
            });

            fill(xhrproto, 'send', function(origSend) {
                return function (data) { // preserve arity
                    var xhr = this;
                    if ('onreadystatechange' in xhr && isFunction(xhr.onreadystatechange)) {
                        fill(xhr, 'onreadystatechange', function (orig) {
                            xhr.__logger_xhr.status_code = xhr.status;
                            events.triggerHandler('error', xhr.__logger_xhr);
                             return orig.apply(this, arguments);
                        } /* intentionally don't track this instrumentation */);
                    } else {
                        // if onreadystatechange wasn't actually set by the page on this xhr, we
                        // are free to set our own and capture the breadcrumb
                        xhr.onreadystatechange = function(abc) {
                            xhr.__logger_xhr.status_code = xhr.status;
                            events.triggerHandler('error', xhr.__logger_xhr);
                         };
                    }

                    return origSend.apply(this, arguments);
                };
            });
        }

        if ('fetch' in this.window) {
            fill(this.window, 'fetch', function(origFetch) {
                return function (fn, t) { // preserve arity
                    // Make a copy of the arguments to prevent deoptimization
                    // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
                    let args = Array.prototype.slice.call(arguments),
                        fetchData = {
                            method: 'GET',
                            url: args[0],
                            status_code: null
                        };

                    if (args[1] && args[1].method) {
                        fetchData.method = args[1].method;
                    }
                    return origFetch.apply(this, args).then(function (response) {
                        fetchData.status_code = response.status;
                        events.triggerHandler('error', xhr.__logger_xhr);
                        return response;
                    });
                };
            });
        }
    }
    _handleOnErrorStackInfo(stackInfo, options){
        this.scheduler.error(stackInfo, options);
    }
    _handleAjaxErrors(error) {
        let status = error.status_code,
            type = /4\d{2}/.test(status) ? '4xx' : /5\d{2}/.test(status) ? '5xx' : '5xx';
        error.name = type;
        this.scheduler.error(error, {}, true);
    }
    captureError(ex, options) {
        try {
            let stack = TraceKit.computeStackTrace(ex);
            this._handleOnErrorStackInfo(stack, options);
        } catch(ex1) {
            if(ex !== ex1) {
                throw ex1;
            }
        }
        return this;
    }
}