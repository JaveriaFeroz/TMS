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
exports.RwbUpdateService = void 0;
const core_1 = require("@angular/core");
let RwbUpdateService = class RwbUpdateService {
    constructor(http, baseUrl) {
        this.http = http;
        this.apiURL = baseUrl;
    }
    //getClients(): Observable<any> {
    //  return this.http.get<any>(this.apiURL + 'operation/Rwb/GetClientLookups');
    //}
    getLookup() {
        return this.http.get(this.apiURL + 'operation/RWB/GetLookups');
    }
    get(rwbNo) {
        return this.http.get(this.apiURL + 'operation/Rwb/GetForUpdate/' + rwbNo);
    }
    update(rwb) {
        return this.http.post(this.apiURL + 'operation/Rwb/SaveUpdates/', rwb);
    }
};
RwbUpdateService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    }),
    __param(1, core_1.Inject('API_BASE_URL'))
], RwbUpdateService);
exports.RwbUpdateService = RwbUpdateService;
//# sourceMappingURL=rwbupdate.service.js.map