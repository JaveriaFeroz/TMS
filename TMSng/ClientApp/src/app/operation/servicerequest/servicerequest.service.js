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
exports.ServiceRequestService = void 0;
const core_1 = require("@angular/core");
let ServiceRequestService = class ServiceRequestService {
    constructor(http, baseUrl) {
        this.http = http;
        this.apiURL = baseUrl;
    }
    getServiceRequests() {
        return this.http.get(this.apiURL + 'operation/ServiceRequest/');
    }
    getLookups() {
        return this.http.get(this.apiURL + 'operation/ServiceRequest/GetLookups/');
    }
    get(requestId) {
        return this.http.get(this.apiURL + 'operation/ServiceRequest/' + requestId);
    }
    save(servicerequest) {
        return this.http.post(this.apiURL + 'operation/ServiceRequest/', servicerequest);
    }
    submit(sub) {
        return this.http.post(this.apiURL + 'operation/ServiceRequest/Submit', sub);
    }
    getMaintenaceHistory(assetid) {
        return this.http.get(this.apiURL + 'master/Asset/GetAssetMaintHistory/' + assetid);
    }
};
ServiceRequestService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    }),
    __param(1, core_1.Inject('API_BASE_URL'))
], ServiceRequestService);
exports.ServiceRequestService = ServiceRequestService;
//# sourceMappingURL=servicerequest.service.js.map