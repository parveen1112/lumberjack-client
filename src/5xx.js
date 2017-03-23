"use strict";
import Base from './base-error';
export default class FiveXX extends Base{
    constructor(stackInfo) {
        super(stackInfo);
        this.type = '5XX';
        this.setFrames(stackInfo);
    }
}