"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agGridTimeEditor = void 0;
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
let agGridTimeEditor = class agGridTimeEditor {
    constructor() {
        this.selectedDate = null;
        this.getValue = () => {
            let dateString = null;
            if (this.selectedDate) {
                dateString = common_1.formatDate(this.selectedDate, 'dd/MM/yyyy', 'en-US');
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
agGridTimeEditor = __decorate([
    core_1.Component({
        selector: "time-cell",
        template: `
  <mat-form-field>         
          <input type="datetime-local"  matInput  [value]="selectedDate" 
        (dateChange)="onDateChanged($event)" >          
        </mat-form-field>  `
    })
], agGridTimeEditor);
exports.agGridTimeEditor = agGridTimeEditor;
//# sourceMappingURL=agGrid-time.component.js.map