"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadRoutes = void 0;
const invoicesummary_component_1 = require("../download/invoicesummary/invoicesummary.component");
const opssummary_component_1 = require("../download/opssummary/opssummary.component");
const plsummary_component_1 = require("../download/plsummary/plsummary.component");
const tripexpensesummary_component_1 = require("../download/tripexpensesummary/tripexpensesummary.component");
const woreimbursementextract_component_1 = require("../download/woreimbursement/woreimbursementextract.component");
const woextract_component_1 = require("../download/workorder/woextract.component");
const creditfuel_component_1 = require("../download/creditfuel/creditfuel.component");
const shortage_component_1 = require("../download/shortage/shortage.component");
const supplieraging_component_1 = require("../download/supplieraging/supplieraging.component");
const expensesummary_component_1 = require("../download/expensesummary/expensesummary.component");
const auth_guard_1 = require("../helper/guard/auth.guard");
exports.DownloadRoutes = [
    {
        path: 'PLSummary',
        component: plsummary_component_1.PLSummaryComponent,
        canActivate: [auth_guard_1.AuthGuard],
        data: {
            title: 'Profit and Loss'
        }
    },
    {
        path: 'TripExpenseSummary',
        component: tripexpensesummary_component_1.TripExpenseSummaryComponent,
        canActivate: [auth_guard_1.AuthGuard],
        data: {
            title: 'TWB Expense Report'
        }
    },
    {
        path: 'OpsSummary',
        component: opssummary_component_1.OpsSummaryComponent,
        canActivate: [auth_guard_1.AuthGuard],
        data: {
            title: 'Operational MIS Data Extract'
        }
    },
    {
        path: 'InvoiceSummary',
        component: invoicesummary_component_1.InoviceSummaryComponent,
        canActivate: [auth_guard_1.AuthGuard],
        data: {
            title: 'Invoice Summary'
        }
    },
    {
        path: 'WorkOrderExtract', component: woextract_component_1.WOExtractComponent,
        canActivate: [auth_guard_1.AuthGuard],
        data: {
            title: 'List of Work Orders & Service Request '
        }
    },
    {
        path: 'WOReImbursementExtract', component: woreimbursementextract_component_1.WOReImbursementExtractComponent,
        canActivate: [auth_guard_1.AuthGuard],
        data: {
            title: 'Work Order ReImbursement Extract'
        }
    },
    {
        path: 'CreditFuel', component: creditfuel_component_1.CreditFuelComponent,
        canActivate: [auth_guard_1.AuthGuard],
        data: {
            title: 'CreditFuel Extract'
        }
    },
    {
        path: 'Shortage', component: shortage_component_1.ShortageComponent,
        canActivate: [auth_guard_1.AuthGuard],
        data: {
            title: 'Shortage Extract'
        }
    },
    {
        path: 'SupplierAging', component: supplieraging_component_1.SupplierAgingComponent,
        canActivate: [auth_guard_1.AuthGuard],
        data: {
            title: 'Supplier Aging'
        }
    },
    {
        path: 'ExpenseSummary', component: expensesummary_component_1.ExpenseSummaryComponent,
        canActivate: [auth_guard_1.AuthGuard],
        data: {
            title: 'Expense Summary'
        }
    },
];
//# sourceMappingURL=download.routes.js.map