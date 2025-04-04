"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationModule = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const router_1 = require("@angular/router");
const app_material_module_1 = require("../app.material.module");
const agGridHelper_1 = require("../helper/agGridHelper");
//import { NumberDirective } from '../helper/numbers-only.directive';
const shared_module_1 = require("../shared.module");
const assetstatus_component_1 = require("./assetstatus/assetstatus.component");
const assetswap_component_1 = require("./assetswap/assetswap.component");
const cancelrwbevents_component_1 = require("./cancelrwbevents/cancelrwbevents.component");
const job_component_1 = require("./job/job.component");
const jobclose_component_1 = require("./jobclose/jobclose.component");
const operation_routes_1 = require("./operation.routes");
const pm_component_1 = require("./pm/pm.component");
const rwb_component_1 = require("./rwb/rwb.component");
const rwbevent_component_1 = require("./rwbevent/rwbevent.component");
const rwbexpense_component_1 = require("./rwbexpense/rwbexpense.component");
const rwbupdate_component_1 = require("./rwbupdate/rwbupdate.component");
const servicerequest_component_1 = require("./servicerequest/servicerequest.component");
const workorder_component_1 = require("./workorder/workorder.component");
const woreimb_component_1 = require("./woreimb/woreimb.component");
let OperationModule = class OperationModule {
};
OperationModule = __decorate([
    (0, core_1.NgModule)({
        declarations: [pm_component_1.PMComponent, servicerequest_component_1.ServiceRequestComponent,
            workorder_component_1.WorkOrderComponent, woreimb_component_1.WOReImbComponent,
            assetstatus_component_1.AssetStatusComponent, assetswap_component_1.AssetSwapComponent, cancelrwbevents_component_1.CancelRWBEventComponent, job_component_1.JobComponent, jobclose_component_1.JobCloseComponent,
            rwb_component_1.RWBComponent, rwbevent_component_1.RWBEventComponent, rwbexpense_component_1.RWBExpenseComponent, rwbupdate_component_1.RWBUpdateComponent],
        imports: [
            router_1.RouterModule.forChild(operation_routes_1.operationRoutes),
            forms_1.ReactiveFormsModule, forms_1.FormsModule, app_material_module_1.MaterialModule, shared_module_1.SharedModule
        ],
        providers: [agGridHelper_1.agGridHelper],
    })
], OperationModule);
exports.OperationModule = OperationModule;
//# sourceMappingURL=operation.module.js.map