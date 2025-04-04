"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryRoutes = void 0;
const auth_guard_1 = require("../helper/guard/auth.guard");
const grn_component_1 = require("./grn/grn.component");
const invadjustment_component_1 = require("./invadjustment/invadjustment.component");
const invtransfer_component_1 = require("./invtransfer/invtransfer.component");
exports.inventoryRoutes = [
    {
        path: 'GRN',
        component: grn_component_1.GRNComponent,
        canActivate: [auth_guard_1.AuthGuard],
        data: {
            title: 'Goods Receipt note'
        }
    },
    {
        path: 'InvAdj',
        component: invadjustment_component_1.InvAdjustmentComponent,
        canActivate: [auth_guard_1.AuthGuard],
        data: {
            title: 'Inventory Adjustment'
        }
    },
    {
        path: 'InvTransfer',
        component: invtransfer_component_1.InvTransferComponent,
        canActivate: [auth_guard_1.AuthGuard],
        data: {
            title: 'Inventory Transfer'
        }
    }
];
//# sourceMappingURL=inventory.routes.js.map