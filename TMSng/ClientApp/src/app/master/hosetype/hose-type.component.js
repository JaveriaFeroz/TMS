"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoseTypeComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let HoseTypeComponent = class HoseTypeComponent {
    constructor(router, formbulider, svcHoseType, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcHoseType = svcHoseType;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Hose Type';
        this.colSearch = [
            { headerName: 'Id', field: 'hoseTypeId', width: 70 },
            { headerName: 'Hose Type Name', field: 'hoseTypeName', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmHoseType = this.formbulider.group({
            hoseTypeId: [null, [forms_1.Validators.required]],
            hoseTypeName: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmHoseType.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmHoseType.reset();
        this.frmHoseType.enable();
        this.frmHoseType.controls.hoseTypeId.disable();
        this.frmHoseType.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.hoseTypeName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmHoseType.controls.hoseTypeId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.hoseTypeId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcHoseType.getHoseTypes().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Hose Type", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.hoseTypeId);
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
        this.frmHoseType.enable();
        this.frmHoseType.controls.hoseTypeId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.hoseTypeName.nativeElement.focus();
    }
    tbSave() {
        try {
            if (!this.frmHoseType.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmHoseType.getRawValue();
                formData.footer = this.footer;
                this.svcHoseType.save(formData).subscribe(() => {
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
            this.svcHoseType.get(Id).subscribe(hosetype => {
                if (hosetype) {
                    this.frmHoseType.disable();
                    this.frmHoseType.controls['hoseTypeId'].setValue(hosetype.hoseTypeId);
                    this.frmHoseType.controls['hoseTypeName'].setValue(hosetype.hoseTypeName);
                    this.frmHoseType.controls['isActive'].setValue(hosetype.isActive);
                    this.footer = hosetype.footer;
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
        this.frmHoseType.reset();
        this.frmHoseType.disable();
        this.footer = new footer_1.agFooter();
        // 
    }
};
__decorate([
    core_1.ViewChild('hoseTypeName', { static: true })
], HoseTypeComponent.prototype, "hoseTypeName", void 0);
__decorate([
    core_1.ViewChild('hoseTypeId', { static: true })
], HoseTypeComponent.prototype, "hoseTypeId", void 0);
HoseTypeComponent = __decorate([
    core_1.Component({
        selector: 'app-hosetype',
        templateUrl: './hose-type.component.html',
        styleUrls: ['./hose-type.component.css']
    })
], HoseTypeComponent);
exports.HoseTypeComponent = HoseTypeComponent;
//# sourceMappingURL=hose-type.component.js.map