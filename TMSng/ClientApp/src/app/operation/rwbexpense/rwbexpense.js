"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RWBExpense = void 0;
const footer_1 = require("../../helper/footer");
class RWBExpense {
    constructor() {
        this.expenses = [];
        this.charges = [];
        this.cashFuels = [];
        this.footer = new footer_1.agFooter();
    }
}
exports.RWBExpense = RWBExpense;
//# sourceMappingURL=rwbexpense.js.map