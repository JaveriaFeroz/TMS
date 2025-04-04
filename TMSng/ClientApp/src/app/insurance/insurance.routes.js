"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insuranceRoutes = void 0;
const auth_guard_1 = require("../helper/guard/auth.guard");
const insclaim_component_1 = require("./insclaim/insclaim.component");
const inscompany_component_1 = require("./inscompany/inscompany.component");
const inspolicy_component_1 = require("./inspolicy/inspolicy.component");
const instype_component_1 = require("./instype/instype.component");
exports.insuranceRoutes = [
    {
        path: 'InsClaim',
        component: insclaim_component_1.InsClaimComponent,
        canActivate: [auth_guard_1.AuthGuard],
        data: {
            title: 'Insurance Claim'
        }
    },
    {
        path: 'InsCompany',
        component: inscompany_component_1.InsCompanyComponent,
        canActivate: [auth_guard_1.AuthGuard],
        data: {
            title: 'Insurance Company'
        }
    },
    {
        path: 'InsPolicy',
        component: inspolicy_component_1.InsPolicyComponent,
        canActivate: [auth_guard_1.AuthGuard],
        data: {
            title: 'Insurance Policy'
        }
    },
    {
        path: 'InsType',
        component: instype_component_1.InsTypeComponent,
        canActivate: [auth_guard_1.AuthGuard],
        data: {
            title: 'Insurance Type'
        }
    }
];
//# sourceMappingURL=insurance.routes.js.map