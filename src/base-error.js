"use strict";

export default class Base {
    constructor(stackInfo)  {
        this.name = stackInfo.name || '';
        this.mode = stackInfo.mode || '';
        this.message = stackInfo.message || '';
        this.frames = [];
    }
    options(options) {
        for (var key in options) {
            if (options.hasOwnProperty(key)) this[key] = options[key];
        }
        return this;
    }
    setFrames(frame) {
        this.frames.push(frame);
        return this;
    }
}