"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormSubmissionDialogComponent = void 0;
const core_1 = require("@angular/core");
const dialog_1 = require("@angular/material/dialog");
let FormSubmissionDialogComponent = class FormSubmissionDialogComponent {
    constructor(data, mdDialogRef) {
        this.data = data;
        this.mdDialogRef = mdDialogRef;
        this.lstRecipient = data.Recipients;
    }
    onSubmit(result) {
        this.mdDialogRef.close(result);
    }
    onClose() {
        this.mdDialogRef.close(true);
    }
};
FormSubmissionDialogComponent = __decorate([
    core_1.Component({
        //changeDetection: ChangeDetectionStrategy.OnPush,
        selector: 'app-formsubmission-dialog',
        templateUrl: './formsubmission-dialog.component.html',
        styleUrls: ['./formsubmission.component.css']
    }),
    __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
], FormSubmissionDialogComponent);
exports.FormSubmissionDialogComponent = FormSubmissionDialogComponent;
//# sourceMappingURL=formsubmission-dialog.component.js.map
