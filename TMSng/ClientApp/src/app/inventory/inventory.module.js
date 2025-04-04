"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModule = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const router_1 = require("@angular/router");
const app_material_module_1 = require("../app.material.module");
const agGridHelper_1 = require("../helper/agGridHelper");
//import { NumberDirective } from '../helper/numbers-only.directive';
//import { NumberDirective } from '../helper/numbers-only.directive';
const shared_module_1 = require("../shared.module");
const grn_component_1 = require("./grn/grn.component");
const inventory_routes_1 = require("./inventory.routes");
const invadjustment_component_1 = require("./invadjustment/invadjustment.component");
const invtransfer_component_1 = require("./invtransfer/invtransfer.component");
let InventoryModule = class InventoryModule {
};
InventoryModule = __decorate([
    core_1.NgModule({
        declarations: [grn_component_1.GRNComponent, invadjustment_component_1.InvAdjustmentComponent, invtransfer_component_1.InvTransferComponent],
        imports: [
            router_1.RouterModule.forChild(inventory_routes_1.inventoryRoutes),
            forms_1.ReactiveFormsModule,
            forms_1.FormsModule,
            app_material_module_1.MaterialModule,
            shared_module_1.SharedModule,
        ],
        providers: [agGridHelper_1.agGridHelper],
    })
], InventoryModule);
exports.InventoryModule = InventoryModule;
//# sourceMappingURL=inventory.module.js.map