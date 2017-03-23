"use strict";
import Base from './base-error';
export default class FiveXX extends Base{
    constructor(stackInfo, options) {
        super();
        this.type = '5XX';
    }
}