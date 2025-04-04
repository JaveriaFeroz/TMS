"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let RouteComponent = class RouteComponent {
    constructor(router, formbulider, svcRoute, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcRoute = svcRoute;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Route';
        this.colSearch = [
            { headerName: 'Route Id', field: 'routeId', width: 70 },
            { headerName: 'Route Name', field: 'routeName', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.loadLookup();
        this.enablePartialDelivery = agFormHelper_1.agFormHelper.enablePartialDelivery();
    }
    ngOnInit() {
        this.frmRoute = this.formbulider.group({
            routeId: [null, [forms_1.Validators.required]],
            routeName: [null, [forms_1.Validators.required]],
            originId: [null],
            destinationId: [null],
            consigneeStartPoint: [null],
            consigneeFinishPoint: [null],
            stdKMs: [null, [forms_1.Validators.required]],
            stdTT: [null, [forms_1.Validators.required]],
            hillyKMs: [null],
            tollTaxApplicable: [null],
            isActive: [null],
            enablePartialDelivery: [null],
        });
        this.frmRoute.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        this.frmRoute.patchValue({ enablePartialDelivery: this.enablePartialDelivery });
    }
    //#region toolbar functions
    tbAdd() {
        this.frmRoute.reset();
        this.frmRoute.enable();
        this.frmRoute.controls.routeId.disable();
        this.frmRoute.patchValue({ isActive: true, enablePartialDelivery: this.enablePartialDelivery, tollTaxApplicable: false });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.routeName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmRoute.controls.routeId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.routeId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcRoute.getRoutes().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Route", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.routeId);
                    }
                });
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcSearchDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbEdit() {
        this.frmRoute.enable();
        this.frmRoute.controls.routeId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.routeName.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmRoute.markAllAsTouched();
            if (!this.frmRoute.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmRoute.getRawValue();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcRoute.save(formData).subscribe(() => {
                        this.initForm();
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                        this.svcToaster.showSuccess('Record saved Successfully');
                    }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                }
            }
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbUndo() {
        this.initForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcRoute.get(Id).subscribe(route => {
                if (route) {
                    this.frmRoute.disable();
                    this.frmRoute.controls['routeId'].setValue(route.routeId);
                    this.frmRoute.controls['routeName'].setValue(route.routeName);
                    this.frmRoute.controls['originId'].setValue(route.originId);
                    this.frmRoute.controls['destinationId'].setValue(route.destinationId);
                    this.frmRoute.controls['consigneeStartPoint'].setValue(route.consigneeStartPoint);
                    this.frmRoute.controls['consigneeFinishPoint'].setValue(route.consigneeFinishPoint);
                    this.frmRoute.controls['stdKMs'].setValue(route.stdKMs);
                    this.frmRoute.controls['stdTT'].setValue(route.stdTT);
                    this.frmRoute.controls['hillyKMs'].setValue(route.hillyKMs);
                    this.frmRoute.controls['isActive'].setValue(route.isActive);
                    this.frmRoute.controls['tollTaxApplicable'].setValue(route.tollTaxApplicable);
                    this.frmRoute.controls['enablePartialDelivery'].setValue(this.enablePartialDelivery);
                    this.footer = route.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    loadLookup() {
        try {
            this.svcRoute.getLookup().subscribe(data => {
                this.lstCity = data.lstCity;
                this.lstConsignee = data.lstConsignee;
                this.lstShipper = data.lstShipper;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(r) {
        this.errors = [];
        if (this.enablePartialDelivery == true) {
            if (r.consigneeStartPoint == null || r.consigneeFinishPoint == null) {
                this.errors.push('Please Select Start Point/ Finish Point   must have value ');
            }
        }
        else if (this.enablePartialDelivery == false) {
            if (r.originId == null || r.destinationId == null) {
                this.errors.push('Please Select Start Point/ Finish Point   must have value ');
            }
        }
    }
    initForm() {
        this.frmRoute.reset();
        this.frmRoute.disable();
        this.frmRoute.patchValue({ isActive: true, enablePartialDelivery: this.enablePartialDelivery, tollTaxApplicable: false });
    }
};
__decorate([
    core_1.ViewChild('routeName', { static: true })
], RouteComponent.prototype, "routeName", void 0);
__decorate([
    core_1.ViewChild('routeId', { static: true })
], RouteComponent.prototype, "routeId", void 0);
RouteComponent = __decorate([
    core_1.Component({
        selector: 'app-route',
        templateUrl: './route.component.html',
        styleUrls: ['./route.component.css']
    })
], RouteComponent);
exports.RouteComponent = RouteComponent;
//# sourceMappingURL=route.component.js.map