"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceModule = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const router_1 = require("@angular/router");
const app_material_module_1 = require("../app.material.module");
const agGridHelper_1 = require("../helper/agGridHelper");
//import { NumberDirective } from '../helper/numbers-only.directive';
const shared_module_1 = require("../shared.module");
const insurance_routes_1 = require("./insurance.routes");
const insclaim_component_1 = require("./insclaim/insclaim.component");
const inscompany_component_1 = require("./inscompany/inscompany.component");
const inspolicy_component_1 = require("./inspolicy/inspolicy.component");
const instype_component_1 = require("./instype/instype.component");
let InsuranceModule = class InsuranceModule {
};
InsuranceModule = __decorate([
    core_1.NgModule({
        declarations: [insclaim_component_1.InsClaimComponent, inscompany_component_1.InsCompanyComponent,
            inspolicy_component_1.InsPolicyComponent, instype_component_1.InsTypeComponent],
        imports: [
            router_1.RouterModule.forChild(insurance_routes_1.insuranceRoutes),
            forms_1.ReactiveFormsModule,
            forms_1.FormsModule,
            app_material_module_1.MaterialModule,
            shared_module_1.SharedModule
        ],
        providers: [agGridHelper_1.agGridHelper],
    })
], InsuranceModule);
exports.InsuranceModule = InsuranceModule;
//# sourceMappingURL=insurance.module.js.map