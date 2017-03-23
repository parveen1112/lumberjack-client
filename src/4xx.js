"use strict";
import Base from './base-error';
export default class FourXX extends Base{
    constructor(stackInfo, options) {
        super(stackInfo, options);
        this.type = '4XX';
        this.setFrames(stackInfo);
    }
}