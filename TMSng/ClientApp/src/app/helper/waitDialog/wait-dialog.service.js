"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const wait_dialog_component_1 = require("../waitDialog/wait-dialog.component");
let WaitDialogService = class WaitDialogService {
    constructor(dialog) {
        this.dialog = dialog;
    }
    open(options) {
        this.dialogRef = this.dialog.open(wait_dialog_component_1.WaitDialogComponent, {
        //data: {
        //  title: options.title,
        //  message: options.message,
        //  cancelText: options.cancelText,
        //  confirmText: options.confirmText
        //}
        });
    }
    //public confirmed(): Observable<any> {
    //  return this.dialogRef.afterClosed().pipe(take(1), map(res => {
    //    return res;
    //  }
    //  ));
    //}
    close() {
        this.dialogRef.close();
    }
};
WaitDialogService = __decorate([
    core_1.Injectable()
], WaitDialogService);
exports.WaitDialogService = WaitDialogService;
//# sourceMappingURL=wait-dialog.service.js.map