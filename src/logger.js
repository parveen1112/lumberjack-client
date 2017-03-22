'use strict';

import TraceKit from '../vendor/TraceKit/tracekit';
import Factory from './factory';

export default class Logger{
    constructor(){

    }

    install(){
        var self = this;
        TraceKit.report.subscribe(function() {
            self._handleOnErrorStackInfo.apply(self, arguments)
        });
    }

    captureError(ex, options) {
        // If not an Error is passed through, recall as a message instead
/*
        if (!isError(ex)) {
            return this.captureMessage(ex, objectMerge({
                trimHeadFrames: 1,
                stacktrace: true // if we fall back to captureMessage, default to attempting a new trace
            }, options));
        }
*/

        // Store the raw exception object for potential debugging and introspection
        this._lastCapturedException = ex;

        // TraceKit.report will re-raise any exception passed to it,
        // which means you have to wrap it in try/catch. Instead, we
        // can wrap it here and only re-raise if TraceKit.report
        // raises an exception different from the one we asked to
        // report on.
        try {
            var stack = TraceKit.computeStackTrace(ex);
            this._handleOnErrorStackInfo(stack, options);
        } catch(ex1) {
            if(ex !== ex1) {
                throw ex1;
            }
        }

        return this;
    }

    getInstance(){

    }

    _handleOnErrorStackInfo(stack, options){
        console.log(stack, options)
    }
}