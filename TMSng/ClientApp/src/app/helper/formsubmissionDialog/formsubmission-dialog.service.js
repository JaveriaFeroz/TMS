"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const formsubmission_dialog_component_1 = require("../formsubmissionDialog/formsubmission-dialog.component");
const operators_1 = require("rxjs/operators");
let FormSubmissionDialogService = class FormSubmissionDialogService {
    constructor(dialog) {
        this.dialog = dialog;
    }
    open(title, status, listData) {
        this.dialogRef = this.dialog.open(formsubmission_dialog_component_1.FormSubmissionDialogComponent, {
            data: {
                header: title,
                DocumentStatus: status,
                RecipientList: listData,
                recipientId: listData[0].recipientId
            },
            width: '575px',
            height: '375px',
        });
    }
    selected() {
        return this.dialogRef.afterClosed().pipe(operators_1.take(1), operators_1.map(res => { return res; }));
    }
    close() {
        this.dialogRef.close();
    }
};
FormSubmissionDialogService = __decorate([
    core_1.Injectable()
], FormSubmissionDialogService);
exports.FormSubmissionDialogService = FormSubmissionDialogService;
//# sourceMappingURL=formsubmission-dialog.service.js.map