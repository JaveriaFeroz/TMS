"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintByComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let ComplaintByComponent = class ComplaintByComponent {
    constructor(router, formbulider, complaintbyService, toaster, helper, waitDlg, searchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.complaintbyService = complaintbyService;
        this.toaster = toaster;
        this.helper = helper;
        this.waitDlg = waitDlg;
        this.searchDlg = searchDlg;
        //#region constant variables
        this.optionName = 'Complaint By';
        this.searchColDefs = [
            { headerName: 'Id', field: 'complaintById', width: 70 },
            { headerName: 'Complaint By Name', field: 'complaintByName', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.complaintbyForm = this.formbulider.group({
            ComplaintById: [null, [forms_1.Validators.required]],
            ComplaintByName: [null, [forms_1.Validators.required]],
            IsActive: [null],
        });
        this.complaintbyForm.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.complaintbyForm.reset();
        this.complaintbyForm.enable();
        this.complaintbyForm.controls.ComplaintById.disable();
        this.complaintbyForm.patchValue({ IsActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.complaintByName.nativeElement.focus();
    }
    tbEdit() {
        this.complaintbyForm.enable();
        this.complaintbyForm.controls.ComplaintById.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.complaintByName.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.waitDlg.open({});
            this.complaintbyService.GetList().subscribe(r => {
                this.searchDlg.open("Search & Select Complaint By", this.searchColDefs, r);
                this.searchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.complaintById);
                    }
                });
            }, error => { this.toaster.showFailure(error); }, () => { this.waitDlg.close(); });
        }
        catch (e) {
            this.searchDlg.close();
            this.toaster.showFailure(e);
        }
    }
    tbRecall() {
        this.initializeForm();
        this.complaintbyForm.controls.ComplaintById.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.complaintById.nativeElement.focus();
    }
    tbUndo() {
        this.initializeForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    tbSave() {
        if (!this.complaintbyForm.invalid) {
            this.waitDlg.open({});
            const complaintby = this.complaintbyForm.getRawValue();
            complaintby.footer = this.footer;
            this.complaintbyService.Save(complaintby).subscribe(() => {
                this.initializeForm();
                agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                this.toaster.showSuccess('Record saved Successfully');
            }, error => { this.toaster.showFailure(error); }, () => { this.waitDlg.close(); });
        }
    }
    //#endregion toolbar functions
    //#region local functions
    get(Id) {
        this.waitDlg.open({});
        try {
            this.complaintbyService.Get(Id).subscribe(complaintby => {
                if (complaintby) {
                    this.complaintbyForm.disable();
                    this.complaintbyForm.controls['ComplaintById'].setValue(complaintby.complaintById);
                    this.complaintbyForm.controls['ComplaintByName'].setValue(complaintby.complaintByName);
                    this.complaintbyForm.controls['IsActive'].setValue(complaintby.isActive);
                    this.footer = complaintby.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                }
                else {
                    this.toaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                }
            }, error => { this.toaster.showFailure(error); }, () => { this.waitDlg.close(); });
        }
        catch (e) {
            this.toaster.showFailure(e);
        }
    }
    initializeForm() {
        this.complaintbyForm.reset();
        //
        this.complaintbyForm.disable();
    }
};
__decorate([
    core_1.ViewChild('complaintByName', { static: true })
], ComplaintByComponent.prototype, "complaintByName", void 0);
__decorate([
    core_1.ViewChild('complaintById', { static: true })
], ComplaintByComponent.prototype, "complaintById", void 0);
ComplaintByComponent = __decorate([
    core_1.Component({
        selector: 'app-complaintby',
        templateUrl: './complaintby.component.html',
        styleUrls: ['./complaintby.component.css']
    })
], ComplaintByComponent);
exports.ComplaintByComponent = ComplaintByComponent;
//# sourceMappingURL=complaintby.component.js.map