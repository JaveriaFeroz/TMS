"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobOrderComponent = void 0;
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let JobOrderComponent = class JobOrderComponent {
    constructor(joborderopenr, formbulider, joborderopenService, toaster, helper, waitDlg, searchDlg, Enum) {
        this.joborderopenr = joborderopenr;
        this.formbulider = formbulider;
        this.joborderopenService = joborderopenService;
        this.toaster = toaster;
        this.helper = helper;
        this.waitDlg = waitDlg;
        this.searchDlg = searchDlg;
        this.Enum = Enum;
        //#region constant variables
        this.optionName = 'Job Order Open';
        this.searchColDefs = [
            { headerName: 'Job Order #', field: 'jobNo' },
            { headerName: 'Job Date', field: 'jobDate' },
            { headerName: 'Job Start Date', field: 'startDate' },
            { headerName: 'Status', field: 'stateName' },
        ];
        this.footer = new footer_1.agFooter();
        this.MaxDate = new Date();
        this.MinDate = new Date();
        this.errors = [];
        this.MinDate.setDate(this.MinDate.getDate() - 45);
        this.MaxDate.setDate(this.MaxDate.getDate());
    }
    ngOnInit() {
        this.joborderopenForm = this.formbulider.group({
            JobOrderNo: [null, [forms_1.Validators.required]],
            JobOrderId: [null,],
            JobDate: [null, [forms_1.Validators.required]],
            JobStartDate: [null, [forms_1.Validators.required]],
            JobStartTime: [null, [forms_1.Validators.required]],
            JobAdvance: [null],
            JobStatus: [null],
            JobStatusId: [null],
        });
        this.joborderopenForm.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.joborderopenForm.reset();
        this.joborderopenForm.enable();
        this.joborderopenForm.controls.JobOrderNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.joborderopenForm.patchValue({ JobStatus: "Open", JobAdvance: 0 });
        this.joborderopenForm.controls.JobStatus.disable();
        this.jodate.focus();
    }
    tbEdit() {
        this.joborderopenForm.enable();
        this.joborderopenForm.controls.JobOrderNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.joborderopenForm.controls.JobStatus.disable();
        this.jodate.focus();
    }
    tbSearch() {
        try {
            this.waitDlg.open({});
            this.joborderopenService.GetList().subscribe(r => {
                this.searchDlg.open("Search & Select JobOrder", this.searchColDefs, r);
                this.searchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.jobNo);
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
        this.joborderopenForm.controls.JobOrderNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.joborderid.nativeElement.focus();
    }
    tbUndo() {
        this.initializeForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    tbExit() {
        this.joborderopenr.navigate(['/MainForm']);
    }
    tbSave() {
        try {
            this.joborderopenForm.markAllAsTouched();
            if (!this.joborderopenForm.invalid) {
                this.waitDlg.open({});
                const joborderopen = this.joborderopenForm.getRawValue();
                joborderopen.JobDate = common_1.formatDate(joborderopen.JobDate, 'dd/MM/yyyy', 'en-US');
                joborderopen.JobStartDate = common_1.formatDate(joborderopen.JobStartDate, 'dd/MM/yyyy', 'en-US');
                joborderopen.footer = this.footer;
                this.joborderopenService.Save(joborderopen).subscribe(() => {
                    this.initializeForm();
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                    this.toaster.showSuccess('Record saved Successfully');
                }, error => {
                    this.toaster.showFailure(error);
                }, () => { this.waitDlg.close(); });
            }
        }
        catch (e) {
            this.waitDlg.close();
            this.toaster.showFailure(e);
        }
    }
    //#endregion toolbar functions
    //#region local functions
    get(Id) {
        Id = this.Enum.format(Id);
        this.waitDlg.open({});
        try {
            this.joborderopenService.Get(Id).subscribe(joborderopen => {
                if (joborderopen) {
                    this.joborderopenForm.disable();
                    this.joborderopenForm.controls['JobOrderNo'].setValue(joborderopen.jobOrderNo);
                    this.joborderopenForm.controls['JobOrderId'].setValue(joborderopen.jobOrderId);
                    this.joborderopenForm.controls['JobStartTime'].setValue(common_1.formatDate(joborderopen.jobStartTime, 'HH:mm', 'en-US'));
                    this.joborderopenForm.controls['JobDate'].setValue(new Date(joborderopen.jobDate));
                    this.joborderopenForm.controls['JobStartDate'].setValue(new Date(joborderopen.jobStartDate));
                    this.joborderopenForm.controls['JobStatusId'].setValue(joborderopen.jobStatusId);
                    this.joborderopenForm.controls['JobStatus'].setValue(joborderopen.jobStatus);
                    this.joborderopenForm.controls['JobAdvance'].setValue(joborderopen.jobAdvance);
                    this.footer = joborderopen.footer;
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
        this.joborderopenForm.reset();
        this.errors = [];
        this.joborderopenForm.disable();
    }
};
__decorate([
    core_1.ViewChild('joborderid', { static: true })
], JobOrderComponent.prototype, "joborderid", void 0);
__decorate([
    core_1.ViewChild('jodate', { static: true })
], JobOrderComponent.prototype, "jodate", void 0);
JobOrderComponent = __decorate([
    core_1.Component({
        selector: 'app-joborderopen',
        templateUrl: './joborderopen.component.html',
        styleUrls: ['./joborderopen.component.css']
    })
], JobOrderComponent);
exports.JobOrderComponent = JobOrderComponent;
//# sourceMappingURL=joborderopen.component.js.map