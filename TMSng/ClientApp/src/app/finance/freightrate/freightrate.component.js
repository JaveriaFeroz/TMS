"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreightRateComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let FreightRateComponent = class FreightRateComponent {
    constructor(router, formbulider, svcFreight, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcFreight = svcFreight;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        //#region constant variables
        this.optionName = 'Freight Rate';
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.get();
    }
    ngOnInit() {
        this.frmFreightRate = this.formbulider.group({
            localRate0To64: [null, [forms_1.Validators.required]],
            localRate65To1980: [null, [forms_1.Validators.required]],
            localRateAbove1980: [null, [forms_1.Validators.required]],
            localRateHilly: [null, [forms_1.Validators.required]],
            upCountryRate0To77: [null, [forms_1.Validators.required]],
            upCountryRate78To560: [null, [forms_1.Validators.required]],
            upCountryRateAbove560: [null, [forms_1.Validators.required]],
            upCountryHilly: [null, [forms_1.Validators.required]],
        });
        this.frmFreightRate.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    //tbAdd() {
    //  this.frmFreightRate.reset();
    //  this.frmFreightRate.enable();
    //  agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    //  this.frmFreightRate.nativeElement.focus();
    //}
    tbEdit() {
        this.frmFreightRate.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.localRate0To64.nativeElement.focus();
    }
    tbSave() {
        try {
            this.svcWaitDlg.open({});
            this.frmFreightRate.markAllAsTouched();
            if (!this.frmFreightRate.invalid) {
                var formData = this.frmFreightRate.getRawValue();
                this.svcFreight.save(formData).subscribe(() => {
                    this.svcToaster.showSuccess('Record saved Successfully');
                    this.get();
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
        this.get();
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    get() {
        this.svcWaitDlg.open({});
        try {
            this.svcFreight.get().subscribe(FR => {
                if (FR) {
                    this.frmFreightRate.disable();
                    this.frmFreightRate.controls['localRate0To64'].setValue(FR.localRate0To64);
                    this.frmFreightRate.controls['localRate65To1980'].setValue(FR.localRate65To1980);
                    this.frmFreightRate.controls['localRateAbove1980'].setValue(FR.localRateAbove1980);
                    this.frmFreightRate.controls['localRateHilly'].setValue(FR.localRateHilly);
                    this.frmFreightRate.controls['upCountryRate0To77'].setValue(FR.upCountryRate0To77);
                    this.frmFreightRate.controls['upCountryRate78To560'].setValue(FR.upCountryRate78To560);
                    this.frmFreightRate.controls['upCountryRateAbove560'].setValue(FR.upCountryRateAbove560);
                    this.frmFreightRate.controls['upCountryHilly'].setValue(FR.upCountryHilly);
                    this.footer = FR.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    initForm() {
        this.frmFreightRate.reset();
        this.frmFreightRate.disable();
        this.errors = [];
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('localRate0To64', { static: true })
], FreightRateComponent.prototype, "localRate0To64", void 0);
FreightRateComponent = __decorate([
    core_1.Component({
        selector: 'app-freightrate',
        templateUrl: './freightrate.component.html',
        styleUrls: ['./freightrate.component.css']
    })
], FreightRateComponent);
exports.FreightRateComponent = FreightRateComponent;
//# sourceMappingURL=freightrate.component.js.map