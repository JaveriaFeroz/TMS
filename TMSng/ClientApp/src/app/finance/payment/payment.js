"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const footer_1 = require("../../helper/footer");
class Payment {
    constructor() {
        this.details = [];
        this.allocations = [];
        this.footer = new footer_1.agFooter();
    }
}
exports.Payment = Payment;
//# sourceMappingURL=payment.js.map