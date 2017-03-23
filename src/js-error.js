"use strict";
import Base from './base-error';
export default class JSError extends Base {
    constructor(stackInfo, options) {
        super();
        this.type = 'JS';
        this.setFrames(stackInfo.stack).options(options);
    }
    _normalizeFrame(frame) {
        if (!frame.url) return;
        return {
            filename:   frame.url,
            lineno:     frame.line,
            colno:      frame.column,
            'function': frame.func || '?'
        };
    }
    setFrames(stack){
        for(let i=0; i < stack.length; i++){
            let frame = this._normalizeFrame(stack[i]);
            if (frame) {
                this.frames.push(frame);
            }
        }
        return this;
    }
}