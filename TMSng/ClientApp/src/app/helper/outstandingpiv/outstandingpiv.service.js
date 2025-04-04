"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutstandingPIVService = void 0;
const core_1 = require("@angular/core");
const operators_1 = require("rxjs/operators");
const outstandingpiv_component_1 = require("../outstandingpiv/outstandingpiv.component");
let OutstandingPIVService = class OutstandingPIVService {
    constructor(dialog) {
        this.dialog = dialog;
    }
    open(supplierId, pyNo) {
        this.dialogRef = this.dialog.open(outstandingpiv_component_1.OutstandingPIVComponent, {
            data: {
                supplierId: supplierId,
                pyNo: pyNo
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
OutstandingPIVService = __decorate([
    core_1.Injectable()
], OutstandingPIVService);
exports.OutstandingPIVService = OutstandingPIVService;
//# sourceMappingURL=outstandingpiv.service.js.map