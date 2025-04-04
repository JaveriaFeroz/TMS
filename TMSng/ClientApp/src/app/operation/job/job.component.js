"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobComponent = void 0;
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let JobComponent = class JobComponent {
    constructor(jobr, formbulider, svcJob, svcToaster, svcWaitDlg, svcSearchDlg, Enum) {
        this.jobr = jobr;
        this.formbulider = formbulider;
        this.svcJob = svcJob;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.Enum = Enum;
        //#region constant variables
        this.optionName = 'Job';
        this.colSearch = [
            { headerName: 'Job #', field: 'jobNo' },
            { headerName: 'Job Date', field: 'jobDate' },
            { headerName: 'Job Start Date', field: 'startDate' },
            { headerName: 'Status', field: 'stateName' },
        ];
        this.footer = new footer_1.agFooter();
        this.MinDate = new Date().getDate() - 45;
        this.MaxDate = new Date();
        this.errors = [];
    }
    ngOnInit() {
        this.frmJob = this.formbulider.group({
            jobNo: [null, [forms_1.Validators.required]],
            jobId: [null],
            jobDate: [null, [forms_1.Validators.required]],
            jobStartDate: [null, [forms_1.Validators.required]],
            jobStartTime: [null, [forms_1.Validators.required]],
            advance: [null],
            stateName: [null],
            //JobStatusId: [null],
        });
        this.frmJob.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmJob.reset();
        this.frmJob.enable();
        this.frmJob.controls.jobNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.frmJob.patchValue({ stateName: "Open", advance: 0 });
        //this.frmJob.controls.State.disable();
        this.jobDate.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmJob.controls.jobNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.jobNo.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcJob.getJobs().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Job", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.jobNo);
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
        this.frmJob.enable();
        this.frmJob.controls.jobNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        //this.frmJob.controls.JobStatus.disable();
        this.jobDate.focus();
    }
    tbSave() {
        try {
            this.frmJob.markAllAsTouched();
            if (!this.frmJob.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmJob.getRawValue();
                formData.footer = this.footer;
                this.svcJob.save(formData).subscribe(() => {
                    this.initForm();
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                    this.svcToaster.showSuccess('Record saved Successfully');
                }, error => {
                    this.svcToaster.showFailure(error);
                }, () => { this.svcWaitDlg.close(); });
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
        this.jobr.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    get(Id) {
        Id = this.Enum.format(Id);
        this.svcWaitDlg.open({});
        try {
            this.svcJob.get(Id).subscribe(job => {
                if (job) {
                    this.frmJob.disable();
                    this.frmJob.controls['jobNo'].setValue(job.jobNo);
                    this.frmJob.controls['jobId'].setValue(job.jobId);
                    this.frmJob.controls['jobDate'].setValue(job.jobDate);
                    this.frmJob.controls['jobStartDate'].setValue(job.jobStartDate);
                    //let JobTime = job.jobStartTime;
                    //this.frmJob.controls['jobStartTime'].setValue(job.jobStartTime);
                    this.frmJob.controls['jobStartTime'].setValue(common_1.formatDate(job.jobStartTime, 'HH:mm', 'en-US'));
                    //this.frmJob.controls['StateId'].setValue(job.jobStatusId);
                    this.frmJob.controls['stateName'].setValue(job.stateName);
                    this.frmJob.controls['advance'].setValue(job.advance);
                    this.footer = job.footer;
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
        this.frmJob.reset();
        this.frmJob.disable();
        this.errors = [];
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('jobNo', { static: true })
], JobComponent.prototype, "jobNo", void 0);
__decorate([
    core_1.ViewChild('jobDate', { static: true })
], JobComponent.prototype, "jobDate", void 0);
JobComponent = __decorate([
    core_1.Component({
        selector: 'app-job',
        templateUrl: './job.component.html',
        styleUrls: ['./job.component.css']
    })
], JobComponent);
exports.JobComponent = JobComponent;
//# sourceMappingURL=job.component.js.map