"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleGroupComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let VehicleGroupComponent = class VehicleGroupComponent {
    constructor(vehiclegroupr, formbulider, svcVehicleGroup, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.vehiclegroupr = vehiclegroupr;
        this.formbulider = formbulider;
        this.svcVehicleGroup = svcVehicleGroup;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Vehicle Group';
        this.colSearch = [
            { headerName: 'Group Id', field: 'groupId', width: 70 },
            { headerName: 'Group Name', field: 'groupName', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmVehicleGroup = this.formbulider.group({
            groupId: [null, [forms_1.Validators.required]],
            groupName: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmVehicleGroup.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmVehicleGroup.reset();
        this.frmVehicleGroup.enable();
        this.frmVehicleGroup.controls.groupId.disable();
        this.frmVehicleGroup.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.groupName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmVehicleGroup.controls.groupId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.groupId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcVehicleGroup.getVehicleGroups().subscribe(r => {
                this.svcSearchDlg.open("Search & Select VehicleGroup", this.colSearch, r);
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
        this.frmVehicleGroup.enable();
        this.frmVehicleGroup.controls.groupId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.groupName.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmVehicleGroup.markAllAsTouched();
            if (!this.frmVehicleGroup.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmVehicleGroup.getRawValue();
                formData.footer = this.footer;
                this.svcVehicleGroup.save(formData).subscribe(() => {
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
        this.vehiclegroupr.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcVehicleGroup.get(Id).subscribe(vehiclegroup => {
                if (vehiclegroup) {
                    this.frmVehicleGroup.disable();
                    this.frmVehicleGroup.controls['groupId'].setValue(vehiclegroup.groupId);
                    this.frmVehicleGroup.controls['groupName'].setValue(vehiclegroup.groupName);
                    this.frmVehicleGroup.controls['isActive'].setValue(vehiclegroup.isActive);
                    this.footer = vehiclegroup.footer;
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
        this.frmVehicleGroup.reset();
        this.frmVehicleGroup.disable();
    }
};
__decorate([
    core_1.ViewChild('groupName', { static: true })
], VehicleGroupComponent.prototype, "groupName", void 0);
__decorate([
    core_1.ViewChild('groupId', { static: true })
], VehicleGroupComponent.prototype, "groupId", void 0);
VehicleGroupComponent = __decorate([
    core_1.Component({
        selector: 'app-vehiclegroup',
        templateUrl: './vehiclegroup.component.html',
        styleUrls: ['./vehiclegroup.component.css']
    })
], VehicleGroupComponent);
exports.VehicleGroupComponent = VehicleGroupComponent;
//# sourceMappingURL=vehiclegroup.component.js.map