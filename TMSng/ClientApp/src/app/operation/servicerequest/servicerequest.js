"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRequest = void 0;
const footer_1 = require("../../helper/footer");
class ServiceRequest {
    constructor() {
        this.footer = new footer_1.agFooter();
        //this.footer = new agFooter();
        this.footer.createdBy = sessionStorage.getItem("UserId");
    }
}
exports.ServiceRequest = ServiceRequest;
//# sourceMappingURL=servicerequest.js.map