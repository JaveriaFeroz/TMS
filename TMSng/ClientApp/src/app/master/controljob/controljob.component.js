"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlJobComponent = void 0;
const core_1 = require("@angular/core");
let ControlJobComponent = class ControlJobComponent {
    constructor(router, formbulider, svcControlJob, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcControlJob = svcControlJob;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        //#region constant variables
        this.optionName = 'Control Job';
    }
    ngOnInit() {
        this.frmControlJob = this.formbulider.group({
            period: [null],
            revenueJobNo: [null],
            costJobNo: [null],
            maintenanceJobNo: [null],
        });
        this.frmControlJob.disable();
        this.get();
        //agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    }
    //#region toolbar functions  
    tbSave() {
        this.frmControlJob.markAllAsTouched();
        if (!this.frmControlJob.invalid) {
            this.svcWaitDlg.open({});
            var formData = this.frmControlJob.getRawValue();
            this.svcControlJob.save(formData).subscribe(() => {
                this.initForm();
                // agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
                this.svcToaster.showSuccess('Record saved Successfully');
                this.get();
                this.svcWaitDlg.close();
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
    }
    tbUndo() {
        this.initForm();
        // agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    get() {
        try {
            this.svcControlJob.get().subscribe(controljob => {
                if (controljob) {
                    this.frmControlJob.disable();
                    this.frmControlJob.controls['period'].setValue(controljob.period);
                    this.frmControlJob.controls['revenueJobNo'].setValue(controljob.revenueJobNo);
                    this.frmControlJob.controls['costJobNo'].setValue(controljob.costJobNo);
                    this.frmControlJob.controls['maintenanceJobNo'].setValue(controljob.maintenanceJobNo);
                    //   agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
                    this.frmControlJob.controls.revenueJobNo.enable();
                    this.frmControlJob.controls.costJobNo.enable();
                    this.frmControlJob.controls.maintenanceJobNo.enable();
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    initForm() {
        this.frmControlJob.reset();
        this.frmControlJob.disable();
    }
};
ControlJobComponent = __decorate([
    core_1.Component({
        selector: 'app-controljob',
        templateUrl: './controljob.component.html',
        styleUrls: ['./controljob.component.css']
    })
], ControlJobComponent);
exports.ControlJobComponent = ControlJobComponent;
//# sourceMappingURL=controljob.component.js.map