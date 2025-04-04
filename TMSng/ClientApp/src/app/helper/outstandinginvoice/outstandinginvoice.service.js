"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutstandingInvoiceService = void 0;
const core_1 = require("@angular/core");
const operators_1 = require("rxjs/operators");
const outstandinginvoice_component_1 = require("../outstandinginvoice/outstandinginvoice.component");
let OutstandingInvoiceService = class OutstandingInvoiceService {
    constructor(dialog) {
        this.dialog = dialog;
    }
    open(clientId, receiptNo) {
        this.dialogRef = this.dialog.open(outstandinginvoice_component_1.OutstandingInvoiceComponent, {
            data: {
                clientId: clientId,
                receiptNo: receiptNo
            },
            height: '80vh',
            width: '74vw',
            disableClose: true
        });
    }
    selected() {
        return this.dialogRef.afterClosed().pipe(operators_1.take(1), operators_1.map(res => { return res; }));
    }
    close() {
        this.dialogRef.close();
    }
};
OutstandingInvoiceService = __decorate([
    core_1.Injectable()
], OutstandingInvoiceService);
exports.OutstandingInvoiceService = OutstandingInvoiceService;
//# sourceMappingURL=outstandinginvoice.service.js.map