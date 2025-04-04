"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agGridDateEditor = void 0;
const core_1 = require("@angular/core");
let agGridDateEditor = class agGridDateEditor {
    constructor() {
        this.selectedDate = null;
        this.getValue = () => {
            return this.selectedDate;
        };
        this.onDateChanged = event => {
            let date = event.value;
            if (date) {
                date.setHours(0, 0, 0, 0);
            }
            this.selectedDate = date;
            this.params.api.stopEditing();
        };
    }
    agInit(params) {
        this.params = params;
        if (this.params.value != null)
            this.selectedDate = this.params.value;
    }
    ngAfterViewInit() {
        this.picker.open();
    }
    isPopup() {
        return true;
    }
};
__decorate([
    core_1.ViewChild('picker')
], agGridDateEditor.prototype, "picker", void 0);
agGridDateEditor = __decorate([
    core_1.Component({
        selector: "date-cell",
        template: `
    <mat-form-field class="tb100">
      <input matInput [matDatepicker]="picker" [value]="selectedDate" (dateChange)="onDateChanged($event)" readonly/>
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>`
    })
], agGridDateEditor);
exports.agGridDateEditor = agGridDateEditor;
//# sourceMappingURL=agGrid-date.component.js.map