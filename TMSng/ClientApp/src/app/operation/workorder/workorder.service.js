"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkOrderService = void 0;
const core_1 = require("@angular/core");
let WorkOrderService = class WorkOrderService {
    constructor(http, baseUrl) {
        this.http = http;
        this.apiURL = baseUrl;
    }
    getWorkOrders() {
        return this.http.get(this.apiURL + 'operation/WorkOrder/');
    }
    getLookups() {
        return this.http.get(this.apiURL + 'operation/WorkOrder/GetLookups/');
    }
    get(wono) {
        return this.http.get(this.apiURL + 'operation/WorkOrder/' + wono);
    }
    save(wo) {
        return this.http.post(this.apiURL + 'operation/WorkOrder/', wo);
    }
    getServiceRequests() {
        return this.http.get(this.apiURL + 'operation/WorkOrder/GetServiceRequests/');
    }
    getMaintenaceHistory(assetid) {
        return this.http.get(this.apiURL + 'master/Asset/GetAssetMaintHistory/' + assetid);
    }
    getActivities() {
        return this.http.get(this.apiURL + 'operation/WorkOrder/GetActivities/' + 0);
    }
    saveActual(wo) {
        return this.http.post(this.apiURL + 'operation/WorkOrder/SaveActual', wo);
    }
    submit(sub) {
        return this.http.post(this.apiURL + 'operation/WorkOrder/Submit', sub);
    }
};
WorkOrderService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    }),
    __param(1, core_1.Inject('API_BASE_URL'))
], WorkOrderService);
exports.WorkOrderService = WorkOrderService;
//# sourceMappingURL=workorder.service.js.map