"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let CityComponent = class CityComponent {
    constructor(cityr, formbulider, svcCity, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.cityr = cityr;
        this.formbulider = formbulider;
        this.svcCity = svcCity;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'City';
        this.colSearch = [
            { headerName: 'Id', field: 'cityId', width: 70 },
            { headerName: 'City Name', field: 'cityName', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmCity = this.formbulider.group({
            cityId: [null, [forms_1.Validators.required]],
            cityName: [null, [forms_1.Validators.required]],
            cityCode: [null, [forms_1.Validators.required]],
            regionId: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmCity.disable();
        this.loadLookup();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmCity.reset();
        this.frmCity.enable();
        this.frmCity.controls.cityId.disable();
        this.frmCity.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.cityName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmCity.controls.cityId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.cityId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcCity.getCities().subscribe(r => {
                this.svcSearchDlg.open("Search & Select City", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.cityId);
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
        this.frmCity.enable();
        this.frmCity.controls.cityId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.cityName.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmCity.markAllAsTouched();
            if (!this.frmCity.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmCity.getRawValue();
                formData.footer = this.footer;
                this.svcCity.save(formData).subscribe(() => {
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
        this.cityr.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcCity.get(Id).subscribe(city => {
                if (city) {
                    this.frmCity.disable();
                    this.frmCity.controls['cityId'].setValue(city.cityId);
                    this.frmCity.controls['cityName'].setValue(city.cityName);
                    this.frmCity.controls['cityCode'].setValue(city.cityCode);
                    this.frmCity.controls['regionId'].setValue(city.regionId);
                    this.frmCity.controls['isActive'].setValue(city.isActive);
                    this.footer = city.footer;
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
    loadLookup() {
        try {
            this.svcCity.getLookup().subscribe(data => {
                this.lstRegion = data.lstRegion;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    initForm() {
        this.frmCity.reset();
        this.frmCity.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('cityName', { static: true })
], CityComponent.prototype, "cityName", void 0);
__decorate([
    core_1.ViewChild('cityId', { static: true })
], CityComponent.prototype, "cityId", void 0);
CityComponent = __decorate([
    core_1.Component({
        selector: 'app-city',
        templateUrl: './city.component.html',
        styleUrls: ['./city.component.css']
    })
], CityComponent);
exports.CityComponent = CityComponent;
//# sourceMappingURL=city.component.js.map