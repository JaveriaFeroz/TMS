"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let RegionComponent = class RegionComponent {
    constructor(router, formbulider, svcRegion, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcRegion = svcRegion;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Region';
        this.colSearch = [
            { headerName: 'Region Id', field: 'regionId', width: 70 },
            { headerName: 'Region Name', field: 'regionName', },
            { headerName: 'Is Active', field: 'isActive', },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmRegion = this.formbulider.group({
            regionId: [null, [forms_1.Validators.required]],
            regionName: [null, [forms_1.Validators.required]],
            taxRate: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmRegion.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmRegion.reset();
        this.frmRegion.enable();
        this.frmRegion.controls.regionId.disable();
        this.frmRegion.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.regionName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmRegion.controls.regionId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.regionId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcRegion.getRegions().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Region", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.regionId);
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
        this.frmRegion.enable();
        this.frmRegion.controls.regionId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.regionName.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmRegion.markAllAsTouched();
            if (!this.frmRegion.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmRegion.getRawValue();
                formData.footer = this.footer;
                this.svcRegion.save(formData).subscribe(() => {
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
            this.svcRegion.get(Id).subscribe(region => {
                if (region) {
                    this.frmRegion.disable();
                    this.frmRegion.controls['regionId'].setValue(region.regionId);
                    this.frmRegion.controls['regionName'].setValue(region.regionName);
                    this.frmRegion.controls['taxRate'].setValue(region.taxRate);
                    this.frmRegion.controls['isActive'].setValue(region.isActive);
                    this.footer = region.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    initForm() {
        this.frmRegion.reset();
        this.frmRegion.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('regionName', { static: true })
], RegionComponent.prototype, "regionName", void 0);
__decorate([
    core_1.ViewChild('regionId', { static: true })
], RegionComponent.prototype, "regionId", void 0);
RegionComponent = __decorate([
    core_1.Component({
        selector: 'app-region',
        templateUrl: './region.component.html',
        styleUrls: ['./region.component.css']
    })
], RegionComponent);
exports.RegionComponent = RegionComponent;
//# sourceMappingURL=region.component.js.map