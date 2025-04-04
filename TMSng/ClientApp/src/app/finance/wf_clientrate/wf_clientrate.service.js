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
exports.WF_ClientRateService = void 0;
const core_1 = require("@angular/core");
let WF_ClientRateService = class WF_ClientRateService {
    constructor(http, baseUrl) {
        this.http = http;
        this.apiURL = baseUrl;
    }
    getClientRates() {
        return this.http.get(this.apiURL + 'finance/WFClientRate/GetPendingForms/');
    }
    getLookup() {
        return this.http.get(this.apiURL + 'finance/WFClientRate/GetLookups');
    }
    get(formId) {
        return this.http.get(this.apiURL + 'finance/WFClientRate/' + formId);
    }
    getExistingRate(clientId) {
        return this.http.get(this.apiURL + 'finance/WFClientRate/GetExistingRate/' + clientId);
    }
    save(clientrate) {
        return this.http.post(this.apiURL + 'finance/WFClientRate/', clientrate);
    }
    submit(sub) {
        return this.http.post(this.apiURL + 'finance/WFClientRate/Submit', sub);
    }
};
WF_ClientRateService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    }),
    __param(1, core_1.Inject('API_BASE_URL'))
], WF_ClientRateService);
exports.WF_ClientRateService = WF_ClientRateService;
//# sourceMappingURL=wf_clientrate.service.js.map