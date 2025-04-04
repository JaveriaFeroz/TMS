"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationRoutes = void 0;
const auth_guard_1 = require("../helper/guard/auth.guard");
const assetstatus_component_1 = require("./assetstatus/assetstatus.component");
const assetswap_component_1 = require("./assetswap/assetswap.component");
const cancelrwbevents_component_1 = require("./cancelrwbevents/cancelrwbevents.component");
const job_component_1 = require("./job/job.component");
const jobclose_component_1 = require("./jobclose/jobclose.component");
const pm_component_1 = require("./pm/pm.component");
const rwb_component_1 = require("./rwb/rwb.component");
const rwbevent_component_1 = require("./rwbevent/rwbevent.component");
const rwbexpense_component_1 = require("./rwbexpense/rwbexpense.component");
const rwbupdate_component_1 = require("./rwbupdate/rwbupdate.component");
const servicerequest_component_1 = require("./servicerequest/servicerequest.component");
const workorder_component_1 = require("./workorder/workorder.component");
const woreimb_component_1 = require("./woreimb/woreimb.component");
exports.operationRoutes = [
    {
        path: 'PM', component: pm_component_1.PMComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Preventive Maintenance' }
    },
    {
        path: 'ServiceRequest', component: servicerequest_component_1.ServiceRequestComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Service Request' }
    },
    {
        path: 'WorkOrder', component: workorder_component_1.WorkOrderComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Work Order' }
    },
    {
        path: 'WOReImb', component: woreimb_component_1.WOReImbComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Work Orde ReImbursement' }
    },
    {
        path: 'AssetStatus', component: assetstatus_component_1.AssetStatusComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Asset Status' }
    },
    {
        path: 'AssetSwap', component: assetswap_component_1.AssetSwapComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Asset Swap' }
    },
    {
        path: 'CancelRWBEvent', component: cancelrwbevents_component_1.CancelRWBEventComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Cancel RWB Event' }
    },
    {
        path: 'Job', component: job_component_1.JobComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Job' }
    },
    {
        path: 'JobClose', component: jobclose_component_1.JobCloseComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Job Closure' }
    },
    {
        path: 'RWB', component: rwb_component_1.RWBComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Road Way Bill' }
    },
    {
        path: 'RWBEvent', component: rwbevent_component_1.RWBEventComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Trip Events' }
    },
    {
        path: 'RWBExpense', component: rwbexpense_component_1.RWBExpenseComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Rwb Expense' }
    },
    {
        path: 'RWBUpdate', component: rwbupdate_component_1.RWBUpdateComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Trip Updates' }
    }
];
//# sourceMappingURL=operation.routes.js.map