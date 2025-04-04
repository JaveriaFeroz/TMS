"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
//import { format } from "date-fns";
let MyDateEditor = class MyDateEditor {
    constructor() {
        this.selectedDate = null;
        this.getValue = () => {
            let dateString = null;
            if (this.selectedDate) {
                dateString = this.selectedDate;
                //dateString = format(this.selectedDate, "dd/MM/yyyy");
            }
            return dateString;
        };
        this.afterGuiAttached = () => {
            if (!this.params.value) {
                return;
            }
            const [_, day, month, year] = this.params.value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            let selectedDate = new Date(year, month - 1, day);
            this.selectedDate = selectedDate;
        };
        this.onDateChanged = event => {
            let date = event.value;
            if (date) {
                date.setHours(0, 0, 0, 0);
            }
            this.selectedDate = date;
        };
    }
    agInit(params) {
        this.params = params;
    }
};
MyDateEditor = __decorate([
    core_1.Component({
        selector: "date-cell",
        template: `
    <mat-form-field>
      <input 
        matInput 
        [matDatepicker]="picker" 
        [value]="selectedDate" 
        (dateChange)="onDateChanged($event)" />
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  `
    })
], MyDateEditor);
exports.MyDateEditor = MyDateEditor;
//# sourceMappingURL=my-date-editor.component.js.map