"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRoutes = void 0;
const login_layout_component_1 = require("./common/login/login-layout.component");
const main_layout_component_1 = require("./common/main/main-layout.component");
const myform_component_1 = require("./common/myform/myform.component");
const page_not_authorized_component_1 = require("./helper/error/page-not-authorized.component");
const page_not_found_component_1 = require("./helper/error/page-not-found.component");
const auth_guard_1 = require("./helper/guard/auth.guard");
exports.mainRoutes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: login_layout_component_1.LoginLayoutComponent, data: { title: 'Login' } },
    { path: 'notauthorized', component: page_not_authorized_component_1.PageNotAuthorizedComponent },
    { path: 'MainForm', component: main_layout_component_1.MainLayoutComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Main' }
    },
    {
        path: 'common/MyForm', component: myform_component_1.MyFormComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'My Forms' }
    },
    { path: 'master', loadChildren: () => Promise.resolve().then(() => require('./master/master.module')).then(m => m.MasterModule) },
    { path: 'inventory', loadChildren: () => Promise.resolve().then(() => require('./inventory/inventory.module')).then(m => m.InventoryModule) },
    { path: 'insurance', loadChildren: () => Promise.resolve().then(() => require('./insurance/insurance.module')).then(m => m.InsuranceModule) },
    { path: 'operation', loadChildren: () => Promise.resolve().then(() => require('./operation/operation.module')).then(m => m.OperationModule) },
    { path: 'download', loadChildren: () => Promise.resolve().then(() => require('./download/download.module')).then(m => m.DownloadModule) },
    { path: 'finance', loadChildren: () => Promise.resolve().then(() => require('./finance/finance.module')).then(m => m.FinanceModule) },
    { path: '**', component: page_not_found_component_1.PageNotFoundComponent }
];
//# sourceMappingURL=app.routes.js.map