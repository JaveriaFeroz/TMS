"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialPeriodComponent = void 0;
const core_1 = require("@angular/core");
const agFormHelper_1 = require("../../helper/agFormHelper");
let FinancialPeriodComponent = class FinancialPeriodComponent {
    constructor(router, formbulider, svcWaitDlg, svcFinancialPeriod, svcToaster) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcWaitDlg = svcWaitDlg;
        this.svcFinancialPeriod = svcFinancialPeriod;
        this.svcToaster = svcToaster;
        //#region constant variables
        this.optionName = 'Period Closure';
        this.enableGLEntries = false;
        this.lstPeriodType = [
            { periodTypeId: 1, periodTypeName: 'Operational' },
            { periodTypeId: 2, periodTypeName: 'GL' },
            { periodTypeId: 3, periodTypeName: 'AR' },
            { periodTypeId: 4, periodTypeName: 'AP' },
        ];
        //this.periodName = agFormHelper.periodName();
        this.get();
        this.enableGLEntries = agFormHelper_1.agFormHelper.enableGL();
        //alert(this.periodName);
        //alert(this.enableGLEntries);
    }
    ngOnInit() {
        this.frmFinancialPeriod = this.formbulider.group({
            periodName: [null],
            periodTypeId: [1],
            //currentMonth: [null],
            //currentYear: [null], 
        });
        this.frmFinancialPeriod.disable();
        this.frmFinancialPeriod.patchValue({ periodTypeId: 1, periodName: this.periodName });
        if (this.enableGLEntries) {
            this.frmFinancialPeriod.controls.periodTypeId.enable();
        }
        //this.get();
        //agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    }
    //#region toolbar functions
    tbSave() {
        if (!this.frmFinancialPeriod.invalid) {
            this.svcWaitDlg.open({});
            var formData = this.frmFinancialPeriod.getRawValue();
            this.svcFinancialPeriod.close(formData.periodTypeId).subscribe(() => {
                this.initForm();
                //  agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
                this.svcToaster.showSuccess('Current period closure and new Financial period opening completed successfully');
                this.get();
                //if (this.enableGLEntries) {
                this.frmFinancialPeriod.controls.periodTypeId.enable();
                //}
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
            this.svcFinancialPeriod.get(1).subscribe(financialperiod => {
                if (financialperiod) {
                    //this.frmFinancialPeriod.disable();
                    this.frmFinancialPeriod.controls['periodName'].setValue(financialperiod.periodName);
                    this.frmFinancialPeriod.controls['periodTypeId'].setValue(1);
                    /* this.frmFinancialPeriod.controls['periodTypeId'].setValue(financialperiod.periodId);*/
                    //   agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
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
    onPeriodChanged(id) {
        try {
            this.svcFinancialPeriod.get(id).subscribe(financialperiod => {
                if (financialperiod) {
                    //this.frmFinancialPeriod.disable();
                    this.frmFinancialPeriod.controls['periodName'].setValue(financialperiod.periodName);
                    this.frmFinancialPeriod.controls['periodTypeId'].setValue(id);
                    /* this.frmFinancialPeriod.controls['periodTypeId'].setValue(financialperiod.periodId);*/
                    //   agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
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
        this.frmFinancialPeriod.reset();
        this.frmFinancialPeriod.disable();
        if (this.enableGLEntries) {
            this.frmFinancialPeriod.controls.periodTypeId.enable();
        }
    }
};
FinancialPeriodComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-financialperiod',
        templateUrl: './financialperiod.component.html',
        styleUrls: ['./financialperiod.component.css']
    })
], FinancialPeriodComponent);
exports.FinancialPeriodComponent = FinancialPeriodComponent;
//# sourceMappingURL=financialperiod.component.js.map