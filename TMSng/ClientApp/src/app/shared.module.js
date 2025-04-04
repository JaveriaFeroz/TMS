"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SharedModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const common_1 = require("@angular/common");
const http_1 = require("@angular/common/http");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const progress_bar_1 = require("@angular/material/progress-bar");
const ag_grid_angular_1 = require("ag-grid-angular");
const ngx_toastr_1 = require("ngx-toastr");
const app_material_module_1 = require("./app.material.module");
const footer_component_1 = require("./common/footer/footer.component");
const formsubmission_dialog_component_1 = require("./helper/formsubmissionDialog/formsubmission-dialog.component");
const formsubmission_dialog_service_1 = require("./helper/formsubmissionDialog/formsubmission-dialog.service");
const history_dialog_component_1 = require("./helper/historyDialog/history-dialog.component");
const history_dialog_service_1 = require("./helper/historyDialog/history-dialog.service");
const outstandinginvoice_component_1 = require("./helper/outstandinginvoice/outstandinginvoice.component");
const outstandinginvoice_service_1 = require("./helper/outstandinginvoice/outstandinginvoice.service");
const outstandingpiv_component_1 = require("./helper/outstandingpiv/outstandingpiv.component");
const outstandingpiv_service_1 = require("./helper/outstandingpiv/outstandingpiv.service");
const outstandingslip_component_1 = require("./helper/outstandingslip/outstandingslip.component");
const outstandingslip_service_1 = require("./helper/outstandingslip/outstandingslip.service");
const outstandingtrip_component_1 = require("./helper/outstandingtrip/outstandingtrip.component");
const outstandingtrip_service_1 = require("./helper/outstandingtrip/outstandingtrip.service");
const search_dialog_component_1 = require("./helper/searchDialog/search-dialog.component");
const search_dialog_service_1 = require("./helper/searchDialog/search-dialog.service");
const errorInterceptor_service_1 = require("./helper/service/errorInterceptor.service");
const toaster_service_1 = require("./helper/service/toaster.service");
const tokenInterceptor_service_1 = require("./helper/service/tokenInterceptor.service");
const wait_dialog_component_1 = require("./helper/waitDialog/wait-dialog.component");
const wait_dialog_service_1 = require("./helper/waitDialog/wait-dialog.service");
//import { TabService } from "./common/main/tab.service";
//import { TabContentComponent } from "./common/main/tab-content.component";
//import { ContentContainerDirective } from "./common/main/content-container.directive";
let SharedModule = SharedModule_1 = class SharedModule {
    static forRoot() {
        return {
            ngModule: SharedModule_1,
            providers: [wait_dialog_service_1.WaitDialogService,
                search_dialog_service_1.SearchDialogService,
                history_dialog_service_1.HistoryDialogService,
                formsubmission_dialog_service_1.FormSubmissionDialogService,
                toaster_service_1.agToasterService,
                outstandinginvoice_component_1.OutstandingInvoiceComponent,
                outstandingpiv_component_1.OutstandingPIVComponent,
                outstandingslip_component_1.OutstandingSlipComponent,
                outstandingtrip_component_1.OutstandingTripComponent,
                outstandinginvoice_service_1.OutstandingInvoiceService,
                outstandingpiv_service_1.OutstandingPIVService,
                outstandingslip_service_1.OutstandingSlipService,
                outstandingtrip_service_1.OutstandingTripService,
                {
                    provide: http_1.HTTP_INTERCEPTORS,
                    useClass: tokenInterceptor_service_1.TokenInterceptorService,
                    multi: true
                },
                {
                    provide: http_1.HTTP_INTERCEPTORS,
                    useClass: errorInterceptor_service_1.ErrorInterceptorService,
                    multi: true,
                }]
        };
    }
};
SharedModule = SharedModule_1 = __decorate([
    core_1.NgModule({
        declarations: [footer_component_1.FooterComponent, wait_dialog_component_1.WaitDialogComponent, search_dialog_component_1.SearchDialogComponent, history_dialog_component_1.HistoryDialogComponent, formsubmission_dialog_component_1.FormSubmissionDialogComponent,
            outstandinginvoice_component_1.OutstandingInvoiceComponent, outstandingpiv_component_1.OutstandingPIVComponent, outstandingslip_component_1.OutstandingSlipComponent, outstandingtrip_component_1.OutstandingTripComponent],
        imports: [app_material_module_1.MaterialModule, common_1.CommonModule, forms_1.FormsModule, forms_1.ReactiveFormsModule, progress_bar_1.MatProgressBarModule, ag_grid_angular_1.AgGridModule.withComponents([]),
            ngx_toastr_1.ToastrModule.forRoot({ timeOut: 2000, enableHtml: true })],
        exports: [common_1.CommonModule, forms_1.FormsModule, forms_1.ReactiveFormsModule, footer_component_1.FooterComponent, progress_bar_1.MatProgressBarModule, ag_grid_angular_1.AgGridModule, ngx_toastr_1.ToastrModule],
        entryComponents: [wait_dialog_component_1.WaitDialogComponent, search_dialog_component_1.SearchDialogComponent, history_dialog_component_1.HistoryDialogComponent, formsubmission_dialog_component_1.FormSubmissionDialogComponent,
            outstandinginvoice_component_1.OutstandingInvoiceComponent, outstandingpiv_component_1.OutstandingPIVComponent, outstandingslip_component_1.OutstandingSlipComponent, outstandingtrip_component_1.OutstandingTripComponent]
    })
], SharedModule);
exports.SharedModule = SharedModule;
//to be used when services to be shared like search, wait etc
//# sourceMappingURL=shared.module.js.map