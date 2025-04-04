"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.numFilterPipe = exports.stringFilterPipe = void 0;
const core_1 = require("@angular/core");
let stringFilterPipe = class stringFilterPipe {
    transform(items, searchText, fieldName) {
        // return empty array if array is falsy
        if (!items) {
            return [];
        }
        // return the original array if search text is empty
        if (!searchText) {
            return items;
        }
        // convert the searchText to lower case
        searchText = searchText.toLowerCase();
        // retrun the filtered array
        return items.filter(item => {
            if (item && item[fieldName]) {
                return item[fieldName].toLowerCase().includes(searchText);
            }
            return false;
        });
    }
};
stringFilterPipe = __decorate([
    core_1.Pipe({ name: 'strFilter' })
], stringFilterPipe);
exports.stringFilterPipe = stringFilterPipe;
let numFilterPipe = class numFilterPipe {
    transform(items, searchValue, fieldName) {
        // return empty array if array is falsy
        if (!items) {
            return [];
        }
        // return the original array if search text is empty
        if (!searchValue) {
            return items;
        }
        // convert the searchText to lower case
        //searchText = searchText.toLowerCase();
        // retrun the filtered array
        return items.filter(item => {
            if (item && item[fieldName]) {
                return item[fieldName] === searchValue;
            }
            return false;
        });
    }
};
numFilterPipe = __decorate([
    core_1.Pipe({ name: 'numFilter' })
], numFilterPipe);
exports.numFilterPipe = numFilterPipe;
//# sourceMappingURL=filter.pipe.js.map