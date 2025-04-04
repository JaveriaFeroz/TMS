"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetentionComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let DetentionComponent = class DetentionComponent {
    constructor(detentionR, formbulider, svcDetention, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.detentionR = detentionR;
        this.formbulider = formbulider;
        this.svcDetention = svcDetention;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Detention';
        this.colSearch = [
            { headerName: 'Id', field: 'detentionId', width: 70 },
            { headerName: 'Detention Narration', field: 'detentionName', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmDetention = this.formbulider.group({
            detentionId: [null, [forms_1.Validators.required]],
            detentionName: [null, [forms_1.Validators.required]],
            hRsThreshold: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmDetention.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmDetention.reset();
        this.frmDetention.enable();
        this.frmDetention.controls.detentionId.disable();
        this.frmDetention.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.detentionName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmDetention.controls.detentionId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.detentionId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcDetention.getDetentions().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Detention", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.detentionId);
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
        this.frmDetention.enable();
        this.frmDetention.controls.detentionId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.detentionName.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmDetention.markAllAsTouched();
            if (!this.frmDetention.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmDetention.getRawValue();
                formData.footer = this.footer;
                this.svcDetention.save(formData).subscribe(() => {
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
        this.detentionR.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcDetention.get(Id).subscribe(det => {
                if (det) {
                    this.frmDetention.disable();
                    this.frmDetention.controls['detentionId'].setValue(det.detentionId);
                    this.frmDetention.controls['detentionName'].setValue(det.detentionName);
                    this.frmDetention.controls['hRsThreshold'].setValue(det.hRsThreshold);
                    this.frmDetention.controls['isActive'].setValue(det.isActive);
                    this.footer = det.footer;
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
        this.frmDetention.reset();
        this.frmDetention.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('detentionName', { static: true })
], DetentionComponent.prototype, "detentionName", void 0);
__decorate([
    core_1.ViewChild('detentionId', { static: true })
], DetentionComponent.prototype, "detentionId", void 0);
DetentionComponent = __decorate([
    core_1.Component({
        selector: 'app-detention',
        templateUrl: './detention.component.html',
        styleUrls: ['./detention.component.css']
    })
], DetentionComponent);
exports.DetentionComponent = DetentionComponent;
//# sourceMappingURL=detention.component.js.map