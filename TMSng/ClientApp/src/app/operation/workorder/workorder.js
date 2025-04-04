"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkOrder = void 0;
const footer_1 = require("../../helper/footer");
class WorkOrder {
    constructor() {
        this.activities = [];
        this.estInventories = [];
        this.estOtherChgs = [];
        this.inventories = [];
        this.otherCharges = [];
        this.footer = new footer_1.agFooter();
    }
}
exports.WorkOrder = WorkOrder;
//# sourceMappingURL=workorder.js.map