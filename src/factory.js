"use strict";
import FourXX from './4xx';
import FiveXX from './5xx';
import JSError from './js-error';

export default class Factory {
    constructor() {}
    getInstance(type) {
        var instance;
        switch (type) {
            case '4xx' : instance = new FourXX();
                         break;
            case '5xx' : instance = new FourXX();
                         break;
            case 'js'  : instance = new JSError();

            default : break;
        }
        return instance;
    }
}