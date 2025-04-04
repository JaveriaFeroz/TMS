import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let MyToasterService = class MyToasterService {
    constructor(toastr) {
        this.toastr = toastr;
        this.options = this.toastr.toastrConfig;
        this.options.positionClass = 'toast-top-right';
        this.options.timeOut = 1500;
    }
    showToast(title, message, type) {
        this.toastr.show(message, title, this.options, 'toast-' + type);
    }
};
MyToasterService = __decorate([
    Injectable()
], MyToasterService);
export { MyToasterService };
//# sourceMappingURL=mytoaster.service.js.map