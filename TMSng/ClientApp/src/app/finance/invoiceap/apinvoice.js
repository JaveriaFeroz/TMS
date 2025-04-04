"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APInvoice = void 0;
const footer_1 = require("../../helper/footer");
class APInvoice {
    constructor() {
        this.details = [];
        this.slips = [];
        this.footer = new footer_1.agFooter();
    }
}
exports.APInvoice = APInvoice;
//# sourceMappingURL=apinvoice.js.map