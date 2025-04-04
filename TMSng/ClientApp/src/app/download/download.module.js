"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadModule = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const router_1 = require("@angular/router");
const app_material_module_1 = require("../app.material.module");
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
const agGridHelper_1 = require("../helper/agGridHelper");
//import { NumberDirective } from '../helper/numbers-only.directive';
const shared_module_1 = require("../shared.module");
const download_routes_1 = require("./download.routes");
let DownloadModule = class DownloadModule {
};
DownloadModule = __decorate([
    (0, core_1.NgModule)({
        declarations: [plsummary_component_1.PLSummaryComponent, tripexpensesummary_component_1.TripExpenseSummaryComponent,
            opssummary_component_1.OpsSummaryComponent, invoicesummary_component_1.InoviceSummaryComponent, woextract_component_1.WOExtractComponent, woreimbursementextract_component_1.WOReImbursementExtractComponent,
            creditfuel_component_1.CreditFuelComponent, shortage_component_1.ShortageComponent, supplieraging_component_1.SupplierAgingComponent, expensesummary_component_1.ExpenseSummaryComponent],
        imports: [
            router_1.RouterModule.forChild(download_routes_1.DownloadRoutes),
            forms_1.ReactiveFormsModule,
            forms_1.FormsModule,
            app_material_module_1.MaterialModule,
            shared_module_1.SharedModule,
        ],
        providers: [agGridHelper_1.agGridHelper],
    })
], DownloadModule);
exports.DownloadModule = DownloadModule;
//# sourceMappingURL=download.module.js.map