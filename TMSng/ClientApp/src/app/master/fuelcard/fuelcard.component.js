"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuelCardComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let FuelCardComponent = class FuelCardComponent {
    constructor(router, formbulider, svcFuelCard, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcFuelCard = svcFuelCard;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Fuel Card';
        this.colSearch = [
            { headerName: 'Card Id', field: 'cardId', width: 70 },
            { headerName: 'Card #', field: 'cardNo', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmFuelCard = this.formbulider.group({
            cardId: [null, [forms_1.Validators.required]],
            cardNo: [null, [forms_1.Validators.required]],
            cardLimit: [null, [forms_1.Validators.required]],
            clientId: [null],
            supplierId: [null],
            isActive: [null],
        });
        this.frmFuelCard.disable();
        this.loadLookup();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmFuelCard.reset();
        this.frmFuelCard.enable();
        this.frmFuelCard.controls.cardId.disable();
        this.frmFuelCard.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.cardNo.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmFuelCard.controls.cardId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.cardId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcFuelCard.getFuelCards().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Fuel Card", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.cardId);
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
        this.frmFuelCard.enable();
        this.frmFuelCard.controls.cardId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.cardNo.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmFuelCard.markAllAsTouched();
            if (!this.frmFuelCard.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmFuelCard.getRawValue();
                formData.footer = this.footer;
                this.svcFuelCard.save(formData).subscribe(() => {
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
            this.svcFuelCard.get(Id).subscribe(fuelcard => {
                if (fuelcard) {
                    this.frmFuelCard.disable();
                    this.frmFuelCard.controls['cardId'].setValue(fuelcard.cardId);
                    this.frmFuelCard.controls['cardNo'].setValue(fuelcard.cardNo);
                    this.frmFuelCard.controls['cardLimit'].setValue(fuelcard.cardLimit);
                    this.frmFuelCard.controls['clientId'].setValue(fuelcard.clientId);
                    this.frmFuelCard.controls['supplierId'].setValue(fuelcard.supplierId);
                    this.frmFuelCard.controls['isActive'].setValue(fuelcard.isActive);
                    this.footer = fuelcard.footer;
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
            this.svcFuelCard.getLookup().subscribe(data => {
                this.lstClient = data.lstClient;
                this.lstSupplier = data.lstSupplier;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    initForm() {
        this.frmFuelCard.reset();
        this.frmFuelCard.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('cardNo', { static: true })
], FuelCardComponent.prototype, "cardNo", void 0);
__decorate([
    core_1.ViewChild('cardId', { static: true })
], FuelCardComponent.prototype, "cardId", void 0);
FuelCardComponent = __decorate([
    core_1.Component({
        selector: 'app-fuelcard',
        templateUrl: './fuelcard.component.html',
        styleUrls: ['./fuelcard.component.css']
    })
], FuelCardComponent);
exports.FuelCardComponent = FuelCardComponent;
//# sourceMappingURL=fuelcard.component.js.map