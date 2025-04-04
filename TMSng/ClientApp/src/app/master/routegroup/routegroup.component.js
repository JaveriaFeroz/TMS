"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteGroupComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let RouteGroupComponent = class RouteGroupComponent {
    constructor(router, formbulider, svcRouteGroup, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcRouteGroup = svcRouteGroup;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Route Group';
        this.colSearch = [
            { headerName: 'Group Id', field: 'routeGroupId', width: 70 },
            { headerName: 'Group Name', field: 'routeGroupName', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        /*  lstRouteGroupType: any;*/
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmRouteGroup = this.formbulider.group({
            groupId: [null, [forms_1.Validators.required]],
            groupName: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmRouteGroup.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmRouteGroup.reset();
        this.frmRouteGroup.enable();
        this.frmRouteGroup.controls.groupId.disable();
        this.frmRouteGroup.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.groupName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmRouteGroup.controls.groupId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.groupId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcRouteGroup.getRouteGroups().subscribe(r => {
                this.svcSearchDlg.open("Search & Select RouteGroup", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.groupId);
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
        this.frmRouteGroup.enable();
        this.frmRouteGroup.controls.groupId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.groupName.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmRouteGroup.markAllAsTouched();
            if (!this.frmRouteGroup.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmRouteGroup.getRawValue();
                formData.footer = this.footer;
                this.svcRouteGroup.save(formData).subscribe(() => {
                    this.initForm();
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                    this.svcToaster.showSuccess('Record saved Successfully');
                }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
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
            this.svcRouteGroup.get(Id).subscribe(routegroup => {
                if (routegroup) {
                    this.frmRouteGroup.disable();
                    this.frmRouteGroup.controls['groupId'].setValue(routegroup.groupId);
                    this.frmRouteGroup.controls['groupName'].setValue(routegroup.groupName);
                    this.frmRouteGroup.controls['isActive'].setValue(routegroup.isActive);
                    this.footer = routegroup.footer;
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
    initForm() {
        this.frmRouteGroup.reset();
        this.frmRouteGroup.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('groupName', { static: true })
], RouteGroupComponent.prototype, "groupName", void 0);
__decorate([
    core_1.ViewChild('groupId', { static: true })
], RouteGroupComponent.prototype, "groupId", void 0);
RouteGroupComponent = __decorate([
    core_1.Component({
        selector: 'app-routegroup',
        templateUrl: './routegroup.component.html',
        styleUrls: ['./routegroup.component.css']
    })
], RouteGroupComponent);
exports.RouteGroupComponent = RouteGroupComponent;
//# sourceMappingURL=routegroup.component.js.map