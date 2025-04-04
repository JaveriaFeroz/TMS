"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplainantComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let ComplainantComponent = class ComplainantComponent {
    constructor(router, formbulider, svcComplainant, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcComplainant = svcComplainant;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.optionName = 'Complainant';
        this.colSearch = [
            { headerName: 'Id', field: 'complainantId', width: 70 },
            { headerName: 'Complainant Name', field: 'complainantName', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmComplainant = this.formbulider.group({
            complainantId: [null, [forms_1.Validators.required]],
            complainantName: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmComplainant.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmComplainant.reset();
        this.frmComplainant.enable();
        this.frmComplainant.controls.complainantId.disable();
        this.frmComplainant.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.complainantName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmComplainant.controls.complainantId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.complainantId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcComplainant.getComplainants().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Complainant", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.complainantId);
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
        this.frmComplainant.enable();
        this.frmComplainant.controls.complainantId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.complainantName.nativeElement.focus();
    }
    tbSave() {
        if (!this.frmComplainant.invalid) {
            this.svcWaitDlg.open({});
            var formData = this.frmComplainant.getRawValue();
            formData.footer = this.footer;
            this.svcComplainant.save(formData).subscribe(() => {
                this.initForm();
                agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                this.svcToaster.showSuccess('Record saved Successfully');
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
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
            this.svcComplainant.get(Id).subscribe(complainant => {
                if (complainant) {
                    this.frmComplainant.disable();
                    this.frmComplainant.controls['complainantId'].setValue(complainant.complainantId);
                    this.frmComplainant.controls['complainantName'].setValue(complainant.complainantName);
                    this.frmComplainant.controls['isActive'].setValue(complainant.isActive);
                    this.footer = complainant.footer;
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
        this.frmComplainant.reset();
        this.frmComplainant.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('complainantName', { static: true })
], ComplainantComponent.prototype, "complainantName", void 0);
__decorate([
    core_1.ViewChild('complainantId', { static: true })
], ComplainantComponent.prototype, "complainantId", void 0);
ComplainantComponent = __decorate([
    core_1.Component({
        selector: 'app-complainant',
        templateUrl: './complainant.component.html',
        styleUrls: ['./complainant.component.css']
    })
], ComplainantComponent);
exports.ComplainantComponent = ComplainantComponent;
//# sourceMappingURL=complainant.component.js.map