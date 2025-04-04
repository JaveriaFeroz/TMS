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
exports.RWBService = void 0;
const core_1 = require("@angular/core");
let RWBService = class RWBService {
    constructor(http, baseUrl) {
        this.http = http;
        this.apiURL = baseUrl;
    }
    getRWBs() {
        return this.http.get(this.apiURL + 'operation/RWB/');
    }
    get(rwbNo) {
        return this.http.get(this.apiURL + 'operation/RWB/' + rwbNo);
    }
    save(rwb) {
        return this.http.post(this.apiURL + 'operation/RWB/', rwb);
    }
    getLookup() {
        return this.http.get(this.apiURL + 'operation/RWB/GetLookups');
    }
    getClients() {
        return this.http.get(this.apiURL + 'operation/RWB/GetClients');
    }
};
RWBService = __decorate([
    core_1.Injectable({ providedIn: 'root' }),
    __param(1, core_1.Inject('API_BASE_URL'))
], RWBService);
exports.RWBService = RWBService;
//# sourceMappingURL=rwb.service.js.map