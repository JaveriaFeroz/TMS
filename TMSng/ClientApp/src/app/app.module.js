"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const http_1 = require("@angular/common/http");
const core_1 = require("@angular/core");
const core_2 = require("@angular/material/core");
const platform_browser_1 = require("@angular/platform-browser");
const animations_1 = require("@angular/platform-browser/animations");
const router_1 = require("@angular/router");
const ag_grid_angular_1 = require("ag-grid-angular");
const app_component_1 = require("./app.component");
const app_material_module_1 = require("./app.material.module");
const app_routes_1 = require("./app.routes");
const login_layout_component_1 = require("./common/login/login-layout.component");
const login_component_1 = require("./common/login/login.component");
const login_service_1 = require("./common/login/login.service");
const main_layout_component_1 = require("./common/main/main-layout.component");
const main_component_1 = require("./common/main/main.component");
const Menu_component_1 = require("./common/menu/Menu.component");
const myform_component_1 = require("./common/myform/myform.component");
const filter_pipe_1 = require("./filter.pipe");
//import { NumberDirective } from './helper/numbers-only.directive';
/*import { agDatePickerComponent } from './helper/ag-datepicker.component';*/
const agGrid_date_component_1 = require("./helper/agGrid-date.component");
const agGrid_time_component_1 = require("./helper/agGrid-time.component");
const agGridHelper_1 = require("./helper/agGridHelper");
const page_not_found_component_1 = require("./helper/error/page-not-found.component");
const auth_guard_1 = require("./helper/guard/auth.guard");
const auth_gl_guard_1 = require("./helper/guard/auth.gl.guard");
const auth_nongl_guard_1 = require("./helper/guard/auth.nongl.guard");
const auth_service_1 = require("./helper/service/auth.service");
const shared_module_1 = require("./shared.module");
const page_not_authorized_component_1 = require("./helper/error/page-not-authorized.component");
const ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
//import { PrimeCellEditorComponent } from './helper/ag-editor.component';
//import { CustomDateComponent } from './helper/ag-date.component';
//import { CalendarModule } from '../../node_modules/primeng/calendar';
//import { TabContentComponent } from "./common/main/tab-content.component";
//import { ContentContainerDirective } from "./common/main/content-container.directive";
//import { TabService } from "./common/main/tab.service";
//TabContentComponent, ContentContainerDirective, TabService
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, core_1.NgModule)({
        declarations: [
            app_component_1.AppComponent, login_component_1.LoginComponent, login_layout_component_1.LoginLayoutComponent, main_layout_component_1.MainLayoutComponent, main_component_1.MainComponent, Menu_component_1.MenuComponent,
            page_not_found_component_1.PageNotFoundComponent, page_not_authorized_component_1.PageNotAuthorizedComponent, myform_component_1.MyFormComponent, filter_pipe_1.numFilterPipe, filter_pipe_1.stringFilterPipe, agGrid_date_component_1.agGridDateEditor, agGrid_time_component_1.agGridTimeEditor
        ],
        imports: [
            platform_browser_1.BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
            http_1.HttpClientModule,
            animations_1.BrowserAnimationsModule,
            app_material_module_1.MaterialModule,
            shared_module_1.SharedModule.forRoot(),
            router_1.RouterModule.forRoot(app_routes_1.mainRoutes),
            //CalendarModule,
            ag_grid_angular_1.AgGridModule.withComponents([agGrid_date_component_1.agGridDateEditor]),
            ng_bootstrap_1.NgbModule
        ],
        entryComponents: [],
        providers: [login_service_1.LoginService, auth_service_1.AuthService, auth_guard_1.AuthGuard, auth_gl_guard_1.AuthGLGuard, auth_nongl_guard_1.AuthNonGLGuard, agGridHelper_1.agGridHelper,
            { provide: core_2.MAT_DATE_LOCALE, useValue: 'en-GB' }
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map