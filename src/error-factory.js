"use strict";
import FourXX from './4xx';
import FiveXX from './5xx';
import JSError from './js-error';


export default class Factory {
    constructor() {}
    getInstance(stackInfo, options) {
        let instance,
        type = /^([Uu]ncaught exception)|((Eval|Internal|Range|Reference|Syntax|Type|URI|)Error)$/.test(stackInfo.name) ? 'js' : stackInfo.name;
        switch (type) {
            case '4xx' : instance = new FourXX(stackInfo, options);
                         break;
            case '5xx' : instance = new FiveXX(stackInfo, options);
                         break;
            case 'js'  : instance = new JSError(stackInfo, options);
                         break;
            default : break;
        }
        return instance;
    }
}